<template>
<div id="app">
  <header>
    <h1>{{ $t('title') }}</h1>
  </header>
  <section class="col-2">
    <div class="month-view">
      <month-navigation
        :date="date"
        @previous="previousMonth()"
        @change="changeMonth(now.year, now.month)"
        @next="nextMonth()"
      />
      <month
        :day-of-week-offset="dayOfWeekOffset"
        :days-in-month="daysInMonth"
        :fill-offset="fillOffset"
        :status-data="idays"
        :date="date"
        @update="updateDay"
      />
    </div>
    <div class="info-view">
      <Info
        :status-data="idays"
      />
    </div>
  </section>
  <section>
    <year
      :status-data="idays"
      :date="date"
    />
  </section>
  <notifications group="main" position="bottom right"/>
</div>
</template>

<script>
// get database object authorized in config.js
import { db } from './firebase'
// get indexeddb
import idb from './database'
// get single file components
import MonthNavigation from './components/MonthNavigation.vue'
import Month from './components/Month.vue'
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
      },
      idays: {}
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      let days = {}
      await idb.days.toCollection().each(d => {
        days[d.name] = d.status
      })
      this.idays = days
    },
    // build date format yyyy-mm-dd
    getDate (year, month, day) {
      return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2)
    },
    // update the status of a day to 1, 0 or -1
    async updateDay (year, month, day, status) {
      // get date format yyyy-mm-dd
      var date = this.getDate(year, month, day)
      // delete record if status == 0 (reset)
      if (status == 0) {
        await idb.days.delete(date)
      }
      // add/update record if status == 1 || -1 (success || fail)
      else {
        await idb.days.put({name: date, status: status})
        if (status == 1) {
          this.$notify(this.randomSuccessNotification());
        }
      }
      // update db
      this.fetchData()
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
    // return a notyf message object with random success title and text
    randomSuccessNotification () {
      return {
        group: 'main',
        title: this.$t('messages.titles')[Math.floor(Math.random() * this.$t('messages.titles').length)],
        text: this.$t('messages.texts')[Math.floor(Math.random() * this.$t('messages.texts').length)],
        duration: 10000
      }
    }
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
  margin: auto;
  padding: .5em 0 1.5em 0;
}
@media (min-width: 1200px) {
  #app > section {
    width: 1200px;
  }
  .col-2 {
    display: flex;
  }
}
.col-2 > div {
  margin: 0 auto;
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
#app .vue-notification {
  cursor: pointer;
  padding: 1em;
  margin: 0 15px 15px 0;
  font-size: 1.2em;
  color: white;
  background-image: linear-gradient(to bottom right, var(--c-accent) 0, var(--c-accent-variant) 100%);
  background-color: var(--c-accent);
  box-shadow: 0 8px 20px -8px var(--c-shadow);
  border-left: 5px solid var(--c-accent-variant);
}
#app .vue-notification .notification-title {
  font-size: 1.5em;
}
</style>
