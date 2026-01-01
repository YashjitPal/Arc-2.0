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

## 🌀 What is Arc 2.0?

Arc 2.0 Browser is a **skin made for Zen Browser** that adds polish to the design by incorporating animations, blurs, and more.  
It’s the skin I personally use, made public due to demand for the CSS. Inspired by **Arc Browser** and other Zen skins (listed in credits).

> **Note:** Arc 2.0 is *not* a standalone browser.

**Tested on:** `Zen Browser 1.17.10b` (Windows)  
**Recommended Mode:** Dark Mode + Single Toolbar Mode  
(Might encounter minor hiccups in other modes.)

---

### ⚠️ Important Note

> Arc 2.0 is my personal browser skin.  
> If you don’t like a design choice I made, I’ll likely keep it if I still like it.  
> Please be respectful and constructive with feedback.

---

## 🧩 Installation Methods

### ✅ Install Using [Sine](https://github.com/CosmoCreeper/Sine) *(Recommended)*

1. Install **Sine**, a JS-based mod & theme manager: [Sine v2.2.3 Release](https://github.com/CosmoCreeper/Sine/releases/tag/v2.2.3).  
   More info: [CosmoCreeper/Sine](https://github.com/CosmoCreeper/Sine)

   ![image](https://github.com/user-attachments/assets/0d7255b4-0ae0-43e9-8989-7d7016936e83)

2. Click **Install** under **Arc 2.0**.  
   Refresh Settings if the theme doesn’t appear under *Installed Mods*.

  <img width="1902" height="1019" alt="image" src="https://github.com/user-attachments/assets/3f580b73-b2b4-4d92-9de4-3f0a02ba61fa" />


3. Configure personalization prefs in the **Settings** button under theme details.

   ![image](https://github.com/user-attachments/assets/c2e7eca7-f942-4cea-881c-eeacf23cc933)
   ![image](https://github.com/user-attachments/assets/4263b760-b9a9-484f-9929-88ad52c42dcb)

4. Locate `Arc 2.0` folder:
   - Go to `about:profiles`
   - Open **Root Directory**
   - Navigate to:  
     `chrome > sine-mods > Arc-2.0`
   - Inside, find `CONFIG.css` to customize preferences (e.g. compact sidebar width).

   ![image](https://github.com/user-attachments/assets/3b71cf3a-9650-4f26-ab09-204fb5355bb4)

---

### 📦 Install Using ZIP Files *(Traditional Method)*

1. Go to `about:profiles`, open **Root Directory**, then open or create a lowercase `chrome` folder.  
2. Download and extract the Arc 2.0 ZIP from **Releases**.  
3. Copy the contents into the `chrome` folder.  
4. Edit preferences in `CONFIG.css` and `about:config`.  
5. Install the required mods and extensions (listed below).  
6. Customize the toolbar layout as desired.

**Enable this setting:**  
`Settings → Look and Feel → Zen URL Bar`

![image](https://github.com/user-attachments/assets/994e74d5-5c29-4c11-8f50-8d6cf95f9b61)

🎉 Congrats! You now have an Arc-inspired Zen Browser setup!

> For installation issues, ask for help in the **#zeneral** channel on the official Zen Browser Discord.

---

## 📌 How to Get Arc-Like Pinned Extensions

1. Go to `about:config` and add:  
   `arc-pinned-extensions-mod` → **Boolean > True**
2. Left-click the addon icon → **Pin Extension**
3. Right-click toolbar → **Customize Toolbar**
4. Drag extensions above Essentials to mimic Arc layout.
5. Click **Done**.

**Tutorial video:**  

https://github.com/user-attachments/assets/98e35d8f-5638-4791-8369-8ff964ad94df

---

## 🧱 Required Mods

### • [Transparent Zen](https://zen-browser.app/mods/642854b5-88b4-4c40-b256-e035532109df/)
### • [Customize Font Size](https://zen-browser.app/mods/d23733fa-983e-4680-8869-bf5b292d4fe6/)
![image](https://github.com/user-attachments/assets/bb964ef8-af07-491b-99e8-8a4fa0c87789)

---

## 🧩 Required Extensions

### • [Zen Internet (Transparent Websites)](https://addons.mozilla.org/en-US/firefox/addon/zen-internet/)
### • [Copy Frame or Page URL](https://addons.mozilla.org/en-US/firefox/addon/arc-like-copy-link/)

---

## ⚙️ Basic Configurations

*(Skip this if using Sine — all prefs are in mod settings.)*

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

````

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

- **Transparent Websites (with Zen Internet)**  
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

## 🌫️ Zen Sidebar Transparency Options

### DWMGlassBlur (Recommended)
- Download: [DWMBlurGlass](https://github.com/Maplespe/DWMBlurGlass)
- Make symbols **valid** as shown:

  ![image](https://github.com/user-attachments/assets/5219d2b3-1396-4116-b37e-eb85a8a7437d)

- Create `DWM.ini` and paste:
  ```ini
  [config]
  applyglobal=true
  extendBorder=false
  reflection=false
  oldBtnHeight=false
  customAmount=true
  crossFade=true
  useAccentColor=false
  blurAmount=50.000000
  customBlurAmount=50.000000
  luminosityOpacity=0.650000
  activeTextColor=4278190080
  inactiveTextColor=4290032820
  activeTextColorDark=4294967295
  inactiveTextColorDark=4290032820
  activeBlendColor=1694498815
  inactiveBlendColor=1694498815
  activeBlendColorDark=1677721600
  inactiveBlendColorDark=1677721600
  glassIntensity=1.000000
  aeroColorBalance=0.080000
  aeroAfterglowBalance=0.430000
  aeroBlurBalance=0.490000
  blurMethod=0
  effectType=0
  crossfadeTime=160
  overrideAccent=true
  occlusionCulling=true
  disableOnBattery=true
  titlebtnGlow=false
  disableFramerateLimit=true

* Import in DWM:

  ![image](https://github.com/user-attachments/assets/12e6c621-ecf8-416d-88c4-670a77b2d66d)

---

### MicaForEveryone

* Download: [MicaForEveryone](https://github.com/MicaForEveryone)
* Add rule for `zen`
* Set **Background Type:** `Acrylic`

![image](https://github.com/user-attachments/assets/9a2581af-4d14-49b7-8f03-d35bd034ad3a)

---

## 🙌 Credits

* [neurokitti / Arc_Zen_Theme](https://github.com/neurokitti/Arc_Zen_Theme)
* [TheBigWazz / Pineapple-Fried](https://github.com/TheBigWazz/Pineapple-Fried)
* [GuiMar10 / Mindfulness](https://github.com/GuiMar10/Mindfulness)
* [Tanay-Kar / Lacuna](https://github.com/Tanay-Kar/Lacuna)
* [greeeen-dev / natsumi-browser](https://github.com/greeeen-dev/natsumi-browser)
* [lunar-os / ZenCss](https://github.com/lunar-os/ZenCss)
* [SameeraSW / Zen Transparency Guide](https://sameerasw.notion.site/Zen-Transparency-1939c6099d4080468f02cf05ae50e827)
* [Discord: #1340837003448684605](https://discord.com/channels/1088172780480114748/1340837003448684605)
* [Discord: #1342214828487344209](https://discord.com/channels/1088172780480114748/1342214828487344209)
* [ferrocyante / vyang](https://github.com/ferrocyante/vyang)
* [JustAdumbPrsn / Nebula Theme](https://github.com/JustAdumbPrsn/Nebula-A-Minimal-Theme-for-Zen-Browser)
* [sameerasw / ZenZero](https://github.com/sameerasw/ZenZero)
* [rrthrr](https://github.com/rrthrr)
* [Comp-Tech-Guy / No-Gaps](https://github.com/Comp-Tech-Guy/No-Gaps)

---

## 🔄 Redistribution Info

You’re free to fork, modify, and redistribute this theme.
Please credit me if you use Arc 2.0 in your projects.
Thank you for using Arc 2.0!

---

## 🆘 Support

Ping **`Equinox`**, **`CompTechGuy`**, or **`perplectly fine`** on the Zen Browser Discord for assistance.
