<template>
<div class="container">
  <h2>{{ totalAchievements }} {{ $tc('achievement', totalAchievements) }}</h2>
  <div class="achievements">
    <!-- single achievement items -->
    <div
      v-for="a in achievements"
      :key="a"
      class="item"
      :class="{ active: getAchievementStatus(a).state > 0 }"
    >
      <div class="badge" v-if="getAchievementStatus(a).state > 1">{{ getAchievementStatus(a).state }}</div>
      <font-awesome-icon :icon="$t('achievements.' + a + '.icon')" class="icon" />
      <div class="progress" :style="'width: ' + getAchievementStatus(a).progress + '%;'"></div>
      <div class="description">
        <div class="title">{{ $t('achievements.' + a + '.title') }}</div>
        {{ $t('achievements.' + a + '.description') }}
      </div>
    </div>
    <!-- offset to show all items inline next to each other -->
    <div v-for="i in achievementOffset" :class="'item offset achievement-offset-' + i"></div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    statusData: Object,
  },
  data () {
    return {
      // the achievements object contains all existing achievements
      achievements: [
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
      ]
    }
  },
  methods: {
    // get the current status of each achievement
    // this function maps an achievement key to its computed property value
    getAchievementStatus (a) {
      switch (a) {
        case 'beginning': return this.achievedBeginning
        case 'ten': return this.achievedTen
        case 'speed': return this.achievedSpeed
        case 'alea': return this.achievedAlea
        case 'tide': return this.achievedTide
        case 'defense': return this.achievedDefense
        case 'praise': return this.achievedPraise
        case 'uptrend': return this.achievedUptrend
        case 'gatherer': return this.achievedGatherer
        case 'news': return this.achievedNews
        case 'spock': return this.achievedSpock
        case 'madness': return this.achievedMadness
        case 'clean': return this.achievedClean
        case 'strike': return this.achievedStrike
        case 'epic': return this.achievedEpic
        case 'master': return this.achievedMaster
        case 'strength': return this.achievedStrength
        case 'legend': return this.achievedLegend
        default: break;
      }
    },
    // build date format yyyy-mm-dd
    getDate (year, month, day) {
      return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2)
    },
  },
  computed: {
    // get the first date entry (edited date that is most past)
    minDate () {
      var keys = Object.keys(this.statusData)
      if (typeof keys !== 'undefined' && keys.length > 0) {
        return keys.reduce(function (p, v) {
          var pd = new Date(p), vd = new Date(v)
          return ( pd < vd ? pd : vd );
        });
      }
    },
    // get number of total achievements
    totalAchievements () {
      return this.totalAchievementsWithoutGatherer + this.achievedGatherer.state
    },
    // get number of total achievements without the gatherer achievements
    // (as gatherer needs to count the number of achievements without itself)
    totalAchievementsWithoutGatherer () {
      var sum = 0
      for (let a of this.achievements) {
        if (a != 'gatherer') {
          sum += this.getAchievementStatus(a).state
        }
      }
      return sum
    },
    // achievements are displayed using flexbox
    // to align the last line left, it is filled up with invisible offset items
    achievementOffset () {
      return 5 - (this.achievements.length % 5)
    },
    // get number of successful days in a row directly preceding today
    currentStreak () {
      var streak = 0, undecided = true, n = new Date(), min = this.minDate, key = ''
      while (min < n) {
        n = new Date(n.setDate(n.getDate() - 1))
        key = this.getDate(n.getFullYear(), n.getMonth()+1, n.getDate())
        if ((!(key in this.statusData) || this.statusData[key] == 0) && undecided) {
          continue
        }
        if (!(key in this.statusData) || (key in this.statusData && this.statusData[key] != 1)) {
          break
        } else {
          undecided = false
          streak++
        }
      }
      return streak
    },
    /*
      below are all computed achievement properties.
      They always return an object of structure { state: 2, progress: 0 }
      where 'state' describes the number of times, this was achieved (integer)
      and 'progress' is a percentage that describes how close the (next) achievement is
    */
    // achievement: first successful day
    achievedBeginning () {
      let state = Object.values(this.statusData).filter(value => value == 1).length
      return {
        state: state > 0 ? 1 : 0,
        progress: state > 0 ? 100 : 0
      }
    },
    // achievement: first 10 successful days
    achievedTen () {
      let state = Object.values(this.statusData).filter(value => value == 1).length
      return {
        state: state >= 10 ? 1 : 0,
        progress: state < 10 ? state*10 : 100
      }
    },
    // achievement: 7 successful days in a row
    achievedSpeed () {
      var states = '', n = new Date(), min = this.minDate, key = ''
      while (min < n) {
        n = new Date(n.setDate(n.getDate() - 1))
        key = this.getDate(n.getFullYear(), n.getMonth()+1, n.getDate())
        states = (key in this.statusData && this.statusData[key] == -1) ? states + 'f' : states
        states = (key in this.statusData && this.statusData[key] == 1) ? states + 's' : states
        states = !(key in this.statusData) ? states + 'n' : states
      }
      return {
        state: (states.match(/(s)\1{6}/g) || []).length,
        progress: (this.currentStreak%7)/7*100
      }
    },
    // achievement: a whole month with 6 fails or less
    achievedAlea () {
      var count = 0, n = new Date(), months = []
      // get all relevant months
      while (this.minDate <= n) {
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
          let key = this.getDate(months[i][0], months[i][1]+1, d)
          // track non successful or missing days
          if (!(key in this.statusData) || (key in this.statusData && this.statusData[key] == -1)) {
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
        let key = this.getDate(now.getFullYear(), now.getMonth()+1, d)
        // track non successful or missing days
        if (key in this.statusData && this.statusData[key] == 1) {
          successful++
        }
      }
      return {
        state: count,
        progress: (successful/days)*100
      }
    },
    // achievement: more successful days than failed days
    achievedTide () {
      let successful = Object.values(this.statusData).filter(value => value == 1).length
      let failed = Object.values(this.statusData).filter(value => value == -1).length
      let state = successful > failed
      return {
        state: state ? 1 : 0,
        progress: state > 0 ? 100 : successful*100/(failed+1)
      }
    },
    // achievement: 6 successful days after a one day fail
    achievedDefense () {
      var count = 0, states = '', n = new Date(), min = this.minDate, key = ''
      while (min < n) {
        n = new Date(n.setDate(n.getDate() - 1))
        key = this.getDate(n.getFullYear(), n.getMonth()+1, n.getDate())
        states = (key in this.statusData && this.statusData[key] == -1) ? states + 'f' : states
        states = (key in this.statusData && this.statusData[key] == 1) ? states + 's' : states
        states = !(key in this.statusData) ? states + 'n' : states
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
      return {
        state: count,
        progress: ((successful%6)/6)*100
      }
    },
    // achievement: 5 successful sundays in a row
    achievedPraise () {
      var states = '', n = new Date(), min = this.minDate, key = ''
      while (min < n) {
        n = new Date(n.setDate(n.getDate() - 1))
        if (n.getDay() > 0) {
          continue
        }
        key = this.getDate(n.getFullYear(), n.getMonth()+1, n.getDate())
        states = (key in this.statusData && this.statusData[key] == -1) ? states + 'f' : states
        states = (key in this.statusData && this.statusData[key] == 1) ? states + 's' : states
        states = !(key in this.statusData) ? states + 'n' : states
      }
      let successful = 0
      let sequence = states.replace(/^n+/g, '')
      for (let i = 0; i < sequence.length; i++) {
        if (sequence[i] == 'f') break
        if (sequence[i] == 's') successful++
      }
      return {
        state: (states.match(/(s)\1{4}/g) || []).length,
        progress: ((successful%5)/5)*100
      }
    },
    // achievement: 4 times more successful days than failed days
    achievedUptrend () {
      let successful = Object.values(this.statusData).filter(value => value == 1).length
      let failed = Object.values(this.statusData).filter(value => value == -1).length
      let state = (successful/4) > failed
      return {
        state: state ? 1 : 0,
        progress: state > 0 ? 100 : (successful/4)*100/(failed+1/4)
      }
    },
    // achievement: collected 15 achievements
    achievedGatherer () {
      let state = Math.floor((Math.floor(this.totalAchievementsWithoutGatherer / 14) + this.totalAchievementsWithoutGatherer) / 15)
      let total = this.totalAchievementsWithoutGatherer + state
      return {
        state: state,
        progress: ((total%15)/15)*100
      }
    },
    // achievement: Longest streak reached a multiple of 10
    achievedNews () {
      var streak = 0, max = 0, n = new Date(), min = this.minDate, key = ''
      while (min < n) {
        n = new Date(n.setDate(n.getDate() - 1))
        key = this.getDate(n.getFullYear(), n.getMonth()+1, n.getDate())
        if (!(key in this.statusData) || (key in this.statusData && this.statusData[key] != 1)) {
          max = streak > max ? streak : max
          streak = 0
        } else {
          streak++
        }
      }
      return {
        state: Math.floor(max/10),
        progress: 0
      }
    },
    // achievement: first 50 successful days
    achievedSpock () {
      return {
        state: Object.values(this.statusData).filter(value => value == 1).length >= 50 ? 1 : 0,
        progress: 0
      }
    },
    // achievement: 8 successful wednesdays in a row
    achievedMadness () {
      var states = '', n = new Date(), min = this.minDate, key = ''
      while (min < n) {
        n = new Date(n.setDate(n.getDate() - 1))
        if (n.getDay() != 3) {
          continue
        }
        key = this.getDate(n.getFullYear(), n.getMonth()+1, n.getDate())
        states = (key in this.statusData && this.statusData[key] == -1) ? states + 'f' : states
        states = (key in this.statusData && this.statusData[key] == 1) ? states + 's' : states
        states = !(key in this.statusData) ? states + 'n' : states
      }
      return {
        state: (states.match(/(s)\1{7}/g) || []).length,
        progress: 0
      }
    },
    // achievement: a whole month without a fail
    achievedClean () {
      var count = 0, n = new Date(), months = []
      // get all relevant months
      while (this.minDate <= n) {
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
          var key = this.getDate(months[i][0], months[i][1]+1, d)
          if (!(key in this.statusData) || (key in this.statusData && this.statusData[key] == -1)) {
            noSuccess++
          }
        }
        if (noSuccess == 0) {
          count++
        }
      }
      return {
        state: count,
        progress: 0
      }
    },
    // achievement: Number of successful days reached a multiple of 100
    achievedStrike () {
      return {
        state: Math.floor(Object.values(this.statusData).filter(value => value == 1).length/100),
        progress: 0
      }
    },
    // achievement: 40 successful days in a row
    achievedEpic () {
      var states = '', n = new Date(), min = this.minDate, key = ''
      while (min < n) {
        n = new Date(n.setDate(n.getDate() - 1))
        key = this.getDate(n.getFullYear(), n.getMonth()+1, n.getDate())
        states = (key in this.statusData && this.statusData[key] == -1) ? states + 'f' : states
        states = (key in this.statusData && this.statusData[key] == 1) ? states + 's' : states
        states = !(key in this.statusData) ? states + 'n' : states
      }
      return {
        state: (states.match(/(s)\1{39}/g) || []).length,
        progress: 0
      }
    },
    // achievement: 365 successful days
    achievedMaster () {
      return {
        state: Math.floor(Object.values(this.statusData).filter(value => value == 1).length / 365),
        progress: 0
      }
    },
    // achievement: 100 successful days in a row
    achievedStrength () {
      var states = '', n = new Date(), min = this.minDate, key = ''
      while (min < n) {
        n = new Date(n.setDate(n.getDate() - 1))
        key = this.getDate(n.getFullYear(), n.getMonth()+1, n.getDate())
        states = (key in this.statusData && this.statusData[key] == -1) ? states + 'f' : states
        states = (key in this.statusData && this.statusData[key] == 1) ? states + 's' : states
        states = !(key in this.statusData) ? states + 'n' : states
      }
      return {
        state: (states.match(/(s)\1{99}/g) || []).length,
        progress: 0
      }
    },
    // achievement: a whole year without a fail
    achievedLegend () {
      var count = 0, n = new Date(), years = []
      // get all relevant years
      while (this.minDate <= n) {
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
            var key = this.getDate(years[i], m, d)
            if (!(key in this.statusData) || (key in this.statusData && this.statusData[key] == -1)) {
              noSuccess++
            }
          }
        }
        if (noSuccess == 0) {
          count++
        }
      }
      return {
        state: count,
        progress: 0
      }
    },
  }
}
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
