# BiLAL-MD

![BiLAL-MD](https://files.catbox.moe/kunzpz.png)

[![Fork on GitHub](https://img.shields.io/badge/Fork%20on-GitHub-orange?logo=github)](https://github.com/cnw-db/BiLAL-md/fork)

---

## GitHub Actions - Node.js CI

This repository uses GitHub Actions to automatically test and build the project on every push or pull request to the `main` branch.

### Workflow file location

`.github/workflows/nodejs-ci.yml`

### Workflow code:

```yaml
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

🔗 Links

Repository: https://github.com/cnw-db/BiLAL-md.git

Pair Site: https://pair-vd1s.onrender.com

Support Channel: Follow the KING BILAL -MD Heroku CC channel on WhatsApp:
https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G



---

🚀 Deploy on Heroku

You can quickly deploy BiLAL-MD using the Heroku template:



Steps to deploy

1. Click the Deploy to Heroku button above.


2. Log in to your Heroku account.


3. Set necessary environment variables such as:

SESSION_ID (your WhatsApp session)

OWNER_NUMBER (your WhatsApp number with country code)



4. Deploy the app.


5. Visit the Pair Site (https://pair-vd1s.onrender.com) to link your WhatsApp number.


6. Enjoy your bot!




---

📋 Features

Fast and reliable WhatsApp bot built with Baileys.

Supports multiple commands (media, groups, fun, admin, and more).

Pair your WhatsApp number easily through the Pair Site UI.

Supports custom plugins and configurations.



---

⚙️ Requirements

Node.js v16+ (tested with 20.x)

WhatsApp phone number for pairing.

Heroku account (optional, for cloud deployment).

Internet connection.



---

🛠️ Local Installation

If you want to run locally, do the following:

git clone https://github.com/cnw-db/BiLAL-md.git
cd BiLAL-md
npm install
npm start

Then visit the Pair Site to link your WhatsApp number.


---

🤝 Support

Join the official support WhatsApp channel for help, updates, and community:

https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G


---

📝 License

This project is licensed under the MIT License.


---

Made with ❤️ by the BiLAL-MD Team

