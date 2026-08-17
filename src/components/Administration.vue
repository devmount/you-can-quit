<template>
<div class="administration-container">
  <h2>{{ t('admin.title') }}</h2>
  <section class="col-2">
    <div class="col-half px-1 backup-zone">
      <h3>{{ t('admin.backup.title') }}</h3>
      <p>{{ t('admin.backup.text') }}</p>
      <button type="button" class="btn btn-primary" @click="$emit('export')">{{ t('admin.backup.buttonExport') }}</button>
    </div>
    <div class="col-half px-1 danger-zone">
      <h3>{{ t('admin.danger.title') }}</h3>
      <p>{{ t('admin.danger.text') }}</p>
      <div class="btn-group">
        <button v-if="!confirm.import" type="button" class="btn btn-danger" @click="confirm.import = true">{{ t('admin.danger.buttonImport') }}</button>
        <div v-if="confirm.import" class="btn btn-danger btn-danger-important">
          {{ t('admin.danger.confirmImport') }}
          <button type="button" class="btn-mini" @click="$refs['backupFile'].click()">{{ t('admin.danger.yes') }}</button>
          <button type="button" class="btn-mini" @click="confirm.import = false">{{ t('admin.danger.no') }}</button>
        </div>
        <input class="hidden" type="file" id="backup" accept=".json" ref="backupFile" @change="$emit('import', $refs['backupFile']);confirm.import = false">
        <button v-if="!confirm.clear" type="button" class="btn btn-danger" @click="confirm.clear = true">{{ t('admin.danger.buttonClear') }}</button>
        <div v-if="confirm.clear" class="btn btn-danger btn-danger-important">
          {{ t('admin.danger.confirmClear') }}
          <button type="button" class="btn-mini" @click="$emit('clear');confirm.clear = false">{{ t('admin.danger.yes') }}</button>
          <button type="button" class="btn-mini" @click="confirm.clear = false">{{ t('admin.danger.no') }}</button>
        </div>
      </div>
    </div>
  </section>
</div>
</template>

<script setup>
import { reactive } from 'vue';
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const confirm = reactive({
  import: false,
  clear: false,
});
</script>

<style>
.btn {
  background: var(--c-background-element-variant);
  border: 2px solid var(--c-background-element-variant);
  color: var(--c-text-light);
  font-size: 16px;
  appearance: none;
  border-radius: 2px;
  cursor: pointer;
  display: inline-block;
  outline: none;
  padding: .6rem 1rem;
  text-align: center;
  text-decoration: none;
  transition: background .2s, border .2s, box-shadow .2s, color .2s;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
}
.btn:focus,
.btn:hover,
.btn:active {
  box-shadow: 0 0 0 .3rem var(--c-background-element-variant-transparent);
  text-decoration: none;
}
.btn.btn-primary {
  background: var(--c-accent-variant);
  border: 2px solid var(--c-accent-variant);
  color: var(--c-text-light);
}
.btn.btn-primary:focus,
.btn.btn-primary:hover,
.btn.btn-primary:active {
  box-shadow: 0 0 0 .3rem var(--c-accent-variant-transparent);
}
.btn.btn-danger {
  background: var(--c-danger-variant);
  border: 2px solid var(--c-danger-variant);
  color: var(--c-text-light);
}
.btn.btn-danger:focus,
.btn.btn-danger:hover,
.btn.btn-danger:active {
  box-shadow: 0 0 0 .3rem var(--c-danger-variant-transparent);
}
.btn.btn-danger.btn-danger-important {
  background: var(--c-danger-important);
  border: 2px solid var(--c-danger-important);
}
.btn-mini {
  appearance: none;
  border: none;
  border-radius: 2px;
  font: inherit;
  color: inherit;
  cursor: pointer;
  padding: 3px 8px;
  margin-left: 10px;
  background: var(--c-danger-important-variant);
}
.btn-mini:focus,
.btn-mini:hover,
.btn-mini:active {
  background: var(--c-danger-variant);
}
.btn-group {
  display: flex;
  justify-content: space-around;
}
</style>
