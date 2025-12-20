---
description: Install and Configure Google Cloud SDK on Windows
---

# Install Google Cloud SDK

1.  **Download the Installer**:
    Run this command in your PowerShell terminal to download the Google Cloud SDK installer.

    ```powershell
    Invoke-WebRequest -Uri https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe -OutFile GoogleCloudSDKInstaller.exe
    ```

2.  **Run the Installer**:
    Execute the installer. Follow the on-screen prompts.
    - Select "Single User" (default).
    - Select "Desktop" or default folder.
    - **IMPORTANT**: Make sure "Bundled Python" is checked.
    - **IMPORTANT**: Check "Add gcloud to your PATH".

    ```powershell
    .\GoogleCloudSDKInstaller.exe
    ```

3.  **Restart Terminal**:
    After installation is complete, **close this terminal window and open a new one** so the new PATH settings take effect.

4.  **Login**:
    Run the login command. This will open your web browser.

    ```powershell
    gcloud auth login
    ```

5.  **Set Project**:
    Run this to set your project ID (replace `[YOUR_PROJECT_ID]` with your actual project ID from the Google Cloud Console).

    ```powershell
    gcloud config set project [YOUR_PROJECT_ID]
    ```

6.  **Verify**:
    Check that everything is working.

    ```powershell
    gcloud auth list
    gcloud config list
    ```
