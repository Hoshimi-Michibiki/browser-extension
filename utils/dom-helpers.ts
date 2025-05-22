export function waitForElementBySelector(
  selector: string,
  timeout: number = 5000
): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    const element = document.querySelector<HTMLElement>(selector);
    if (element) {
      resolve(element);
      return;
    }
    const observer = new MutationObserver((mutations, obs) => {
      const el = document.querySelector<HTMLElement>(selector);
      if (el) {
        obs.disconnect();
        resolve(el);
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    setTimeout(() => {
      observer.disconnect();
      resolve(document.querySelector<HTMLElement>(selector));
    }, timeout);
  });
}

export function observeDOM(
  targetNode: Node,
  callback: MutationCallback,
  options: MutationObserverInit = { childList: true, subtree: true }
): MutationObserver {
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, options);
  return observer;
}

export function waitForElementByXPath(
  xpath: string,
  timeout: number = 5000
): Promise<HTMLElement | null> {
    return new Promise((resolve) => {
        const element = getElementByXPath(xpath);
        if (element) {
            resolve(element);
            return;
        }
        const observe = new MutationObserver((mutations, obs) => {
            const el = getElementByXPath(xpath);
            if (el) {
                obs.disconnect();
                resolve(el);
            }
        });
        observe.observe(document.documentElement, {
            childList: true,
            subtree: true,
        })
        setTimeout(() => {
            observe.disconnect();
            resolve(getElementByXPath(xpath));
        }, timeout);
    });
}

function getElementByXPath(xpath: string): HTMLElement | null {
  const result = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );
  return result.singleNodeValue as HTMLElement | null;
}
