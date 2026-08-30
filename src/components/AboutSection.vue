<template>
<div class="about-container">
  <h2>{{ t('about.title') }}</h2>
  <section class="col-2">
    <div class="col-half px-1">
      <h3>{{ t('about.what.title') }}</h3>
      <p>{{ t('about.what.text') }}</p>
    </div>
    <div class="col-half px-1">
      <h3>{{ t('about.how.title') }}</h3>
      <p>{{ t('about.how.text') }}</p>
      <day-legend />
    </div>
  </section>
</div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import DayLegend from '@/components/info/DayLegend.vue';

const { t } = useI18n();
</script>
