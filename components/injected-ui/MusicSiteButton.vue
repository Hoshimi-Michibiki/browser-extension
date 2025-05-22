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
  <button class="playerButton" type="button" @click="count++">{{ msg }} : {{ count }}</button>
</template>

<style scoped>
.playerButton{
    border-radius: 15px;
}
</style>
