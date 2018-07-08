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
      <ul class="dayList">
        <li v-for="(day, index) in days" :key="index">
          <b-alert :variant="states[day.status]" show>{{ day.name }}</b-alert>
          <b-btn @click="updateDay(day, 1)" variant="success" class="m-0"><font-awesome-icon icon="circle" /></b-btn>
          <b-btn @click="updateDay(day, 0)" variant="default" class="m-0"><font-awesome-icon icon="circle" /></b-btn>
          <b-btn @click="updateDay(day, -1)" variant="danger" class="m-0"><font-awesome-icon icon="circle" /></b-btn>
          <b-btn @click="deleteDay(day)" variant="danger" class="ml-2"><font-awesome-icon icon="times" /></b-btn>
        </li>
      </ul>
      <div class="day-grid">
        <div v-for="i in 7" :key="i" class="day label">{{ dayOfWeekName(i) }}</div>
        <div v-for="d in daysInMonth" :key="d" class="day" :class="{ future: d > date.day }">
          {{ d }}
        </div>
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
      updateDay: function(day, status) {
        this.$firestore.days.doc(day['.key']).update({status: status})
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
    },
    computed: {
      // compute the number of days of the month currently displayed
      daysInMonth: function() {
        return new Date(this.date.year, this.date.month, 0).getDate();
      },
      // compute the offset of weekdays
      dayOfWeekOffset: function() {
        return 0 // TODO
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
    margin-top: 60px;
  }
  .dayList {
    list-style: none;
  }
  .dayList .btn {
    border-radius: 0;
  }
  .day-grid {
    display: flex;
    flex-flow: column wrap;
    align-content: center;
    height: calc(80px * 7 + 70px);
  }
  .day-grid .day {
    width: 100px;
    height: 80px;
    padding: 5px;
    margin: 5px;
    background: #ccc;
  }
  .day-grid .day.label {
    background: none;
    line-height: 80px;
  }
  .day-grid .day.future {
    background: #eee;
  }
</style>
