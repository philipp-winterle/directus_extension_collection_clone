import { defineEndpoint } from '@directus/extensions-sdk';
import ansis from 'ansis';
import type { Logger } from 'pino';
import packageJson from '../../package.json' assert { type: 'json' };
import {
  cleanCollection,
  getCloneableFields,
  getCloneableRelations
} from './utils';

const EXTENSION_NAME = ansis.ansi256(198)(`[ ${packageJson.name.replaceAll("-", " ").toUpperCase()} ] `);

export default defineEndpoint({
  id: "collection_clone",
  handler: async(router, {
    services, logger: baseLogger, env, getSchema, database: knex
  }) => {
    const logger = baseLogger.child({}, {
      msgPrefix: EXTENSION_NAME
    }) as Logger;

    const {
      CollectionsService, FieldsService, RelationsService,
    } = services;

    router.post('/:sourceCollection/:targetCollection', async(req: any, res) => {
      const {
        accountability
      } = req;
      const {
        sourceCollection, targetCollection
      } = req.params;

      console.log(accountability);

      if (!sourceCollection || !targetCollection) {
        return res.status(400).send('Missing name of the collection to clone');
      }

      if (!accountability) {
        return res.status(401).send('Unauthorized - Your user role does not have permission to clone collections');
      }

      logger.info(`Cloning collection ${sourceCollection} to ${targetCollection}`);

      const collectionService = new CollectionsService({
        knex,
        schema: await getSchema(),
        accountability: accountability,
      });

      const fieldsService = new FieldsService({
        knex,
        schema: await getSchema(),
        accountability: accountability,
      });

      try {
        const collectionData = await collectionService.readOne(sourceCollection);
        const fieldsData = await fieldsService.readAll(sourceCollection);

        const cloneableFields = getCloneableFields(fieldsData, targetCollection);
        const cleanedCollection = cleanCollection(collectionData);

        const newCollectionPayload = {
          collection: targetCollection, // Just the name of the new collection
          meta: {
            ...cleanedCollection.meta, // Copy all the meta data from the original collection
            collection: targetCollection, // Update the collection name in the meta data
          },
          schema: cleanedCollection.schema ? {
            ...cleanedCollection.schema, // Copy all the schema data from the original collection
            name: targetCollection, // Update the schema name
          } : null,
          fields: cloneableFields // Copy all the cloneable fields from the original collection
        };

        // Create the new collection
        await collectionService.createOne(newCollectionPayload);

        // Create the relations service just now because of schema change
        const relationsService = new RelationsService({
          knex,
          schema: await getSchema(), // It's important to use the new schema as there are changes to the schema
          accountability: accountability,
        });

        // Get the relations data
        const relationsData = await relationsService.readAll(sourceCollection);

        // Clone the relations
        const cloneableRelations = await getCloneableRelations(relationsData, sourceCollection, targetCollection, logger);

        // Create the new relations
        for (const relation of cloneableRelations) {
          await relationsService.createOne(relation);
        }

        logger.info(`Collection ${sourceCollection} successfully cloned to ${targetCollection}`);

        return res.send({
          newCollectionPayload,
          cloneableRelations
        });
      } catch (error) {
        logger.error(error);

        return res.status(500).send(`Error cloning collection ${sourceCollection} to ${targetCollection} - Error: ${error}`);
      }
    });
  }
});
