<template>
<div class="info">
  <Stats :status-data="statusData" />
  <Achievements :status-data="statusData" />
  <Legend />
</div>
</template>

<script setup>
import { defineProps } from 'vue';
import Legend from './info/Legend.vue';
import Stats from './info/Stats.vue';
import Achievements from './info/Achievements.vue';

defineProps({
  statusData: Object,
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
