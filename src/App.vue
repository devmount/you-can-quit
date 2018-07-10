<template>
<div id="app">
  <header>
    <h1>You can quit!</h1>
  </header>
  <section>
    <Navigation
      :month="monthName(date.month)"
      :year="date.year"
      @previous="previousMonth()"
      @change="changeMonth(now.year, now.month)"
      @next="nextMonth()"
    />
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
          <button @click="updateDay(date.year, date.month, d, 1)" class="success" title="Mark successful"><font-awesome-icon icon="chevron-up" /></button>
          <button @click="updateDay(date.year, date.month, d, 0)" title="Mark undecided"><font-awesome-icon icon="undo-alt" /></button>
          <button @click="updateDay(date.year, date.month, d, -1)" class="fail" title="Mark failed"><font-awesome-icon icon="chevron-down" /></button>
        </div>
      </div>
      <!-- offset days -->
      <div v-for="o in fillOffset" class="day offset"></div>
    </div>
    <hello-world msg="test" />
  </section>
</div>
</template>

<script>
import { db } from './firebase'
import Navigation from './components/Navigation.vue'

export default {
  name: 'app',
  firestore() {
    return {
      days: db.collection('days'),
    }
  },
  components: {
    Navigation
  },
  data() {
    // today
    var now = new Date()
    return {
      date: {
        month: now.getMonth()+1,
        year: now.getFullYear()
      },
      now: {
        day: now.getDate(),
        weekday: now.getDay()+1,
        month: now.getMonth()+1,
        year: now.getFullYear()
      }
    }
  },
  methods: {
    getDate: function(year, month, day) {
      return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2)
    },
    // update the status of a day to 1, 0 or -1
    updateDay: function(year, month, day, status) {
      // build date format yyyy-mm-dd
      var date = this.getDate(year, month, day)
      var self = this
      // find existing records by date of date format above
      this.$firestore.days.where("name", "==", date)
        .get().then(function(result) {
          if (result.empty) {
            // record doesn't exist: add it
            self.$firestore.days.add(
              {
                name: date,
                status: status,
                timestamp: new Date()
              }
            )
          } else {
            // record exists: update its status
            self.$firestore.days.doc(result.docs[0].id).update({status: status})
          }
        })
        .catch(function(error) {
          // an error occured. TODO: error handling
        })
    },
    deleteDay: function(day) {
      this.$firestore.days.doc(day['.key']).delete()
    },
    // return the month name
    monthName: function(monthIndex) {
      return ['January','February','March','April','May','June','July','August','September','October','November','December'][monthIndex-1];
    },
    // return the day of week name
    dayOfWeekName: function(dayIndex) {
      return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex-1];
    },
    // change month to display
    changeMonth: function(year, month) {
      if (month > 12) {
        // first month of next year
        this.date.year = year+1
        this.date.month = 1
      } else
      if (month < 1) {
        // last month of previous year
        this.date.year = year-1
        this.date.month = 12
      } else {
        // change month in currently displayed year
        this.date.year = year
        this.date.month = month
      }
    },
    // go to next month
    nextMonth: function() {
      this.changeMonth(this.date.year, this.date.month+1)
    },
    // go to previous month
    previousMonth: function() {
      this.changeMonth(this.date.year, this.date.month-1)
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
  },
  computed: {
    // compute the number of days of the month currently displayed
    daysInMonth: function() {
      return new Date(this.date.year, this.date.month, 0).getDate();
    },
    // compute the offset of weekdays before actual days
    dayOfWeekOffset: function() {
      return new Date(this.date.year, this.date.month-1, 1).getDay()
    },
    // compute the offset of days to fill a total of 7 columns
    fillOffset: function() {
      var offset = 36 - (this.daysInMonth + this.dayOfWeekOffset);
      return offset > 0 ? offset : 0;
    },
    // prepare data in format: yyyy-mm-dd => status
    currentDays: function() {
      var currentDays = {}
      this.days.forEach(function(day) {
          currentDays[day.name] = day.status
      })
      return currentDays
    }
  }
}
</script>

<style>
body {
  --c-text-normal: #7e8a9a;
  --c-text-light: #eee;
  --c-background: #3d444c;
  --c-background-element: #4b535d;
  --c-accent: #9aeab9;
  --c-accent-variant: #78d19a;
  --c-shadow: #24292e;
  background-color: var(--c-background); 
  color: var(--c-text-normal);
}
h1, h2, h3 {
  color: var(--c-text-light);
  font-weight: normal;
  position: relative;
}
h1 {
  margin-bottom: 2em;
}
h1::after {
  content: '';
  position: absolute;
  bottom: -1em;
  width: 10%;
  max-width: 120px;
  height: 5px;
  background: var(--c-accent);
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 1px 10px -1px var(--c-shadow);
}
button {
  border: none;
  border-radius: 0;
  outline: none;
  background: transparent;
  cursor: pointer;
}
#app {
  font-family: 'Open Sans', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: 60px 0;
}
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
  width: 109px;
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
