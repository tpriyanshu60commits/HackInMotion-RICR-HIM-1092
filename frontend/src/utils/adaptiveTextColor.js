/**
 * Adaptive Text Color Utility
 *
 * Automatically adjusts text color to black or white if the contrast against its
 * computed background falls below an acceptable threshold.
 */

// Helper to calculate relative luminance
function getLuminance(r, g, b) {
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Calculate contrast ratio (1 to 21)
function getContrast(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function parseRGB(rgbString) {
  const match = rgbString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return null;
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
    a: match[4] ? parseFloat(match[4]) : 1,
  };
}

// Find effective background color by traversing up the DOM
function getEffectiveBackgroundColor(el) {
  let current = el;
  while (current && current !== document) {
    const style = window.getComputedStyle(current);
    const bg = style.backgroundColor;
    const parsed = parseRGB(bg);
    // If the background is somewhat solid (alpha > 0.5), use it
    if (parsed && parsed.a > 0.5) {
      return parsed;
    }
    current = current.parentElement;
  }

  // Fallback to checking a global theme attribute (set by dynamic image backgrounds)
  const globalTheme = document.body.getAttribute('data-bg-theme');
  if (globalTheme === 'dark') return { r: 0, g: 0, b: 0, a: 1 };
  if (globalTheme === 'light') return { r: 255, g: 255, b: 255, a: 1 };

  // Default to a darkish background due to the scrim layer in WeatherBackground
  return { r: 40, g: 40, b: 40, a: 1 };
}

let isProcessing = false;
let pendingElements = new Set();
let observer = null;

function processPendingElements() {
  if (pendingElements.size === 0) {
    isProcessing = false;
    return;
  }

  const elements = Array.from(pendingElements);
  pendingElements.clear();

  const updates = [];

  for (const el of elements) {
    if (!document.body.contains(el)) continue;

    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0')
      continue;

    // Remove any current override to read the true default color
    const currentOverride = el.style.color;
    if (currentOverride === 'rgb(0, 0, 0)' || currentOverride === 'rgb(255, 255, 255)') {
      el.style.color = '';
    }

    const defaultColorStr = window.getComputedStyle(el).color;
    const defaultColor = parseRGB(defaultColorStr);

    // Restore override temporarily if needed
    if (currentOverride === 'rgb(0, 0, 0)' || currentOverride === 'rgb(255, 255, 255)') {
      el.style.color = currentOverride;
    }

    if (!defaultColor) continue;

    const effectiveBg = getEffectiveBackgroundColor(el);
    const textLum = getLuminance(defaultColor.r, defaultColor.g, defaultColor.b);
    const bgLum = getLuminance(effectiveBg.r, effectiveBg.g, effectiveBg.b);

    const contrast = getContrast(textLum, bgLum);

    // WCAG AA contrast ratio threshold is 4.5 for normal text
    if (contrast < 4.5) {
      // Background luminance threshold for light vs dark is around 0.179
      const newColor = bgLum > 0.179 ? '#000000' : '#ffffff';
      updates.push({ el, color: newColor });
    } else {
      // Contrast is fine, remove override
      updates.push({ el, color: '' });
    }
  }

  // Batch DOM writes to avoid layout thrashing
  for (const { el, color } of updates) {
    if (color) {
      if (el.style.color !== color) {
        el.style.color = color;
        el.style.transition = 'color 0.4s ease-in-out';
      }
    } else {
      if (
        el.style.color === 'rgb(0, 0, 0)' ||
        el.style.color === 'rgb(255, 255, 255)' ||
        el.style.color === '#000000' ||
        el.style.color === '#ffffff'
      ) {
        el.style.color = '';
      }
    }
  }

  isProcessing = false;
}

function scheduleProcessing() {
  if (!isProcessing && pendingElements.size > 0) {
    isProcessing = true;
    if (window.requestIdleCallback) {
      window.requestIdleCallback(processPendingElements);
    } else {
      requestAnimationFrame(processPendingElements);
    }
  }
}

export function initAdaptiveTextColor() {
  if (observer) return; // Already initialized

  const targetTags = [
    'H1',
    'H2',
    'H3',
    'H4',
    'H5',
    'H6',
    'P',
    'SPAN',
    'A',
    'LABEL',
    'BUTTON',
    'LI',
    'TH',
    'TD',
  ];
  const selector = targetTags.map((tag) => tag.toLowerCase()).join(', ') + ', .adaptive-text';

  // Initial scan
  document.querySelectorAll(selector).forEach((el) => pendingElements.add(el));
  scheduleProcessing();

  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const textElements = node.querySelectorAll(selector);
            textElements.forEach((el) => pendingElements.add(el));
            if (targetTags.includes(node.tagName) || node.classList?.contains('adaptive-text')) {
              pendingElements.add(node);
            }
          } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
            if (node.textContent.trim().length > 0) {
              pendingElements.add(node.parentElement);
            }
          }
        });
      } else if (mutation.type === 'attributes') {
        // If style/class changes, re-evaluate contrast
        if (mutation.target.nodeType === Node.ELEMENT_NODE) {
          if (
            targetTags.includes(mutation.target.tagName) ||
            mutation.target.classList?.contains('adaptive-text')
          ) {
            pendingElements.add(mutation.target);
          }
          // Also re-evaluate children in case background changed
          const textElements = mutation.target.querySelectorAll(selector);
          textElements.forEach((el) => pendingElements.add(el));
        }
      }
    });

    scheduleProcessing();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'data-bg-theme'],
  });
}
