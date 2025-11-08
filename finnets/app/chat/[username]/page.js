import Chat from '@/components/Chat';
import { redirect } from 'next/navigation';

export default async function ChatPage({ params }) {
  const { username } = await params;
  let privateData;
  let checkingBal;
  let savingsBal;
  let accounts;
  let userContext = '';

  // This assumes the username in the URL is not verified against the login session
  // if (username != login.session.username)
  if (!username) redirect('/chat');

  const baseUrl = process.env.DATACENTER_API_URL;

  console.log(baseUrl);
  try {
    const res = await fetch(
      `${baseUrl}/api/bank_database/getTotalBalance?username=${username}`
    );
    if (res.ok) privateData = await res.json();
    const ckRes = await fetch(
      `${baseUrl}/api/bank_database/getTotalBalance?username=${username}&type=checking`
    );
    if (ckRes.ok) checkingBal = await ckRes.json();
    const svRes = await fetch(
      `${baseUrl}/api/bank_database/getTotalBalance?username=${username}&type=savings`
    );
    if (svRes.ok) savingsBal = await svRes.json();
    const accRes = await fetch(
      `${baseUrl}/api/bank_database/getAccounts?username=${username}`
    );
    if (accRes.ok) accounts = await accRes.json();

    const accountDetails = Array.isArray(accounts?.data)
      ? accounts.data
          .map(
            (acc, i) =>
              `\n• [${acc.account_type.toUpperCase()}] Account #${
                acc.account_number
              }: $${acc.balance}`
          )
          .join('\n')
      : '  No account information available';

    userContext = privateData?.data
      ? `
      Customer profile:
      - First Name: ${privateData.data.first_name}
      - Last Name: ${privateData.data.last_name}
      - Username: ${privateData.data.username}
      - Total Balance: $${privateData.data.total_balance}
      - Checking Balance: ${checkingBal?.data?.total_balance ?? 'Unavailable'}
      - Checking Balance: ${savingsBal?.data?.total_balance ?? 'Unavailable'}

      Accounts: 
      ${accountDetails}

      You are the customer's personal banking assistant. Always keep their data confidential and use it only to answer banking-related questions.
      `
      : `
      You are a banking assistant. No private data is available for this customer.
      `;
  } catch (err) {
    console.error('Fetched data error:', err);
  }

  const chat_history = [[`Hello, ${privateData.data.first_name}!`, false]];

  return (
    <>
      <Chat initial_messages={chat_history} cust_context={userContext} />
    </>
  );
}
