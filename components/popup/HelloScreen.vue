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
    <button class="button button-elevated" type="button" @click="count++">Connect to Discord</button>
    <!-- <p>{{ t('greetUser','User') }}</p> -->
    <!-- <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p> -->
  </div>

  <!-- <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p> -->
  <p class="text-muted">Have you invited <a href="https://github.com" target="_blank">the Michibiki bot ?</a><br>This is required for the extension to work<br>Click <a href="https://github.com" target="_blank">here</a> to learn more !</p>
</template>

<style scoped>
.text-muted {
  color: #888;
}
</style>
