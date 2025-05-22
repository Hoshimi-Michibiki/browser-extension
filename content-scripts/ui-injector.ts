import { ContentScriptContext } from "#imports";
import { type Component, App as VueApp, createApp } from "vue";
import { createShadowRootUi } from "#imports";

interface InjectedComponentMount {
  unmount: () => void;
  // sendMessage?: (message: any) => Promise<any>; // im considering this
}

export async function mountInjectedComponent(
  context: ContentScriptContext,
  VueComponent: Component,
  mountPoint: HTMLElement,
  props?: Record<string, any>,
  css = ":host { all: initial; }"
): Promise<InjectedComponentMount> {
  const ui = await createShadowRootUi(context, {
    name: `injected-${VueComponent.name || "component"}-${Date.now()}`,
    position: "inline",
    anchor: "body",
    css,
    onMount: (
      uiContainer: HTMLElement,
      shadow: ShadowRoot,
      shadowHost: HTMLElement
    ) => {
      const app = createApp(VueComponent, props);
      app.mount(uiContainer);
      return () => app.unmount();
    },
  });
  ui.mount();

  return {
    unmount: ui.remove,
  };
}
