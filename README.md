# Finnets Chat — Banking Chatbot (Demo)

Hello! 👋 **Finnets Chat** is a secure, bank-ready chatbot designed to run on a financial institution’s backend servers. It summarizes a customer’s account data (when permitted) and answers bank-related questions in natural language. All sensitive calls are performed as **in-network, server-side requests**—never from the browser.

The bot **only** requests account information when:
- the user’s consent cookie is enabled (**`chat_privacy=true`**), **and**
- the **bank’s API** authorizes the request.

Beyond the account summary and chat, the app supports:
- **Language preference:** choose from ~50 of the world’s most widely used languages  
- **Theme customization:** change **accent color**, **font**, and **contrast mode** for accessibility  
- **Privacy policy:** render a bank-specific policy page

> This repository showcases both a **mock bank** and the **chatbot app**. The chatbot itself is portable: it can be used with **any backend** so long as you provide the correct `.env` values and expose the necessary bank API routes.

---

## Security at a glance

- **Server-only data access** (SSR/Server Actions/internal services)
- **Gateway enforcement**: requests validated by your bank API + `INTERNAL_SECRET`
- **User consent gate**: respects `BANK_FETCH_ENABLED`
- **httpOnly cookies** and SameSite configuration where applicable
- **Network segmentation** in the production demo via Nginx reverse proxy

---

## Tech stack

- **Next.js** (App Router) for UI + server routes  
- **Nginx** reverse proxy (production demo)  
- **MySQL** for the mock bank’s sample data  
- **Docker / Docker Compose** orchestration

---

## Demo Setup

### 1) Create `.env`

At the repository root, create a `.env` file. Use this starter template and update values as needed:

```dotenv
# ── App basics ────────────────────────────────────────────────────────────────
APP_NAME=finnets
NODE_ENV=production/development

# Secret used for internal service-to-service requests (proxy/gateway).
# Change this in production.
INTERNAL_SECRET=

# ── Finnets Watsonx API ─────────────────────────────────────────────────────────
IBM_CLOUD_API_KEY=
PROJECT_ID=
WATSONX_URL=
WATSONX_MODEL_ID=

# ── Bank API routing ─────────────────────────────────────────────────────────
# Target for server-side requests to the bank’s API.
DATACENTER_API_URL="http://localhost:3001"
FINNETS_URL="http://localhost:3001"
FINNETS_URL_INTERNAL="http://finnets:3001"

# Toggle to allow fetching bank data when the user consents.
BANK_FETCH_ENABLED=true

# ── Database (mock bank demo) ────────────────────────────────────────────────
DB_HOST=mock_bank_database
DB_PORT=3306
DB_USER=root
DB_PASS=1234@
DB_NAME=Finnets
BANK_API_URL_PROD="http://mock_bank-prod:3000"
BANK_API_URL_DEV="http://localhost:3000"
```

### 2) Install Docker

Make sure Docker is installed and running:

- **Docker Desktop**: <https://docs.docker.com/get-started/>

### 3) Start the demos

You can run helper scripts or Compose files directly.

**Option A — Helper scripts (recommended)**

From the repo root:

```bash
cd ./config
./start-all.sh
```

- **Development demo**: open **http://localhost:3000**
- **Production demo** (via Nginx): open **http://localhost:8080**

To run **only the production demo**:

```bash
cd ./config
./start-prod.sh
```

**Option B — Docker Compose (manual)**

Make sure to setup the networks before using the docker compose command(s)!

---

## Using the app

- **Language & theme**  
  Use the **Language** button to pick one of ~50 most used world languages. Change **accent color**, **font**, and toggle **contrast mode** in **Settings**.

- **Account summary**  
  When allowed by both **user consent** and **bank policy**, the chatbot renders a server-fetched snapshot of the user’s accounts.

- **Chat**  
  Ask questions about balances, transactions, cards, etc. The app calls bank APIs server-side according to your `.env` and gateway keys.

---
## Customization

- **Languages**: edit `/finnets/data/supportedLangs.json` (ensure unique labels)  
- **Fonts**: edit `/finnets/data/fontSupport.json` and `/finnets/lib/Fonts`  
- **Branding**: replace assets in `/public` and tweak tokens

---

## Troubleshooting

- **Chat Not Working?**  
  Most likely is an API routing issue. Ensure that your connection is valid. If it is, and you are running on production, ensure that the prod `.env` variables are correct.

- **401/403 from bank API**  
  Verify `INTERNAL_SECRET` / `BANK_API_KEY` and that the gateway authorizes the chatbot’s network.

- **DB connection issues (demo)**  
  Check `DB_*` values and ensure the MySQL container is healthy.

---

## License

Read the LICENSE for how to use code.
