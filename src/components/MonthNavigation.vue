<template>
<div class="navigation" tabindex="0">
  <h2>{{ t('name.month.' + date.month) }} {{ date.year }}</h2>
  <div class="button-group">
    <button
      @click="emit('previous')"
      :title="t('month.previous') + ' [←]'"
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
      :title="t('month.next') + ' [→]'"
    >
      <font-awesome-icon icon="chevron-right" />
    </button>
  </div>
</div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
  date: Object,
});

const emit = defineEmits(['previous', 'change', 'next']);
</script>
