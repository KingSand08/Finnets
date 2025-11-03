This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Setting up the database

1. Open your terminal (or command prompt).
2. Navigate to the database directory:

```
cd /Finnets/finnets/datacenter
```

3. Log in to MySQL using your username and password:

```
mysql -u your_username -p
```

4. Run the database setup script:

```
source createDB.sql;
```

## Create the .env file

1. In the root of your finnets directory, create a new file named .env.

```
/Finnets/finnets/.env
```

2. Add your MySQL credentials and database info:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASS=your_password
DB_NAME=Finnets
```

3. Save the file

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# API Endpoints

## Get total balance by username and/or account type

**Endpoint:**

```
GET api/getTotalBalance/username={username}&type={account_type}
GET api/getTotalBalance/username={username}
```

**Query Parameters:**
_username: required_
_account_type: optional_

**Successful Response Examples:**

```
{
  "success": true,
  "data": {
    "first_name": "John",
    "last_name": "Doe",
    "username": "johndoe",
    "total_balance": 13425.50
  }
}
```

## Get an account balance by username and account number

**Endpoint:**

```
GET api/getBalance/username={username}&account-number={account_number}
```

**Query Parameters:**
_username: required_
_account_number: required_

**Successful Response Examples:**

```
{
  "success": true,
  "data": {
    "first_name": "John",
    "last_name": "Doe",
    "username": "johndoe",
    "account_number": "1234567890",
    "account_type": "savings",
    "balance": 13425.50
  }
}
```
