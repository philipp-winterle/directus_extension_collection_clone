import { defineModule } from '@directus/extensions-sdk';
import Module from './module.vue';

export default defineModule({
  id: 'directus_module_collection_clone',
  name: 'Clone Collection',
  icon: 'copy_all',
  color: 'primary',
  hidden: false,
  routes: [
    {
      path: '',
      component: Module,
    },
  ],

  // preRegisterCheck() {
  //   injectCloneButton();

  //   return true;
  // },
});
