<template>
  <private-view title="Clone Collection">
    <template #headline>
      <div>Select a collection to clone</div>
    </template>

    <!-- Main Content -->
    <main class="container">
      <v-info title="Collection Cloning" icon="copy_all" type="success">
        This tool allows you to clone any collection in your Directus instance.
        Select a collection below to get started.
      </v-info>

      <div class="table-wrapper">
        <collections-table />
      </div>
    </main>
  </private-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CollectionsTable from "./components/Table.vue";

export default defineComponent({
  name: "CollectionCloneModule",
  components: {
    CollectionsTable,
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
</style>
