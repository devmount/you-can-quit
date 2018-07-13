<template>
<div class="info">
  <Legend />
  <Stats
    :status-data="statusData"
  />
</div>
</template>

<script>
import Legend from './Legend.vue'
import Stats from './Stats.vue'

export default {
  components: {
    Legend,
    Stats
  },
  props: {
    statusData: Object,
  }
}
</script>

<style>

</style>