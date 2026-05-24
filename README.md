<div align="center">
  <img width="200" src="https://github.com/user-attachments/assets/f9a25afb-2503-421a-bed0-6e94f2ab43db" />
</div>

<h1 align="center" style="font-size: 2.5em;">Arc 2.0</h1>

<p align="center">
  Arc which receives non-chromium updates every 1–2 weeks! (iykyk).
</p>

<div align="center">
  <a href="https://zen-browser.app/">
    <img width="120" alt="zen-badge-light" src="https://github.com/user-attachments/assets/d6ab3ddf-6630-4062-92d0-22497d2a3f9a" />
  </a>
</div>

---

![image](https://github.com/user-attachments/assets/19211d6b-69e4-442c-99c4-655c48f5a8c5)

## What is Arc 2.0?

Arc 2.0 Browser is a **skin made for Zen Browser** that adds polish to the design by incorporating animations, blurs, and more.  
It’s the skin I personally use, made public due to demand for the CSS. Inspired by **Arc Browser** and other Zen skins (listed in credits).

> **Note:** Arc 2.0 is _not_ a standalone browser.

**Tested on:** `Zen Browser 1.20t` (Windows & Linux)

**[NOTE: If you intend to use Transparent Webspages in whatever manner, increase Compact Sidebar Opacity in Arc2.0 Mod Settings (Sine) or in `about:config` to have a readable Sidebar.
But if you're using Opaque Webpages, then you can decrease opacity as per your liking as Compact Sidebar will be blurred.
Also, Browser Pages like Settings (about:preferences) will be kept Transparent, so please use don't use Compact Sidebar mode at that time.
Before 1.19.9b everything was fine and sorted out, so blame Firefox 150 update for such breaking changes...]**

**Recommended Mode:** All modes are working properly except **Collapsed Sidebar**.
Also, in **Sidebar & Top Toolbar** mode, if you're choosing to keep Bookmarks under URL Bar while not having compact toolbar on, a small part of compact sidebar's pseduo bg might appear above compact sidebar's actual size. So for good looks, either at least turn on compact mode for toolbar, or remove Bookmarks, or switch to **Only Sidebar** mode.

---

### ⚠️ Important Note

> Arc 2.0 is my personal browser skin.  
> If you don’t like a design choice I made, I’ll likely keep it if I still like it.  
> Please be respectful and constructive with feedback.

---

## 🧩 Installation Methods

### Install Using [Sine](https://github.com/CosmoCreeper/Sine) _(Recommended)_

1. Install **Sine**, a JS-based mod & theme manager: [Sine v2.3.3](https://github.com/sineorg/docs/blob/main/src/installation.md).
   <img width="1906" height="1033" alt="image" src="https://github.com/user-attachments/assets/1d45cb42-61d7-4f02-8765-f8edb12b8924" />

2. **Theme Installation** (_Method-1_): Copy the link ![url](https://github.com/YashjitPal/Arc-2.0) and paste it to install and update theme with latest changes.
   <img width="1906" height="1033" alt="image" src="https://github.com/user-attachments/assets/7bb0ecd3-ccbf-4d95-98e1-3a1f15c29f35" />

   (_Method-2_): Install mod named `Arc-2.0` from **Marketplace**; this will not install or update theme instantly with latest changes as it takes time to get processed, so prefer Method-1.
   <img width="1906" height="1033" alt="image" src="https://github.com/user-attachments/assets/5b723429-00cf-4e40-bd35-8e0a806d3259" />

   Refresh Settings if the theme doesn’t appear under **Installed Mods**.

3. Configure personalization prefs in **Mod Settings** by clicking on gear icon under theme details.
   <img width="636" height="372" alt="image" src="https://github.com/user-attachments/assets/6676845c-c412-47e9-9675-86bb88f15ff0" />
   <img width="1906" height="1033" alt="image" src="https://github.com/user-attachments/assets/0c7eddc3-da0d-4633-afc9-0c694d80b0ce" />

---

### Install Using ZIP/TAR Files _(Traditional Method)_

1. Go to `about:profiles`, open **Root Directory**, then open or create a lowercase `chrome` folder.
2. Download and extract the Arc 2.0 ZIP from **Releases**.
3. Copy the contents into the `chrome` folder.
4. Add `prefs` to `about:config` (listed below).
5. Install the required mods and extensions (listed below).
6. Customize the toolbar layout as desired.

---

## Floating URL Bar

![image](https://github.com/user-attachments/assets/994e74d5-5c29-4c11-8f50-8d6cf95f9b61)

🎉 Congrats! You now have an Arc-inspired Zen Browser setup!

> For installation issues, ask for help in the **#mod-support** channel on the official **Sine** server on **Discord**.

---

## How to Get Arc-Like Pinned Extensions

### If installed via Sine

1. Go to Arc-2.0 Settings and click `Enable Pinned Extensions UI`.
   **OR**

### If installed via Traditional Method

1. Go to `about:config` and add:  
   `arc-pinned-extensions-mod` → **Boolean > True**.
   **NEXT**
2. Left-click any addon icon → **Pin Extension**
3. Click on Arc/three-dots button on Toolbar → **Customize Toolbar**
4. Drag pinned extensions above **Essentials area**, and don't do anything if while moving extensions its orientation gets messed up; it'll fix itself when you're done.
5. Click **Done**, the fixed pinned extensions orientation will be achieved!

**Tutorial video:**

https://github.com/user-attachments/assets/98e35d8f-5638-4791-8369-8ff964ad94df

---

## Required Mods

### • [Transparent Zen](https://zen-browser.app/mods/642854b5-88b4-4c40-b256-e035532109df/)

### • [Customize Font Size](https://zen-browser.app/mods/d23733fa-983e-4680-8869-bf5b292d4fe6/)

![image](https://github.com/user-attachments/assets/bb964ef8-af07-491b-99e8-8a4fa0c87789)

---

## 🧩 Required Extensions/Addons

### • [Zen Internet (Transparent Websites)](https://addons.mozilla.org/en-US/firefox/addon/zen-internet/)

**[NOTE: If you're enabling transparent pages using this addon, then increase Compact Sidebar Opacity in Arc2.0 Mod Settings (Sine) or in `about:config` to have a readable Sidebar.]**

---

## ⚙️ Basic Configurations

_(Skip this if using Sine — all prefs are in mod settings.)_

Open a new tab → type `about:config` → press Enter → add the following preferences:

```

browser.tabs.allow_transparent_browser → true
browser.urlbar.openintab → true
zen.widget.windows.acrylic → false
browser.urlbar.trimURLs → true
browser.tabs.groups.enabled → true
arc-pinned-extensions-mod → true
arc-tab-loading-animation → 0–5
arc-tab-switch-animation → 0–5
arc-nogaps-compact-mod → true
arc-nogaps-mod → true
arc-remove-workspace-indicator → true
arc-workspace-style → 0–2
arc-enable-container-styling → 0–2
arc-compact-mode-no-sidebar-bg → true
arc-tabs-no-shadow → true
arcline.url.bar → 0–1
browser.ml.linkPreview.enabled → true
browser.ml.linkPreview.outputSentences → [number]
browser.tabs.fadeOutUnloadedTabs → true
browser.low_commit_space_threshold_mb → [2/3 of total RAM]
browser.tabs.min_inactive_duration_before_unload → [milliseconds]
dom.ipc.processPriorityManager.backgroundUsesEcoQoS → true

```

Descriptions are provided in the original instructions above.

---

## ✨ Features

- **Better color gradients for Essentials**  
  ![image](https://github.com/user-attachments/assets/0c884a5e-92c9-4bae-8ecb-4c683da859a2)

- **Arc-like pinned extensions & minimal URL Bar**  
  ![image](https://github.com/user-attachments/assets/c4c8e9a1-8ef4-4c06-9335-df7f839814d4)

- **Better looking Tab Groups**  
  ![image](https://github.com/user-attachments/assets/177eebf8-1c43-49d7-8509-90dc1161b4dd)
  ![image](https://github.com/user-attachments/assets/b0314a00-1726-4364-922f-04297bf9ecfd)

- **Floating URL Bar with Blur Background**  
  ![image](https://github.com/user-attachments/assets/03a63255-9520-46c6-8468-f0579d97ad10)

- **Improved “Customize Toolbar” View**  
  ![image](https://github.com/user-attachments/assets/d0d797ac-9900-41d8-a60d-5e4e2966ba89)

- **Better Workspace Indicator**  
  ![image](https://github.com/user-attachments/assets/84e3e65f-2c98-4f52-8f33-f28402907d53)

- **Transparent Websites (with Zen Internet) [NOTE: Increase Compact Sidebar Opacity in Arc2.0 Mod Settings (Sine) or in `about:config` to have a readable Sidebar.]**  
  ![image](https://github.com/user-attachments/assets/34f1d947-33b0-4370-a717-fc354d4f9830)

- **Enhanced PDF Viewer & PiP**  
  ![image](https://github.com/user-attachments/assets/d8c85853-6c49-4d66-8a36-01fbe60b88f8)
  ![image](https://github.com/user-attachments/assets/8e7303c0-4a1a-4ff5-8497-c34c5b06440b)

- **Media Mini Player Improvements**  
  ![image](https://github.com/user-attachments/assets/70579c46-311f-48c5-9ae2-c5e86ba46332)
  ![image](https://github.com/user-attachments/assets/d7e281b3-2652-47e3-b515-dcbde7fad547)

---

## 🎨 Workspace Theme Colors

![image](https://github.com/user-attachments/assets/dcbeb0bf-f2dd-4cd4-a394-7a43cd2ce978)

---

## Zen Transparency Options

### DWMGlassBlur (Recommended for Windows 11)

- Download: **If you're on Windows 11 version 24H2 (26100.7171) or above, install this - **[DWMBlurGlass](https://github.com/Maplespe/DWMBlurGlass/releases/tag/2.3.2b3)
  **If you are on Windows 11 version below 24H2 (26100.7171), then install this - **[DWMBlurGlass](https://github.com/Maplespe/DWMBlurGlass/releases/tag/2.3.1r)
- Make symbols **valid** as shown:

  ![image](<img width="888" height="892" alt="image" src="https://github.com/user-attachments/assets/e38fb950-b8de-42c1-8bd7-49b400929f14" />)

- Create `DWM.ini` and paste:
  **FOR DWMBlurGlass v2.3.2b3**

```
[config]
applyglobal=true
extendBorder=false
reflection=false
oldBtnHeight=false
customAmount=true
crossFade=false
useAccentColor=false
overrideAccent=false
occlusionCulling=true
disableOnBattery=false
titlebtnGlow=false
disableFramerateLimit=true
autoDownloadSymbols=true
extendRound=10
titlebtnOffsetX=-1
customTitleBtnSize=false
titleBtnSizePreset=1
customCloseBtnW=44
customMaxBtnW=26
customMinBtnW=25
customBtnFrameH=18
blurAmount=20
customBlurAmount=20
luminosityOpacity=0.65
glassIntensity=1
customAeroTexture=false
customAeroTexturePath=
crossfadeTime=160
aeroColorBalance=0.08
aeroAfterglowBalance=0.43
aeroBlurBalance=0.49
activeTextColor=4294967295
inactiveTextColor=4290953925
activeBlendColor=0
inactiveBlendColor=0
activeTextColorDark=4294967295
inactiveTextColorDark=4290032820
activeBlendColorDark=1677721600
inactiveBlendColorDark=1677721600
blurMethod=0
effectType=0
blurQuality=1
```

**[NOTE]: For v2.3.1, configure it as you like.**

- Import in DWM:

<img width="888" height="892" alt="image" src="https://github.com/user-attachments/assets/18cded56-9f3f-4c7c-9cea-8f7fe5ec2b9f" />

---

### MicaForEveryone

- Download: [MicaForEveryone](https://github.com/MicaForEveryone)
- Add rule for `zen`
- Set **Background Type:** `Acrylic`

![image](https://github.com/user-attachments/assets/9a2581af-4d14-49b7-8f03-d35bd034ad3a)

**[NOTE]: To enable transparency in other Operating Systems, use AI.**

---

## Credits

- [neurokitti / Arc_Zen_Theme](https://github.com/neurokitti/Arc_Zen_Theme)
- [TheBigWazz / Pineapple-Fried](https://github.com/TheBigWazz/Pineapple-Fried)
- [GuiMar10 / Mindfulness](https://github.com/GuiMar10/Mindfulness)
- [Tanay-Kar / Lacuna](https://github.com/Tanay-Kar/Lacuna)
- [greeeen-dev / natsumi-browser](https://github.com/greeeen-dev/natsumi-browser)
- [lunar-os / ZenCss](https://github.com/lunar-os/ZenCss)
- [SameeraSW / Zen Transparency Guide](https://sameerasw.notion.site/Zen-Transparency-1939c6099d4080468f02cf05ae50e827)
- [ferrocyante / vyang](https://github.com/ferrocyante/vyang)
- [JustAdumbPrsn / Nebula Theme](https://github.com/JustAdumbPrsn/Nebula-A-Minimal-Theme-for-Zen-Browser)
- [sameerasw / ZenZero](https://github.com/sameerasw/ZenZero)
- [rrthrr](https://github.com/rrthrr)
- [Comp-Tech-Guy / No-Gaps](https://github.com/Comp-Tech-Guy/No-Gaps)

---

## 🔄 Redistribution Info

You’re free to fork, modify, and redistribute this theme.
Please credit me if you use Arc 2.0 in your projects.
Thank you for using Arc 2.0!

---

## Support

Ping **`Equinox`** or **`CompTechGuy`** on **Sine** server on **Discord** for assistance.
