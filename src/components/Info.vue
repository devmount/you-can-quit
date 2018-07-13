<template>
<div class="info">
  <Legend />
  <Stats :status-data="statusData" />
  <Achievements :status-data="statusData" />
</div>
</template>

<script>
import Legend from './info/Legend.vue'
import Stats from './info/Stats.vue'
import Achievements from './info/Achievements.vue'

export default {
  components: {
    Legend,
    Stats,
    Achievements
  },
  props: {
    statusData: Object,
  }
}
</script>