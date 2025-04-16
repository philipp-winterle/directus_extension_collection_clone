<template>
  <private-view title="Clone Collection">
    <template #headline>
      <div>Select a collection to clone</div>
    </template>

    <div class="container">
      <v-info title="Collection Cloning" icon="copy_all" type="success">
        This tool allows you to clone any collection in your Directus instance.
        Select a collection below to get started.
      </v-info>
      <!-- Main Content -->
      <div class="table-wrapper">
        <CollectionsTable @modal-state-changed="setModalState" />
      </div>
    </div>

    <!-- Overlay that activates when modal is open -->
    <v-overlay :active="isModalOpen" class="modal-overlay" />
  </private-view>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import CollectionsTable from "./components/Table.vue";

export default defineComponent({
  name: "CollectionCloneModule",
  components: {
    CollectionsTable,
  },
  setup() {
    const isModalOpen = ref(false);

    function setModalState(isOpen: boolean) {
      isModalOpen.value = isOpen;
    }

    return {
      isModalOpen,
      setModalState,
    };
  },
});
</script>

<style scoped>
.container {
  padding: var(--content-padding);
  padding-top: 0;
}

.v-info {
  margin-bottom: 20px;
}

.table-wrapper {
  margin-top: 20px;
}

.modal-overlay {
  z-index: 500;
}
</style>
