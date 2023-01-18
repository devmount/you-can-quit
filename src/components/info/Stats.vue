<template>
<div class="container">
  <h2 class="mt-1">{{ t('stats.title') }}</h2>
  <div class="stats">
    <div class="box">
      <div class="title">{{ t('stats.streak.current') }}</div>
      <div class="data" :class="{ zero: currentStreak == 0 }">
        <span>{{ currentStreak }}</span> {{ t('day', currentStreak) }}
        <font-awesome-icon icon="angle-up" class="icon" />
      </div>
    </div>
    <div class="box">
      <div class="title">{{ t('stats.streak.longest') }}</div>
      <div class="data" :class="{ zero: longestStreak == 0 }">
        <span>{{ longestStreak }}</span> {{ t('day', longestStreak) }}
        <font-awesome-icon icon="angle-double-up" class="icon" />
      </div>
    </div>
    <div class="box">
      <div class="title">{{ t('successful') }}</div>
      <div class="data" :class="{ zero: successfulDays == 0 }">
        <span>{{ successfulDays }}</span> {{ t('day', successfulDays) }}
        <font-awesome-icon icon="check" class="icon" />
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
  statusData: Object,
});

// build date format yyyy-mm-dd
const getDate = (year, month, day) => {
  return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
};

// get the minimum date (edited date that is most past)
const minDate = computed(() => {
  var keys = Object.keys(props.statusData);
  if (typeof keys !== 'undefined' && keys.length > 0) {
    return keys.reduce(function (p, v) {
      var pd = new Date(p), vd = new Date(v);
      return ( pd < vd ? pd : vd );
    });
  } else {
    return new Date(1970, 0, 1);
  }
});

// get number of successful days in a row directly preceding today
const currentStreak = computed(() => {
  let streak = 0, undecided = true, n = new Date(), min = new Date(minDate.value), key = '';
  while (min <= n) {
    n = new Date(n.setDate(n.getDate() - 1));
    key = getDate(n.getFullYear(), n.getMonth()+1, n.getDate());
    if (!(key in props.statusData) && undecided) continue;
    if (!(key in props.statusData) || (key in props.statusData && props.statusData[key] < 1)) break;
    else {
      undecided = false;
      streak++;
    }
  }
  return streak;
});

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
  return max;
});

// get total number of successful days
const successfulDays = computed(() => {
  return Object.values(props.statusData).filter(value => value == 1).length;
});
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
.stats .box .data > span {
  font-size: 2.5em;
  font-weight: bold;
}
.stats .box .data > .icon {
  position: absolute;
  right: -10px;
  bottom: -15px;
  color: #ffffff44;
  font-size: 4em;
}
.stats .box .data.zero > .icon {
  color: #ffffff11;
}
</style>
