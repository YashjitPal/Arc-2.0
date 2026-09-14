// ==UserScript==
// @name                 Arc 2.0
// @description          All-in-one JavaScript enhancements for Arc 2.0 theme
// @author               Arc-2.0
// @version              3.4
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
   Extracts active playback cover art (MediaSession metadata artwork, YouTube
   video thumbnails, or high-res page icons) and sets it as the dynamic
   background for Zen Browser's sidebar media player controls toolbar.
   Updates in real time when tracks/songs change across all platforms.
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
      const artwork = meta?.artwork;
      if (artwork && artwork.length > 0) {
        let bestSrc = null;
        let maxSize = -1;
        for (let i = 0; i < artwork.length; i++) {
          const item = artwork[i];
          if (!item?.src) continue;
          const size = parseInt(item.sizes) || 0;
          if (size > maxSize || !bestSrc) {
            maxSize = size;
            bestSrc = item.src;
          }
        }
        if (bestSrc) return bestSrc;
      }
    } catch (e) {}

    // 2. YouTube / YouTube Music video thumbnail
    try {
      const url = browser?.currentURI?.spec || "";
      const ytMatch = url.match(
        /(?:youtube\.com\/(?:watch\?.*v=|shorts\/)|youtu\.be\/|music\.youtube\.com\/(?:watch\?.*v=))([a-zA-Z0-9_-]{11})/,
      );
      if (ytMatch && ytMatch[1]) {
        return "https://i.ytimg.com/vi/" + ytMatch[1] + "/hqdefault.jpg";
      }
    } catch (e) {}

    // 3. Tab favicon / page icon fallback
    try {
      const tab =
        browser && window.gBrowser
          ? window.gBrowser.getTabForBrowser(browser)
          : null;
      const icon =
        browser?.mIconURL || (tab ? window.gBrowser.getIcon(tab) : null);
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
    const toolbar = document.getElementById(MEDIA_TOOLBAR_ID);
    if (coverUrl) {
      const cssVal = 'url("' + coverUrl + '")';
      card.style.setProperty("--arc-media-cover-url", cssVal);
      card.setAttribute("has-cover", "true");
      if (toolbar) {
        toolbar.style.setProperty("--arc-media-cover-url", cssVal);
      }
    } else {
      card.style.removeProperty("--arc-media-cover-url");
      card.removeAttribute("has-cover");
    }
  }

  /**
   * Update cover art for a specific card using its direct controller/browser.
   */
  function updateCardCover(cardInstance) {
    if (!cardInstance) return;
    const element = cardInstance.element;
    if (!element) return;

    const cover = extractCoverUrl(
      cardInstance.controller,
      cardInstance.browser,
    );
    applyCoverToCard(element, cover);
  }

  /**
   * Synchronize all active cards with their playing media sessions.
   */
  function syncAllCards() {
    const toolbar = document.getElementById(MEDIA_TOOLBAR_ID);
    if (!toolbar) return;

    const cards = toolbar.querySelectorAll(".zen-media-card:not([hidden])");
    if (!cards.length) return;

    const tabsWithMedia = Array.from(window.gBrowser?.tabs || []).filter(
      (tab) =>
        tab.hasAttribute("soundplaying") ||
        tab.linkedBrowser?.browsingContext?.mediaController?.isActive,
    );

    cards.forEach((cardEl, index) => {
      // 1. Check if card element has direct references attached
      let browser = cardEl._arcBrowser;
      let controller = cardEl._arcController;

      // 2. If not directly attached, match against active media tabs
      if (!browser && tabsWithMedia.length > 0) {
        const cardTitle =
          cardEl.querySelector(".zen-media-title")?.textContent?.trim() || "";

        let matchedTab = tabsWithMedia.find((tab) => {
          const c = tab.linkedBrowser?.browsingContext?.mediaController;
          const meta = c?.getMetadata?.();
          return (
            (meta?.title && meta.title.trim() === cardTitle) ||
            (tab.label && tab.label.trim() === cardTitle)
          );
        });

        if (!matchedTab && tabsWithMedia[index]) {
          matchedTab = tabsWithMedia[index];
        } else if (!matchedTab && tabsWithMedia.length === 1) {
          matchedTab = tabsWithMedia[0];
        }

        if (matchedTab) {
          browser = matchedTab.linkedBrowser;
          controller = browser?.browsingContext?.mediaController;
          cardEl._arcBrowser = browser;
          cardEl._arcController = controller;
        }
      }

      if (browser || controller) {
        const cover = extractCoverUrl(controller, browser);
        applyCoverToCard(cardEl, cover);
      }
    });
  }

  /**
   * Hook ZenMediaCard.prototype so every metadata change event immediately updates cover art.
   */
  function tryHookCardPrototype() {
    const card = window.gZenMediaController?.frontCard;
    if (!card) return false;
    const proto = Object.getPrototypeOf(card);
    if (!proto || proto._arcCoverHooked) return true;

    const origUpdateMetadata = proto.updateMetadata;
    if (typeof origUpdateMetadata === "function") {
      proto.updateMetadata = function () {
        const res = origUpdateMetadata.apply(this, arguments);
        try {
          updateCardCover(this);
        } catch (e) {}
        return res;
      };
    }

    proto._arcCoverHooked = true;
    return true;
  }

  /**
   * Intercept Zen's controller to hook into every media session.
   */
  function hookZenMediaController() {
    if (!window.gZenMediaController) return false;

    // Try hooking prototype immediately if a card already exists
    tryHookCardPrototype();

    const origActivate = window.gZenMediaController.activateMediaControls;
    if (origActivate && !origActivate._arcHooked) {
      window.gZenMediaController.activateMediaControls = function (
        mediaController,
        browser,
      ) {
        const toolbar = document.getElementById(MEDIA_TOOLBAR_ID);
        const prevCount = toolbar?.children?.length || 0;

        origActivate.apply(this, arguments);

        // Track the newly created card element and associate browser/controller
        if (toolbar && toolbar.children.length > prevCount) {
          const newCardEl = toolbar.lastElementChild;
          if (newCardEl && newCardEl.classList.contains("zen-media-card")) {
            newCardEl._arcBrowser = browser;
            newCardEl._arcController = mediaController;
          }
        }

        // Try hooking card prototype as soon as first card is created
        tryHookCardPrototype();

        // Attach direct listeners on the mediaController for real-time changes
        if (
          mediaController &&
          typeof mediaController.addEventListener === "function"
        ) {
          const onMediaEvent = () => {
            tryHookCardPrototype();
            syncAllCards();
            requestAnimationFrame(() => syncAllCards());
          };
          mediaController.addEventListener("metadatachange", onMediaEvent);
          mediaController.addEventListener("playbackstatechange", onMediaEvent);
          mediaController.addEventListener("positionstatechange", onMediaEvent);
        }

        setTimeout(syncAllCards, 50);
        setTimeout(syncAllCards, 300);
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
      }, 300);
      setTimeout(() => clearInterval(hookTimer), 10000);
    }

    // Observe toolbar DOM mutations (cards added/removed/shown, AND title/artist text changes)
    const toolbar = document.getElementById(MEDIA_TOOLBAR_ID);
    if (toolbar) {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (
            mutation.type === "childList" ||
            mutation.type === "characterData" ||
            (mutation.type === "attributes" &&
              (mutation.attributeName === "class" ||
                mutation.attributeName === "hidden" ||
                mutation.attributeName === "playing"))
          ) {
            tryHookCardPrototype();
            syncAllCards();
            break;
          }
        }
      });

      observer.observe(toolbar, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["class", "hidden", "playing"],
      });
    }

    // Listen to tab audio events
    window.addEventListener("TabAttrModified", (event) => {
      if (event.detail?.changed?.includes("soundplaying")) {
        tryHookCardPrototype();
        setTimeout(syncAllCards, 150);
      }
    });

    window.addEventListener("TabSelect", () => {
      tryHookCardPrototype();
      setTimeout(syncAllCards, 200);
    });

    // Periodic heartbeat sync (every 2.5s) while media is actively playing
    setInterval(() => {
      const playingCard = document.querySelector(
        `#${MEDIA_TOOLBAR_ID} .zen-media-card.playing:not([hidden])`,
      );
      if (playingCard) {
        tryHookCardPrototype();
        syncAllCards();
      }
    }, 2500);

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
     PDF documents ONLY. Pressing it inverts colors, and pressing it again
     restores the original colors.
   - For PDF documents, inverts PDF pages with color-preserving hue rotation
     and optimized highlight colors via InvertPDFActor.
   - Non-PDF web pages are unaffected (handled by addons like Dark Reader).
   - Live-syncs --arc-border-radius and --arc-font from about:config to all tabs.
   ========================================================================== */
(function () {
  "use strict";

  // 1. Ensure InvertPDFActor background module is imported and actor registered
  try {
    ChromeUtils.importESModule(
      "chrome://userscripts/content/services/invertPDF.sys.mjs",
    );
  } catch (e) {
    try {
      ChromeUtils.importESModule(
        "chrome://sine/content/Arc-2.0/invertPDF.sys.mjs",
      );
    } catch (err) {
      console.warn("[Arc-2.0] Failed to import invertPDF.sys.mjs:", err);
    }
  }

  const INVERT_FILTER = "invert(98%) hue-rotate(176.4deg)";

  // 2. Toggle Invert function (PDFs ONLY — URL must end with .pdf)
  async function toggleCurrentTabInvert() {
    const tab = window.gBrowser?.selectedTab;
    const browser = tab?.linkedBrowser || window.gBrowser?.selectedBrowser;
    if (!browser) return;

    // Guard: Only activate on URLs ending with .pdf
    const url = (browser.currentURI?.spec || "").toLowerCase();
    const isPdfUrl =
      url.endsWith(".pdf") ||
      url.includes(".pdf?") ||
      url.includes(".pdf#") ||
      url.startsWith("resource://pdf.js/") ||
      url.startsWith("chrome://pdfjs/");
    if (!isPdfUrl) return;

    let contentHandled = false;

    // A. Try toggling via InvertPDFActor (preserves PDF toolbar styling)
    try {
      const actor =
        browser.browsingContext?.currentWindowGlobal?.getActor(
          "InvertPDFActor",
        );
      if (actor) {
        const reply = await actor.sendQuery("ToggleInvert");
        if (reply && reply.handled) {
          contentHandled = true;
          tab._arcInverted = reply.inverted;
          browser.style.filter = "";
          browser.removeAttribute("arc-inverted");
        }
      }
    } catch (e) {}

    // B. Fallback: Apply filter directly to the browser element.
    //    Safe because the URL guard above ensures this only runs on PDF pages.
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
    const keyset =
      document.getElementById("mainKeyset") || document.querySelector("keyset");
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

  // Preserve per-tab invert state when switching tabs
  window.addEventListener("TabSelect", () => {
    const tab = window.gBrowser?.selectedTab;
    const browser = tab?.linkedBrowser;
    if (!browser) return;

    if (tab._arcInverted) {
      browser.style.filter = INVERT_FILTER;
      browser.setAttribute("arc-inverted", "true");
    } else {
      browser.style.filter = "";
      browser.removeAttribute("arc-inverted");
    }
  });

  // 4. Observe changes to "arc-border-radius" in about:config and broadcast to tabs
  try {
    const syncRadiusToTabs = () => {
      try {
        const radius = Services.prefs.getStringPref(
          "arc-border-radius",
          "12px",
        );

        for (const tab of window.gBrowser?.tabs || []) {
          try {
            const actor =
              tab.linkedBrowser?.browsingContext?.currentWindowGlobal?.getActor(
                "InvertPDFActor",
              );
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

        document.documentElement.style.setProperty(
          "--arc-font",
          `"${fontName}"`,
        );

        for (const tab of window.gBrowser?.tabs || []) {
          try {
            const actor =
              tab.linkedBrowser?.browsingContext?.currentWindowGlobal?.getActor(
                "InvertPDFActor",
              );
            actor?.sendAsyncMessage("ArcFontChanged", {
              font: fontName,
              pref: fontPref,
            });
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
      { once: true },
    );
  } catch (e) {}

  console.log(
    "[Arc-2.0] All-in-one arc.uc.js with PDF-Only Invert Hotkey (Ctrl+Alt+Shift+-) initialized successfully",
  );
})();

/* ==========================================================================
   MODULE 4: Stylesheet Auto-Setup (userChrome.css, userContent.css & Preferences)
   --------------------------------------------------------------------------
   Sine mod manager installs themes into `chrome/sine-mods/Arc-2.0/`, but
   does not create native `<profile>/chrome/userChrome.css` or `userContent.css`.
   Because Gecko's PDF Viewer (`resource://pdf.js/web/viewer.html`) is a resource
   document, it requires a user content stylesheet (userContent.css) to apply theme
   styling (such as betterpdf.css floating glass toolbar, rounded corners, and blurs).
   Auto-creating both `userChrome.css` and `userContent.css` ensures Arc-2.0 remains
   fully functional regardless of future browser updates or mod loader changes.
   Furthermore, Arc-2.0 relies on specific Gecko preferences for translucency
   and window appearance.
   This module ensures:
   1. `browser.tabs.allow_transparent_browser` is enabled (true) for translucency.
   2. `layout.css.corner-shape.enabled` is disabled (false) so custom border radius applies.
   3. `widget.windows.pip-decorations.enabled` is enabled (true) for PiP rounded corners.
   4. `toolkit.legacyUserProfileCustomizations.stylesheets` is enabled.
   5. `<profile>/chrome/userChrome.css` automatically exists and imports Arc-2.0.
   6. `<profile>/chrome/userContent.css` automatically exists and imports Arc-2.0.
   7. Arc-2.0's userContent.css is dynamically registered via nsIStyleSheetService
      so styles apply immediately to all content and PDF viewer pages.
   ========================================================================== */
(function () {
  "use strict";

  try {
    // 1. Configure initial Arc-2.0 recommended preferences
    const arcInitPref = "arc.theme.initialized-defaults";
    if (!Services.prefs.getBoolPref(arcInitPref, false)) {
      Services.prefs.setBoolPref("browser.tabs.allow_transparent_browser", true);
      Services.prefs.setBoolPref("layout.css.corner-shape.enabled", false);
      Services.prefs.setBoolPref("widget.windows.pip-decorations.enabled", true);
      Services.prefs.setBoolPref("browser.tabs.fadeOutUnloadedTabs", true);
      Services.prefs.setBoolPref(arcInitPref, true);
    }

    // Always ensure critical stylesheet customization is enabled
    if (
      !Services.prefs.getBoolPref(
        "toolkit.legacyUserProfileCustomizations.stylesheets",
        false,
      )
    ) {
      Services.prefs.setBoolPref(
        "toolkit.legacyUserProfileCustomizations.stylesheets",
        true,
      );
    }

        // Ensure fadeOutUnloadedTabs is true by default unless user explicitly changed it
    if (!Services.prefs.prefHasUserValue("browser.tabs.fadeOutUnloadedTabs")) {
      Services.prefs.setBoolPref("browser.tabs.fadeOutUnloadedTabs", true);
    }

    const chromeDir = Services.dirsvc.get("UChrm", Ci.nsIFile);

    // 2. Helper to ensure chrome/*.css exists and imports Arc-2.0
    function ensureStylesheetImport(fileName, importRelativePath) {
      try {
        const targetFile = chromeDir.clone();
        targetFile.append(fileName);

        const importLine = `@import "${importRelativePath}";\n`;
        let shouldWrite = false;
        let existingContent = "";

        if (!targetFile.exists()) {
          existingContent = importLine;
          shouldWrite = true;
        } else {
          const fstream = Cc[
            "@mozilla.org/network/file-input-stream;1"
          ].createInstance(Ci.nsIFileInputStream);
          const cstream = Cc[
            "@mozilla.org/intl/converter-input-stream;1"
          ].createInstance(Ci.nsIConverterInputStream);
          fstream.init(targetFile, -1, 0, 0);
          cstream.init(fstream, "UTF-8", 1024, 0);
          let str = {};
          while (cstream.readString(1024, str) > 0) {
            existingContent += str.value;
          }
          cstream.close();
          fstream.close();

          if (!existingContent.includes(importRelativePath)) {
            existingContent = importLine + existingContent;
            shouldWrite = true;
          }
        }

        if (shouldWrite) {
          const ostream = Cc[
            "@mozilla.org/network/file-output-stream;1"
          ].createInstance(Ci.nsIFileOutputStream);
          const costream = Cc[
            "@mozilla.org/intl/converter-output-stream;1"
          ].createInstance(Ci.nsIConverterOutputStream);
          ostream.init(targetFile, 0x02 | 0x08 | 0x20, 0o644, 0);
          costream.init(ostream, "UTF-8", 0, 0);
          costream.writeString(existingContent);
          costream.close();
          ostream.close();
        }
      } catch (err) {
        console.warn(`[Arc-2.0] Failed to ensure chrome/${fileName}:`, err);
      }
    }

    // Ensure both userChrome.css and userContent.css exist and import Arc-2.0
    ensureStylesheetImport("userChrome.css", "sine-mods/Arc-2.0/userChrome.css");
    ensureStylesheetImport("userContent.css", "sine-mods/Arc-2.0/userContent.css");

    // 3. Dynamically register Arc-2.0 userContent.css via nsIStyleSheetService
    try {
      const sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(
        Ci.nsIStyleSheetService,
      );
      const arcContentFile = chromeDir.clone();
      arcContentFile.append("sine-mods");
      arcContentFile.append("Arc-2.0");
      arcContentFile.append("userContent.css");

      if (arcContentFile.exists()) {
        const sheetURI = Services.io.newFileURI(arcContentFile);
        if (!sss.sheetRegistered(sheetURI, sss.USER_SHEET)) {
          sss.loadAndRegisterSheet(sheetURI, sss.USER_SHEET);
        }
      }
    } catch (err) {
      console.warn(
        "[Arc-2.0] Failed to dynamically register userContent.css via sss:",
        err,
      );
    }
  } catch (e) {
    console.warn("[Arc-2.0] Stylesheet auto-setup error:", e);
  }
})();

/* ==========================================================================
   MODULE 5: Tab Lifecycle Management (Auto-Unload & Auto-Clean)
   --------------------------------------------------------------------------
   Real-time, event-driven lifecycle management for tabs across all workspaces:
   1. Auto-Unload: Discards inactive regular tabs from memory after user-defined
      time (e.g. 30s, 15m, 1h, 1d).
      - Pinned and Essential tabs can optionally be included via checkbox.
      - Countdown starts when the user activates/updates the duration pref or
        when the tab becomes inactive (no instant retroactive unloading).
   2. Auto-Clean: Strictly cleans (closes) ONLY tabs that are ALREADY UNLOADED,
      tracking the exact timestamp each tab was unloaded via SessionStore.
      - Pinned and Essential tabs can optionally be included via checkbox.
      - Countdown starts when the user activates/updates the clean duration pref
        or when the tab is unloaded (no instant retroactive closing).
   3. Real-Time Scheduler: Calculates the exact millisecond wakeup time so tabs
      unload and clean instantly at the exact second they expire.
   4. Exclusions: Active/selected tab, playing media, WebRTC sharing, PiP, and
      Zen empty placeholder tabs are strictly protected.
   5. Setting duration to 0 disables that feature with zero background overhead.
   ========================================================================== */
(function () {
  "use strict";

  const PREF_AUTO_UNLOAD = "arc-tab-auto-unload";
  const PREF_AUTO_CLEAN = "arc-tab-auto-clean";
  const PREF_AUTO_UNLOAD_PINNED = "arc-tab-auto-unload-pinned";
  const PREF_AUTO_CLEAN_PINNED = "arc-tab-auto-clean-pinned";
  const SESSION_STORE_KEY = "arcUnloadedAt";

  let gSchedulerTimer = null;

  // Activation timestamps to prevent instant retroactive unload/clean when user inputs duration
  let gUnloadPrefActivatedAt = Date.now();
  let gCleanPrefActivatedAt = Date.now();
  let gLastUnloadMs = -1;
  let gLastCleanMs = -1;

  /**
   * Helper to resolve SessionStore safely.
   */
  function getSessionStore() {
    if (window.SessionStore) return window.SessionStore;
    try {
      return ChromeUtils.importESModule(
        "resource:///modules/sessionstore/SessionStore.sys.mjs",
      ).SessionStore;
    } catch (e) {
      return null;
    }
  }

  /**
   * Parse a duration string with unit suffix into milliseconds.
   * Units: 's' (seconds), 'm' (minutes), 'h' (hours), 'd' (days).
   * Pure numbers default to minutes. Returns 0 if disabled or invalid.
   */
  function parseDurationToMs(prefValue) {
    if (typeof prefValue === "number") {
      return prefValue > 0 ? Math.round(prefValue * 60 * 1000) : 0;
    }
    if (!prefValue || typeof prefValue !== "string") return 0;

    const trimmed = prefValue.trim().toLowerCase();
    if (!trimmed || trimmed === "0" || trimmed === "false") return 0;

    const match = trimmed.match(/^([0-9]+(?:\.[0-9]+)?)\s*([a-z]+)?$/);
    if (!match) return 0;

    const num = parseFloat(match[1]);
    if (isNaN(num) || num <= 0) return 0;

    const unit = match[2] || "m";
    switch (unit) {
      case "s":
      case "sec":
      case "secs":
      case "second":
      case "seconds":
        return Math.round(num * 1000);

      case "m":
      case "min":
      case "mins":
      case "minute":
      case "minutes":
        return Math.round(num * 60 * 1000);

      case "h":
      case "hr":
      case "hrs":
      case "hour":
      case "hours":
        return Math.round(num * 3600 * 1000);

      case "d":
      case "day":
      case "days":
        return Math.round(num * 86400 * 1000);

      default:
        return Math.round(num * 60 * 1000);
    }
  }

  /**
   * Safely retrieve the duration in ms for a given preference name.
   */
  function getPrefDurationMs(prefName) {
    try {
      const type = Services.prefs.getPrefType(prefName);
      if (type === 32) {
        // String
        return parseDurationToMs(Services.prefs.getStringPref(prefName));
      } else if (type === 64) {
        // Integer
        return parseDurationToMs(Services.prefs.getIntPref(prefName));
      }
      return 0;
    } catch (e) {
      return 0;
    }
  }

  /**
   * Check if a tab is currently unloaded / discarded from memory.
   */
  function isTabDiscarded(tab) {
    return (
      tab.hasAttribute("pending") ||
      tab.hasAttribute("discarded") ||
      !tab.linkedBrowser?.isRemoteBrowser
    );
  }

  /**
   * Check if a tab is pinned or a Zen Essential tab.
   */
  function isPinnedOrEssential(tab) {
    return (
      tab.pinned ||
      tab.hasAttribute("pinned") ||
      tab.hasAttribute("zen-essential") ||
      tab.getAttribute("zen-essential") === "true"
    );
  }

  /**
   * Universal protection check.
   * Strictly protects active tabs, playing media, WebRTC sharing, PiP, empty tabs, busy, crashed.
   */
  function isProtectedTab(tab) {
    if (!tab || tab.closing || !tab.isConnected) return true;

    // 1. Never touch active/selected tab in the window
    if (tab.selected || tab === window.gBrowser?.selectedTab) return true;

    // 2. Never touch Zen Glance or placeholder empty tabs
    if (tab.hasAttribute("zen-glance-tab") || tab.hasAttribute("zen-empty-tab")) {
      return true;
    }

    // 3. Never touch tabs playing audio or active media sessions
    if (
      tab.hasAttribute("soundplaying") ||
      tab.soundPlaying ||
      tab.linkedBrowser?.browsingContext?.mediaController?.isPlaying
    ) {
      return true;
    }

    // 4. Never touch WebRTC sharing tabs (camera, microphone, screen sharing)
    if (tab.hasAttribute("sharing")) return true;

    // 5. Never touch Picture-in-Picture tabs
    if (tab.hasAttribute("pictureinpicture")) return true;

    // 6. Never touch busy/loading or crashed tabs
    if (tab.hasAttribute("busy") || tab.hasAttribute("crashed")) return true;

    return false;
  }

  /**
   * Get the timestamp when a tab was unloaded.
   * Checks in-memory cache first, then SessionStore.
   */
  function getTabUnloadedAt(tab) {
    if (typeof tab._arcUnloadedAt === "number" && tab._arcUnloadedAt > 0) {
      return tab._arcUnloadedAt;
    }
    const ss = getSessionStore();
    if (ss) {
      try {
        const saved = ss.getCustomTabValue(tab, SESSION_STORE_KEY);
        if (saved) {
          const ts = parseInt(saved, 10);
          if (!isNaN(ts) && ts > 0) {
            tab._arcUnloadedAt = ts;
            return ts;
          }
        }
      } catch (e) {}
    }
    return null;
  }

  /**
   * Record or clear the timestamp when a tab was unloaded.
   */
  function setTabUnloadedAt(tab, timestamp) {
    tab._arcUnloadedAt = timestamp || null;
    const ss = getSessionStore();
    if (ss) {
      try {
        if (timestamp) {
          ss.setCustomTabValue(tab, SESSION_STORE_KEY, String(timestamp));
        } else {
          ss.deleteCustomTabValue(tab, SESSION_STORE_KEY);
        }
      } catch (e) {}
    }
  }

  /**
   * Core lifecycle processor.
   * Evaluates all tabs, performs due actions, and schedules the exact next wakeup.
   */
  function checkTabsLifecycle() {
    if (!window.gBrowser?.tabs) return;

    if (gSchedulerTimer) {
      clearTimeout(gSchedulerTimer);
      gSchedulerTimer = null;
    }

    const unloadMs = getPrefDurationMs(PREF_AUTO_UNLOAD);
    const cleanMs = getPrefDurationMs(PREF_AUTO_CLEAN);
    const allowUnloadPinned = Services.prefs.getBoolPref(PREF_AUTO_UNLOAD_PINNED, false);
    const allowCleanPinned = Services.prefs.getBoolPref(PREF_AUTO_CLEAN_PINNED, false);

    // If both features are disabled, nothing to process or schedule
    if (unloadMs <= 0 && cleanMs <= 0) return;

    const now = Date.now();
    let nextWakeupMs = Infinity;

    const allTabs = Array.from(window.gBrowser.tabs);

    for (const tab of allTabs) {
      if (isProtectedTab(tab)) continue;

      const pinnedOrEssential = isPinnedOrEssential(tab);
      const discarded = isTabDiscarded(tab);

      if (discarded) {
        // ====================================================================
        // UNLOADED TAB: Target for Auto-Clean
        // ====================================================================
        if (cleanMs > 0) {
          // If pinned/essential, only clean if user explicitly enabled it
          if (pinnedOrEssential && !allowCleanPinned) {
            continue;
          }

          let unloadedAt = getTabUnloadedAt(tab);
          if (!unloadedAt) {
            unloadedAt = tab.lastAccessed || now;
            setTabUnloadedAt(tab, unloadedAt);
          }

          // Inactivity starts from when tab became unloaded, but NOT earlier
          // than when the user activated/changed the Auto-Clean duration pref.
          const effectiveUnloadedStart = Math.max(unloadedAt, gCleanPrefActivatedAt);
          const timeSinceUnloaded = now - effectiveUnloadedStart;

          if (timeSinceUnloaded >= cleanMs) {
            // Safety: Never close the only remaining tab in the browser
            if (window.gBrowser.tabs.length > 1 && !tab.hasAttribute("zen-empty-tab")) {
              try {
                const kind = pinnedOrEssential ? "pinned/essential" : "regular";
                console.log(
                  `[Arc-2.0] Auto-cleaning unloaded ${kind} tab: "${tab.label}" (unloaded for ${Math.round(timeSinceUnloaded / 1000)}s)`,
                );
                setTabUnloadedAt(tab, null);
                window.gBrowser.removeTab(tab, { animate: true });
                continue; // Tab closed
              } catch (e) {
                console.warn("[Arc-2.0] Auto-clean error:", e);
              }
            }
          } else {
            const remainingClean = cleanMs - timeSinceUnloaded;
            nextWakeupMs = Math.min(nextWakeupMs, remainingClean);
          }
        }
      } else {
        // ====================================================================
        // LOADED TAB: Skipped by Auto-Clean, Target for Auto-Unload
        // ====================================================================
        if (unloadMs > 0) {
          // If pinned/essential, only unload if user explicitly enabled it
          if (pinnedOrEssential && !allowUnloadPinned) {
            continue;
          }

          const lastAccessed = tab.lastAccessed || now;

          // Inactivity starts from when tab became inactive, but NOT earlier
          // than when the user activated/changed the Auto-Unload duration pref.
          const effectiveInactiveStart = Math.max(lastAccessed, gUnloadPrefActivatedAt);
          const inactiveDuration = now - effectiveInactiveStart;

          if (inactiveDuration >= unloadMs) {
            try {
              const kind = pinnedOrEssential ? "pinned/essential" : "regular";
              console.log(
                `[Arc-2.0] Auto-unloading inactive ${kind} tab: "${tab.label}" (inactive for ${Math.round(inactiveDuration / 1000)}s)`,
              );
              setTabUnloadedAt(tab, now);
              window.gBrowser.discardBrowser(tab, true);

              // Now that it is unloaded, if Auto-Clean is active, schedule for cleanMs
              if (cleanMs > 0 && (!pinnedOrEssential || allowCleanPinned)) {
                nextWakeupMs = Math.min(nextWakeupMs, cleanMs);
              }
            } catch (e) {
              console.warn("[Arc-2.0] Auto-unload error:", e);
            }
          } else {
            const remainingUnload = unloadMs - inactiveDuration;
            nextWakeupMs = Math.min(nextWakeupMs, remainingUnload);
          }
        }
      }
    }

    // Schedule the next real-time wakeup if there are pending actions
    if (nextWakeupMs !== Infinity) {
      // Clamp between 250ms (responsive) and 5000ms (heartbeat max)
      const sleepTime = Math.max(250, Math.min(nextWakeupMs, 5000));
      gSchedulerTimer = setTimeout(checkTabsLifecycle, sleepTime);
    }
  }

  /**
   * Request an immediate check (debounced).
   */
  function scheduleImmediateCheck(delayMs = 150) {
    if (gSchedulerTimer) {
      clearTimeout(gSchedulerTimer);
      gSchedulerTimer = null;
    }
    gSchedulerTimer = setTimeout(checkTabsLifecycle, delayMs);
  }

  function init() {
    // Record initial preference values
    gLastUnloadMs = getPrefDurationMs(PREF_AUTO_UNLOAD);
    gLastCleanMs = getPrefDurationMs(PREF_AUTO_CLEAN);
    gUnloadPrefActivatedAt = Date.now();
    gCleanPrefActivatedAt = Date.now();

    // 1. Listen for tab unload events to record exact unloaded timestamps
    window.addEventListener("TabBrowserDiscarded", (event) => {
      const tab = event.target;
      if (tab) {
        setTabUnloadedAt(tab, Date.now());
      }
      scheduleImmediateCheck(200);
    });

    // 2. Listen for tab selection: clear unloaded timestamp when tab is restored
    window.addEventListener("TabSelect", (event) => {
      const tab = event.target;
      if (tab) {
        setTabUnloadedAt(tab, null);
      }
      scheduleImmediateCheck(200);
    });

    // 3. Tab open / close events
    window.addEventListener("TabOpen", () => scheduleImmediateCheck(300));
    window.addEventListener("TabClose", () => scheduleImmediateCheck(300));

    // 4. Observe preference changes for immediate real-time response
    const prefObserver = {
      observe(subject, topic, data) {
        if (data === PREF_AUTO_UNLOAD || data === PREF_AUTO_UNLOAD_PINNED) {
          const newUnloadMs = getPrefDurationMs(PREF_AUTO_UNLOAD);
          if (newUnloadMs !== gLastUnloadMs || data === PREF_AUTO_UNLOAD_PINNED) {
            gLastUnloadMs = newUnloadMs;
            // Reset activation timestamp so existing tabs are not unloaded instantly retroactively
            gUnloadPrefActivatedAt = Date.now();
          }
          scheduleImmediateCheck(50);
        } else if (data === PREF_AUTO_CLEAN || data === PREF_AUTO_CLEAN_PINNED) {
          const newCleanMs = getPrefDurationMs(PREF_AUTO_CLEAN);
          if (newCleanMs !== gLastCleanMs || data === PREF_AUTO_CLEAN_PINNED) {
            gLastCleanMs = newCleanMs;
            // Reset activation timestamp so existing unloaded tabs are not cleaned instantly retroactively
            gCleanPrefActivatedAt = Date.now();
          }
          scheduleImmediateCheck(50);
        }
      },
    };
    try {
      Services.prefs.addObserver(PREF_AUTO_UNLOAD, prefObserver);
      Services.prefs.addObserver(PREF_AUTO_CLEAN, prefObserver);
      Services.prefs.addObserver(PREF_AUTO_UNLOAD_PINNED, prefObserver);
      Services.prefs.addObserver(PREF_AUTO_CLEAN_PINNED, prefObserver);
    } catch (e) {}

    // 5. Initial check
    scheduleImmediateCheck(1000);
  }

  // Execute init() immediately
  try {
    init();
  } catch (e) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
      init();
    } else {
      window.addEventListener("DOMContentLoaded", init, { once: true });
      window.addEventListener("load", init, { once: true });
    }
  }
})();
