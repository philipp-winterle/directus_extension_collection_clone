<template>
  <VButton
    v-tooltip.bottom="'Clone Collection'"
    icon="content_copy"
    secondary
    small
  >
    <VIcon name="copy_all" />
  </VButton>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CloneCollectionModal from "./CloneCollectionModal.vue";

export default defineComponent({
  name: "ActionButton",
  components: {
    CloneCollectionModal,
  },
  props: {
    collection: {
      type: String,
      required: true,
    },
  },
});
</script>
