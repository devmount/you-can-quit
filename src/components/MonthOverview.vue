<template>
<div class="month-day-grid" :style="{ '--half-rows': halfRows }">
  <!-- day of week labels -->
  <div v-for="l in 7" :key="'label-' + l" class="day label">{{ t('name.dayofweek.' + l).slice(0, 2).toUpperCase() }}</div>
  <!-- offset days -->
  <div v-for="o in dayOfWeekOffset" :key="'pre-' + o" :class="'day offset month-day-pre-offset-' + o"></div>
  <!-- actual days -->
  <div
    v-for="d in daysInMonth"
    :key="'day-' + d"
    class="day"
    :class="{
      past: isPast(date.year, date.month, d),
      today: isToday(date.year, date.month, d),
      future: isFuture(date.year, date.month, d),
      success: statusData[getDate(date.year, date.month, d)] == 1,
      fail: statusData[getDate(date.year, date.month, d)] == -1
    }"
    :title="isToday(date.year, date.month, d) ? t('today') : ''"
  ><div class="day-date"><span class="day-weekday">{{ t('name.dayofweek.' + weekdayLabel(d)).slice(0, 2) }}</span><span class="day-number">{{ d }}</span></div>
    <div v-if="isPast(date.year, date.month, d)" class="action">
      <button
        @click="emit('update', date.year, date.month, d, 1)"
        class="success"
        :title="t('mark.successful')"
      >
        <font-awesome-icon icon="chevron-up" />
      </button>
      <button
        @click="emit('update', date.year, date.month, d, 0)"
        class="undo"
        :title="t('mark.undecided')"
      >
        <font-awesome-icon icon="undo-alt" />
      </button>
      <button
        @click="emit('update', date.year, date.month, d, -1)"
        class="fail"
        :title="t('mark.failed')"
      >
        <font-awesome-icon icon="chevron-down" />
      </button>
    </div>
  </div>
  <!-- offset days -->
  <div v-for="o in fillOffset" :key="'post-' + o" :class="'day offset month-day-post-offset-' + o"></div>
</div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useI18n } from "vue-i18n";
import { getDate } from '@/utils';
const { t } = useI18n();

const emit = defineEmits(['update'])

const props = defineProps({
  dayOfWeekOffset: Number,
  daysInMonth: Number,
  fillOffset: Number,
  statusData: Object,
  date: Object,
});

// number of rows in the first of the two mobile/tablet columns (days 1..halfRows go left, the rest go right)
const halfRows = computed(() => Math.ceil(props.daysInMonth / 2));

// today
const d = new Date()
const now = reactive({
  day: d.getDate(),
  month: d.getMonth()+1,
  year: d.getFullYear()
});

// check if date is a future date
const isFuture = (year, month, day) => {
  return new Date(year, month-1, day) > new Date(now.year, now.month-1, now.day)
};
// check if date is today
const isToday = (year, month, day) => {
  return year == now.year && month == now.month && day == now.day
};
// check if date is past
const isPast = (year, month, day) => {
  return new Date(year, month-1, day) < new Date(now.year, now.month-1, now.day)
};
// get the day-of-week label key (1-7, Sunday-Saturday) for a given day
const weekdayLabel = (day) => {
  return new Date(props.date.year, props.date.month-1, day).getDay() + 1;
};
</script>

<style>
.month-day-grid {
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  height: auto;
}
.month-day-grid .day.label,
.month-day-grid .day.offset {
  display: none;
}
.month-day-grid .day {
  width: 100%;
  min-height: 3.5rem;
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  line-height: normal;
  font-size: 1.5em;
  padding: 0;
  margin: 5px 0;
  background: var(--c-background-element);
  position: relative;
  overflow: hidden;
  border-radius: 3px;
  transition: all 0.2s;
  cursor: default;
}
.month-day-grid .day .day-date {
  display: flex;
  align-items: center;
  padding: 0 1rem;
}
.month-day-grid .day .day-weekday {
  display: inline-block;
  width: 1.8em;
  font-size: .55em;
  opacity: .6;
  margin-right: .5rem;
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
  flex-flow: row nowrap;
  position: static;
}
.month-day-grid .day .action button {
  text-align: center;
  width: 3.25rem;
  height: auto;
  color: var(--c-text-normal);
}
.month-day-grid .day .action button.undo {
  order: 1;
}
.month-day-grid .day .action button.fail {
  order: 2;
  color: var(--c-shadow);
  background: var(--c-background);
}
.month-day-grid .day .action button.success {
  order: 3;
  color: white;
  background: var(--c-accent-variant);
}
@media (min-width: 700px) {
  .month-day-grid {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(var(--half-rows), auto);
    column-gap: 1.5rem;
  }
}
@media (min-width: 1200px) {
  .month-day-grid {
    display: flex;
    flex-flow: column wrap;
    align-content: center;
    column-gap: 0;
    height: calc((80px + 20px) * 7);
  }
  .month-day-grid .day.label,
  .month-day-grid .day.offset {
    display: block;
    background: none;
  }
  .month-day-grid .day {
    width: 90px;
    height: 80px;
    line-height: 80px;
    box-sizing: content-box;
    display: block;
    font-size: 1.5em;
    padding: 5px;
    margin: 5px;
  }
  .month-day-grid .day .day-date {
    display: contents;
  }
  .month-day-grid .day .day-weekday {
    display: none;
  }
  .month-day-grid .day .action {
    width: 101px;
    justify-content: center;
    position: absolute;
    bottom: -30px;
    left: 0;
    transition: all 0.2s;
  }
  .month-day-grid .day .action button {
    width: 33.3%;
    height: 30px;
    order: initial;
  }
  .month-day-grid .day.past:hover {
    line-height: 50px;
  }
  .month-day-grid .day.past:hover .action {
    bottom: 0;
  }
}
</style>
