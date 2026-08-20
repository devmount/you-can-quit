// Pure achievement computation, shared between AchievementList.vue (rendering)
// and App.vue (detecting newly-earned achievements right after a day update).
import { getDate, getMinDate, getCurrentStreak, getStateString } from '@/utils';

// the achievements object contains all existing achievements
export const achievements = [
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

/*
  below are all achievement computation functions.
  They always return an object of structure { state: 2, progress: 0 }
  where 'state' describes the number of times, this was achieved (integer)
  and 'progress' is a percentage that describes how close the (next) achievement is
*/
// achievement: first successful day
const achievedBeginning = (statusData) => {
  let state = Object.values(statusData).filter(value => value == 1).length
  return {
    state: state > 0 ? 1 : 0,
    progress: state > 0 ? 100 : 0,
    left: state < 1 ? 1 : 0,
    unit: 'day'
  }
};
// achievement: first 10 successful days
const achievedTen = (statusData) => {
  let state = Object.values(statusData).filter(value => value == 1).length
  return {
    state: state >= 10 ? 1 : 0,
    progress: state < 10 ? state*10 : 100,
    left: state < 10 ? 10-state : 0,
    unit: 'day'
  }
};
// achievement: 7 successful days in a row
const achievedSpeed = (statusData, minDate, currentStreak) => {
  const states = getStateString(statusData, minDate)
  return {
    state: (states.match(/(s)\1{6}/g) || []).length,
    progress: (currentStreak%7)/7*100,
    left: 7-currentStreak%7,
    unit: 'day'
  }
};
// achievement: a whole month with 6 fails or less
const achievedAlea = (statusData, minDate) => {
  var count = 0, n = new Date(), months = []
  // get all relevant months
  while (minDate <= n) {
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
      if (!(key in statusData) || (key in statusData && statusData[key] == -1)) {
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
    if (key in statusData && statusData[key] == 1) {
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
};
// achievement: more successful days than failed days
const achievedTide = (statusData) => {
  let successful = Object.values(statusData).filter(value => value == 1).length
  let failed = Object.values(statusData).filter(value => value == -1).length
  let state = successful > failed
  return {
    state: state ? 1 : 0,
    progress: state > 0 ? 100 : successful*100/(failed+1),
    left: state > 0 ? 0 : failed+1-successful,
    unit: 'day'
  }
};
// achievement: 6 successful days after a one day fail
const achievedDefense = (statusData, minDate) => {
  var count = 0
  const states = getStateString(statusData, minDate)
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
};
// achievement: 5 successful sundays in a row
const achievedPraise = (statusData, minDate) => {
  const states = getStateString(statusData, minDate, (d) => d.getDay() === 0)
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
};
// achievement: 4 times more successful days than failed days
const achievedUptrend = (statusData) => {
  let successful = Object.values(statusData).filter(value => value == 1).length
  let failed = Object.values(statusData).filter(value => value == -1).length
  let state = (successful/4) > failed
  return {
    state: state ? 1 : 0,
    progress: state > 0 ? 100 : (successful/4)*100/(failed+1/4),
    left: state > 0 ? 0 : failed*4+1-successful,
    unit: 'day'
  }
};
// achievement: collected 15 achievements
const achievedGatherer = (totalAchievementsWithoutGatherer) => {
  let state = Math.floor((Math.floor(totalAchievementsWithoutGatherer / 14) + totalAchievementsWithoutGatherer) / 15)
  let total = totalAchievementsWithoutGatherer + state
  return {
    state: state,
    progress: ((total%15)/15)*100,
    left: 15-total%15,
    unit: 'achievement'
  }
};
// achievement: Longest streak reached a multiple of 10
const achievedNews = (statusData, minDate, currentStreak) => {
  var streak = 0, max = 0, n = new Date(), min = minDate, key = ''
  while (min < n) {
    n = new Date(n.setDate(n.getDate() - 1))
    key = getDate(n.getFullYear(), n.getMonth()+1, n.getDate())
    if (!(key in statusData) || (key in statusData && statusData[key] != 1)) {
      max = streak > max ? streak : max
      streak = 0
    } else {
      streak++
    }
  }
  // flush a streak that runs uninterrupted through the earliest tracked day
  max = streak > max ? streak : max
  let state = Math.floor(max/10)
  let progress = currentStreak*100/(10*(state+1))
  if (currentStreak >= 10*(state+1)) {
    progress = 100
  }
  return {
    state: state,
    progress: progress,
    left: 10-currentStreak%10,
    unit: 'day'
  }
};
// achievement: first 50 successful days
const achievedSpock = (statusData) => {
  let state = Object.values(statusData).filter(value => value == 1).length
  return {
    state: state >= 50 ? 1 : 0,
    progress: state < 50 ? state*100/50 : 100,
    left: state < 50 ? 50-state : 0,
    unit: 'day'
  }
};
// achievement: 8 successful wednesdays in a row
const achievedMadness = (statusData, minDate) => {
  const states = getStateString(statusData, minDate, (d) => d.getDay() === 3)
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
};
// achievement: a whole month without a fail
const achievedClean = (statusData, minDate) => {
  var count = 0, n = new Date(), months = []
  // get all relevant months
  while (minDate <= n) {
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
      if (!(key in statusData) || (key in statusData && statusData[key] == -1)) {
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
    if (key in statusData && statusData[key] == 1) {
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
};
// achievement: Number of successful days reached a multiple of 100
const achievedStrike = (statusData) => {
  let successful = Object.values(statusData).filter(value => value == 1).length
  return {
    state: Math.floor(successful/100),
    progress: successful%100,
    left: 100-successful%100,
    unit: 'day'
  }
};
// achievement: 40 successful days in a row
const achievedEpic = (statusData, minDate, currentStreak) => {
  const states = getStateString(statusData, minDate)
  return {
    state: (states.match(/(s)\1{39}/g) || []).length,
    progress: (currentStreak%40)/40*100,
    left: 40-currentStreak%40,
    unit: 'day'
  }
};
// achievement: 365 successful days
const achievedMaster = (statusData) => {
  let successful = Object.values(statusData).filter(value => value == 1).length
  return {
    state: Math.floor(successful/365),
    progress: successful%365*100/365,
    left: 365-successful%365,
    unit: 'day'
  }
};
// achievement: 100 successful days in a row
const achievedStrength = (statusData, minDate, currentStreak) => {
  const states = getStateString(statusData, minDate)
  return {
    state: (states.match(/(s)\1{99}/g) || []).length,
    progress: currentStreak%100,
    left: 100-currentStreak%100,
    unit: 'day'
  }
};
// achievement: a whole year without a fail
const achievedLegend = (statusData, minDate) => {
  var count = 0, n = new Date(), years = []
  // get all relevant years
  while (minDate <= n) {
    n = new Date(n.setDate(n.getDate() - 1))
    if (n.getMonth() == 0 && n.getDate() == 1) {
      years.push(n.getFullYear())
    }
  }
  // iterate over all relevant years
  for (let i = 0; i < years.length; i++) {
    var noSuccess = 0
    for (let m = 0; m < 12; m++) {
      const days = new Date(years[i], m+1, 0).getDate()
      // iterate over all days of the current month
      for (let d = 1; d <= days; d++) {
        var key = getDate(years[i], m+1, d)
        if (!(key in statusData) || (key in statusData && statusData[key] == -1)) {
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
      if (key in statusData && statusData[key] == 1) {
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
};

// Map achievement key to its computation function (all except 'gatherer',
// which depends on the combined state of every other achievement)
const achievementFns = {
  beginning: achievedBeginning,
  ten: achievedTen,
  speed: achievedSpeed,
  alea: achievedAlea,
  tide: achievedTide,
  defense: achievedDefense,
  praise: achievedPraise,
  uptrend: achievedUptrend,
  news: achievedNews,
  spock: achievedSpock,
  madness: achievedMadness,
  clean: achievedClean,
  strike: achievedStrike,
  epic: achievedEpic,
  master: achievedMaster,
  strength: achievedStrength,
  legend: achievedLegend,
};

// Compute the status of every achievement for the given status data,
// returning a plain object keyed by achievement, e.g. { beginning: { state, progress, left, unit }, ... }
export const getAchievementStatuses = (statusData) => {
  const minDate = getMinDate(statusData);
  const currentStreak = getCurrentStreak(statusData);

  const statuses = {};
  let totalWithoutGatherer = 0;
  for (const key of achievements) {
    if (key == 'gatherer') continue;
    statuses[key] = achievementFns[key](statusData, minDate, currentStreak);
    totalWithoutGatherer += statuses[key].state;
  }
  statuses.gatherer = achievedGatherer(totalWithoutGatherer);

  return statuses;
};
