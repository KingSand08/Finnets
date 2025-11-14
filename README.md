# Finnets Chat — Banking Chatbot (Demo)
Hello! 👋 **Finnets AI** is a secure, bank-ready chatbot designed to run on a financial institution’s backend servers. It summarizes a customer’s account data (when allowed by both the user and institution) and answers bank-related questions in natural language. There are also settings to make application more accessible, have chat language support for ~50 languages, and have some customizable UI elements.

## Problem and Solution Statement
### Problems
Employing the design thinking framework for brainstorming and solution design, we identified their difficulties as follows:
1. Confusing experiences when seeking technical and financial support via bank applications:
   - Customers may feel confused by technical language or unclear instructions in the banking app.
   - New users may not understand the steps required to complete certain transactions in the app.
2. Limited language options for non-native English-speaking customers:
   - Traditional banking apps often offer limited language options beyond the major languages.
   - Translation often has to be accessed through the settings, which feels rigid.
3. Long wait times for customer service via chat sessions:
   - Traditional chat sessions usually go through a filter handled by a hard-coded virtual assistant.
A lack of customer service representatives leads to longer wait times.

### Solutions
In response to the user challenges, our team built FinNets to address the top three priority of customers' needs:
1. An AI-powered virtual assistant that offers technical support via chat sessions.
   - The virtual assistant can provide instant feedback, including general banking information, regulations, and technical instructions, helping customers use the app effectively.
2. Customers can opt in or out of private information sharing, allowing the chatbot to provide in-depth financial analysis.
   - If authorized, the virtual assistant can access the data center and provide in-depth analysis on customer financial activities.
   - Customers can discuss ways to improve their savings and investment returns with the virtual assistant.
3. Supports multiple languages to assist a diverse customer base:
   - The virtual assistant can respond to customers in any language they request. 
   - Customers can switch languages easily without going through the settings.
To showcase what FinNets can do, meet John Doe. As a senior citizen, he prioritizes security and independence. With FinNets, he can:
   - Receive his financial report without performing complex in-app navigation.
   - Adjust font size and colors, with simple navigation.
   - Handle his finances on his own and feel confident doing it.
   - Query in any language of choice.
FinNets is not just another automated tool. It is a leverage to improve customer service when using our bank apps.

## Tech Used Written Statement
### Core Technology Used
- This project uses Watsonx.ai as the core LLM for our chatbot feature.
### Watsonx.ai Can
- Respond to customers' general queries.
- Provide in-depth analysis on financial information collected from the data center.
 - Offer technical solutions based on pre-scripted prompts.
### Development Stack
Frontend: JavaScript with the Next.js framework.
Backend: MySQL and Next.js API routes.

## Links
### Demo video:
https://drive.google.com/file/d/1N5JbNWXxa6xWnDjCWWxqL_saNq3v1ZCF/view?usp=sharing

## Demo Setup

### 1) Create `.env` in proper location

In the repository root, create a `.env` file. These values will be compied by docker to each container, so do not add it directly to each NextJS app.

```dotenv
------------------WATSONX INFORMATION-----------------
IBM_CLOUD_API_KEY=
PROJECT_ID=
WATSONX_URL=
WATSONX_MODEL_ID=

----------NECESSARY NON CRITICAL INFORMATION----------
FINNETS_URL_DEV=http://localhost:3001
FINNETS_URL_PROD=http://localhost:3001

DB_HOST=mock_bank_database
DB_PORT=3306
DB_USER=root
DB_PASS=1234@
DB_NAME=Finnets

BANK_SECRET=secret1
FINNETS_SECRET=secret2

BANK_API_URL_PROD=http://mock_bank:3000
BANK_API_URL_DEV=http://mock_bank-dev:3000
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

### Unix
```bash
cd ./config
./start-prod.sh
```

### Windows
```powershell
cd ./config
bash ./start-prod.sh
```

### Option B — Docker Compose (manual)

Make sure to setup the networks before using the docker compose command(s)!

And ensure that you do them in the right order!

### Unix
```bash
  cd ./config
  # Setup DB Network
  docker network create bank_shared_net >/dev/null
  # Docker Create Database Container
  docker compose --env-file ../.env -f ../docker-compose.db.yml up --build -d
  
  # Setup Production Network
  docker network create bank_prod_net >/dev/null
  # Docker Create Production Container
  docker compose --env-file ../.env -f ../docker-compose.prod.yml up --build -d
  
  # (OPTIONAL) Setup Development Network
  docker network create bank_dev_net >/dev/null
  # (OPTIONAL) Docker Create Development Container
  docker compose --env-file ../.env -f ../docker-compose.dev.yml up --build -d
```

---

## Using the app
- **Production/Development demo**: open **http://localhost:3000**
- Make sure that only one container (production/development) is on at a time!
- When you get to the bank page, login with either of these accounts:
    - janesmith   jane.smith@example.com  password123
    - johndoe     john.doe@example.com    password123
### App Features to Try
- **Language & theme**  
  Use the Chat **Language** button to pick one of ~50 most used world languages. Change **accent color**, **font**, and toggle **contrast mode** in **Settings**.

- **Account summary**  
  When allowed by both **user consent** and **bank policy**, the chatbot renders a server-fetched snapshot of the user’s accounts.

- **Chat**  
  Ask questions about balances, transactions, cards, etc. The app calls bank APIs server-side according to your `.env` and gateway keys.

---
## Customization

- **Languages**: edit `./finnets/data/supportedLangs.json` (ensure unique labels)  
- **Fonts**: edit `./finnets/data/fontSupport.json` and `./finnets/lib/Fonts`  

---

## License

Read the LICENSE for how to use code.
