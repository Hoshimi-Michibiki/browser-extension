import { ContentScriptContext } from "#imports";
import { type Component, App as VueApp, createApp } from "vue";
import { createShadowRootUi } from "#imports";
import { logger } from "@/utils/logger";

interface InjectedComponentMount {
  unmount: () => void;
  componentName?: string;
//   sendMessage?: (message: any) => Promise<any>; // im considering this
}

export async function mountInjectedComponent(
  context: ContentScriptContext,
  VueComponent: Component,
  mountPoint: HTMLDivElement,
  props?: Record<string, any>,
  componentName?: string, // so we would know the exact component to unmount
  css = ":host { all: initial; }"
): Promise<InjectedComponentMount> {
  const ui = await createShadowRootUi(context, {
    name: `michibiki-injected-${VueComponent.name || "component"}-${Date.now()}`,
    position: "inline",
    anchor: mountPoint,
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
    componentName: componentName
  };
}
