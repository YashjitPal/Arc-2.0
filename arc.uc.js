// ==UserScript==
// @name                 Arc 2.0
// @description          All-in-one JavaScript enhancements for Arc 2.0 theme
// @author               Arc-2.0
// @version              3.3.4
// ==/UserScript==

/* ==========================================================================
   MODULE 1: Tab Group Scrolling (arc-group-scroll)
   --------------------------------------------------------------------------
   Enables smooth mouse-wheel scrolling within expanded tab groups in Zen's
   sidebar tab bar. Allows navigating through tabs inside a group without
   scrolling the entire sidebar until the top or bottom of the group is reached.
   ========================================================================== */
(function () {
  "use strict";

  const LINE_HEIGHT = 20;

  function onWheel(event) {
    const group = event.target?.closest?.(
      "tab-group:not([split-view-group]):not([collapsed])",
    );
    if (!group || group.scrollHeight <= group.clientHeight) {
      return;
    }

    let delta = event.deltaY;
    if (event.deltaMode === event.DOM_DELTA_LINE) {
      delta *= LINE_HEIGHT;
    } else if (event.deltaMode === event.DOM_DELTA_PAGE) {
      delta *= group.clientHeight;
    }

    const max = group.scrollHeight - group.clientHeight;
    const next = Math.max(0, Math.min(max, group.scrollTop + delta));

    // At the group's top or bottom, let the event through so the sidebar scrolls.
    if (next === group.scrollTop) {
      return;
    }

    group.scrollTop = next;
    event.preventDefault();
    event.stopPropagation();
  }

  document.addEventListener("wheel", onWheel, {
    capture: true,
    passive: false,
  });
})();

/* ==========================================================================
   MODULE 2: Sidebar Media Cover Art (arc-media-cover)
   --------------------------------------------------------------------------
   Extracts active playback cover art (MediaSession metadata, YouTube video
   thumbnails, or high-res favicons) and sets it as the dynamic background
   for Zen Browser's sidebar media player controls toolbar.
   ========================================================================== */
(function () {
  "use strict";

  const MEDIA_TOOLBAR_ID = "zen-media-controls-toolbar";

  /**
   * Extract cover art from MediaSession metadata, YouTube video ID, or tab icon.
   */
  function extractCoverUrl(mediaController, browser) {
    // 1. Try MediaSession metadata artwork
    try {
      const meta = mediaController?.getMetadata?.();
      if (meta?.artwork && Array.isArray(meta.artwork) && meta.artwork.length > 0) {
        const best = meta.artwork.reduce((prev, curr) => {
          const prevSize = parseInt(prev?.sizes) || 0;
          const currSize = parseInt(curr?.sizes) || 0;
          return currSize > prevSize ? curr : prev;
        }, meta.artwork[0]);
        if (best?.src) return best.src;
      }
    } catch (e) {}

    // 2. YouTube / YouTube Music video thumbnail
    try {
      const url = browser?.currentURI?.spec || "";
      const ytMatch = url.match(
        /(?:youtube\.com\/(?:watch\?.*v=|shorts\/)|youtu\.be\/|music\.youtube\.com\/(?:watch\?.*v=))([a-zA-Z0-9_-]{11})/
      );
      if (ytMatch && ytMatch[1]) {
        return "https://i.ytimg.com/vi/" + ytMatch[1] + "/hqdefault.jpg";
      }
    } catch (e) {}

    // 3. Tab favicon / page icon fallback
    try {
      const tab = browser && window.gBrowser ? window.gBrowser.getTabForBrowser(browser) : null;
      const icon =
        browser?.mIconURL ||
        (tab ? window.gBrowser.getIcon(tab) : null);
      if (icon && !icon.includes("default-favicon")) {
        return icon;
      }
    } catch (e) {}

    return null;
  }

  /**
   * Apply or clear the cover art CSS variable on a media card element.
   */
  function applyCoverToCard(card, coverUrl) {
    if (!card) return;
    if (coverUrl) {
      card.style.setProperty("--arc-media-cover-url", 'url("' + coverUrl + '")');
      card.setAttribute("has-cover", "true");
    } else {
      card.style.removeProperty("--arc-media-cover-url");
      card.removeAttribute("has-cover");
    }
  }

  /**
   * Synchronize all active cards with their playing media sessions.
   */
  function syncAllCards() {
    const toolbar = document.getElementById(MEDIA_TOOLBAR_ID);
    if (!toolbar) return;

    const cards = toolbar.querySelectorAll(".zen-media-card:not([hidden])");
    if (!cards.length) return;

    // Search active media tabs
    const tabsWithMedia = Array.from(window.gBrowser?.tabs || []).filter(
      (tab) => tab.hasAttribute("soundplaying") || tab.linkedBrowser?.browsingContext?.mediaController?.isActive
    );

    cards.forEach((card, index) => {
      const cardTitle = card.querySelector(".zen-media-title")?.textContent?.trim() || "";

      // Try matching by track title or tab label
      let matchedTab = tabsWithMedia.find((tab) => {
        const controller = tab.linkedBrowser?.browsingContext?.mediaController;
        const meta = controller?.getMetadata?.();
        return (
          (meta?.title && meta.title.trim() === cardTitle) ||
          (tab.label && tab.label.trim() === cardTitle)
        );
      });

      // Fallback: match by index or take the first active tab
      if (!matchedTab && tabsWithMedia[index]) {
        matchedTab = tabsWithMedia[index];
      } else if (!matchedTab && tabsWithMedia.length === 1) {
        matchedTab = tabsWithMedia[0];
      }

      if (matchedTab) {
        const browser = matchedTab.linkedBrowser;
        const controller = browser?.browsingContext?.mediaController;
        const cover = extractCoverUrl(controller, browser);
        applyCoverToCard(card, cover);
        if (cover) {
          toolbar.style.setProperty("--arc-media-cover-url", 'url("' + cover + '")');
        }
      }
    });
  }

  /**
   * Intercept Zen's controller to hook into every media session.
   */
  function hookZenMediaController() {
    if (!window.gZenMediaController) return false;

    const origActivate = window.gZenMediaController.activateMediaControls;
    if (origActivate && !origActivate._arcHooked) {
      window.gZenMediaController.activateMediaControls = function (mediaController, browser) {
        origActivate.apply(this, arguments);

        if (mediaController && typeof mediaController.addEventListener === "function") {
          const onMetaChange = () => {
            requestAnimationFrame(() => syncAllCards());
          };
          mediaController.addEventListener("metadatachange", onMetaChange);
          mediaController.addEventListener("playbackstatechange", onMetaChange);
        }

        setTimeout(syncAllCards, 150);
        setTimeout(syncAllCards, 600);
      };
      window.gZenMediaController.activateMediaControls._arcHooked = true;
    }

    return true;
  }

  function init() {
    // Hook Zen's controller if available or retry shortly
    if (!hookZenMediaController()) {
      const hookTimer = setInterval(() => {
        if (hookZenMediaController()) clearInterval(hookTimer);
      }, 400);
      setTimeout(() => clearInterval(hookTimer), 10000);
    }

    // Observe toolbar DOM mutations (cards added/removed/shown)
    const toolbar = document.getElementById(MEDIA_TOOLBAR_ID);
    if (toolbar) {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (
            mutation.type === "childList" ||
            (mutation.type === "attributes" &&
              (mutation.attributeName === "class" ||
                mutation.attributeName === "hidden" ||
                mutation.attributeName === "playing"))
          ) {
            syncAllCards();
            break;
          }
        }
      });

      observer.observe(toolbar, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "hidden", "playing"],
      });
    }

    // Listen to tab audio events
    window.addEventListener("TabAttrModified", (event) => {
      if (event.detail?.changed?.includes("soundplaying")) {
        setTimeout(syncAllCards, 200);
      }
    });

    window.addEventListener("TabSelect", () => {
      setTimeout(syncAllCards, 300);
    });

    // Initial check
    syncAllCards();
  }

  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init, { once: true });
  }
})();

/* ==========================================================================
   MODULE 3: Invert Colors Hotkey (Ctrl+Alt+Shift+-) & Arc Customizations
   --------------------------------------------------------------------------
   - Attaches the `Ctrl`+`Alt`+`Shift`+`-` hotkey to toggle color inversion on
     the active tab. Pressing it inverts colors, and pressing it again restores
     the original colors.
   - For PDF documents, inverts PDF pages with color-preserving hue rotation
     and optimized highlight colors via InvertPDFActor.
   - For other pages (or as fallback), inverts the active tab directly.
   - Maintains per-tab invert state on tab switching.
   - Live-syncs --arc-border-radius from about:config to all tabs.
   ========================================================================== */
(function () {
  "use strict";

  const INVERT_FILTER = "invert(98%) hue-rotate(176.4deg)";

  // 1. Ensure InvertPDFActor background module is imported and actor registered
  try {
    ChromeUtils.importESModule("chrome://userscripts/content/services/invertPDF.sys.mjs");
  } catch (e) {
    try {
      ChromeUtils.importESModule("chrome://sine/content/Arc-2.0/invertPDF.sys.mjs");
    } catch (err) {
      console.warn("[Arc-2.0] Failed to import invertPDF.sys.mjs:", err);
    }
  }

  // 2. Toggle Invert function
  async function toggleCurrentTabInvert() {
    const tab = window.gBrowser?.selectedTab;
    const browser = tab?.linkedBrowser || window.gBrowser?.selectedBrowser;
    if (!browser) return;

    let contentHandled = false;

    // A. Try toggling via the InvertPDFActor in the content tab (PDF documents)
    try {
      const actor = browser.browsingContext?.currentWindowGlobal?.getActor("InvertPDFActor");
      if (actor) {
        const reply = await actor.sendQuery("ToggleInvert");
        if (reply && reply.handled) {
          contentHandled = true;
          tab._arcInverted = reply.inverted;
          // Clear any browser-level filter if content handled it
          browser.style.filter = "";
          browser.removeAttribute("arc-inverted");
        }
      }
    } catch (e) {}

    // B. Fallback: Apply inversion directly to the browser element
    if (!contentHandled) {
      tab._arcInverted = !tab._arcInverted;
      if (tab._arcInverted) {
        browser.style.filter = INVERT_FILTER;
        browser.setAttribute("arc-inverted", "true");
      } else {
        browser.style.filter = "";
        browser.removeAttribute("arc-inverted");
      }
    }
  }

  // 3. Hotkey matching function: Ctrl + Alt + Shift + -
  function isMatchingHotkey(e) {
    if (!e.ctrlKey || !e.altKey || !e.shiftKey) return false;

    return (
      e.key === "-" ||
      e.key === "_" ||
      e.code === "Minus" ||
      e.code === "NumpadSubtract" ||
      e.keyCode === 189 ||
      e.keyCode === 109 ||
      e.keyCode === 173
    );
  }

  function onKeyDown(event) {
    if (isMatchingHotkey(event)) {
      event.preventDefault();
      event.stopPropagation();
      toggleCurrentTabInvert();
    }
  }

  // Attach keydown listener in capture phase on window
  window.addEventListener("keydown", onKeyDown, { capture: true });

  // Native XUL key shortcut registration in mainKeyset
  try {
    const keyset = document.getElementById("mainKeyset") || document.querySelector("keyset");
    if (keyset && !document.getElementById("key_arcInvertColors")) {
      const key = document.createXULElement
        ? document.createXULElement("key")
        : document.createElement("key");
      key.id = "key_arcInvertColors";
      key.setAttribute("modifiers", "control,alt,shift");
      key.setAttribute("key", "-");
      key.addEventListener("command", (e) => {
        e.stopPropagation();
        toggleCurrentTabInvert();
      });
      keyset.appendChild(key);
    }
  } catch (e) {}

  // 4. Preserve per-tab invert state when switching tabs
  window.addEventListener("TabSelect", () => {
    const tab = window.gBrowser?.selectedTab;
    const browser = tab?.linkedBrowser;
    if (!browser) return;

    if (tab._arcInverted && browser.hasAttribute("arc-inverted")) {
      browser.style.filter = INVERT_FILTER;
    } else if (!tab._arcInverted && browser.hasAttribute("arc-inverted")) {
      browser.style.filter = "";
    }
  });

  // 5. Observe changes to "arc-border-radius" in about:config and broadcast to tabs
  try {
    const syncRadiusToTabs = () => {
      try {
        const radius = Services.prefs.getStringPref("arc-border-radius", "12px");
        try {
          Services.prefs.getDefaultBranch("").setStringPref("arc-border-radius", radius);
        } catch (err) {}

        for (const tab of window.gBrowser?.tabs || []) {
          try {
            const actor = tab.linkedBrowser?.browsingContext?.currentWindowGlobal?.getActor("InvertPDFActor");
            actor?.sendAsyncMessage("ArcRadiusChanged", { radius });
          } catch (err) {}
        }
      } catch (e) {}
    };

    const radiusObserver = {
      observe(subject, topic, data) {
        if (data === "arc-border-radius") {
          syncRadiusToTabs();
        }
      },
    };
    Services.prefs.addObserver("arc-border-radius", radiusObserver);

    const resolveFontName = (val) => {
      const map = {
        Nunito: "Nunito",
        "Nunito-Italic": "Nunito-Italic",
        "SF-Symbols": "SF-Symbols",
        "SF-Pro": "SF-Pro",
        SUSE: "Suse",
        "SUSE-Italic": "Suse-Italic",
      };
      return map[val] || val || "Nunito";
    };

    const syncFontToTabs = () => {
      try {
        const fontPref = Services.prefs.getStringPref("arc-font", "Nunito");
        const fontName = resolveFontName(fontPref);

        try {
          Services.prefs.getDefaultBranch("").setStringPref("arc-font", fontPref);
        } catch (err) {}

        document.documentElement.style.setProperty("--arc-font", `"${fontName}"`);

        for (const tab of window.gBrowser?.tabs || []) {
          try {
            const actor = tab.linkedBrowser?.browsingContext?.currentWindowGlobal?.getActor("InvertPDFActor");
            actor?.sendAsyncMessage("ArcFontChanged", { font: fontName, pref: fontPref });
          } catch (err) {}
        }
      } catch (e) {}
    };

    const fontObserver = {
      observe(subject, topic, data) {
        if (data === "arc-font") {
          syncFontToTabs();
        }
      },
    };
    Services.prefs.addObserver("arc-font", fontObserver);

    // Initial font sync
    syncFontToTabs();

    window.addEventListener(
      "unload",
      () => {
        try {
          Services.prefs.removeObserver("arc-border-radius", radiusObserver);
          Services.prefs.removeObserver("arc-font", fontObserver);
          window.removeEventListener("keydown", onKeyDown, { capture: true });
        } catch (e) {}
      },
      { once: true }
    );
  } catch (e) {}

  console.log("[Arc-2.0] All-in-one arc.uc.js with Invert Hotkey (Ctrl+Alt+Shift+-) initialized successfully");
})();
