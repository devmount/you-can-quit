<template>
<div class="container">
  <h2>Stats</h2>
  <div class="stats">
    Current streak: {{ currentStreak }}<br>
    Longest streak: {{ longestStreak }}
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
      var streak = 0, n = new Date(), min = this.minDate, key = ''
      while (min < n) {
        n = new Date(n.setDate(n.getDate() - 1))
        key = this.getDate(n.getFullYear(), n.getMonth()+1, n.getDate())
        if (!(key in this.statusData) || (key in this.statusData && this.statusData[key] != 1)) {
          break
        } else {
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
    }
  }
}
</script>

<style>

</style>
