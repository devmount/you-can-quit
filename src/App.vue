<template>
<div id="app">
  <header>
    <h1>You can quit!</h1>
  </header>
  <section class="col-2">
    <div class="month-view">
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
        :date="date"
        @update="updateDay"
      />
    </div>
    <div class="info-view">
      <Info
        :status-data="statusData"
      />
    </div>
  </section>
  <section>
    <year
      :status-data="statusData"
      :date="date"
    />
  </section>
</div>
</template>

<script>
import { db } from './firebase'
import Month from './components/Month.vue'
import MonthNavigation from './components/MonthNavigation.vue'
import Year from './components/Year.vue'
import Info from './components/Info.vue'

export default {
  name: 'app',
  firestore () {
    return {
      days: db.collection('days'),
    }
  },
  components: {
    Month,
    MonthNavigation,
    Year,
    Info
  },
  data () {
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
    getDate (year, month, day) {
      return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2)
    },
    // update the status of a day to 1, 0 or -1
    updateDay (year, month, day, status) {
      // get date format yyyy-mm-dd
      var date = this.getDate(year, month, day), self = this
      // find existing records by date of date format above
      this.$firestore.days.where("name", "==", date)
        .get().then(function(result) {
          if (result.empty) {
            if (status != 0) {
              // record doesn't exist and status is not undecided: add it
              self.$firestore.days.add(
                {
                  name: date,
                  status: status,
                  timestamp: new Date()
                }
              )
            }
          } else {
            if (status == 0) {
              // day is undecided: delete it from database
              self.$firestore.days.doc(result.docs[0].id).delete()
            } else {
              // record exists: update its status
              self.$firestore.days.doc(result.docs[0].id).update({status: status})
            }
          }
        })
        .catch(function(error) {
          // an error occured. TODO: error handling
        })
    },
    // return the month name
    monthName (monthIndex) {
      return ['January','February','March','April','May','June','July','August','September','October','November','December'][monthIndex-1];
    },
    // change month to display
    changeMonth (year, month) {
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
    nextMonth () {
      this.changeMonth(this.date.year, this.date.month+1)
    },
    // go to previous month
    previousMonth () {
      this.changeMonth(this.date.year, this.date.month-1)
    },
  },
  computed: {
    // compute the number of days of the month currently displayed
    daysInMonth () {
      return new Date(this.date.year, this.date.month, 0).getDate();
    },
    // compute the offset of weekdays before actual days
    dayOfWeekOffset () {
      return new Date(this.date.year, this.date.month-1, 1).getDay()
    },
    // compute the offset of days to fill a total of 7 columns
    fillOffset () {
      var offset = 36 - (this.daysInMonth + this.dayOfWeekOffset);
      return offset > 0 ? offset : 0;
    },
    // prepare data in format: yyyy-mm-dd => status
    statusData () {
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
  --c-background-element-variant: #57606b;
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
  cursor: default;
}
h1 {
  font-size: 3em;
  margin-bottom: 1.2em;
  margin-top: 0;
}
h1::after {
  content: '';
  position: absolute;
  bottom: -.8em;
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
  margin: 40px 0;
}
#app > section {
  width: 1200px;
  margin: auto;
  padding: .5em 0 1.5em 0;
}
.col-2 {
  display: flex;
}
.col-2 > .month-view {
  width: 800px;
}
.col-2 > .info-view {
  width: 400px;
}
.mt-1 {
  margin-top: 1em;
}
.mt-2 {
  margin-top: 2em;
}
</style>
