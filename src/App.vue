<template>
<div
  id="app"
  ref="container"
  @keydown.ctrl.left.exact="previousYear()"
  @keydown.left.exact="previousMonth()"
  @keydown.82.prevent="changeMonth(calNow.year, calNow.month)"
  @keydown.right.exact="nextMonth()"
  @keydown.ctrl.right.exact="nextYear()"
>
  <header>
    <h1>{{ t('title') }} <font-awesome-icon icon="sign-out-alt" class="icon" /></h1>
    <p>{{ t('subtitle') }}</p>
    <hr />
  </header>
  <section class="col-2">
    <div class="month-view">
      <month-navigation
        :date="calDate"
        @previous="previousMonth()"
        @change="changeMonth(calNow.year, calNow.month)"
        @next="nextMonth()"
      />
      <month
        :day-of-week-offset="dayOfWeekOffset"
        :days-in-month="daysInMonth"
        :fill-offset="fillOffset"
        :status-data="calData"
        :date="calDate"
        @update="updateDay"
      />
    </div>
    <div class="info-view">
      <Info
        :status-data="calData"
      />
    </div>
  </section>
  <section>
    <year-navigation
      :date="calDate"
      @previous="previousYear()"
      @change="changeMonth(calNow.year, calNow.month)"
      @next="nextYear()"
    />
    <year
      :status-data="calData"
      :date="calDate"
    />
  </section>
  <administration
    class="mt-5"
    @import="importBackup"
    @export="exportBackup()"
    @clear="clearDatabase()"
  />
  <about class="mt-5" />
  <footer>
    <div class="mt-2">
      {{ t('footer.switchLanguage') }}
      <select v-model="locale" class="lang-select" id="language">
        <option v-for="(lang, i) in Object.keys(languages)" :key="i" :value="lang">{{ languages[lang] }}</option>
      </select>
    </div>
    <div class="mt-3">
      <a href="https://github.com/devmount/you-can-quit" target="_blank"><font-awesome-icon :icon="['fab', 'github']" class="icon" /></a>
      <a href="https://twitter.com/intent/tweet?text=Awesome%20little%20app%20to%20help%20quitting%20with%20a%20bad%20habit%20%F0%9F%98%8E&url=https%3A%2F%2Fyoucanqu.it&via=devmount&hashtags=ycq%2Cvuejs%2CDEVcommunity" target="_blank"><font-awesome-icon :icon="['fab', 'twitter']" class="icon" /></a>
      <a href="https://dev.to/devmount/you-can-quit-with-the-help-of-vue-and-dexie-221i" target="_blank"><font-awesome-icon :icon="['fab', 'dev']" class="icon" /></a>
    </div>
    <div class="mt-2">{{ t('footer.version') }} {{ version }}</div>
    <div> with 🤍 by <a href="https://devmount.de" target="_blank">devmount</a></div>
  </footer>
  <notifications group="main" position="bottom right"/>
</div>
</template>

<script setup>
import { notify } from '@kyvg/vue3-notification';
import { ref, reactive, inject, onMounted, computed } from 'vue';
import { useI18n } from "vue-i18n";

// get indexed db
import db from '@/database';

// get components
import About from '@/components/About.vue';
import Administration from '@/components/Administration.vue';
import Info from '@/components/Info.vue';
import Month from '@/components/Month.vue';
import MonthNavigation from '@/components/MonthNavigation.vue';
import Year from '@/components/Year.vue';
import YearNavigation from '@/components/YearNavigation.vue';

const { t, locale } = useI18n();
const version = inject('version');

// today
const d = new Date();
const calDate = reactive({
  month: d.getMonth()+1,
  year: d.getFullYear(),
});
const calNow = reactive({
  day: d.getDate(),
  weekday: d.getDay()+1,
  month: d.getMonth()+1,
  year: d.getFullYear(),
});
const calData = ref({});

// handle mount hooks
onMounted(() => {
  fetchData();
  // this.$refs['container'].focus()
});

// retrieve existing data
const fetchData = async () => {
  let days = {}
  await db.days.toCollection().each(d => {
    days[d.name] = d.status;
  });
  calData.value = days;
};

// build date format yyyy-mm-dd
const getDate = (year, month, day) => {
  return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2)
};

// update the status of a day to 1, 0 or -1
const updateDay = async (year, month, day, status) => {
  // get date format yyyy-mm-dd
  let date = getDate(year, month, day);
  // delete record if status == 0 (reset)
  if (status == 0) {
    await db.days.delete(date);
  }
  // add/update record if status == 1 || -1 (success || fail)
  else {
    await db.days.put({name: date, status: status});
    if (status == 1) {
      notify(randomSuccessNotification());
    }
  }
  // update db
  fetchData();
};

// change month to display
const changeMonth = (year, month) => {
  if (month > 12) {
    // first month of next year
    calDate.year = year+1;
    calDate.month = 1;
  } else
  if (month < 1) {
    // last month of previous year
    calDate.year = year-1;
    calDate.month = 12;
  } else {
    // change month in currently displayed year
    calDate.year = year;
    calDate.month = month;
  }
};

// go to next month
const nextMonth = () => {
  changeMonth(calDate.year, calDate.month+1);
};
// go to previous month
const previousMonth = () => {
  changeMonth(calDate.year, calDate.month-1);
};
// go to next year
const nextYear = () => {
  changeMonth(calDate.year+1, calDate.month);
};
// go to previous year
const previousYear = () => {
  changeMonth(calDate.year-1, calDate.month);
};

// return a notyf message object with random success title and text
const randomSuccessNotification = () => {
  return {
    group: 'main',
    title: t('messages.titles.' + Math.floor(Math.random() * 7)),
    text: t('messages.texts.' + Math.floor(Math.random() * 6)),
    duration: 10000
  }
};

// create a file download of whole database as JSON
const exportBackup = () => {
  download(JSON.stringify(calData.value), 'backup.json', 'text/plain');
  notify({
    group: 'main',
    title: t('admin.exportSuccess.title'),
    text: t('admin.exportSuccess.text'),
    duration: 6000
  });
};
// import a backup JSON file and replace current database
const importBackup = (handle) => {
  let file = handle.files[0];
  if(!file || file.type !== 'text/plain' && file.type !== 'application/json') return;
  let reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  reader.onload = async (evt) => {
    let backup = JSON.parse(evt.target.result)
    for (const date in backup) {
      if (backup.hasOwnProperty(date)) {
        const status = backup[date];
        await db.days.put({name: date, status: status});
      }
    }
    fetchData();
    notify({
      group: 'main',
      title: t('admin.importSuccess.title'),
      text: t('admin.importSuccess.text'),
      duration: 6000
    });
  }
  reader.onerror = evt => console.error(evt);
};

// throw all data away
const clearDatabase = async () => {
  await db.days.toCollection().delete()
  calData.value = {};
  notify({
    group: 'main',
    title: t('admin.clearSuccess.title'),
    text: t('admin.clearSuccess.text'),
    duration: 6000
  });
};

// execute a file download
const download = (content, fileName, contentType) => {
  let a = document.createElement("a"), file = new Blob([content], {type: contentType})
  a.href = URL.createObjectURL(file)
  a.download = fileName
  a.click()
};
  
// compute the number of days of the month currently displayed
const daysInMonth = computed(() => {
  return new Date(calDate.year, calDate.month, 0).getDate();
});
// compute the offset of weekdays before actual days
const dayOfWeekOffset = computed(() => {
  return new Date(calDate.year, calDate.month-1, 1).getDay();
});
// compute the offset of days to fill a total of 7 columns
const fillOffset = computed(() => {
  var offset = 36 - (daysInMonth.value + dayOfWeekOffset.value);
  return offset > 0 ? offset : 0;
});
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
  --c-danger-important: #d8344f;
  --c-danger-important-variant: #ac2a40;
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
  font-size: 3rem;
  margin-bottom: .5rem;
}
hr {
  border: none;
  outline: 0;
  width: 10%;
  max-width: 120px;
  height: 5px;
  background: var(--c-accent);
  box-shadow: 0 1px 10px -1px var(--c-shadow);
  margin: 2rem auto 1rem auto;
}
a {
  color: var(--c-text-light);
  outline: 0;
  text-decoration: none;
  transition: color .3s;
}
a:hover,
a:focus,
a:active {
  color: var(--c-accent);
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
#app section {
  margin: auto;
  padding: .5em 0 1.5em 0;
}
#app section p {
  text-align: left;
}
#app footer {
  margin: 8rem 0 10rem 0;
}
#app footer a .icon {
  color: var(--c-text-normal);
  font-size: 2rem;
  margin: 0 .8rem;
  transition: color .3s;
}
#app footer .lang-select {
  background: transparent;
  color: inherit;
  border: none;
  font-family: inherit;
  font-size: inherit;
  text-align: center;
}
#app footer a:hover .icon,
#app footer a:focus .icon,
#app footer a:active .icon {
  color: var(--c-accent);
}
@media (min-width: 1200px) {
  #app section {
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
.mt-3 {
  margin-top: 3rem;
}
.mt-5 {
  margin-top: 5rem;
}
.px-1 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.hidden {
  display: none;
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
