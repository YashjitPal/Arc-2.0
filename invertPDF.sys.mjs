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
  };

  handleEvent(event) {
    if (event.type === "DOMContentLoaded" || event.type === "pageshow") {
      this.initStyles();
      this.syncRadius();
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

  syncFont() {
    try {
      const doc = this.document;
      if (!doc) return;
      const uri = (doc.documentURI || doc.location?.href || "").toLowerCase();
      if (
        uri.startsWith("about:") ||
        uri.startsWith("chrome://") ||
        uri.startsWith("resource://pdf.js")
      ) {
        let prefVal = "Nunito";
        try {
          prefVal = Services.prefs.getStringPref("arc-font", "Nunito");
        } catch (e) {}
        const fontMap = {
          "Nunito": "Nunito",
          "Nunito-Italic": "Nunito-Italic",
          "SF-Symbols": "SF-Symbols",
          "SF-Pro": "SF-Pro",
          "SUSE": "Suse",
          "SUSE-Italic": "Suse-Italic",
        };
        const font = fontMap[prefVal] || prefVal || "Nunito";
        doc.documentElement?.style?.setProperty("--arc-font", `"${font}"`);
      }
    } catch (e) {}
  }

  syncRadius() {
    try {
      let radius = Services.prefs.getStringPref("arc-border-radius", "12px");
      this.document?.documentElement?.style?.setProperty("--arc-border-radius", radius);
    } catch (e) {}
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
      this.document?.documentElement?.style?.setProperty(
        "--arc-border-radius",
        message.data?.radius || "12px"
      );
    }

    if (message.name === "ArcFontChanged") {
      const doc = this.document;
      if (doc) {
        const uri = (doc.documentURI || doc.location?.href || "").toLowerCase();
        if (
          uri.startsWith("about:") ||
          uri.startsWith("chrome://") ||
          uri.startsWith("resource://pdf.js")
        ) {
          doc.documentElement?.style?.setProperty(
            "--arc-font",
            `"${message.data?.font || "Nunito"}"`
          );
        }
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
  try {
    let radius = Services.prefs.getStringPref("arc-border-radius", "12px");
    Services.prefs.getDefaultBranch("").setStringPref("arc-border-radius", radius);
  } catch (e) {}

  try {
    let font = Services.prefs.getStringPref("arc-font", "Nunito");
    Services.prefs.getDefaultBranch("").setStringPref("arc-font", font);
  } catch (e) {}

  let esModuleURI = import.meta.url;
  try {
    ChromeUtils.registerWindowActor("InvertPDFActor", {
      child: { esModuleURI, events: { DOMContentLoaded: {}, pageshow: {} } },
      parent: { esModuleURI },
      allFrames: true,
      messageManagerGroups: ["browsers"],
    });
  } catch (e) {}
}
