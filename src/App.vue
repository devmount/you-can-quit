<template>
  <div id="app">
    <header>
      <h1>You can quit!</h1>
    </header>
    <section>
      <h2>{{ monthName(date.month) }} {{ date.year}}</h2>
      <div>
        <b-btn @click="addDay" variant="outline-info" class="m-1"><font-awesome-icon icon="plus" /></b-btn>
      </div>
      <!-- <ul class="dayList">
        <li v-for="(day, index) in days" :key="index">
          <b-alert :variant="states[day.status]" show>{{ day.name }}</b-alert>
          <b-btn @click="updateDay(day, 1)" variant="success" class="m-0"><font-awesome-icon icon="circle" /></b-btn>
          <b-btn @click="updateDay(day, 0)" variant="default" class="m-0"><font-awesome-icon icon="circle" /></b-btn>
          <b-btn @click="updateDay(day, -1)" variant="danger" class="m-0"><font-awesome-icon icon="circle" /></b-btn>
          <b-btn @click="deleteDay(day)" variant="danger" class="ml-2"><font-awesome-icon icon="times" /></b-btn>
        </li>
      </ul> -->
      <b-btn @click="previousMonth()" @keyup.left="previousMonth()" variant="info" class="ml-2"><font-awesome-icon icon="caret-left" /></b-btn>
      <b-btn @click="changeMonth(now.year, now.month)" variant="info" class="ml-2"><font-awesome-icon icon="dot-circle" /></b-btn>
      <b-btn @click="nextMonth()" @keyup.right="nextMonth()" variant="info" class="ml-2"><font-awesome-icon icon="caret-right" /></b-btn>
      <div class="day-grid">
        <!-- day of week labels -->
        <div v-for="l in 7" class="day label">{{ dayOfWeekName(l) }}</div>
        <!-- offset days -->
        <div v-for="o in dayOfWeekOffset" class="day offset"></div>
        <!-- actual days -->
        <div v-for="d in daysInMonth" :key="d" class="day" :class="{ future: isFuture(date.year, date.month, d) }">
          {{ d }}
          <div class="action">
            <b-btn @click="updateDay(date.year, date.month, d, 1)" variant="success" class="m-0" size="sm"><font-awesome-icon icon="caret-up" /></b-btn>
            <b-btn @click="updateDay(date.year, date.month, d, 0)" variant="default" class="m-0" size="sm"></b-btn>
            <b-btn @click="updateDay(date.year, date.month, d, -1)" variant="danger" class="m-0" size="sm"><font-awesome-icon icon="caret-down" /></b-btn>
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
    data() {
      var now = new Date()
      return {
        days: [],
        states: {
          '1': 'success',
          '0': 'default',
          '-1': 'danger'
        },
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
    firestore() {
      return {
        days: db.collection('days'),
      }
    },
    methods: {
      addDay: function() {
        this.$firestore.days.add(
          {
            name: '2018-07-07',
            status: 0,
            timestamp: new Date()
          }
        )
      },
      // update the status of a day to 1, 0 or -1
      updateDay: function(year, month, day, status) {
        // build date format yyyy-mm-dd
        var date = year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2)
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
    },
    computed: {
      // compute the number of days of the month currently displayed
      daysInMonth: function() {
        return new Date(this.date.year, this.date.month-1, 0).getDate();
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
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 60px 0;
  }
  .day-grid {
    display: flex;
    flex-flow: column wrap;
    align-content: center;
    height: calc(80px * 7 + 70px);
  }
  .day-grid .day {
    width: 99px;
    height: 80px;
    padding: 5px;
    margin: 5px;
    background: #ccc;
    position: relative;
    overflow: hidden;
  }
  .day-grid .day.label {
    background: none;
    line-height: 80px;
  }
  .day-grid .day.offset {
    background: none;
  }
  .day-grid .day.future {
    background: #eee;
  }
  .day-grid .day .action {
    display: flex;
    flex-flow: row nowrap;
    position: absolute;
    bottom: -28px;
    left: 0;
    transition: all 0.3s;
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
