import { config } from '@vue/test-utils';

// every component uses the globally-registered font-awesome-icon component
// (registered in main.js, never imported locally) - stub it everywhere so
// tests don't need to replicate the full icon library setup
config.global.stubs = {
  'font-awesome-icon': true,
};
