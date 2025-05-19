# Browser extension for the Michibiki Discord Bot!
- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar).

# Setup
### Project setup
- Clone the source code
- ```cd browser-extension```
- run ```pnpm install``` - [Install pnpm if you haven't](https://pnpm.io/installation)

### Build and Test
- Simply run ```pnpm run dev``` or ```pnpm run dev:firefox``` if you use firefox based browser
- If you encounter errors or the browser window isn't showing up. You will need to continue reading this README file.
### Specify startup browser path for testing
If you haven't, copy ```.env.example``` and name it to ```.env```. We will start edit this file.
<br>You have a few options when it comes to selecting a browser for testing the extension

**+ Chrome for Testing**
  + Go to [Chrome for Testing download page (Stable Release)](https://googlechromelabs.github.io/chrome-for-testing/#stable) - and download for your desired platform
  + Extract the archive
  + Open the extracted folder, copy the path of ```chrome.exe```
  + For me, the path looks like this: ```"C:\\Users\\Admin\\Downloads\\chrome-win64\\chrome.exe"```
  + Paste the path to ```CHROME_BIN_PATH``` field
  + You are ready to test
 
    
**+ Your own browser**
  + If your browser is **chromium** based, the env keys you need would be ```CHROME_XXX_PATH```, and for **firefox** based browsers: ```FIREFOX_XXX_PATH```
  + Find your browser executable path and paste it into ```FIREFOX_BIN_PATH``` or ```CHROME_BIN_PATH``` field
  + You are ready to test
  #### For testing directly on your current profile without creating one each time
  By default, it will create a new profile each time you run ```pnpm run dev``` or ```pnpm run dev:firefox```. We solve this by specify the profile path.
  + Open your current browser and go to ```about:profiles```
  + Find your profile path, for me it's ```C:\\Users\\Admin\\AppData\\Roaming\\zen\\Profiles\\toeesn15.Default (release)```
  + Paste your profile path to ```FIREFOX_PROFILE_PATH``` or ```CHROME_PROFILE_PATH``` field
  + Run ```pnpm``` and test again!

    
<br>**Note: For path syntax, you can either use:**
- CHROME_BIN_PATH=C:\\\\Users\\\\Admin\\\\Downloads\\\\chrome-win64\\\\chrome.exe
  <br>or<br>
- CHROME_BIN_PATH="C:\Users\Admin\Downloads\chrome-win64\chrome.exe"

<br>**Use what work best for you. Check this [answer](https://stackoverflow.com/questions/15969608/what-is-the-difference-between-and-in-file-path) to learn more**

## Linux
The only different thing if you're on Linux is the binary/executable file path. For example, my path for zen-browser is ```/usr/bin/zen-browser```.
<br>To find your binary path, use ```which``` command. Ex: ```which zen-browser``` - ```which chrome``` - ```which firefox```

# Pack and sign the extension (.crx)
Each time you run ```pnpm run dev```, the output extension will be in ```.output``` folder. It export both chromium/firefox version of the extension so you can import directly into the browser of your choice.
<br>But if you plan to pack the ```.crx``` file. Check out [this guide](https://www.dre.vanderbilt.edu/~schmidt/android/android-4.0/external/chromium/chrome/common/extensions/docs/packaging.html)

# Troubleshoot
## Browser opened but when i click on the extension icon, the popup window isn't showing up or is empty
- Try openning a webpage and reload, and try again
