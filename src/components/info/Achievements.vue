<template>
<div class="container">
  <h2>{{ totalAchievements }} {{ t('achievement', totalAchievements) }}</h2>
  <div class="achievements">
    <!-- single achievement items -->
    <div
      v-for="a in achievements"
      :key="a"
      class="item"
      :class="{ active: getAchievementStatus(a).state > 0 }"
    >
      <div class="badge" v-if="getAchievementStatus(a).state > 1">{{ getAchievementStatus(a).state }}</div>
      <font-awesome-icon :icon="t('achievements.' + a + '.icon')" class="icon" />
      <div class="progress" :style="'width: ' + getAchievementStatus(a).progress + '%;'"></div>
      <div class="description">
        <div class="title">{{ t('achievements.' + a + '.title') }}</div>
        <div><font-awesome-icon icon="info-circle" class="icon" /> {{ t('achievements.' + a + '.description') }}</div>
        <div v-if="getAchievementStatus(a).progress == 100"><font-awesome-icon icon="check" class="icon" /> {{ t('completed') }}</div>
        <div v-else-if="getAchievementStatus(a).progress != 0">
          <font-awesome-icon icon="shoe-prints" class="icon" />
          {{ getAchievementStatus(a).progress.toFixed(1) }}% {{ t('done') }}, {{ getAchievementStatus(a).left }} {{ t(getAchievementStatus(a).unit, getAchievementStatus(a).left).toLowerCase() }} left
        </div>
      </div>
    </div>
    <!-- offset to show all items inline next to each other -->
    <div v-for="i in achievementOffset" :class="'item offset achievement-offset-' + i"></div>
  </div>
</div>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
  statusData: Object,
});


// the achievements object contains all existing achievements
const achievements = [
  'beginning',
  'ten',
  'speed',
  'alea',
  'tide',
  'defense',
  'praise',
  'uptrend',
  'gatherer',
  'news',
  'spock',
  'madness',
  'clean',
  'strike',
  'epic',
  'master',
  'strength',
  'legend',
];

// get the current status of each achievement
// this function maps an achievement key to its computed property value
const getAchievementStatus = (a) => {
  switch (a) {
    case 'beginning': return achievedBeginning.value;
    case 'ten': return achievedTen.value;
    case 'speed': return achievedSpeed.value;
    case 'alea': return achievedAlea.value;
    case 'tide': return achievedTide.value;
    case 'defense': return achievedDefense.value;
    case 'praise': return achievedPraise.value;
    case 'uptrend': return achievedUptrend.value;
    case 'gatherer': return achievedGatherer.value;
    case 'news': return achievedNews.value;
    case 'spock': return achievedSpock.value;
    case 'madness': return achievedMadness.value;
    case 'clean': return achievedClean.value;
    case 'strike': return achievedStrike.value;
    case 'epic': return achievedEpic.value;
    case 'master': return achievedMaster.value;
    case 'strength': return achievedStrength.value;
    case 'legend': return achievedLegend.value;
    default: break;
  }
};

// build date format yyyy-mm-dd
const getDate = (year, month, day) => {
  return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2)
};
  
// get the first date entry (edited date that is most past)
const minDate = computed(() => {
  var keys = Object.keys(props.statusData)
  if (typeof keys !== 'undefined' && keys.length > 0) {
    return keys.reduce(function (p, v) {
      var pd = new Date(p), vd = new Date(v)
      return ( pd < vd ? pd : vd );
    });
  }
});

// get number of total achievements
const totalAchievements = computed(() => {
  return totalAchievementsWithoutGatherer.value + achievedGatherer.value.state;
});

// get number of total achievements without the gatherer achievements
// (as gatherer needs to count the number of achievements without itself)
const totalAchievementsWithoutGatherer = computed(() => {
  var sum = 0;
  for (let a of achievements) {
    if (a != 'gatherer') {
      sum += getAchievementStatus(a).state;
    }
  }
  return sum;
});

// achievements are displayed using flexbox
// to align the last line left, it is filled up with invisible offset items
const achievementOffset = computed(() => {
  return 5 - (achievements.length % 5)
});

// get number of successful days in a row directly preceding today
const currentStreak = computed(() => {
  let streak = 0, undecided = true, n = new Date(), min = new Date(minDate.value), key = ''
  while (min <= n) {
    n = new Date(n.setDate(n.getDate() - 1))
    key = getDate(n.getFullYear(), n.getMonth()+1, n.getDate())
    if (!(key in props.statusData) && undecided) continue
    if (!(key in props.statusData) || (key in props.statusData && props.statusData[key] < 1)) break
    else {
      undecided = false
      streak++
    }
  }
  return streak
});

/*
  below are all computed achievement properties.
  They always return an object of structure { state: 2, progress: 0 }
  where 'state' describes the number of times, this was achieved (integer)
  and 'progress' is a percentage that describes how close the (next) achievement is
*/
// achievement: first successful day
const achievedBeginning = computed(() => {
  let state = Object.values(props.statusData).filter(value => value == 1).length
  return {
    state: state > 0 ? 1 : 0,
    progress: state > 0 ? 100 : 0,
    left: state < 1 ? 1 : 0,
    unit: 'day'
  }
});
// achievement: first 10 successful days
const achievedTen = computed(() => {
  let state = Object.values(props.statusData).filter(value => value == 1).length
  return {
    state: state >= 10 ? 1 : 0,
    progress: state < 10 ? state*10 : 100,
    left: state < 10 ? 10-state : 0,
    unit: 'day'
  }
});
// achievement: 7 successful days in a row
const achievedSpeed = computed(() => {
  var states = '', n = new Date(), min = minDate.value, key = ''
  while (min < n) {
    n = new Date(n.setDate(n.getDate() - 1))
    key = getDate(n.getFullYear(), n.getMonth()+1, n.getDate())
    states = (key in props.statusData && props.statusData[key] == -1) ? states + 'f' : states
    states = (key in props.statusData && props.statusData[key] == 1) ? states + 's' : states
    states = !(key in props.statusData) ? states + 'n' : states
  }
  return {
    state: (states.match(/(s)\1{6}/g) || []).length,
    progress: (currentStreak.value%7)/7*100,
    left: 7-currentStreak.value%7,
    unit: 'day'
  }
});
// achievement: a whole month with 6 fails or less
const achievedAlea = computed(() => {
  var count = 0, n = new Date(), months = []
  // get all relevant months
  while (minDate.value <= n) {
    n = new Date(n.setDate(n.getDate() - 1))
    if (n.getDate() == 1) {
      months.push([n.getFullYear(), n.getMonth()])
    }
  }
  // iterate over all relevant months
  for (let i = 0; i < months.length; i++) {
    const days = new Date(months[i][0], months[i][1]+1, 0).getDate()
    var noSuccess = 0
    // iterate over all days of the given month
    for (let d = 1; d <= days; d++) {
      let key = getDate(months[i][0], months[i][1]+1, d)
      // track non successful or missing days
      if (!(key in props.statusData) || (key in props.statusData && props.statusData[key] == -1)) {
        noSuccess++
      }
    }
    if (noSuccess <= 6) {
      count++
    }
  }
  // for progress: find number of successful days in current month
  let successful = 0, now = new Date()
  const days = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate()
  for (let d = 1; d <= days; d++) {
    let key = getDate(now.getFullYear(), now.getMonth()+1, d)
    // track successful days
    if (key in props.statusData && props.statusData[key] == 1) {
      successful++
    }
  }
  let daysLeft = days-successful-6
  let progress = successful >= days-6 ? 1 : successful/(days-6)
  return {
    state: count,
    progress: progress*100,
    left: daysLeft > 0 ? daysLeft : 0,
    unit: 'day'
  }
});
// achievement: more successful days than failed days
const achievedTide = computed(() => {
  let successful = Object.values(props.statusData).filter(value => value == 1).length
  let failed = Object.values(props.statusData).filter(value => value == -1).length
  let state = successful > failed
  return {
    state: state ? 1 : 0,
    progress: state > 0 ? 100 : successful*100/(failed+1),
    left: state > 0 ? 0 : failed+1-successful,
    unit: 'day'
  }
});
// achievement: 6 successful days after a one day fail
const achievedDefense = computed(() => {
  var count = 0, states = '', n = new Date(), min = minDate.value, key = ''
  while (min < n) {
    n = new Date(n.setDate(n.getDate() - 1))
    key = getDate(n.getFullYear(), n.getMonth()+1, n.getDate())
    states = (key in props.statusData && props.statusData[key] == -1) ? states + 'f' : states
    states = (key in props.statusData && props.statusData[key] == 1) ? states + 's' : states
    states = !(key in props.statusData) ? states + 'n' : states
  }
  for (let i = 0; i < states.length-7; i++) {
    if (states.substring(i, i+8) == 'ssssssfs') {
      count++
    }
  }
  // for progress: find number of current successful days after one day fail
  let successful = 0, failed = false
  let sequence = states.replace(/^n+/g, '').replace(/n+/g, 'f')
  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i] == 'n') continue
    if (sequence[i] == 'f' && successful == 0 || sequence[i] == 's' && failed || successful >= 6) break
    if (sequence[i] == 'f' && failed) {
      successful = 0
      break
    }
    if (sequence[i] == 'f' && !failed) {
      failed = true
      continue
    }
    if (sequence[i] == 's' && !failed) {
      successful++
      continue
    }
  }
  let daysLeft = 6-successful
  return {
    state: count,
    progress: ((successful%6)/6)*100,
    left: daysLeft > 0 ? daysLeft : 0,
    unit: 'day'
  }
});
// achievement: 5 successful sundays in a row
const achievedPraise = computed(() => {
  var states = '', n = new Date(), min = minDate.value, key = ''
  while (min < n) {
    n = new Date(n.setDate(n.getDate() - 1))
    if (n.getDay() > 0) {
      continue
    }
    key = getDate(n.getFullYear(), n.getMonth()+1, n.getDate())
    states = (key in props.statusData && props.statusData[key] == -1) ? states + 'f' : states
    states = (key in props.statusData && props.statusData[key] == 1) ? states + 's' : states
    states = !(key in props.statusData) ? states + 'n' : states
  }
  let successful = 0
  let sequence = states.replace(/^n+/g, '')
  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i] == 'f') break
    if (sequence[i] == 's') successful++
  }
  return {
    state: (states.match(/(s)\1{4}/g) || []).length,
    progress: ((successful%5)/5)*100,
    left: 5-successful%5,
    unit: 'sunday'
  }
});
// achievement: 4 times more successful days than failed days
const achievedUptrend = computed(() => {
  let successful = Object.values(props.statusData).filter(value => value == 1).length
  let failed = Object.values(props.statusData).filter(value => value == -1).length
  let state = (successful/4) > failed
  return {
    state: state ? 1 : 0,
    progress: state > 0 ? 100 : (successful/4)*100/(failed+1/4),
    left: state > 0 ? 0 : failed*4+1-successful,
    unit: 'day'
  }
});
// achievement: collected 15 achievements
const achievedGatherer = computed(() => {
  let state = Math.floor((Math.floor(totalAchievementsWithoutGatherer.value / 14) + totalAchievementsWithoutGatherer.value) / 15)
  let total = totalAchievementsWithoutGatherer.value + state
  return {
    state: state,
    progress: ((total%15)/15)*100,
    left: 15-total%15,
    unit: 'achievement'
  }
});
// achievement: Longest streak reached a multiple of 10
const achievedNews = computed(() => {
  var streak = 0, max = 0, n = new Date(), min = minDate.value, key = ''
  while (min < n) {
    n = new Date(n.setDate(n.getDate() - 1))
    key = getDate(n.getFullYear(), n.getMonth()+1, n.getDate())
    if (!(key in props.statusData) || (key in props.statusData && props.statusData[key] != 1)) {
      max = streak > max ? streak : max
      streak = 0
    } else {
      streak++
    }
  }
  let state = Math.floor(max/10)
  let progress = currentStreak.value*100/(10*(state+1))
  if (currentStreak.value >= 10*(state+1)) {
    progress = 100
  }
  return {
    state: state,
    progress: progress,
    left: 10-currentStreak.value%10,
    unit: 'day'
  }
});
// achievement: first 50 successful days
const achievedSpock = computed(() => {
  let state = Object.values(props.statusData).filter(value => value == 1).length
  return {
    state: state >= 50 ? 1 : 0,
    progress: state < 50 ? state*100/50 : 100,
    left: state < 50 ? 50-state : 0,
    unit: 'day'
  }
});
// achievement: 8 successful wednesdays in a row
const achievedMadness = computed(() => {
  var states = '', n = new Date(), min = minDate.value, key = ''
  while (min < n) {
    n = new Date(n.setDate(n.getDate() - 1))
    if (n.getDay() != 3) {
      continue
    }
    key = getDate(n.getFullYear(), n.getMonth()+1, n.getDate())
    states = (key in props.statusData && props.statusData[key] == -1) ? states + 'f' : states
    states = (key in props.statusData && props.statusData[key] == 1) ? states + 's' : states
    states = !(key in props.statusData) ? states + 'n' : states
  }
  let successful = 0
  let sequence = states.replace(/^n+/g, '')
  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i] == 'f') break
    if (sequence[i] == 's') successful++
  }
  return {
    state: (states.match(/(s)\1{7}/g) || []).length,
    progress: ((successful%8)/8)*100,
    left: 8-successful%8,
    unit: 'wednesday'
  }
});
// achievement: a whole month without a fail
const achievedClean = computed(() => {
  var count = 0, n = new Date(), months = []
  // get all relevant months
  while (minDate.value <= n) {
    n = new Date(n.setDate(n.getDate() - 1))
    if (n.getDate() == 1) {
      months.push([n.getFullYear(), n.getMonth()])
    }
  }
  // iterate over all relevant months
  for (let i = 0; i < months.length; i++) {
    const days = new Date(months[i][0], months[i][1]+1, 0).getDate()
    var noSuccess = 0
    // iterate over all days of the current month
    for (let d = 1; d <= days; d++) {
      var key = getDate(months[i][0], months[i][1]+1, d)
      if (!(key in props.statusData) || (key in props.statusData && props.statusData[key] == -1)) {
        noSuccess++
      }
    }
    if (noSuccess == 0) {
      count++
    }
  }
  // for progress: find number of successful days in current month
  let successful = 0, now = new Date()
  const days = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate()
  for (let d = 1; d <= days; d++) {
    let key = getDate(now.getFullYear(), now.getMonth()+1, d)
    // track successful days
    if (key in props.statusData && props.statusData[key] == 1) {
      successful++
    }
  }
  let daysLeft = days-successful
  return {
    state: count,
    progress: (successful/days)*100,
    left: daysLeft > 0 ? daysLeft : 0,
    unit: 'day'
  }
});
// achievement: Number of successful days reached a multiple of 100
const achievedStrike = computed(() => {
  let successful = Object.values(props.statusData).filter(value => value == 1).length
  return {
    state: Math.floor(successful/100),
    progress: successful%100,
    left: 100-successful%100,
    unit: 'day'
  }
});
// achievement: 40 successful days in a row
const achievedEpic = computed(() => {
  var states = '', n = new Date(), min = minDate.value, key = ''
  while (min < n) {
    n = new Date(n.setDate(n.getDate() - 1))
    key = getDate(n.getFullYear(), n.getMonth()+1, n.getDate())
    states = (key in props.statusData && props.statusData[key] == -1) ? states + 'f' : states
    states = (key in props.statusData && props.statusData[key] == 1) ? states + 's' : states
    states = !(key in props.statusData) ? states + 'n' : states
  }
  return {
    state: (states.match(/(s)\1{39}/g) || []).length,
    progress: (currentStreak.value%40)/40*100,
    left: 40-currentStreak.value%40,
    unit: 'day'
  }
});
// achievement: 365 successful days
const achievedMaster = computed(() => {
  let successful = Object.values(props.statusData).filter(value => value == 1).length
  return {
    state: Math.floor(successful/365),
    progress: successful%365*100/365,
    left: 365-successful%365,
    unit: 'day'
  }
});
// achievement: 100 successful days in a row
const achievedStrength = computed(() => {
  var states = '', n = new Date(), min = minDate.value, key = ''
  while (min < n) {
    n = new Date(n.setDate(n.getDate() - 1))
    key = getDate(n.getFullYear(), n.getMonth()+1, n.getDate())
    states = (key in props.statusData && props.statusData[key] == -1) ? states + 'f' : states
    states = (key in props.statusData && props.statusData[key] == 1) ? states + 's' : states
    states = !(key in props.statusData) ? states + 'n' : states
  }
  return {
    state: (states.match(/(s)\1{99}/g) || []).length,
    progress: currentStreak.value%100,
    left: 100-currentStreak.value%100,
    unit: 'day'
  }
});
// achievement: a whole year without a fail
const achievedLegend = computed(() => {
  var count = 0, n = new Date(), years = []
  // get all relevant years
  while (minDate.value <= n) {
    n = new Date(n.setDate(n.getDate() - 1))
    if (n.getMonth() == 0 && n.getDate() == 1) {
      years.push(n.getFullYear())
    }
  }
  // iterate over all relevant years
  for (let i = 0; i < years.length; i++) {
    var noSuccess = 0
    for (let m = 0; m < 12; m++) {
      const days = new Date(years[i], m, 0).getDate()
      // iterate over all days of the current month
      for (let d = 1; d <= days; d++) {
        var key = getDate(years[i], m, d)
        if (!(key in props.statusData) || (key in props.statusData && props.statusData[key] == -1)) {
          noSuccess++
        }
      }
    }
    if (noSuccess == 0) {
      count++
    }
  }
  // for progress: find number of successful days in current year
  let successful = 0, now = new Date(), year = now.getFullYear()
  const days = year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0) ? 366 : 365
  for (let m = 0; m < 12; m++) {
    const mdays = new Date(year, m+1, 0).getDate()
    for (let d = 1; d <= mdays; d++) {
      let key = getDate(year, m+1, d)
      // track successful days
      if (key in props.statusData && props.statusData[key] == 1) {
        successful++
      }
    }
  }
  let daysLeft = days-successful
  return {
    state: count,
    progress: (successful/days)*100,
    left: daysLeft > 0 ? daysLeft : 0,
    unit: 'day'
  }
});
</script>

<style>
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
