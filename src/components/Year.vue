<template>
<div>
  <h2>{{ date.year }}</h2>
  <div class="year-day-grid">
    <!-- day of week labels -->
    <div v-for="l in 7" class="day label">{{ $t('name.dayofweek.' + l).slice(0, 2).toUpperCase() }}</div>
    <!-- offset days -->
    <div v-for="o in dayOfWeekOffset" class="day offset"></div>
    <!-- days in current year with month initials -->
    <template v-for="m in 12">
      <div
        v-for="(d,i) in daysInMonth(m)"
        class="day"
        :class="{
          today: isToday(date.year, m, d),
          tomonth: m == date.month,
          success: statusData[getDate(date.year, m, d)] == 1,
          fail: statusData[getDate(date.year, m, d)] == -1
        }"
        :title="
          (isToday(date.year, m, d) ? 'Today' : '') + 
          (i == 0 ? $t('name.month.' + m) : '')
        "
      >
        <span v-if="i == 0">{{ $t('name.month.' + m).slice(0, 1) }}</span>
      </div>
    </template>
  </div>
</div>
</template>

<script>
export default {
  props: {
    statusData: Object,
    date: Object,
  },
  data () {
    // today
    var now = new Date()
    return {
      now: {
        day: now.getDate(),
        month: now.getMonth()+1,
        year: now.getFullYear()
      }
    }
  },
  methods: {
    // build date format yyyy-mm-dd
    getDate (year, month, day) {
      return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2)
    },
    // compute the number of days of the given month
    daysInMonth (month) {
      return new Date(this.date.year, month, 0).getDate();
    },
    // check if date is today
    isToday (year, month, day) {
      return year == this.now.year && month == this.now.month && day == this.now.day
    },
  },
  computed: {
    // compute the offset of weekdays before actual days
    dayOfWeekOffset () {
      return new Date(this.date.year, 0, 1).getDay()
    },
  }
}
</script>

<style>
.year-day-grid {
  display: flex;
  flex-flow: column wrap;
  align-content: center;
  height: calc((10px + 14px) * 7);
}
.year-day-grid .day {
  width: 18px;
  height: 10px;
  line-height: 10px;
  font-size: .7em;
  font-weight: bold;
  padding: 5px 0;
  margin: 2px;
  background: var(--c-background-element);
  position: relative;
  border-radius: 2px;
  transition: all 0.2s;
  cursor: default;
}
.year-day-grid .day.label{
  margin-right: 10px;
  background: none;
}
.year-day-grid .day.offset {
  background: none;
}
.year-day-grid .day.tomonth {
  background: var(--c-background-element-variant);
}
.year-day-grid .day.today {
  background: var(--c-text-light);
}
.year-day-grid .day.success {
  color: white;
  background-image: linear-gradient(to bottom right, var(--c-accent) 0, var(--c-accent-variant) 100%);
  background-color: var(--c-accent);
  box-shadow: 0 8px 20px -8px var(--c-shadow);
}
.year-day-grid .day.fail {
  color: var(--c-shadow);
  background: transparent;
}
</style>
