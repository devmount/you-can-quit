<template>
<div class="navigation" tabindex="0">
  <h2>{{ year }}</h2>
  <div class="button-group">
    <button
      @click="emit('previous')"
      :title="t('year.previous') + ' CTRL+[←]'"
    >
      <font-awesome-icon icon="chevron-left" />
    </button>
    <button
      @click="emit('change')"
      :title="t('reset') + ' [R]'"
    >
      <font-awesome-icon icon="undo-alt" />
    </button>
    <button
      @click="emit('next')"
      :title="t('year.next') + ' CTRL+[→]'"
    >
      <font-awesome-icon icon="chevron-right" />
    </button>
  </div>
</div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
  date: Object,
});

const year = computed(() => props.date.year );

const emit = defineEmits(['previous', 'change', 'next']);
</script>

<style>
.navigation {
  margin: 1em 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}
.navigation > * {
  flex-basis: 50%;
}
.navigation h2 {
  margin: 0;
  padding: 0 1em 0 0;
  text-align: right;
}
.navigation .button-group {
  text-align: left;
}
.navigation .button-group button {
  color: var(--c-text-light);
  padding: 0 .5em;
  font-size: 1.5em;
}
</style>
