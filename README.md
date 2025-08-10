# 🚀 BiLAL-MD

![BiLAL-MD Banner](https://files.catbox.moe/kunzpz.png)

[![Fork on GitHub](https://img.shields.io/badge/Fork%20on-GitHub-orange?logo=github&style=for-the-badge)](https://github.com/cnw-db/BiLAL-md/fork)  
[![Build Status](https://github.com/cnw-db/BiLAL-md/actions/workflows/nodejs-ci.yml/badge.svg?branch=main&style=for-the-badge)](https://github.com/cnw-db/BiLAL-md/actions/workflows/nodejs-ci.yml)  
[![Deploy on Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/cnw-db/BiLAL-md.git)

---

## 📦 Project Overview

**BiLAL-MD** is a blazing-fast WhatsApp bot powered by Baileys library.  
Easily pair your WhatsApp number and automate fun, admin, media commands and more!

---

## ⚙️ Features

- ✅ Lightweight & reliable  
- ✅ Supports media, group management, admin tools, fun commands  
- ✅ Easy pairing through a web interface  
- ✅ Customizable plugins & configs  

---

## 🛠️ Installation

### Deploy on Heroku (Recommended)

Click the button below to deploy instantly:

[![Deploy on Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/cnw-db/BiLAL-md.git)

### Run Workflow 

```bash
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
