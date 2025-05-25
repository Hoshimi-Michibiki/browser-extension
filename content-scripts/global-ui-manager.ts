import { createApp, reactive, h, App as VueApp, VNode} from 'vue';
import ToastNotification from '@/components/shared/ToastNotification.vue';
import ConfirmationPrompt from '@/components/shared/ConfirmationPrompt.vue';

interface ToastItem { id: string; message: string; type: string;};
interface PromptItem { id: string; question: string; callback: (confirmed: boolean) => void; promptIdForResponseMessage: string; };

const pageUiState = reactive({
    toasts: [] as ToastItem[],
    activePrompt: null as PromptItem | null,
});

let globalVueApp: VueApp | null = null;

const GlobalUIRootComponent = {
    setup() {
        return () => {
            const toastNodes: VNode[] = pageUiState.toasts.map(toast =>
                h(ToastNotification, {
                    key: toast.id,
                    message: toast.message,
                    type: toast.type,
                    onClose: () => removeToast(toast.id),
                })
            );

            let promptNode: VNode | null = null;
            if (pageUiState.activePrompt) {
                promptNode = h(ConfirmationPrompt, {
                    question: pageUiState.activePrompt.question,
                    onConfirm: () => resolvePrompt(true),
                    onCancel: () => resolvePrompt(false),
                });
            }

            return h('div', { class: 'my-extension-global-ui-container'}, [
                h('div', { class: 'my-extension-toast-wrapper '}, toastNodes),
                pageUiState.activePrompt ? h('div', { class: 'my-extension-prompt-overlay' }, [promptNode]) : null,
            ]);
        };
    }
};

function ensureGlobalAppMounted() {
    if (globalVueApp) return;

    const hostId = 'my-extension-global-ui-host';
    let hostElement = document.getElementById(hostId);
    if (!hostElement) {
        hostElement = document.createElement('div');
        hostElement.id = hostId;
        hostElement.style.position = 'fixed';
        hostElement.style.top = '0';
        hostElement.style.right = '0';
        hostElement.style.zIndex = '999';
        hostElement.style.pointerEvents = 'none';

        document.body.appendChild(hostElement);
    }
    globalVueApp = createApp(GlobalUIRootComponent);
    globalVueApp.mount(hostElement);
}

function addToast(message: string, type: string) {
    ensureGlobalAppMounted();
    const id = `toast-${Date.now()}`;
    pageUiState.toasts.push({ id, message, type });
    setTimeout(() => removeToast(id), 5000);
}

function removeToast(id: string) {
    pageUiState.toasts = pageUiState.toasts.filter(t => t.id !== id);
}

function addPrompt(question: string, promptIdForResponseMessage: string, callback: (confirmed: boolean) => void ) {
    ensureGlobalAppMounted();
    if (pageUiState.activePrompt) {
        pageUiState.activePrompt.callback(false);
    }
    pageUiState.activePrompt = { id: `prompt-display-${Date.now()}`, question, callback, promptIdForResponseMessage };
}

function resolvePrompt(confirmed: boolean) {
  if (pageUiState.activePrompt) {
    pageUiState.activePrompt.callback(confirmed);
    browser.runtime.sendMessage({
      action: 'PROMPT_RESPONSE',
      promptId: pageUiState.activePrompt.promptIdForResponseMessage,
      payload: { confirmed }
    }).catch(e => logger.debug("Failed to send prompt response, maybe no listener:", e));
    pageUiState.activePrompt = null;
  }
}

export function initGlobalUIManager() {
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'SHOW_PAGE_TOAST') {
      addToast(message.payload.message, message.payload.type);
      sendResponse({ success: true });
      return true;
    } else if (message.action === 'SHOW_PAGE_PROMPT') {
      addPrompt(message.payload.question, message.payload.promptId, (confirmed) => {
      });
      sendResponse({ success: true });
      return true; 
    }
    return false;
  });

  window.addEventListener('show-page-toast', (event: Event) => {
    const { message, type } = (event as CustomEvent).detail;
    addToast(message, type);
  });
  window.addEventListener('show-page-prompt', (event: Event) => {
    const { question, promptId, callback } = (event as CustomEvent).detail;
    addPrompt(question, promptId, callback);
  });

  logger.debug('[GlobalUIManager] Initialized.');
}