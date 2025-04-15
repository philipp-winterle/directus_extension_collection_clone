import type { Relation, RelationMeta } from '@directus/types';
import type { Logger } from 'pino';
import type {
  DirectusCollection, DirectusField
} from '../types/directus.d';

export const getCloneableFields = (fields: DirectusField[], newCollection: string) => {
  const cloneableFields = fields
    // Do not remove ID from fields as this is needed for collection cloning
    .map(field => {
      // Prepare field for creation by removing id from meta
      const fieldToCreate = {
        field: field.field,
        type: field.type,
        schema: field.schema,
        meta: { ...field.meta },
      };

      // Remove id from meta if it exists
      if (fieldToCreate.meta && 'id' in fieldToCreate.meta) {
        delete fieldToCreate.meta.id;
      }

      // Rewrite meta collection to match new collection name
      if (fieldToCreate.meta && 'collection' in fieldToCreate.meta) {
        fieldToCreate.meta.collection = newCollection;
      }

      // Rewrite schema table to match new collection name
      if (fieldToCreate.schema && 'table' in fieldToCreate.schema) {
        fieldToCreate.schema.table = newCollection;
      }

      return fieldToCreate;
    });

  return cloneableFields;
};

export const cleanCollection = (collection: DirectusCollection) => {
  // Remove id from meta if it exists
  // if (collection.meta && 'id' in collection.meta) {
  //   delete collection.meta.id;
  // }

  return collection;
};

export const getCloneableRelations = async(relations: Relation[], oldCollection: string, newCollection: string, logger: Logger) => {
  // Create a new array to store the cloneable relations
  const cloneableRelations: Relation[] = [];

  // Create/update relations
  if (relations.length > 0) {
    logger.info(`Creating relations for collection: ${newCollection}`);

    for (const relation of relations) {
      // Prepare relation data for creation
      const newRelation: Partial<Relation> = relation;

      // Remove id from meta if it exists
      if (newRelation.meta && 'id' in newRelation.meta) {
        const { id: _id, ...rest } = newRelation.meta;

        // This is a workaround to remove the id from the meta object
        newRelation.meta = rest as RelationMeta;
      }

      // Update Collection
      if (newRelation.collection === oldCollection) {
        newRelation.collection = newCollection;
      }

      // Update Schema
      if (newRelation.schema && newRelation.schema.table === oldCollection) {
        newRelation.schema.table = newCollection;
      }

      // Update Meta
      if (newRelation.meta && newRelation.meta.many_collection === oldCollection) {
        newRelation.meta.many_collection = newCollection;
      }

      if (newRelation.meta && newRelation.meta.one_collection === oldCollection) {
        newRelation.meta.one_collection = newCollection;
      }

      if (newRelation.meta && newRelation.meta.one_allowed_collections && newRelation.meta.one_allowed_collections.includes(oldCollection)) {
        newRelation.meta.one_allowed_collections = newRelation.meta.one_allowed_collections.map(collection => collection === oldCollection ? newCollection : collection);
      }

      // Add the new relation to the cloneable relations array
      cloneableRelations.push(newRelation as Relation);
    }

    logger.info(`All relations created successfully for collection ${newCollection}`);
  }

  return relations;
};
