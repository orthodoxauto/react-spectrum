/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { useInsertionEffect } from "react";

interface PreventScrollOptions {
  /** Whether the scroll lock is disabled. */
  isDisabled?: boolean;
}

// The number of active usePreventScroll calls. Used to determine whether to revert back to the original page style/scroll position
let preventScrollCount = 0;

/**
 * Prevents scrolling on the document body on mount, and
 * restores it on unmount. Also ensures that content does not
 * shift due to the scrollbars disappearing.
 */
export function usePreventScroll(options: PreventScrollOptions = {}): void {
  let { isDisabled } = options;

  useInsertionEffect(() => {
    if (isDisabled) {
      return;
    }

    preventScrollCount++;
    let styleId = "react-aria-prevent-scroll";
    if (preventScrollCount === 1) {
      let style = document.createElement("style");
      style.id = styleId;
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      style.textContent = `
        html {
          overflow: hidden;
          padding-right: ${scrollBarWidth}px;
          --scrollbar-width: ${scrollBarWidth}px;
        }
        html::-webkit-scrollbar {
          overflow: hidden;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      preventScrollCount--;
      if (preventScrollCount === 0) {
        document.getElementById(styleId)?.remove();
      }
    };
  }, [isDisabled]);
}
