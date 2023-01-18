<template>
<div>
  <div class="year-container">
    <div class="year-day-grid">
      <!-- day of week labels -->
      <div v-for="l in 7" class="day label">{{ t('name.dayofweek.' + l).slice(0, 2).toUpperCase() }}</div>
      <!-- offset days -->
      <div v-for="o in dayOfWeekOffset" :class="'day offset year-day-pre-offset-' + o"></div>
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
            (i == 0 ? t('name.month.' + m) : '')
          "
        >
          <span v-if="i == 0">{{ t('name.month.' + m).slice(0, 1) }}</span>
        </div>
      </template>
    </div>
  </div>
</div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
  statusData: Object,
  date: Object,
});

// today
const d = new Date()
const now = reactive({
  day: d.getDate(),
  month: d.getMonth()+1,
  year: d.getFullYear()
});

// build date format yyyy-mm-dd
const getDate = (year, month, day) => {
  return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2)
};
// compute the number of days of the given month
const daysInMonth = (month) => {
  return new Date(props.date.year, month, 0).getDate();
};
// check if date is today
const isToday = (year, month, day) => {
  return year == now.year && month == now.month && day == now.day
};

// compute the offset of weekdays before actual days
const dayOfWeekOffset = computed(() => {
  return new Date(props.date.year, 0, 1).getDay()
});
</script>

<style>
.year-container {
  overflow-x: auto;
}
.year-day-grid {
  width: 1200px;
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
