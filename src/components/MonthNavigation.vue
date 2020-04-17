<template>
<div class="navigation" tabindex="0">
  <h2>{{ $t('name.month.' + date.month) }} {{ date.year }}</h2>
  <div class="button-group">
    <button
      @click="$emit('previous')"
      :title="$t('month.previous') + ' [←]'"
    >
      <font-awesome-icon icon="chevron-left" />
    </button>
    <button
      @click="$emit('change')"
      :title="$t('reset') + ' [R]'"
    >
      <font-awesome-icon icon="undo-alt" />
    </button>
    <button
      @click="$emit('next')"
      :title="$t('month.next') + ' [→]'"
    >
      <font-awesome-icon icon="chevron-right" />
    </button>
  </div>
</div>
</template>

<script>
export default {
  props: {
    date: Object,
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
