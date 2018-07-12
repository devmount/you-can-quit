<template>
<div class="container">
  <h2>Legend</h2>
  <div class="legend">
    <div class="today">Today</div>
    <div class="successful">Successful day</div>
    <div class="undecided">Undecided day</div>
    <div class="failed">Failed day</div>
  </div>
</div>
</template>

<script>
export default {
  
}
</script>

<style>
.legend {
  text-align: left;
  padding-top: 17px;
  display: flex;
  flex-flow: row wrap;
  cursor: default;
}
.legend > div {
  position: relative;
  padding: 0 0 10px 35px;
  width: calc(50% - 35px);
}
.legend > div::before {
  content: '';
  position: absolute;
  left: 0;
  width: 18px;
  height: 20px;
  border-radius: 2px;
}
.legend > div.successful::before {
  color: white;
  background-image: linear-gradient(to bottom right, var(--c-accent) 0, var(--c-accent-variant) 100%);
  background-color: var(--c-accent);
  box-shadow: 0 8px 20px -8px var(--c-shadow);
}
.legend > div.undecided::before {
  background: var(--c-background-element);
}
.legend > div.failed::before {
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, .1);
  background: transparent;
}
.legend > div.today::before {
  background: var(--c-text-light);
}
</style>
