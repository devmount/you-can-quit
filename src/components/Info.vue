<template>
<div class="info">
  <Legend />
  <Stats />
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
  props: {}
}
</script>

<style>

</style>