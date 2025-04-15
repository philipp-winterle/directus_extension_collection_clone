<template>
  <VCard class="clone-collection-modal">
    <VCardTitle><h2>Clone Collection</h2></VCardTitle>
    <VCardText>
      <div class="clone-form">
        <p>
          Cloning collection: <strong>{{ collectionName }}</strong>
        </p>
        <div class="field">
          <div class="label">New Collection Name</div>
          <VInput
            v-model="newCollectionName"
            :placeholder="'Enter a name for the new collection'"
            :autofocus="true"
          />
        </div>
      </div>
    </VCardText>
    <VCardActions>
      <VButton secondary @click="$emit('toggle')"> Cancel </VButton>
      <VButton @click="submitClone" :loading="loading" :disabled="!isValid">
        Clone
      </VButton>
    </VCardActions>
  </VCard>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  id: "clone-collection-modal",
  name: "CloneCollectionModal",
  description: "Clone a collection",
  icon: "copy_all",
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    collectionName: {
      type: String,
      required: true,
    },
  },
  emits: ["toggle", "submit"],
  setup(props, { emit }) {
    const newCollectionName = ref("");
    const loading = ref(false);

    const isValid = computed(() => {
      return (
        newCollectionName.value.trim() !== "" &&
        newCollectionName.value !== props.collectionName
      );
    });

    function submitClone() {
      if (!isValid.value) return;

      loading.value = true;

      // Emit the submit event with the new collection name
      emit("submit", {
        sourceCollection: props.collectionName,
        targetCollection: newCollectionName.value,
      });

      // The parent component should handle closing the modal after successful operation
    }

    return {
      newCollectionName,
      loading,
      isValid,
      submitClone,
    };
  },
});
</script>

<style scoped>
.clone-collection-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: auto;
  height: auto;
  color: var(--theme--foreground);
  background-color: var(--theme--background-normal);
  border: 1px solid var(--theme--border-color-accent);
  border-radius: var(--theme--border-radius);
  padding: var(--theme--content-padding);
  box-shadow: 0 0 10px 0 var(--theme--border-color-accent);
}

.clone-collection-modal h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 500;
}

.clone-form {
  margin: 20px 0;
}

.field {
  margin-top: 20px;
}

.label {
  margin-bottom: 8px;
  font-weight: 500;
}
</style>
