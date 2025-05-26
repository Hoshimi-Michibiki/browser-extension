<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from '@/composables/useI18n';

const { t, getUILanguage } = useI18n();

defineProps({
  msg: String,
});


const isLoading = ref(false);
const loginError = ref<string | null>(null);


const michibikiBotInviteLink = ref('https://discord.com/oauth2/authorize?client_id=?&scope=bot&permissions=?'); 


const isMichibikiBotMentionedInPrivacy = computed(() => {
  return t('discordLoginPrivacyInfo').toLowerCase().includes('michibiki');
});

const handleDiscordLogin = async () => {
  isLoading.value = true;
  loginError.value = null;
  console.log('Initiating Discord login...');

  try {
    
    await new Promise(resolve => setTimeout(resolve, 2500)); 

    console.log('Discord OAuth flow would be handled by background script.');

  } catch (error: any) {
    console.error('Discord login failed:', error);
    loginError.value = error.message || t('discordLoginGenericError');
    isLoading.value = false;
  }
};

</script>

<template>
  <div>
    <div class="header-logo">
      <img src="/wxt.svg"
       alt="Discord Logo" class="discord-brand-logo" />
      </div>
    <h1>{{ t('discordLoginTitle') }}</h1>
    <p class="subtitle">{{ t('discordLoginSubtitle') }}</p>

    <div class="card-actions">
      <button
        class="button button-elevated"
        type="button"
        @click="handleDiscordLogin"
        :disabled="isLoading"
      >
        <span v-if="isLoading" class="button-content">
          <span class="spinner"></span>
          {{ t('discordLoginLoadingButton') }}
        </span>
        <span v-else class="button-content">
          <img 
          
          alt="" class="button-icon" />
          {{ t('discordLoginButtonLabel') }}
        </span>
      </button>
    </div>

    <p v-if="loginError" class="error-message">{{ loginError }}</p>

    <p class="text-muted privacy-notice">{{ t('discordLoginPrivacyInfo') }} <br> {{ t('discordLoginNoDataSaving') }}.</p>
    <p class="text-muted" v-if="!isMichibikiBotMentionedInPrivacy">
      {{ t('michibikiBotPreamble') }} <a :href="michibikiBotInviteLink" target="_blank">{{ t('michibikiBotLinkText') }}</a>? <br>{{ t('michibikiBotRequirement') }}
    </p>
  </div>
</template>

<style scoped>
.text-muted {
  color: #888;
}
</style>
