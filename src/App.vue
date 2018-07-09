<template>
  <div id="app">
    <header>
      <h1>You can quit!</h1>
    </header>
    <section>
      <div class="navigation">
        <h2>{{ monthName(date.month) }} {{ date.year}}</h2>
        <div class="button-group">
          <button @click="previousMonth()" v-shortkey="['arrowleft']" @shortkey="previousMonth()" title="Previous Month [←]">
            <font-awesome-icon icon="chevron-left" />
          </button>
          <button @click="changeMonth(now.year, now.month)" v-shortkey="['r']" @shortkey="changeMonth(now.year, now.month)" title="Reset [r]">
            <font-awesome-icon icon="undo-alt" />
          </button>
          <button @click="nextMonth()" v-shortkey="['arrowright']" @shortkey="nextMonth()" title="Next Month [→]">
            <font-awesome-icon icon="chevron-right" />
          </button>
        </div>
      </div>
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
            today: isToday(date.year, date.month, d),
            future: isFuture(date.year, date.month, d),
            success: currentDays[getDate(date.year, date.month, d)] == 1,
            fail: currentDays[getDate(date.year, date.month, d)] == -1
          }"
        >
          {{ d }}
          <div class="action">
            <button @click="updateDay(date.year, date.month, d, 1)"><font-awesome-icon icon="chevron-up" /></button>
            <button @click="updateDay(date.year, date.month, d, 0)"></button>
            <button @click="updateDay(date.year, date.month, d, -1)"><font-awesome-icon icon="chevron-down" /></button>
          </div>
        </div>
        <!-- offset days -->
        <div v-for="o in fillOffset" class="day offset"></div>
      </div>
    </section>
  </div>
</template>

<script>
  import { db } from './firebase'

  export default {
    name: 'app',
    firestore() {
      return {
        days: db.collection('days'),
      }
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
    background-color: #3d444c; 
    color: #7e8a9a;
  }
  h1, h2, h3 {
    color: #eee;
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
    height: 5px;
    background: #9aeab9;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 1px 10px -1px #24292e;
  }
  button {
    border: none;
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
  .navigation {
    margin: 1em 0;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
  }
  .navigation > * {
    flex-basis: 50%;
  }
  .navigation h2 {
    margin: 0;
    padding: .3em 1em 0 0;
    text-align: right;
  }
  .navigation .button-group {
    text-align: left;
  }
  .navigation .button-group button {
    color: #eee;
    padding: .5em;
    font-size: 1.5em;
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
    background: #4b535d;
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
    background: #eee;
  }
  .day-grid .day.today .action,
  .day-grid .day.future .action {
    display: none;
  }
  .day-grid .day.success {
    color: white;
    background-image: linear-gradient(to bottom right,#9aeab9 0,#78d19a 100%);
    background-color: #9aeab9;
    box-shadow: 0 8px 20px -8px #24292e;
  }
  .day-grid .day.fail {
    color: #24292e;
    background: transparent;
  }
  .day-grid .day .action {
    display: flex;
    flex-flow: row nowrap;
    position: absolute;
    bottom: -28px;
    left: 0;
    transition: all 0.2s;
  }
  .day-grid .day:hover .action {
    bottom: 0;
  }
  .day-grid .day .action .btn {
    border-radius: 0;
    width: 33px;
    text-align: center;
  }
</style>
