/**
 * @file JSWindowActor for inverting PDF Viewer colors and synchronizing Arc preferences.
 */

export class InvertPDFActorChild extends JSWindowActorChild {
  static config = {
    filter: "invert(98%) hue-rotate(176.4deg)",
    highlightColors: {
      yellow: "hsl(64, 70%, 50%)",
      green: "hsl(156.6, 100%, 66.3%)",
      blue: "hsl(189.4, 100%, 75.1%)",
      pink: "hsl(300, 70%, 85%)",
      red: "hsl(350, 80%, 85%)",
    },
    fontMap: {
      Nunito: "Nunito",
      "Nunito-Italic": "Nunito-Italic",
      "SF-Symbols": "SF-Symbols",
      "SF-Pro": "SF-Pro",
      SUSE: "Suse",
      "SUSE-Italic": "Suse-Italic",
    },
    prefVars: {
      "arc-border-radius": "12px",
      "arc-findbar-bg": "light-dark(rgba(255,255,255,0.5), rgba(0,0,0,0.5))",
      "arc-findbar-blur": "10px",
      "arc-findbar-saturate": "1",
      "arc-findbar-contrast": "1",
    },
  };

  handleEvent(event) {
    if (event.type === "DOMContentLoaded" || event.type === "pageshow") {
      if (!this.isInternalOrPdf()) return;
      this.initStyles();
      this.syncPrefs();
      this.syncFont();
    }
  }

  isPdf() {
    const doc = this.document;
    if (!doc) return false;
    const origin = doc.nodePrincipal?.originNoSuffix || "";
    return (
      origin === "resource://pdf.js" ||
      origin === "chrome://pdfjs" ||
      (doc.documentURI || "").toLowerCase().includes("pdf.js") ||
      (doc.location?.href || "").toLowerCase().includes("pdf.js") ||
      !!doc.getElementById?.("viewerContainer")
    );
  }

  isInternalOrPdf() {
    const doc = this.document;
    if (!doc) return false;
    const uri = (doc.documentURI || doc.location?.href || "").toLowerCase();
    return (
      uri.startsWith("about:") ||
      uri.startsWith("chrome://") ||
      uri.startsWith("resource://pdf.js") ||
      this.isPdf()
    );
  }

  readPrefValue(prefName, fallback) {
    try {
      const type = Services.prefs.getPrefType(prefName);
      if (type === Services.prefs.PREF_STRING) {
        return Services.prefs.getStringPref(prefName, String(fallback));
      }
      if (type === Services.prefs.PREF_INT) {
        return String(Services.prefs.getIntPref(prefName, Number(fallback) || 0));
      }
      if (type === Services.prefs.PREF_BOOL) {
        return String(Services.prefs.getBoolPref(prefName, Boolean(fallback)));
      }
    } catch (e) {}
    return String(fallback);
  }

  syncFont() {
    try {
      const doc = this.document;
      if (!doc || !this.isInternalOrPdf()) return;
      const prefVal = this.readPrefValue("arc-font", "Nunito");
      const font =
        InvertPDFActorChild.config.fontMap[prefVal] || prefVal || "Nunito";
      doc.documentElement?.style?.setProperty("--arc-font", `"${font}"`, "important");
    } catch (e) {}
  }

  syncPrefs() {
    try {
      const doc = this.document;
      if (!doc || !this.isInternalOrPdf()) return;
      const style = doc.documentElement?.style;
      if (!style) return;

      for (const [prefName, fallback] of Object.entries(
        InvertPDFActorChild.config.prefVars,
      )) {
        const val = this.readPrefValue(prefName, fallback);
        if (val) {
          style.setProperty(`--${prefName}`, val, "important");
        }
      }
    } catch (e) {}
  }

  syncRadius() {
    this.syncPrefs();
  }

  initStyles() {
    const doc = this.document;
    if (!doc || !this.isPdf() || doc.getElementById("arcInvertStyles")) return;

    const { highlightColors, filter } = InvertPDFActorChild.config;
    const style = doc.createElement("style");
    style.id = "arcInvertStyles";
    style.textContent = `
      :root[data-inverted] .pdfViewer,
      :root[data-inverted] #thumbnailView .thumbnailImage,
      :root[data-inverted] .editToolbar,
      :root[data-inverted] .freeTextEditor,
      :root[data-inverted] .inkEditorCanvas {
        filter: ${filter} !important;
      }

      :root[data-inverted] .highlight[fill="#FFFF98"] { fill: ${highlightColors.yellow} !important; }
      :root[data-inverted] .highlight[fill="#53FFBC"] { fill: ${highlightColors.green} !important; }
      :root[data-inverted] .highlight[fill="#80EBFF"] { fill: ${highlightColors.blue} !important; }
      :root[data-inverted] .highlight[fill="#FFCBE6"] { fill: ${highlightColors.pink} !important; }
      :root[data-inverted] .highlight[fill="#FF4F5F"] { fill: ${highlightColors.red} !important; }

      :root[data-inverted] .annotationEditorLayer :is(.freeTextEditor, .inkEditor, .stampEditor):is(.selectedEditor::before, > .resizers) {
        filter: ${filter} !important;
      }
    `;
    doc.head?.appendChild(style);
  }

  receiveMessage(message) {
    if (message.name === "ToggleInvert") {
      const doc = this.document;
      if (!doc || !this.isPdf()) return { handled: false };

      this.initStyles();

      const isInverted = doc.documentElement.hasAttribute("data-inverted");
      if (isInverted) {
        doc.documentElement.removeAttribute("data-inverted");
        doc.documentElement.classList.remove("pdf-invert-colors");
      } else {
        doc.documentElement.setAttribute("data-inverted", "true");
        doc.documentElement.classList.add("pdf-invert-colors");
      }
      return { handled: true, inverted: !isInverted };
    }

    if (message.name === "ArcRadiusChanged") {
      if (this.isInternalOrPdf()) {
        this.document?.documentElement?.style?.setProperty(
          "--arc-border-radius",
          message.data?.radius || "12px",
          "important",
        );
      }
    }

    if (message.name === "ArcPrefsChanged") {
      if (this.isInternalOrPdf()) {
        const style = this.document?.documentElement?.style;
        const prefs = message.data?.prefs;
        if (style && prefs && typeof prefs === "object") {
          for (const [k, v] of Object.entries(prefs)) {
            if (v !== undefined && v !== null && v !== "") {
              style.setProperty(`--${k}`, String(v), "important");
            }
          }
        } else {
          this.syncPrefs();
        }
      }
    }

    if (message.name === "ArcFontChanged") {
      if (this.isInternalOrPdf()) {
        this.document?.documentElement?.style?.setProperty(
          "--arc-font",
          `"${message.data?.font || "Nunito"}"`,
          "important",
        );
      }
    }
    return null;
  }
}

export class InvertPDFActorParent extends JSWindowActorParent {
  receiveMessage() {
    return null;
  }
}

if (Services.appinfo.processType === Services.appinfo.PROCESS_TYPE_DEFAULT) {

  let esModuleURI = import.meta.url;
  try {
    ChromeUtils.registerWindowActor("InvertPDFActor", {
      child: { esModuleURI, events: { DOMContentLoaded: {}, pageshow: {} } },
      parent: { esModuleURI },
      allFrames: true,
      messageManagerGroups: ["browsers"],
      safeForUntrustedWebProcess: true,
    });
  } catch (e) {}
}
