<template>
<div class="container">
  <h2 class="mt-1">Stats</h2>
  <div class="stats">
    <div class="box">
      <div class="title">Current streak</div>
      <div class="data" :class="{ zero: currentStreak == 0 }">
        <span>{{ currentStreak }}</span> days
        <font-awesome-icon icon="angle-up" class="icon" />
      </div>
    </div>
    <div class="box">
      <div class="title">Longest streak</div>
      <div class="data" :class="{ zero: longestStreak == 0 }">
        <span>{{ longestStreak }}</span> days
        <font-awesome-icon icon="angle-double-up" class="icon" />
      </div>
    </div>
    <div class="box">
      <div class="title">Successful</div>
      <div class="data" :class="{ zero: successfulDays == 0 }">
        <span>{{ successfulDays }}</span> days
        <font-awesome-icon icon="check" class="icon" />
      </div>
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
    // get maximum number of successful days in a row
    longestStreak () {
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
      return max
    },
    // get total number of successful days
    successfulDays () {
      return Object.values(this.statusData).filter(value => value == 1).length
    }
  }
}
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
