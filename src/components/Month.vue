<template>
<div class="day-grid">
  <!-- day of week labels -->
  <div v-for="l in 7" class="day label">{{ dayOfWeekName(l).slice(0, 2).toUpperCase() }}</div>
  <!-- offset days -->
  <div v-for="o in dayOfWeekOffset" class="day offset"></div>
  <!-- actual days -->
  <div
    v-for="d in daysInMonth"
    class="day"
    :class="{
      past: isPast(date.year, date.month, d),
      today: isToday(date.year, date.month, d),
      future: isFuture(date.year, date.month, d),
      success: currentDays[getDate(date.year, date.month, d)] == 1,
      fail: currentDays[getDate(date.year, date.month, d)] == -1
    }"
    :title="isToday(date.year, date.month, d) ? 'Today' : ''"
  >
    {{ d }}
    <div v-if="isPast(date.year, date.month, d)" class="action">
      <button @click="$emit('update', date.year, date.month, d, 1)" class="success" title="Mark successful"><font-awesome-icon icon="chevron-up" /></button>
      <button @click="$emit('update', date.year, date.month, d, 0)" title="Mark undecided"><font-awesome-icon icon="undo-alt" /></button>
      <button @click="$emit('update', date.year, date.month, d, -1)" class="fail" title="Mark failed"><font-awesome-icon icon="chevron-down" /></button>
    </div>
  </div>
  <!-- offset days -->
  <div v-for="o in fillOffset" class="day offset"></div>
</div>
</template>

<script>
export default {
  props: {
    dayOfWeekOffset: Number,
    daysInMonth: Number,
    fillOffset: Number,
    currentDays: Object,
    now: Object,
    date: Object,
  },
  methods: {
    // build date format yyyy-mm-dd
    getDate: function(year, month, day) {
      return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2)
    },
    // return the day of week name
    dayOfWeekName: function(dayIndex) {
      return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex-1];
    },
    // check if date is a future date
    isFuture: function(year, month, day) {
      return new Date(year, month, day) > new Date(this.now.year, this.now.month, this.now.day)
    },
    // check if date is today
    isToday: function(year, month, day) {
      return year == this.now.year && month == this.now.month && day == this.now.day
    },
    // check if date is past
    isPast: function(year, month, day) {
      return new Date(year, month, day) < new Date(this.now.year, this.now.month, this.now.day)
    },
  }
}
</script>

<style>
.day-grid {
  display: flex;
  flex-flow: column wrap;
  align-content: center;
  height: calc((80px + 20px) * 7);
}
.day-grid .day {
  width: 99px;
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
}
.day-grid .day.label {
  background: none;
}
.day-grid .day.offset {
  background: none;
}
.day-grid .day.today {
  background: var(--c-text-light);
}
.day-grid .day.success {
  color: white;
  background-image: linear-gradient(to bottom right, var(--c-accent) 0, var(--c-accent-variant) 100%);
  background-color: var(--c-accent);
  box-shadow: 0 8px 20px -8px var(--c-shadow);
}
.day-grid .day.fail {
  color: var(--c-shadow);
  background: transparent;
}
.day-grid .day .action {
  display: flex;
  width: 110px;
  flex-flow: row nowrap;
  justify-content: center;
  position: absolute;
  bottom: -30px;
  left: 0;
  transition: all 0.2s;
}
.day-grid .day.past:hover {
  line-height: 50px;
}
.day-grid .day.past:hover .action {
  bottom: 0;
}
.day-grid .day .action button {
  text-align: center;
  width: 33.3%;
  height: 30px;
  color: var(--c-text-normal);
}
.day-grid .day .action button.success {
  color: white;
  background: var(--c-accent-variant);
}
.day-grid .day .action button.fail {
  color: var(--c-shadow);
  background: var(--c-background);
}
</style>
