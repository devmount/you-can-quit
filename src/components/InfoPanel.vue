<template>
<div class="info">
  <stats-panel :status-data="statusData" />
  <achievement-list :status-data="statusData" :unlocked-achievements="unlockedAchievements" />
</div>
</template>

<script setup>
import AchievementList from '@/components/info/AchievementList.vue';
import StatsPanel from '@/components/info/StatsPanel.vue';

defineProps({
  statusData: Object,
  unlockedAchievements: {
    type: Array,
    default: () => [],
  },
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
