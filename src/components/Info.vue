<template>
<div class="info">
  <Stats :status-data="statusData" />
  <Achievements :status-data="statusData" />
  <Legend />
</div>
</template>

<script>
import { defineComponent } from 'vue';
import Legend from './info/Legend.vue';
import Stats from './info/Stats.vue';
import Achievements from './info/Achievements.vue';

export default defineComponent({
  components: {
    Legend,
    Stats,
    Achievements
  },
  props: {
    statusData: Object,
  }
});
</script>

<style>
.info {
  display: flex;
  flex-flow: column nowrap;
  height: 784px;
  justify-content: space-between;
}
</style>
