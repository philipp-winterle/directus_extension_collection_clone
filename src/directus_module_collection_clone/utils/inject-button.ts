import { STORES_INJECT } from '@directus/constants';
import {
  computed, createApp, h, reactive
} from 'vue';
import CloneCollectionModal from '../components/CloneCollectionModal.vue';
import { getDirectusApp } from "./get-directus-app";
import { getDirectusRouter } from './get-directus-router';

// Track if modal is already mounted to prevent duplicates
let modalMounted = false;
// Reactive state to control the modal
const modalState = reactive({
  active: false,
  collectionName: '',
});

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation: MutationRecord) => {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      const firstNode = mutation.addedNodes[0] as Element;

      if (firstNode instanceof Text === false && firstNode.classList.contains('v-menu-popper') && !firstNode.classList.contains('bounce-move')) {
        const openedMenu = firstNode.querySelector('.v-menu-content .v-list');

        // Add our custom menu item
        if (openedMenu) {
          // insertCustomMenuItem(targetInsertElement);
          injectCloneButton({
            update: true,
            openedMenu
          });
        }
      }
    }
  });
});

export async function injectCloneButton(options: {
 update?: boolean,
  openedMenu?: Element
} = {
  update: false,
  openedMenu: undefined
}) {
  const router = getDirectusRouter();

  const menuOutlet = document.querySelector('#menu-outlet');

  // If menu outlet is missing from the app
  if (!menuOutlet) {
    return;
  }

  if (router) {
    const to = router.currentRoute.value;

    if (options.update && options.openedMenu && to.name === 'settings-collections') {
      insertCustomMenuItem(options.openedMenu);
    }
  }

  // Configure the observer to watch for changes to child elements
  observer.observe(menuOutlet, {
    childList: true, // Watch for changes to direct children
    subtree: true, // Watch for changes in the entire subtree
    attributes: false, // Don't watch for attribute changes
    characterData: false // Don't watch for character data changes
  });
}

/**
 * Inserts a custom menu item into the provided menu list
 * @param menuList - The ul.v-list element to insert the menu item into
 */
function insertCustomMenuItem(menuList: Element) {
  // Extract collection name from the current route
  const clickableItems = menuList?.querySelectorAll('.v-list-item.link.clickable');
  const collectionName = (Array.from(clickableItems).find((item) => item.hasAttribute('href') && item.getAttribute('href')?.includes('/admin/content/')) as HTMLElement)?.getAttribute('href')?.split('/').pop();

  // Clone existing menu item
  const v_divider = menuList?.querySelector('.v-divider')?.cloneNode(true);
  const reference_v_list_item = menuList?.querySelector('.v-list-item')?.nextSibling as Node;
  const v_list_item = reference_v_list_item?.cloneNode(true);
  const v_list_item_icon = (v_list_item as HTMLElement)?.querySelector('i');

  v_list_item_icon?.setAttribute('data-icon', 'copy_all');
  const v_list_item_contet = (v_list_item as HTMLElement)?.querySelector('.v-list-item-content');

  if (v_list_item_contet) {
    v_list_item_contet.textContent = 'Clone Collection';
  }

  if (v_divider) {
    menuList?.append(v_divider);
  }

  if (v_list_item) {
    menuList?.insertBefore(v_list_item, reference_v_list_item);

    v_list_item.addEventListener('click', () => {
      console.log('Clone item clicked', collectionName);

      // Get the current collection name from the URL or context
      if (collectionName) {
        showCloneModal(collectionName);
      }
    });
  }
}

/**
 * Shows the clone collection modal with the current collection name
 */
function showCloneModal(collectionName: string) {
  if (!collectionName) {
    console.error('Could not determine collection name');

    return;
  }

  // Set the modal state
  modalState.collectionName = collectionName;
  modalState.active = true;

  // Mount the modal if not already mounted
  mountModalComponent();
}

/**
 * Mounts the modal component to the DOM if not already mounted
 */
function mountModalComponent() {
  if (modalMounted) return;
  // Create a container for the modal
  const modalContainer = document.createElement('div');

  modalContainer.id = 'clone-collection-modal-container';
  document.body.appendChild(modalContainer);

  // Create the modal app
  const modalApp = createApp({
    setup() {
      const isActive = computed(() => modalState.active);
      const currentCollectionName = computed(() => modalState.collectionName);

      // Handle toggle event from modal
      const handleToggle = () => {
        modalState.active = !modalState.active;
      };

      // Handle submit event from modal
      const handleSubmit = (data: {
 sourceCollection: string,
targetCollection: string
}) => {
        console.log('Cloning collection', data);
        // Implement your cloning logic here or call an API
        // You can use the Directus API or your custom implementation

        // Close the modal after successful operation
        modalState.active = false;
      };

      // TODO: Funktioniert noch nicht. Wird ganz unten auf der Seite angezeigt.

      return () => h(CloneCollectionModal, {
        active: isActive.value,
        collectionName: currentCollectionName.value,
        onToggle: handleToggle,
        onSubmit: handleSubmit
      });
    }
  });

  // Mount the app to the container
  modalApp.mount(modalContainer);
  modalMounted = true;
}

async function initializeApp() {
  const directusApp = getDirectusApp();
  const stores = directusApp._container._vnode.component.provides[STORES_INJECT];

  const {
    useFieldsStore, useSettingsStore, useUserStore
  } = stores;
  const fieldStore = useFieldsStore();
  const settingsStore = useSettingsStore();
  const userStore = useUserStore();
}
