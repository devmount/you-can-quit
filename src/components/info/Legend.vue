<template>
<div class="container">
  <h2>{{ t('legend.title') }}</h2>
  <div class="legend">
    <div class="today">{{ t('today') }}</div>
    <div class="successful">{{ t('legend.day.successful') }}</div>
    <div class="undecided">{{ t('legend.day.undecided') }}</div>
    <div class="failed">{{ t('legend.day.failed') }}</div>
  </div>
</div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
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
  text-align: center;
  position: absolute;
  left: 0;
  width: 20px;
  height: 20px;
  border-radius: 2px;
}
.legend > div.successful::before {
  background-image: linear-gradient(to bottom right, var(--c-accent) 0, var(--c-accent-variant) 100%);
  background-color: var(--c-accent);
  box-shadow: 0 8px 20px -8px var(--c-shadow);
}
.legend > div.undecided::before {
  background: var(--c-background-element);
}
.legend > div.failed::before {
  background: var(--c-background);
}
.legend > div.today::before {
  background: var(--c-text-light);
}
</style>
