<template>
  <div id="app">
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
  </div>
</template>

<script>
  import { db } from './firebase'

  export default {
    name: 'app',
    data() {
      return {
        days: [],
        states: {1: 'success', 0: 'default', '-1': 'danger'}
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
      updateDay: function(day, status) {
        this.$firestore.days.doc(day['.key']).update({status: status})
      },
      deleteDay: function(day) {
        this.$firestore.days.doc(day['.key']).delete()
      }
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
</style>
