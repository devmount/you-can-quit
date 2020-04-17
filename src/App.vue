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
        :status-data="data"
        :date="date"
        @update="updateDay"
      />
    </div>
    <div class="info-view">
      <Info
        :status-data="data"
      />
    </div>
  </section>
  <section>
    <year
      :status-data="data"
      :date="date"
    />
  </section>
  <h2>{{ $t('admin.title') }}</h2>
  <section class="col-2">
    <div class="col-half px-1 backup-zone">
      <h3>{{ $t('admin.backup.title') }}</h3>
      <p>{{ $t('admin.backup.text') }}</p>
      <button class="btn btn-primary" @click="exportBackup">{{ $t('admin.backup.buttonExport') }}</button>
    </div>
    <div class="col-half px-1 danger-zone">
      <h3>{{ $t('admin.danger.title') }}</h3>
      <p>{{ $t('admin.danger.text') }}</p>
      <div class="btn-group">
        <label class="btn btn-danger" for="backup">{{ $t('admin.danger.buttonImport') }}</label>
        <input class="hidden" type="file" id="backup" accept=".json" ref="backupFile" @change="importBackup">
        <button class="btn btn-danger" @click="clearDatabase">{{ $t('admin.danger.buttonClear') }}</button>
      </div>
    </div>
  </section>
  <notifications group="main" position="bottom right"/>
</div>
</template>

<script>
// get indexed db
import db from './database'
// get single file components
import MonthNavigation from './components/MonthNavigation.vue'
import Month from './components/Month.vue'
import Year from './components/Year.vue'
import Info from './components/Info.vue'

export default {
  name: 'app',
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
      data: {}
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      let days = {}
      await db.days.toCollection().each(d => {
        days[d.name] = d.status
      })
      this.data = days
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
        await db.days.delete(date)
      }
      // add/update record if status == 1 || -1 (success || fail)
      else {
        await db.days.put({name: date, status: status})
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
    },
    // create a file download of whole database as JSON
    exportBackup () {
      this.download(JSON.stringify(this.data), 'backup.json', 'text/plain')
      this.$notify({
        group: 'main',
        title: this.$t('admin.exportSuccess.title'),
        text: this.$t('admin.exportSuccess.text'),
        duration: 6000
      });
    },
    // import a backup JSON file and replace current database
    importBackup () {
      let file = this.$refs.backupFile.files[0]
      if(!file || file.type !== 'text/plain' && file.type !== 'application/json') return
      
      let reader = new FileReader()
      reader.readAsText(file, "UTF-8")
      reader.onload = async (evt) => {
        let backup = JSON.parse(evt.target.result)
        for (const date in backup) {
          if (backup.hasOwnProperty(date)) {
            const status = backup[date];
            await db.days.put({name: date, status: status})
          }
        }
        this.fetchData()
        this.$notify({
          group: 'main',
          title: this.$t('admin.importSuccess.title'),
          text: this.$t('admin.importSuccess.text'),
          duration: 6000
        });
      }
      reader.onerror = evt => {
        // eslint-disable-next-line
        console.error(evt)
      }
    },
    async clearDatabase () {
      await db.days.toCollection().delete()
      this.data = {}
      this.$notify({
        group: 'main',
        title: this.$t('admin.clearSuccess.title'),
        text: this.$t('admin.clearSuccess.text'),
        duration: 6000
      });
    },
    // execute a file download
    download (content, fileName, contentType) {
      let a = document.createElement("a"), file = new Blob([content], {type: contentType})
      a.href = URL.createObjectURL(file)
      a.download = fileName
      a.click()
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
  --c-background-element-variant-transparent: #57606b44;
  --c-accent: #9aeab9;
  --c-accent-variant: #78d19a;
  --c-accent-variant-transparent: #78d19a44;
  --c-danger: #ea9ab2;
  --c-danger-variant: #d17887;
  --c-danger-variant-transparent: #d1788744;
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
  font-family: inherit;
}
#app {
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: 40px 0;
}
#app > section {
  margin: auto;
  padding: .5em 0 1.5em 0;
}
#app > section p {
  text-align: left;
}
@media (min-width: 1200px) {
  #app > section {
    width: 1200px;
  }
  .col-2 {
    display: flex;
  }
  .col-half {
    width: 50%;
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
.col-half {
  width: 90%;
}
.mt-1 {
  margin-top: 1rem;
}
.mt-2 {
  margin-top: 2rem;
}
.px-1 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.hidden {
  display: none;
}
.btn {
  background: var(--c-background-element-variant);
  border: 2px solid var(--c-background-element-variant);
  color: var(--c-text-light);
  font-size: 16px;
  appearance: none;
  border-radius: 2px;
  cursor: pointer;
  display: inline-block;
  outline: none;
  padding: .6rem 1rem;
  text-align: center;
  text-decoration: none;
  transition: background .2s, border .2s, box-shadow .2s, color .2s;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
}
.btn:focus,
.btn:hover,
.btn:active {
  box-shadow: 0 0 0 .3rem var(--c-background-element-variant-transparent);
  text-decoration: none;
}
.btn.btn-primary {
  background: var(--c-accent-variant);
  border: 2px solid var(--c-accent-variant);
  color: var(--c-text-light);
}
.btn.btn-primary:focus,
.btn.btn-primary:hover,
.btn.btn-primary:active {
  box-shadow: 0 0 0 .3rem var(--c-accent-variant-transparent);
}
.btn.btn-danger {
  background: var(--c-danger-variant);
  border: 2px solid var(--c-danger-variant);
  color: var(--c-text-light);
}
.btn.btn-danger:focus,
.btn.btn-danger:hover,
.btn.btn-danger:active {
  box-shadow: 0 0 0 .3rem var(--c-danger-variant-transparent);
}
.btn-group {
  display: flex;
  justify-content: space-around;
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
