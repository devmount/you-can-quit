<template>
<div class="container">
  <h2>{{ totalAchievements }} <span class="capitalize">{{ t('achievement', totalAchievements) }}</span></h2>
  <div class="achievements">
    <!-- single achievement items -->
    <div
      v-for="a in achievements"
      :key="a"
      class="item"
      :class="{ active: getAchievementStatus(a).state > 0, pulse: animatingKeys.includes(a) }"
    >
      <div class="badge" v-if="getAchievementStatus(a).state > 1">{{ getAchievementStatus(a).state }}</div>
      <font-awesome-icon :icon="t('achievements.' + a + '.icon')" class="icon" />
      <div class="progress" :style="{ width: getAchievementStatus(a).progress + '%' }"></div>
      <div class="description">
        <div class="title">{{ t('achievements.' + a + '.title') }}</div>
        <div><font-awesome-icon icon="info-circle" class="icon" /> {{ t('achievements.' + a + '.description') }}</div>
        <div v-if="getAchievementStatus(a).progress == 100"><font-awesome-icon icon="check" class="icon" /> {{ t('completed') }}</div>
        <div v-else-if="getAchievementStatus(a).progress != 0">
          <font-awesome-icon icon="shoe-prints" class="icon" />
          {{ getAchievementStatus(a).progress.toFixed(1) }}% {{ t('done') }}, {{ getAchievementStatus(a).left }} {{ t(getAchievementStatus(a).unit, getAchievementStatus(a).left) }} {{ t('left') }}
        </div>
      </div>
    </div>
    <!-- offset to show all items inline next to each other -->
    <div v-for="i in achievementOffset" :key="'offset-' + i" :class="'item offset achievement-offset-' + i"></div>
  </div>
</div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from "vue-i18n";
import { achievements, getAchievementStatuses } from '@/achievements';
const { t } = useI18n();

const props = defineProps({
  statusData: Object,
  unlockedAchievements: {
    type: Array,
    default: () => [],
  },
});

// status of every achievement, keyed by achievement
const statuses = computed(() => getAchievementStatuses(props.statusData));
const getAchievementStatus = (a) => statuses.value[a];

// get number of total achievements
const totalAchievements = computed(() => {
  return achievements.reduce((sum, a) => sum + getAchievementStatus(a).state, 0);
});

// achievements are displayed using flexbox
// to align the last line left, it is filled up with invisible offset items
const achievementOffset = computed(() => {
  return 5 - (achievements.length % 5)
});

// briefly highlight unlocked achievement tiles
const animatingKeys = ref([]);
let animationTimeout = null;
watch(() => props.unlockedAchievements, (keys) => {
  if (!keys.length) return;
  animatingKeys.value = keys;
  clearTimeout(animationTimeout);
  animationTimeout = setTimeout(() => {
    animatingKeys.value = [];
  }, 1300);
});
</script>

<style>
h2 .capitalize {
  text-transform: capitalize;
}
.achievements {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  cursor: default;
}
.achievements .item {
  width: 60px;
  height: 60px;
  line-height: 60px;
  position: relative;
  overflow: visible;
  margin: 7px 0;
  padding: 5px;
  font-size: 2em;
  color: var(--c-text-normal);
  background: var(--c-background-element);
  box-shadow: 0 8px 20px -8px var(--c-shadow);
  transition: all 0.2s;
}
.achievements .item.offset {
  background: transparent;
  box-shadow: none;
}
.achievements .item.active {
  color: white;
  background-image: linear-gradient(to bottom right, var(--c-accent) 0, var(--c-accent-variant) 100%);
  background-color: var(--c-accent);
}
.achievements .item.pulse {
  animation: achievement-pulse 1s ease;
  z-index: 1;
}
.achievements .item .badge {
  position: absolute;
  font-size: .4em;
  line-height: .4em;
  font-weight: bold;
  top: -2px;
  right: -2px;
  background: white;
  color: var(--c-accent-variant);
  padding: 7px 5px;
}
.achievements .item .progress {
  position: absolute;
  width: 0%;
  height: 3px;
  bottom: 0;
  left: 0;
  background: white;
  transition: width 0.2s;
}
.achievements .item .description {
  position: absolute;
  font-size: .5em;
  line-height: 1.2em;
  visibility: hidden;
  opacity: 0;
  z-index: 2;
  transition: all 0.2s;
  width: 210px;
  background: var(--c-background-element);
  padding: 13px;
  top: 84px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 8px 20px -8px var(--c-shadow);
}
.achievements .item .description::before {
  content: '';
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 14px solid transparent;
  border-right: 14px solid transparent;
  border-bottom: 14px solid var(--c-background-element);
}
.achievements .item:nth-child(5n+1) .description {
  left: 0;
  transform: initial;
}
.achievements .item:nth-child(5n+1) .description::before {
  left: 35px;
}
.achievements .item:nth-child(5n) .description {
  left: auto;
  right: 0;
  transform: initial;
}
.achievements .item:nth-child(5n) .description::before {
  left: auto;
  right: 35px;
  transform: translateX(50%);
}
.achievements .item .description .title {
  position: relative;
  font-size: 1.3em;
  line-height: 1.5em;
  padding-bottom: 1em;
}
.achievements .item .description .title::after {
  content: '';
  position: absolute;
  bottom: .5em;
  width: 20%;
  max-width: 120px;
  height: 2px;
  background: var(--c-accent);
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 1px 10px -1px var(--c-shadow);
}
.achievements .item:hover .description,
.achievements .item:focus .description,
.achievements .item:active .description {
  visibility: visible;
  opacity: 1;
}
.achievements .item .description:hover {
  visibility: hidden;
  opacity: 0;
}
</style>
