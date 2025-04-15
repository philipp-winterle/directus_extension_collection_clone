<template>
  <v-table
    :headers="tableHeaders"
    :items="collections"
    :loading="loading"
    :allow-header-reorder="false"
    item-key="name"
    show-select="one"
    class="collections-table"
  >
    <!-- <template #item-collection="{ item }">
      <div class="collection-cell">
        <span class="collection-name">{{ item.collection }}</span>
      </div>
    </template> -->

    <template #item="{ item }">
      <tr>
        <td>{{ item.collection }}</td>
        <td>
          <ActionButton :collection="item.collection" />
        </td>
      </tr>
    </template>
  </v-table>

  <clone-collection-modal
    v-if="activeCollection"
    :active="!!activeCollection"
    :collection-name="activeCollection"
    @toggle="activeCollection = null"
    @submit="cloneCollection"
  />
</template>

<script lang="ts">
import { useApi } from "@directus/extensions-sdk";
import { computed, defineComponent, ref } from "vue";
import ActionButton from "./ActionButton.vue";
import CloneCollectionModal from "./CloneCollectionModal.vue";

export default defineComponent({
  name: "CollectionsTable",
  components: {
    CloneCollectionModal,
    ActionButton,
  },
  setup() {
    const api = useApi();
    const collections = ref<any[]>([]);
    const loading = ref(true);
    const selectedCollection = ref<string | null>(null);
    // Define table headers
    const tableHeaders = computed(() => [
      {
        text: "Collection",
        value: "collection",
        align: "left",
        sortable: false,
        width: null,
      },
      {
        text: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
        width: 100,
      },
    ]);

    // Open clone modal for a specific collection
    function openCloneModal(collectionName: string) {
      selectedCollection.value = collectionName;
    }

    // Clone the collection
    async function cloneCollection(data: {
      sourceCollection: string;
      targetCollection: string;
    }) {
      loading.value = true;
      try {
        await api.get(
          `/collection_clone/${data.sourceCollection}/${data.targetCollection}`,
        );
        activeCollection.value = null;
        // Refresh collections list
        await fetchCollections();
      } catch (error) {
        console.error("Error cloning collection:", error);
      } finally {
        loading.value = false;
      }
    }

    // Fetch all collections
    async function fetchCollections() {
      loading.value = true;
      try {
        const response = await api.get("/collections");

        // Filter out system collections (starting with 'directus_')
        collections.value = response.data.data
          .filter(
            (collection: any) => !collection.collection.startsWith("directus_"),
          )
          .map((collection: any) => ({
            collection: collection.collection,
            // actions: <ActionButton></ActionButton>,
          }));
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        loading.value = false;
      }
    }

    // Fetch collections on component mount
    fetchCollections();

    return {
      loading,
      collections,
      tableHeaders,
      selectedCollection,
      openCloneModal,
      cloneCollection,
    };
  },
});
</script>

<style scoped>
.collections-table {
  width: 100%;
  margin-bottom: 20px;
}

.collection-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  flex-shrink: 0;
}

.collection-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
