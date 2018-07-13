<template>
<div class="container">
  <h2>Stats</h2>
  <div class="stats">
    Current streak: {{ currentStreak }}
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
    getDate: function(year, month, day) {
      return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2)
    },
  },
  computed: {
    // get number of successful days in a row preceding today
    currentStreak: function() {
      var streak = 0, n = new Date(), success = true, key = ''
      while (success) {
        n = new Date(n.setDate(n.getDate() - 1))
        key = this.getDate(n.getFullYear(), n.getMonth()+1, n.getDate())
        if (!(key in this.statusData) || (key in this.statusData && this.statusData[key] != 1)) {
          success = false
        } else {
          streak++
        }
      }
      return streak
    }
  }
}
</script>

<style>

</style>
