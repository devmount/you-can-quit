<template>
<div class="info">
  <stats :status-data="statusData" />
  <achievements :status-data="statusData" />
  <legend />
</div>
</template>

<script setup>
import Achievements from '@/components/info/Achievements.vue';
import Legend from '@/components/info/Legend.vue';
import Stats from '@/components/info/Stats.vue';

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
