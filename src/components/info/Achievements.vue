<template>
<div class="container">
  <h2>Achievements</h2>
  <div class="achievements">
    <div
      v-for="a in achievements"
      class="item"
      :class="{ active: a.count > 0 }"
      :title="a.title"
    >
      <font-awesome-icon :icon="a.icon" class="icon" />
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    statusData: Object,
  },
  data () {
    return {
      achievements: {
        firstday: {
          title: 'The Beginning',
          description: 'Mark the first day successful',
          icon: 'sign-out-alt',
          count: 0
        },
        weekly: {
          title: '7 in a row',
          description: '7 successful days in a row',
          icon: 'eye',
          count: 0
        },
      }
    }
  },
  methods: {
    // build date format yyyy-mm-dd
    getDate (year, month, day) {
      return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2)
    },
  },
  computed: {
    // get the minimum date (edited date that is most past)
    minDate () {
      var keys = Object.keys(this.statusData)
      if (typeof keys !== 'undefined' && keys.length > 0) {
        return keys.reduce(function (p, v) {
          var pd = new Date(p), vd = new Date(v)
          return ( pd < vd ? pd : vd );
        });
      }
    },
  }
}
</script>

<style>
.achievements {
  display: flex;
  flex-flow: row wrap;
  cursor: default;
}
.achievements .item {
  width: 20%;
  position: relative;
  overflow: hidden;
  margin: 10px 5px;
  padding: 5px 0;
  font-size: 2em;
  color: white;
  color: var(--c-text-normal);
  background: var(--c-background-element);
  box-shadow: 0 8px 20px -8px var(--c-shadow);
  transition: all 0.2s;
}
.achievements .item.active {
  color: white;
  background-image: linear-gradient(to bottom right, var(--c-accent) 0, var(--c-accent-variant) 100%);
  background-color: var(--c-accent);
}
</style>
