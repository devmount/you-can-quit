<template>
<div class="container">
  <h2>Achievements ({{ totalAchievements }})</h2>
  <div class="achievements">
    <!-- achievement: beginning | Mark the first day successful -->
    <div
      id="beginning"
      class="item"
      :class="{ active: achievedBeginning }"
    >
      <font-awesome-icon icon="sign-out-alt" class="icon" />
      <div class="description">
        <div class="title">The Beginning</div>
        Mark the first day successful
      </div>
    </div>
    <!-- achievement: speed | 7 successful days in a row -->
    <div
      id="speed"
      class="item"
      :class="{ active: achievedSpeed > 0 }"
    >
      <div class="badge" v-if="achievedSpeed > 1">{{ achievedSpeed }}</div>
      <font-awesome-icon icon="tachometer-alt" class="icon" />
      <div class="description">
        <div class="title">Pick Up Speed</div>
        7 successful days in a row
      </div>
    </div>
    <!-- achievement: alea | A whole month with 6 fails or less -->
    <div
      id="alea"
      class="item"
      :class="{ active: achievedAlea > 0 }"
    >
      <div class="badge" v-if="achievedAlea > 1">{{ achievedAlea }}</div>
      <font-awesome-icon icon="dice-six" class="icon" />
      <div class="description">
        <div class="title">Alea Iacta Est</div>
        A whole month with 6 fails or less
      </div>
    </div>
    <!-- achievement: tide | More successful days than failed days -->
    <div
      id="tide"
      class="item"
      :class="{ active: achievedTide }"
    >
      <font-awesome-icon icon="umbrella-beach" class="icon" />
      <div class="description">
        <div class="title">The tide is turned</div>
        More successful days than failed days
      </div>
    </div>
    <!-- achievement: defense | 3 successful days after a one day fail -->
    <div
      id="defense"
      class="item"
      :class="{ active: achievedDefense > 0 }"
    >
      <div class="badge" v-if="achievedDefense > 1">{{ achievedDefense }}</div>
      <font-awesome-icon icon="shield-alt" class="icon" />
      <div class="description">
        <div class="title">Strong Defense</div>
        3 successful days after a one day fail
      </div>
    </div>
    <!-- achievement: praise | 5 successful sundays in a row -->
    <div
      id="praise"
      class="item"
      :class="{ active: achievedPraise > 0 }"
    >
      <div class="badge" v-if="achievedPraise > 1">{{ achievedPraise }}</div>
      <font-awesome-icon icon="church" class="icon" />
      <div class="description">
        <div class="title">Praise The Lord</div>
        5 successful sundays in a row
      </div>
    </div>
    <!-- achievement: uptrend | 4 times more successful days than failed days -->
    <div
      id="uptrend"
      class="item"
      :class="{ active: achievedUptrend }"
    >
      <font-awesome-icon icon="chart-line" class="icon" />
      <div class="description">
        <div class="title">Rising tendency of Success</div>
        4 times more successful days than failed days
      </div>
    </div>
    <!-- achievement: gatherer | Collected 15 achievements (without itself) -->
    <div
      id="gatherer"
      class="item"
      :class="{ active: achievedGatherer > 0 }"
    >
      <div class="badge" v-if="achievedGatherer > 1">{{ achievedGatherer }}</div>
      <font-awesome-icon icon="award" class="icon" />
      <div class="description">
        <div class="title">Gatherer</div>
        Collected 15 achievements (without itself)
      </div>
    </div>
    <!-- achievement: clean | A whole month without a fail -->
    <div
      id="clean"
      class="item"
      :class="{ active: achievedClean > 0 }"
    >
      <div class="badge" v-if="achievedClean > 1">{{ achievedClean }}</div>
      <font-awesome-icon icon="broom" class="icon" />
      <div class="description">
        <div class="title">Stay Clean</div>
        A whole month without a fail
      </div>
    </div>
    <!-- achievement: epic | 40 successful days in a row -->
    <div
      id="epic"
      class="item"
      :class="{ active: achievedEpic > 0 }"
    >
      <div class="badge" v-if="achievedEpic > 1">{{ achievedEpic }}</div>
      <font-awesome-icon icon="trophy" class="icon" />
      <div class="description">
        <div class="title">Epic Trophy</div>
        40 successful days in a row
      </div>
    </div>
    <!-- achievement: master | A total of 365 successful days -->
    <div
      id="master"
      class="item"
      :class="{ active: achievedMaster > 0 }"
    >
      <div class="badge" v-if="achievedMaster > 1">{{ achievedMaster }}</div>
      <font-awesome-icon icon="graduation-cap" class="icon" />
      <div class="description">
        <div class="title">Master Of Success</div>
        A total of 365 successful days
      </div>
    </div>
    <!-- achievement: legend | A whole year without a fail -->
    <div
      id="legend"
      class="item"
      :class="{ active: achievedLegend > 0 }"
    >
      <div class="badge" v-if="achievedLegend > 1">{{ achievedLegend }}</div>
      <font-awesome-icon icon="monument" class="icon" />
      <div class="description">
        <div class="title">Legendary Monument</div>
        A whole year without a fail
      </div>
    </div>
    <!-- offset to show all items inline next to each other -->
    <div v-for="i in 3" class="item offset"></div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    statusData: Object,
  },
  methods: {
    // build date format yyyy-mm-dd
    getDate (year, month, day) {
      return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2)
    },
  },
  computed: {
    // get the minimum date (edited date that is most past)
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
      return this.totalAchievementsWithoutGatherer + this.achievedGatherer
    },
    // get number of total achievements without the gatherer achievements
    // (as gatherer needs to count the number of achievements without itself)
    totalAchievementsWithoutGatherer () {
      return (this.achievedBeginning ? 1 : 0)
        + this.achievedSpeed
        + this.achievedAlea
        + (this.achievedTide ? 1 : 0)
        + this.achievedDefense
        + this.achievedPraise
        + (this.achievedUptrend ? 1 : 0)
        + this.achievedClean
        + this.achievedEpic
        + this.achievedMaster
        + this.achievedLegend
    },
    // achievement: first successful day | returns bool
    achievedBeginning () {
      return Object.values(this.statusData).filter(value => value == 1).length > 0
    },
    // achievement: 7 successful days in a row | returns number
    achievedSpeed () {
      var states = '', n = new Date(), min = this.minDate, key = ''
      while (min < n) {
        n = new Date(n.setDate(n.getDate() - 1))
        key = this.getDate(n.getFullYear(), n.getMonth()+1, n.getDate())
        states = (key in this.statusData && this.statusData[key] == -1) ? states + 'f' : states
        states = (key in this.statusData && this.statusData[key] == 1) ? states + 's' : states
        states = !(key in this.statusData) ? states + 'n' : states
      }
      return (states.match(/(s)\1{6}/g) || []).length
    },
    // achievement: a whole month with 6 fails or less | returns number
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
        // iterate over all days of the current month
        for (let d = 1; d <= days; d++) {
          var key = this.getDate(months[i][0], months[i][1]+1, d)
          if (!(key in this.statusData) || (key in this.statusData && this.statusData[key] == -1)) {
            noSuccess++
          }
        }
        if (noSuccess <= 6) {
          count++
        }
      }
      return count
    },
    // achievement: more successful days than failed days | returns bool
    achievedTide () {
      return Object.values(this.statusData).filter(value => value == 1).length > Object.values(this.statusData).filter(value => value == -1).length
    },
    // achievement: 3 successful days after a one day fail | returns number
    achievedDefense () {
      var states = '', n = new Date(), min = this.minDate, key = ''
      while (min < n) {
        n = new Date(n.setDate(n.getDate() - 1))
        key = this.getDate(n.getFullYear(), n.getMonth()+1, n.getDate())
        states = (key in this.statusData && this.statusData[key] == -1) ? states + 'f' : states
        states = (key in this.statusData && this.statusData[key] == 1) ? states + 's' : states
        states = !(key in this.statusData) ? states + 'n' : states
      }
      return (states.match(/sssfs/g) || []).length
    },
    // achievement: 5 successful sundays in a row | returns number
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
      return (states.match(/(s)\1{4}/g) || []).length
    },
    // achievement: 4 times more successful days than failed days | returns bool
    achievedUptrend () {
      return (Object.values(this.statusData).filter(value => value == 1).length / 4) > Object.values(this.statusData).filter(value => value == -1).length
    },
    // achievement: collected 15 achievements (without itself) | returns number
    achievedGatherer () {
      return Math.floor(this.totalAchievementsWithoutGatherer / 15)
    },
    // achievement: a whole month without a fail | returns number
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
      return count
    },
    // achievement: 40 successful days in a row | returns number
    achievedEpic () {
      var states = '', n = new Date(), min = this.minDate, key = ''
      while (min < n) {
        n = new Date(n.setDate(n.getDate() - 1))
        key = this.getDate(n.getFullYear(), n.getMonth()+1, n.getDate())
        states = (key in this.statusData && this.statusData[key] == -1) ? states + 'f' : states
        states = (key in this.statusData && this.statusData[key] == 1) ? states + 's' : states
        states = !(key in this.statusData) ? states + 'n' : states
      }
      return (states.match(/(s)\1{39}/g) || []).length
    },
    // achievement: 365 successful days | returns number
    achievedMaster () {
      return Math.floor(Object.values(this.statusData).filter(value => value == 1).length / 365)
    },
    // achievement: a whole year without a fail | returns number
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
      return count
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
.achievements .item .description {
  position: absolute;
  font-size: .5em;
  line-height: 1.1em;
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
</style>
