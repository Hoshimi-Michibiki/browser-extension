<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from '@/composables/useI18n';

const { t, getUILanguage } = useI18n();

defineProps({
  msg: String,
});

const count = ref(0);
</script>

<template>
  <div>
    <a target="_blank">
      <img src="/wxt.svg" class="logo" alt="WXT logo" />
    </a>
  </div>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button class="button button-elevated" type="button" @click="count++">{{ t('discordLoginTitle') }}</button>
  </div>

  <p class="text-muted">{{ t('michibikiBotPreamble') }} 
    <a href="https://github.com" target="_blank">
      {{ t('michibikiBotLinkText') }} ?
      </a>
      <br>{{ t('michibikiBotRequirement') }}<br>
      </p>
</template>

<style scoped>
.text-muted {
  color: #888;
}
</style>
