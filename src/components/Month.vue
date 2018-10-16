<template>
<div class="month-day-grid">
  <!-- day of week labels -->
  <div v-for="l in 7" class="day label">{{ $t('name.dayofweek.' + l).slice(0, 2).toUpperCase() }}</div>
  <!-- offset days -->
  <div v-for="o in dayOfWeekOffset" :class="'day offset month-day-pre-offset-' + o"></div>
  <!-- actual days -->
  <div
    v-for="d in daysInMonth"
    class="day"
    :class="{
      past: isPast(date.year, date.month, d),
      today: isToday(date.year, date.month, d),
      future: isFuture(date.year, date.month, d),
      success: statusData[getDate(date.year, date.month, d)] == 1,
      fail: statusData[getDate(date.year, date.month, d)] == -1
    }"
    :title="isToday(date.year, date.month, d) ? $t('today') : ''"
  >{{ d }}
    <div v-if="isPast(date.year, date.month, d)" class="action">
      <button
        @click="$emit('update', date.year, date.month, d, 1)"
        class="success"
        :title="$t('mark.successful')"
      >
        <font-awesome-icon icon="chevron-up" />
      </button>
      <button
        @click="$emit('update', date.year, date.month, d, 0)"
        :title="$t('mark.undecided')"
      >
        <font-awesome-icon icon="undo-alt" />
      </button>
      <button
        @click="$emit('update', date.year, date.month, d, -1)"
        class="fail"
        :title="$t('mark.failed')"
      >
        <font-awesome-icon icon="chevron-down" />
      </button>
    </div>
  </div>
  <!-- offset days -->
  <div v-for="o in fillOffset" :class="'day offset month-day-post-offset-' + o"></div>
</div>
</template>

<script>
export default {
  props: {
    dayOfWeekOffset: Number,
    daysInMonth: Number,
    fillOffset: Number,
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
    // check if date is a future date
    isFuture (year, month, day) {
      return new Date(year, month, day) > new Date(this.now.year, this.now.month, this.now.day)
    },
    // check if date is today
    isToday (year, month, day) {
      return year == this.now.year && month == this.now.month && day == this.now.day
    },
    // check if date is past
    isPast (year, month, day) {
      return new Date(year, month, day) < new Date(this.now.year, this.now.month, this.now.day)
    },
  }
}
</script>

<style>
.month-day-grid {
  display: flex;
  flex-flow: column wrap;
  align-content: center;
  height: calc((80px + 20px) * 7);
}
.month-day-grid .day {
  width: 90px;
  height: 80px;
  line-height: 80px;
  font-size: 1.5em;
  padding: 5px;
  margin: 5px;
  background: var(--c-background-element);
  position: relative;
  overflow: hidden;
  border-radius: 3px;
  transition: all 0.2s;
  cursor: default;
}
.month-day-grid .day.label,
.month-day-grid .day.offset {
  background: none;
}
.month-day-grid .day.today {
  background: var(--c-text-light);
}
.month-day-grid .day.success {
  color: white;
  background-image: linear-gradient(to bottom right, var(--c-accent) 0, var(--c-accent-variant) 100%);
  background-color: var(--c-accent);
  box-shadow: 0 8px 20px -8px var(--c-shadow);
}
.month-day-grid .day.fail {
  color: var(--c-shadow);
  background: transparent;
}
.month-day-grid .day .action {
  display: flex;
  width: 101px;
  flex-flow: row nowrap;
  justify-content: center;
  position: absolute;
  bottom: -30px;
  left: 0;
  transition: all 0.2s;
}
.month-day-grid .day.past:hover {
  line-height: 50px;
}
.month-day-grid .day.past:hover .action {
  bottom: 0;
}
.month-day-grid .day .action button {
  text-align: center;
  width: 33.3%;
  height: 30px;
  color: var(--c-text-normal);
}
.month-day-grid .day .action button.success {
  color: white;
  background: var(--c-accent-variant);
}
.month-day-grid .day .action button.fail {
  color: var(--c-shadow);
  background: var(--c-background);
}
</style>
