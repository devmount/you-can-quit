<template>
<div id="app">
  <header>
    <h1>You can quit!</h1>
  </header>
  <section>
    <month-navigation
      :month="monthName(date.month)"
      :year="date.year"
      @previous="previousMonth()"
      @change="changeMonth(now.year, now.month)"
      @next="nextMonth()"
    />
    <month
      :day-of-week-offset="dayOfWeekOffset"
      :days-in-month="daysInMonth"
      :fill-offset="fillOffset"
      :status-data="statusData"
      :now="now"
      :date="date"
      @update="updateDay"
    />
    <year
      :year="date.year"
    />
  </section>
</div>
</template>

<script>
import { db } from './firebase'
import Month from './components/Month.vue'
import MonthNavigation from './components/MonthNavigation.vue'
import Year from './components/Year.vue'

export default {
  name: 'app',
  firestore() {
    return {
      days: db.collection('days'),
    }
  },
  components: {
    Month,
    MonthNavigation,
    Year
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
    // build date format yyyy-mm-dd
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
    // return the month name
    monthName: function(monthIndex) {
      return ['January','February','March','April','May','June','July','August','September','October','November','December'][monthIndex-1];
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
    statusData: function() {
      var statusData = {}
      this.days.forEach(function(day) {
          statusData[day.name] = day.status
      })
      return statusData
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
</style>
