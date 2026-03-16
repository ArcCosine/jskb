import { JSDOM } from 'jsdom';
import type { Environment } from 'vitest';

export default <Environment>{
  name: 'jsdom-extended',
  setup() {
    const dom = new JSDOM('<!DOCTYPE html>', {
      url: 'http://localhost',
      pretendToBeVisual: true,
    });

    // @ts-ignore
    global.window = dom.window;
    // @ts-ignore
    global.document = dom.window.document;
    // @ts-ignore
    global.navigator = dom.window.navigator;

    // Add any other globals you need
    // For example, if your tests expect 'HTMLElement'
    // @ts-ignore
    global.HTMLElement = dom.window.HTMLElement;

    return {
      teardown() {
        dom.window.close();
      },
    };
  },
};
