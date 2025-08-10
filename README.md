# BiLAL-MD

![BiLAL-MD Banner](https://files.catbox.moe/kunzpz.png)

[![Fork on GitHub](https://img.shields.io/badge/Fork%20on-GitHub-orange?logo=github)](https://github.com/cnw-db/BiLAL-md/fork)

---

## 🚀 GitHub Actions - Node.js CI

This project uses GitHub Actions to automatically test and build the project on every push or pull request to the `main` branch.

### Workflow file location

`.github/workflows/nodejs-ci.yml`

### Workflow code (copy-paste ready):

name: Node.js CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}

    - name: Install dependencies
      run: npm install

    - name: Start application
      run: npm start

---

## 🔗 Useful Links

- **Repository:** [https://github.com/cnw-db/BiLAL-md.git](https://github.com/cnw-db/BiLAL-md.git)  
- **Pair Site:** [https://pair-vd1s.onrender.com](https://pair-vd1s.onrender.com)  
- **Support Channel:** [KING BILAL -MD Heroku CC WhatsApp Channel](https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G)

---

## 🚀 Deploy BiLAL-MD on Heroku

Use the button below for instant deployment:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/cnw-db/BiLAL-md.git)

### Deployment Steps

1. Click **Deploy to Heroku** above.  
2. Login to your Heroku account.  
3. Fill environment variables (such as `SESSION_ID` and `OWNER_NUMBER`).  
4. Deploy the app.  
5. Visit the Pair Site: [https://pair-vd1s.onrender.com](https://pair-vd1s.onrender.com) and link your WhatsApp number.  
6. Start using your bot instantly!

---

## 📋 Features

- Reliable WhatsApp Bot using Baileys library  
- Supports commands for media, groups, admins, fun, and more  
- Easy pairing via web UI  
- Extensible with plugins and configurations

---

## ⚙️ Requirements

- Node.js v16 or higher (tested on 20.x)  
- WhatsApp number for pairing  
- Heroku account (optional for cloud deployment)  
- Internet connection

---

## 🛠️ Running Locally

Clone and run:

```bash
git clone https://github.com/cnw-db/BiLAL-md.git
cd BiLAL-md
npm install
npm start
