<script lang="ts" setup>
//! IMPORTANT: You can't 
import { ref } from 'vue';
import { useI18n } from '@/composables/useI18n';

const { t, getUILanguage } = useI18n();

const props = defineProps({
  msg: String,
});

const count = ref(0);
</script>

<template>
  <button class="button button-elevated" type="button" @click="count++">{{ msg }} : {{ count }}</button>
</template>


