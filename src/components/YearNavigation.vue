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
import { computed } from 'vue';
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
  date: Object,
});

const year = computed(() => props.date.year );

const emit = defineEmits(['previous', 'change', 'next']);
</script>
