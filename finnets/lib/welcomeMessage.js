async function welcomeMessage(params) {
  const { username } = await params;
  let privateData;
  let checkingBal;
  let savingsBal;
  let accounts;
  let userContext = '';

  // This assumes the username in the URL is not verified against the login session
  // if (username != login.session.username)
  if (!username) redirect('/chat');

  // Call the bank's API instead of direct database access
  const bankApiUrl = process.env.BANK_API_URL_PROD || 'http://localhost:3000';

  try {
    const res = await fetch(
      `${bankApiUrl}/api/bank/total-balance?username=${username}`
    );
    if (res.ok) privateData = await res.json();
    const ckRes = await fetch(
      `${bankApiUrl}/api/bank/total-balance?username=${username}&type=checking`
    );
    if (ckRes.ok) checkingBal = await ckRes.json();
    const svRes = await fetch(
      `${bankApiUrl}/api/bank/total-balance?username=${username}&type=savings`
    );
    if (svRes.ok) savingsBal = await svRes.json();
    const accRes = await fetch(
      `${bankApiUrl}/api/bank/accounts?username=${username}`
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

  const chat_history = [
    [`Welcome back, ${privateData.data.first_name}!`, false],
  ];
}
