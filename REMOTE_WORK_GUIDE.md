# 🚀 Working with Yasser Creatives on a New PC

This guide will help you set up this project and pair program with **Antigravity by Google** on any other computer.

## 🛠️ Phase 1: The One-Time Setup

### 1. External Requirements
Ensure the new PC has the following installed:
*   **Node.js** (LTS version)
*   **Git**
*   **Antigravity by Google** (IDE)

### 2. Getting the Code
Open your terminal (PowerShell or CMD) and run:
```powershell
# Clone the repository
git clone https://github.com/yasser-sebti/yscreatives.git

# Enter the project folder
cd yscreatives
```

### 3. Restoring Dependencies & Secrets
```powershell
# Install all required packages
npm install

# IMPORTANT: Re-create your local secrets
# Create a file named ".env" in the root directory and add:
VITE_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/1465114634028847222/vHeejDzEZqZaegMwo8EBcszVgkY87JzOJTCxvv67AS1h2Dd01KcylMuNKLiIZQ6nbe8t
```

---

## 🤖 Phase 2: Working with Antigravity

### 1. Opening the Project
1.  Launch **Antigravity**.
2.  Select **Open Folder** and choose the `yscreatives` folder you just cloned.
3.  Antigravity will automatically index the files and be ready to assist you.

### 2. Common Pair-Programming Commands
You can ask Antigravity to help you with the heavy lifting by typing in the chat:
*   *"Run the dev server"* -> Antigravity will start `npm run dev` for you.
*   *"How do I change the color of the footer?"* -> It will analyze the structure and propose the CSS edit.
*   *"Sync my changes to GitHub"* -> It will handle the `git add`, `commit`, and `push` commands.

---

## 🔄 Phase 3: The Daily Workflow

### Before you start working (on any PC):
Type this to Antigravity or run in terminal:
```powershell
git pull
```
*This ensures you have the latest version of the code that you saved from your other computer.*

### When you finish working:
Type this to Antigravity:
*"Push my changes to GitHub with the message: [Describe what you did]"*
*Or manually:*
```powershell
git add .
git commit -m "Update footer and logo"
git push
```

> [!TIP]
> **Cloudflare Automation**: Every time you push to GitHub, Cloudflare will automatically detect the changes and update your live website. No manual upload needed!
