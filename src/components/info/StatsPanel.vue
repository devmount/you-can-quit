<template>
<div class="container">
  <h2 class="mt-1">{{ t('stats.title') }}</h2>
  <div class="stats">
    <div class="box">
      <div class="title">{{ t('stats.streak.current') }}</div>
      <div class="data" :class="{ zero: currentStreak == 0, pulse: pulsing.current }">
        <span>{{ currentStreak }}</span> {{ t('day', currentStreak) }}
        <font-awesome-icon icon="angle-up" class="icon" />
      </div>
    </div>
    <div class="box">
      <div class="title">{{ t('stats.streak.longest') }}</div>
      <div class="data" :class="{ zero: longestStreak == 0, pulse: pulsing.longest }">
        <span>{{ longestStreak }}</span> {{ t('day', longestStreak) }}
        <font-awesome-icon icon="angle-double-up" class="icon" />
      </div>
    </div>
    <div class="box">
      <div class="title">{{ t('successful') }}</div>
      <div class="data" :class="{ zero: successfulDays == 0, pulse: pulsing.successful }">
        <span>{{ successfulDays }}</span> {{ t('day', successfulDays) }}
        <font-awesome-icon icon="check" class="icon" />
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue';
import { useI18n } from "vue-i18n";
import { getDate, getMinDate, getCurrentStreak } from '@/utils';
const { t } = useI18n();

const props = defineProps({
  statusData: Object,
});

// briefly highlight a stat tile when its value increases
const pulsing = reactive({ current: false, longest: false, successful: false });
const pulseTimeouts = {};
const triggerPulse = (key) => {
  pulsing[key] = true;
  clearTimeout(pulseTimeouts[key]);
  pulseTimeouts[key] = setTimeout(() => { pulsing[key] = false; }, 1300);
};

// get the minimum date (edited date that is most past)
const minDate = computed(() => getMinDate(props.statusData));

// get number of successful days in a row directly preceding today
const currentStreak = computed(() => getCurrentStreak(props.statusData));

// get maximum number of successful days in a row
const longestStreak = computed(() => {
  var streak = 0, max = 0, n = new Date(), min = new Date(minDate.value), key = '';
  while (min < n) {
    n = new Date(n.setDate(n.getDate() - 1));
    key = getDate(n.getFullYear(), n.getMonth()+1, n.getDate());
    if (!(key in props.statusData) || (key in props.statusData && props.statusData[key] != 1)) {
      max = streak > max ? streak : max;
      streak = 0;
    } else {
      streak++;
    }
  }
  // flush a streak that runs uninterrupted through the earliest tracked day
  return streak > max ? streak : max;
});

// get total number of successful days
const successfulDays = computed(() => {
  return Object.values(props.statusData).filter(value => value == 1).length;
});

watch(currentStreak, (newVal, oldVal) => { if (newVal > oldVal) triggerPulse('current'); });
watch(longestStreak, (newVal, oldVal) => { if (newVal > oldVal) triggerPulse('longest'); });
watch(successfulDays, (newVal, oldVal) => { if (newVal > oldVal) triggerPulse('successful'); });
</script>

<style>
.stats {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  cursor: default;
}
.stats .box {
  width: 31%;
}
.stats .box .data {
  position: relative;
  overflow: hidden;
  margin: 10px 0;
  padding: 5px 0;
  color: white;
  background-image: linear-gradient(to bottom right, var(--c-accent) 0, var(--c-accent-variant) 100%);
  background-color: var(--c-accent);
  box-shadow: 0 8px 20px -8px var(--c-shadow);
  transition: all 0.2s;
}
.stats .box .data.zero {
  color: var(--c-text-normal);
  background: var(--c-background-element);
}
.stats .box .data.pulse {
  animation: achievement-pulse 1s ease;
}
.stats .box .data > span {
  font-size: 2.5em;
  font-weight: bold;
}
.stats .box .data > .icon {
  position: absolute;
  right: -20px;
  bottom: -10px;
  color: #ffffff44;
  font-size: 4em;
}
.stats .box .data.zero > .icon {
  color: #ffffff11;
}
</style>
