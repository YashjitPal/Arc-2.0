
<div align="center">
<img width="200" src="https://github.com/user-attachments/assets/f9a25afb-2503-421a-bed0-6e94f2ab43db" />
</div>
<h1 align="center" style="font-size: 2.5em;">Arc 2.0</h1>

<p align="center">Arc which receives non-chromium updates every 1-2 weeks! (iykyk).</p>

<div align="center">
    <a href="https://zen-browser.app/">
        <img width="120" alt="zen-badge-light" src="https://github.com/user-attachments/assets/d6ab3ddf-6630-4062-92d0-22497d2a3f9a" />
    </a>
</div>

##
![image](https://github.com/user-attachments/assets/19211d6b-69e4-442c-99c4-655c48f5a8c5)

## What is Arc 2.0?
Arc 2.0 Browser is a skin made for Zen Browser that adds lots of polish to the design by incorporating animations, blurs and more. It's pretty much the skin I personally use, but made public because people wanted the CSS. This skin is inspired by Arc browser and some other Zen skins (listed in credits)

Arc 2.0 is NOT a standalone browser. I don't even intend on making one.

Arc 2.0 has been tested on 1.13.1b (Beta) on Windows. Note: It is not tested on Mac.

### Features are listed below!
### ℹ️ Note

> Please remember that Arc 2.0 in the end is my personal browser skin. If you don't like a design choice I've
> made, chances are I'll keep it if I still like it. So please be respectful and refrain from attacking people when you
> make suggestions. Thanks!

## How to use? (Full video tutorial given below)
Install the ZIP file from Releases. Extract it, then copy and paste the files of the ZIP file in the chrome folder. 

After installing the CSS files, open the browser and pin the Copy Frame or Page URL extension (extensions listed below).

Now install the mods and other extensions listed below and then alter the settings as listed below or according to yourself.

Enable the required configs from ```about:config```

Adjust or change the different toolbar items according to the one i made like Arc (in the image) or according to yourself.

Vallah! You got yourself a new browser which is arc but a lot more better!!!

This is what your chrome folder should look like:

![image](https://github.com/user-attachments/assets/1f5db909-e475-4129-acc7-3a215ac96731)

Also enable this from the settings:

![image](https://github.com/user-attachments/assets/994e74d5-5c29-4c11-8f50-8d6cf95f9b61)


## How to get Arc like pinned extensions:

* First go to settings.
* Press Zen Mods.
* Scroll and find ```Hide Plugins```.
* Disable that addon.
* Left click the addon icon.
* Pin the extension.
* Right click an empty area on the toolbar and press ```Customize Toolbar```.
* Drag and drop the required extension above the essentials to make it look like Arc extensions.
* Press the done button!
* Go back to settings and enable the ```Hide Plugins``` mod.

Below is the tutorial video:

https://github.com/user-attachments/assets/98e35d8f-5638-4791-8369-8ff964ad94df

## Mods required:
* ### Zen Minimal Exit Menu

  Link - https://zen-browser.app/mods/6cd4bca9-f17d-4461-b554-844d69a4887c/
* ### Transparent Zen

  Link - https://zen-browser.app/mods/642854b5-88b4-4c40-b256-e035532109df/
* ### Customize Font Size![image](https://github.com/user-attachments/assets/bb964ef8-af07-491b-99e8-8a4fa0c87789)

  Link - https://zen-browser.app/mods/d23733fa-983e-4680-8869-bf5b292d4fe6/
  

## Extensions required:
* ### Zen Internet (for transparent websites):
 
  Link - https://addons.mozilla.org/en-US/firefox/addon/zen-internet/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search
* ### Copy Frame or Page URL
 
  Link - https://addons.mozilla.org/en-US/firefox/addon/copy-frame-or-page-url/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search

## Basic Configs required:
Press Ctrl+T and open the floating URL bar and type "about:config". Press the tick button then type the following. After that press the ```boolean``` option and press the ```+``` button and set it to true or false for the following:
* ### ```browser.tabs.allow_transparent_browser``` (*boolean > true*)
* ### ```browser.urlbar.openintab``` (*boolean > true*) - **When typed something by clicking on the URL bar, opens a new tab instead of modifying the current tab.**
* ### ```zen.widget.windows.acrylic``` (*boolean > false*) - **For using Mica for Everyone in the toolbar.**
* ### ```browser.urlbar.trimURLs``` (*boolean > true*) - **Shortens URL Bar to only show domain name.**
* ### ```arc-compact-mode-no-sidebar-bg` (boolean > true) - **Disable this to remove Pseudo Background on Sidebar if you don't use Transparent Websites.**
* ### ```arc-tab-loading-animation``` (_Number_) - **Animation while the website loads.**
  **0: No animation;**
  **1: Blur (*Added by default, not needed to be added in `about:config`*);**
  **2: More Prominenet Blur;**
  **3: Less Prominent Blur;**
  **4: Grayscale with No Blur;**
  **5: Grayscale with Blur**
* ### ```arc-tab-switch-animation``` (_Number_) - **Animation while switching between tabs.**
  **0: No animation;**
  **1: Bounce (*Added by default, not needed to be added in `about:config`*);**
  **2: More Bouncy;**
  **3: More Bounce than default but lighter than 2;**
  **4: Smooth Crossfade;**
  **5: Zoom out effect**
* ### ```arc-nogaps-compact-mod``` (_Boolean > True_) - **Margin/Border-less for only compact mode.**
* ### ```arc-nogaps-mod``` (_Boolean > True_) - **Margin/Border-less for all modes.**
* ### ```arc-remove-workspace-indicator``` (_Boolean > True_) - **Removes Workspace Indicator below Essentials.**
* ### ```arc-workspace-style``` (_Number_) - **Introduces MacOS dock like animations to Workspace Indicators at the bottom of sidebar.**
  **0: No Background;**
  **1: No Animation;**
  **2: Capsule Background**
* ### ```arc-disable-container-styling``` (_Boolean > True_) - **Disables Container styling.**
* ### ```browser.ml.linkPreview.enabled``` (_Boolean > True_) - **Press `Shift + Alt` while hovering mouse over a link to generate AI based summarized preview of the content inside.**
* ### ```browser.ml.linkPreview.outputSentences``` (_Number_) - **Set the number of sentences you want AI based summarized preview of a website in.**
* ### ```browser.tabs.fadeOutUnloadedTabs``` (_Boolean > True_ - **Fades tab unloaded in the background.**
* ### ```browser.low_commit_space_threshold_mb``` (_Number_) - **Set the amount of memory left free in your system to activate tab unloading. Recommended to set it 2/3rd of your total RAM.**
* ### ```browser.tabs.min_inactive_duration_before_unload``` (_Number_) - **Under above config, set the duration (in milliseconds) in which tab unloading should be executed.**
* ### ```dom.ipc.processPriorityManager.backgroundUsesEcoQoS``` (_Boolean > True_) - **Makes browser run on performance efficiency mode.**

## Features:
* ### Better color gradients for essentials:
  ![image](https://github.com/user-attachments/assets/0c884a5e-92c9-4bae-8ecb-4c683da859a2)
* ### Arc like pinned extensions and minimal URL Bar:
  ![image](https://github.com/user-attachments/assets/c4c8e9a1-8ef4-4c06-9335-df7f839814d4)
* ### Floating URL Bar with Blur Background:
  ![image](https://github.com/user-attachments/assets/03a63255-9520-46c6-8468-f0579d97ad10)
* ### Better ```Customize Toolbar```:
  ![image](https://github.com/user-attachments/assets/d0d797ac-9900-41d8-a60d-5e4e2966ba89)
* ### Better workspace indicator:
  ![image](https://github.com/user-attachments/assets/84e3e65f-2c98-4f52-8f33-f28402907d53)
* ### Transparent Websites (with Zen Internet Add-on):
  ![image](https://github.com/user-attachments/assets/34f1d947-33b0-4370-a717-fc354d4f9830)
* ### Better PDF viewer:
  ![image](https://github.com/user-attachments/assets/d8c85853-6c49-4d66-8a36-01fbe60b88f8)
* ### Better PiP:
  ![image](https://github.com/user-attachments/assets/8e7303c0-4a1a-4ff5-8497-c34c5b06440b)
* ### Better Media Mini Player:
  ![image](https://github.com/user-attachments/assets/70579c46-311f-48c5-9ae2-c5e86ba46332)
  ![image](https://github.com/user-attachments/assets/d7e281b3-2652-47e3-b515-dcbde7fad547)



## Workspace Theme Colors:
![image](https://github.com/user-attachments/assets/dcbeb0bf-f2dd-4cd4-a394-7a43cd2ce978)

## Zen Sidebar transparency there are two options: **DWMGlassBlur** and **MicaForEveryone**. 
### DWMGlassBlur (Recommended)
Follow instructions given and download the program from here - ![url](https://github.com/Maplespe/DWMBlurGlass)
Then, firstly download the symbols and make them from **invalid** to **valid**, as in the image below:

![image](https://github.com/user-attachments/assets/5219d2b3-1396-4116-b37e-eb85a8a7437d)

Next, create a `DWM.ini` file and paste the following code in it:
```[config]
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
```
Then, import it in DWM like the image below:
![image](https://github.com/user-attachments/assets/12e6c621-ecf8-416d-88c4-670a77b2d66d)

### MicaForEveryone
Install it from here following the instructions given - ![url](https://github.com/MicaForEveryone)
Click on ```Add new rule``` and type ```zen```. Under ```Style```, set background type to ```acrylic```.
![image](https://github.com/user-attachments/assets/9a2581af-4d14-49b7-8f03-d35bd034ad3a)



## Credits:
* ### https://github.com/neurokitti/Arc_Zen_Theme/tree/main
* ### https://github.com/TheBigWazz/Pineapple-Fried/blob/main/pineapple-fried%2Fwazz-tweaks%2FModules%2Fcommunity-changes%2Furl-loading-animation.css
* ### https://github.com/GuiMar10/Mindfulness
* ### https://github.com/Tanay-Kar/Lacuna
* ### https://github.com/greeeen-dev/natsumi-browser
* ### https://sameerasw.notion.site/Zen-Transparency-1939c6099d4080468f02cf05ae50e827?pvs=4
* ### https://discord.com/channels/1088172780480114748/1340837003448684605
* ### https://discord.com/channels/1088172780480114748/1342214828487344209
* ### https://github.com/ferrocyante/vyang
* ### https://github.com/JustAdumbPrsn/Nebula-A-Minimal-Theme-for-Zen-Browser
* ### https://github.com/sameerasw/ZenZero

## Re-distribution info:
You are totally free to make forks of this or put this in your chrome file and create or modify it according to yourself. It's suggested to credit me if you use my theme. Thank you for using Arc 2.0.

## Please note that!
Ping `Equinox` and `perplectly fine` on Discord for support with issues.
