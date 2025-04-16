<template>
  <v-table
    :headers="tableHeaders"
    :items="collections"
    :loading="loading"
    :allow-header-reorder="false"
    item-append="test"
    item-key="name"
    show-select="none"
    class="collections-table"
  >
    <template #item-append="{ item }">
      <ActionButton
        :collection="item.collection"
        @click="openCloneModal(item.collection)"
      />
    </template>
  </v-table>

  <CloneCollectionModal
    v-if="selectedCollection"
    :active="!!selectedCollection"
    :collection-name="selectedCollection"
    :collections="collections"
    @toggle="closeCloneModal"
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
  emits: ["modal-state-changed"],
  setup(props, { emit }) {
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
    ]);

    // Open clone modal for a specific collection
    function openCloneModal(collectionName: string) {
      selectedCollection.value = collectionName;
      // Emit that modal is open
      emit("modal-state-changed", true);
    }

    // Close clone modal
    function closeCloneModal() {
      selectedCollection.value = null;
      // Emit that modal is closed
      emit("modal-state-changed", false);
    }

    // Clone the collection
    async function cloneCollection(data: {
      sourceCollection: string;
      targetCollection: string;
      onSuccess?: () => void;
      onError?: (error: string) => void;
    }) {
      try {
        await api.post(
          `/collection_clone/${data.sourceCollection}/${data.targetCollection}`
        );

        // Refresh collections list
        await fetchCollections();

        // Call success callback if provided
        if (data.onSuccess) {
          data.onSuccess();
        }
      } catch (error) {
        console.error("Error cloning collection:", error);

        // Extract error message
        let errorMessage = "Failed to clone collection";
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (error && typeof error === "object" && "message" in error) {
          errorMessage = String(error.message);
        } else if (typeof error === "string") {
          errorMessage = error;
        }

        // Call error callback if provided
        if (data.onError) {
          data.onError(errorMessage);
        }
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
            (collection: any) => !collection.collection.startsWith("directus_")
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
      closeCloneModal,
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
