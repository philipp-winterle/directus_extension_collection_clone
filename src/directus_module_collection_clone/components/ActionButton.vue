<template>
  <VButton
    v-tooltip.bottom="'Clone Collection'"
    icon="content_copy"
    secondary
    small
    @click="openCloneModal(item.collection)"
  >
    <VIcon name="content_copy" />
  </VButton>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ActionButton",
  props: {
    collection: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const openCloneModal = () => {
      console.log(props.collection);
    };

    return { openCloneModal };
  },
});
</script>
