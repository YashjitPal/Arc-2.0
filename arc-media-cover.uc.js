// ==UserScript==
// @name                 Arc Sidebar Media Cover
// @description          Sets media cover art as background for Zen Browser's sidebar media player
// @author               Arc-2.0
// ==/UserScript==

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
      if (
        meta?.artwork &&
        Array.isArray(meta.artwork) &&
        meta.artwork.length > 0
      ) {
        // Find best artwork by size or pick the last one (typically highest resolution)
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
    if (coverUrl) {
      card.style.setProperty(
        "--arc-media-cover-url",
        'url("' + coverUrl + '")',
      );
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
      (tab) =>
        tab.hasAttribute("soundplaying") ||
        tab.linkedBrowser?.browsingContext?.mediaController?.isActive,
    );

    cards.forEach((card, index) => {
      const cardTitle =
        card.querySelector(".zen-media-title")?.textContent?.trim() || "";

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
          toolbar.style.setProperty(
            "--arc-media-cover-url",
            'url("' + cover + '")',
          );
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
      window.gZenMediaController.activateMediaControls = function (
        mediaController,
        browser,
      ) {
        origActivate.apply(this, arguments);

        if (
          mediaController &&
          typeof mediaController.addEventListener === "function"
        ) {
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
