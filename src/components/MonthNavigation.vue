<template>
<div class="navigation">
  <h2>{{ month }} {{ year }}</h2>
  <div class="button-group">
    <button @click="$emit('previous')" v-shortkey="['arrowleft']" @shortkey="$emit('previous')" title="Previous Month [←]">
      <font-awesome-icon icon="chevron-left" />
    </button>
    <button @click="$emit('change')" v-shortkey="['r']" @shortkey="$emit('change')" title="Reset [r]">
      <font-awesome-icon icon="undo-alt" />
    </button>
    <button @click="$emit('next')" v-shortkey="['arrowright']" @shortkey="$emit('next')" title="Next Month [→]">
      <font-awesome-icon icon="chevron-right" />
    </button>
  </div>
</div>
</template>

<script>
export default {
  props: {
    month: String,
    year: Number,
  }
}
</script>

<style>
.navigation {
  margin: 1em 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}
.navigation > * {
  flex-basis: 50%;
}
.navigation h2 {
  margin: 0;
  padding: .3em 1em 0 0;
  text-align: right;
}
.navigation .button-group {
  text-align: left;
}
.navigation .button-group button {
  color: var(--c-text-light);
  padding: .5em;
  font-size: 1.5em;
}
</style>
