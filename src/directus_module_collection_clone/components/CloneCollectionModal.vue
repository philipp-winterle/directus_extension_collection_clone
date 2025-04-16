<template>
  <VCard class="clone-collection-modal">
    <VCardTitle><h2>Clone Collection</h2></VCardTitle>
    <VCardText>
      <div class="clone-form">
        <p>
          <template v-if="!cloneSuccess && !errorMessage">
            Cloning collection: <strong>{{ collectionName }}</strong>
          </template>
          <template v-else-if="cloneSuccess">
            Successfully cloned <strong>{{ collectionName }}</strong> to
            <strong>{{ newCollectionName }}</strong>
          </template>
          <template v-else-if="errorMessage">
            <div class="error-message">
              <v-icon name="error" />
              Error cloning collection: <strong>{{ errorMessage }}</strong>
            </div>
          </template>
        </p>
        <div class="field" v-if="!cloneSuccess && !errorMessage">
          <div class="label">New Collection Name</div>
          <VInput
            v-model="newCollectionName"
            :placeholder="'Enter a name for the new collection'"
            :autofocus="true"
          />
        </div>
      </div>
    </VCardText>
    <VCardActions class="clone-collection-modal-actions">
      <template v-if="!cloneSuccess && !errorMessage">
        <VButton
          kind="secondary"
          :fullWidth="false"
          @click="$emit('toggle')"
          :disabled="loading"
        >
          Cancel
        </VButton>
        <VButton
          v-if="!loading"
          @click="submitClone"
          :disabled="!isValid || loading"
          kind="info"
          type="button"
        >
          Clone
        </VButton>
        <VButton v-else loading="true" :disabled="true"> Clone </VButton>
      </template>
      <template v-else-if="cloneSuccess">
        <VButton
          :fullWidth="true"
          @click="$emit('toggle')"
          kind="success"
          type="button"
        >
          Close
        </VButton>
      </template>
      <template v-else-if="errorMessage">
        <VButton
          :fullWidth="true"
          @click="$emit('toggle')"
          kind="danger"
          type="button"
        >
          Close
        </VButton>
      </template>
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
      default: true,
    },
    collectionName: {
      type: String,
      required: true,
    },
    isCloning: {
      type: Boolean,
      default: null,
    },
    collections: {
      type: Array,
      required: true,
    },
  },
  emits: ["toggle", "submit"],
  setup(props, { emit }) {
    const newCollectionName = ref("");
    const loading = ref<boolean | null>(false);
    const cloneSuccess = ref(false);
    const errorMessage = ref("");

    // Check if the new collection name is valid
    const isValid = computed(() => {
      return (
        newCollectionName.value.trim() !== "" &&
        newCollectionName.value !== props.collectionName &&
        !props.collections.some((entry: any) => {
          return entry.collection === newCollectionName.value;
        })
      );
    });

    function submitClone() {
      if (!isValid.value) return;

      loading.value = true;
      errorMessage.value = "";

      // Emit the submit event with the new collection name
      emit("submit", {
        sourceCollection: props.collectionName,
        targetCollection: newCollectionName.value,
        onSuccess: () => {
          loading.value = false;
          cloneSuccess.value = true;
        },
        onError: (error: string) => {
          loading.value = false;
          errorMessage.value = error || "An unknown error occurred";
        },
      });
    }

    return {
      newCollectionName,
      loading,
      isValid,
      cloneSuccess,
      errorMessage,
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
  width: calc(min(500px, 90vw));
  height: auto;
  color: var(--theme--foreground);
  background-color: var(--theme--background-normal);
  border: 1px solid var(--theme--border-color-accent);
  border-radius: var(--theme--border-radius);
  padding: var(--theme--content-padding);
  box-shadow: 0 0 10px 0 var(--theme--border-color-accent);
  z-index: 501;
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

.clone-collection-modal-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.error-message {
  color: var(--theme--danger);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}
</style>
