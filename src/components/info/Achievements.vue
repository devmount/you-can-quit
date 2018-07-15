<template>
<div class="container">
  <h2 class="mt-2">Achievements</h2>
  <div class="achievements">
    <div
      id="beginning"
      class="item"
      :class="{ active: achievedBeginning }"
      title="The Beginning"
    >
      <font-awesome-icon icon="sign-out-alt" class="icon" />
      <div class="description">Mark the first day successful</div>
    </div>
    <div
      id="speed"
      class="item"
      :class="{ active: achievedSpeed > 0 }"
      title="Pick Up Speed"
    >
      <div class="badge" v-if="achievedSpeed > 1">{{ achievedSpeed }}</div>
      <font-awesome-icon icon="tachometer-alt" class="icon" />
      <div class="description">7 successful days in a row</div>
    </div>
    <div
      id="alea"
      class="item"
      :class="{ active: achievedAlea > 0 }"
      title="Alea Iacta Est"
    >
      <div class="badge" v-if="achievedAlea > 0">{{ achievedAlea }}</div>
      <font-awesome-icon icon="dice-six" class="icon" />
      <div class="description">A month with 6 fails or less</div>
    </div>
    <div
      id="tide"
      class="item"
      :class="{ active: achievedTide > 0 }"
      title="The tide is turned"
    >
      <font-awesome-icon icon="umbrella-beach" class="icon" />
      <div class="description">More successful days than failed days</div>
    </div>
    <div
      id="clean"
      class="item"
      :class="{ active: achievedClean > 0 }"
      title="Stay Clean"
    >
      <div class="badge" v-if="achievedClean > 0">{{ achievedClean }}</div>
      <font-awesome-icon icon="broom" class="icon" />
      <div class="description">A whole month without a fail</div>
    </div>
    <div
      id="master"
      class="item"
      :class="{ active: achievedMaster > 0 }"
      title="Master Of Success"
    >
      <div class="badge" v-if="achievedMaster > 0">{{ achievedMaster }}</div>
      <font-awesome-icon icon="graduation-cap" class="icon" />
      <div class="description">A total of 365 successful days</div>
    </div>
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
    // achievement: first successful day | returns bool
    achievedBeginning () {
      return Object.values(this.statusData).filter(value => value == 1).length > 0
    },
    // achievement: 7 successful days in a row | returns number
    achievedSpeed () {
      var streak = 0, count = 0, n = new Date(), min = this.minDate, key = ''
      while (min < n) {
        n = new Date(n.setDate(n.getDate() - 1))
        key = this.getDate(n.getFullYear(), n.getMonth()+1, n.getDate())
        if (streak == 7) {
          count++
          streak = 0
        }
        if (!(key in this.statusData) || (key in this.statusData && this.statusData[key] != 1)) {
          streak = 0
        } else {
          streak++
        }
      }
      return count
    },
    // achievement: a month with 6 fails or less | returns number
    achievedAlea () {
      // TODO
      var fails = 0, count = 0, n = new Date(), min = this.minDate, key = ''
      return 0
    },
    // achievement: more successful days than failed days | returns bool
    achievedTide () {
      return Object.values(this.statusData).filter(value => value == 1).length > Object.values(this.statusData).filter(value => value == -1).length
    },
    // achievement: a whole month without a fail | returns number
    achievedClean () {
      // TODO
      return 0
    },
    // achievement: 365 successful days | returns number
    achievedMaster () {
      return Math.floor(Object.values(this.statusData).filter(value => value == 1).length / 365)
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
  display: none;
}
</style>
