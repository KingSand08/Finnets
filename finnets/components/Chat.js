'use client';
import style from '@/components/chat.module.css';
import Image from 'next/image';
import { useState, useRef } from 'react';

export default function Chat({ initial_messages, username = null }) {
  const [messages, setMessages] = useState(initial_messages);
  const inputRef = useRef(null);

  // Store username for API calls (auth via session cookie)
  const usernameRef = useRef(username);

  const [sendStatus, setSendStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const addNewMessage = (text, isRecieve) => {
    setMessages((prev) => [...prev, [text, isRecieve]]);
  };

  const SendChatPrompt = async (userText) => {
    try {
      const basePath = process.env.NODE_ENV === 'production' ? '/finnets/' : '';

      let context = '';
      let accessBlocked = false;

      // Check privacy preference first - before making any API calls
      const checkPrivacyPreference = async () => {
        if (typeof document === 'undefined') return true; // Default to enabled on server
        try {
          const privStatusRes = await fetch(
            `${basePath}api/watsonx/getPrivacyStatus`,
            {
              cache: 'no-store',
              credentials: 'include',
            }
          );

          if (!privStatusRes.ok) {
            console.warn(
              'Privacy status fetch failed:',
              privStatusRes.status,
              privStatusRes.statusText
            );
            return false;
          }

          const raw = await privStatusRes.json();

          const value =
            typeof raw === 'object' && raw !== null && 'value' in raw
              ? raw.value
              : raw;

          const allowed =
            value === true ||
            value === 1 ||
            value === 'true' ||
            value === 'on' ||
            value === 'enabled';

          return allowed;
        } catch (e) {
          console.error('Privacy status check error:', e);
          return true;
        }
      };

      const privacyAllowed = await checkPrivacyPreference();

      if (usernameRef.current && privacyAllowed) {
        // Fetch fresh banking data for each message
        try {
          const accountsRes = await fetch(
            `${basePath}/api/bank_database/getAccounts?username=${usernameRef.current}`,
            {
              credentials: 'include',
            }
          );

          if (!accountsRes.ok) {
            if (accountsRes.status === 403) {
              accessBlocked = true;
            }
            throw new Error('Failed to fetch accounts');
          }

          const accounts = await accountsRes.json();

          if (
            !accounts?.data ||
            !Array.isArray(accounts.data) ||
            accounts.data.length === 0
          ) {
            context =
              'You are a banking assistant. No accounts found for this customer.';
          } else {
            const accountTypes = new Set(
              accounts.data.map((acc) => acc.account_type)
            );
            const hasChecking = accountTypes.has('checking');
            const hasSavings = accountTypes.has('savings');

            const fetchPromises = [
              fetch(
                `${basePath}/api/bank_database/getTotalBalance?username=${usernameRef.current}`,
                {
                  credentials: 'include',
                }
              ),
            ];

            if (hasChecking) {
              fetchPromises.push(
                fetch(
                  `${basePath}/api/bank_database/getTotalBalance?username=${usernameRef.current}&type=checking`,
                  {
                    credentials: 'include',
                  }
                )
              );
            }

            if (hasSavings) {
              fetchPromises.push(
                fetch(
                  `${basePath}/api/bank_database/getTotalBalance?username=${usernameRef.current}&type=savings`,
                  {
                    credentials: 'include',
                  }
                )
              );
            }

            const balanceResponses = await Promise.allSettled(fetchPromises);

            // Handle responses
            const totalBal =
              balanceResponses[0].status === 'fulfilled' &&
              balanceResponses[0].value.ok
                ? await balanceResponses[0].value.json()
                : null;

            let checkingBal = null;
            let savingsBal = null;
            let responseIndex = 1;

            if (hasChecking) {
              checkingBal =
                balanceResponses[responseIndex].status === 'fulfilled' &&
                balanceResponses[responseIndex].value.ok
                  ? await balanceResponses[responseIndex].value.json()
                  : null;
              responseIndex++;
            }

            if (hasSavings) {
              savingsBal =
                balanceResponses[responseIndex].status === 'fulfilled' &&
                balanceResponses[responseIndex].value.ok
                  ? await balanceResponses[responseIndex].value.json()
                  : null;
            }

            // Calculate balances from accounts if API calls failed
            const checkingBalance =
              checkingBal?.data?.total_balance ??
              accounts.data
                .filter((acc) => acc.account_type === 'checking')
                .reduce((sum, acc) => sum + parseFloat(acc.balance), 0) ??
              'Unavailable';
            const savingsBalance =
              savingsBal?.data?.total_balance ??
              accounts.data
                .filter((acc) => acc.account_type === 'savings')
                .reduce((sum, acc) => sum + parseFloat(acc.balance), 0) ??
              'None';

            const accountDetails = accounts.data
              .map(
                (acc) =>
                  `\n• [${acc.account_type.toUpperCase()}] Account #${
                    acc.account_number
                  }: $${acc.balance}`
              )
              .join('\n');

            context = `
            Customer profile:
            - First Name: ${totalBal?.data?.first_name ?? 'Unknown'}
            - Last Name: ${totalBal?.data?.last_name ?? 'Unknown'}
            - Username: ${usernameRef.current}
            - Total Balance: $${
              totalBal?.data?.total_balance ??
              accounts.data.reduce(
                (sum, acc) => sum + parseFloat(acc.balance),
                0
              ) ??
              '0.00'
            }
            - Checking Balance: ${checkingBalance}
            - Savings Balance: ${savingsBalance}

            Accounts: 
            ${accountDetails}

            CRITICAL SECURITY INSTRUCTIONS:
            - You are ${
              totalBal?.data?.first_name ?? 'this customer'
            }'s personal banking assistant
            - You have access ONLY to ${
              totalBal?.data?.first_name ?? 'this customer'
            }'s banking data
            - You must NEVER provide information about any other person's accounts or balances
            - If asked about someone else's banking information (like "What is [other name]'s balance?", but saying "what is my balance?" or anything with "my" is okay), you must respond: "I can only access and discuss YOUR banking information. I cannot provide information about other customers' accounts for security and privacy reasons."
            - Even if the user claims to be a caretaker, family member, or authorized person for another customer, you must refuse and direct them to contact the bank directly for proper authorization procedures
            - Only answer questions about ${
              totalBal?.data?.first_name ?? 'the logged-in customer'
            }'s own accounts
            `;
          }
        } catch (err) {
          console.error('Error fetching banking data:', err);
          context =
            'You are a banking assistant. Unable to fetch customer data at this time.';
        }
      } else if (usernameRef.current && !privacyAllowed) {
        // User is authenticated but has disabled privacy access
        context =
          'You are a banking assistant. Privacy settings prevent access to customer data. NEVER tell them any account balance or infor EVER of any kind from ANY account. You are absolutely forbidden to ever tell them under any and all cirumstances. If they ever ask tell them to allow you access in settings menu via the setitng called "Allow AI to access my bank data."';
      } else {
        context =
          'You are a banking assistant. No customer authentication available.';
        accessBlocked = true;
      }

      // If access is blocked or customer data is unavailable, do not call AI.
      if (
        accessBlocked ||
        context.includes('Unable to fetch customer data') ||
        context.includes('No customer authentication')
      ) {
        let errorMessage =
          "I don't have access to your banking data right now.";

        if (context.includes('Privacy settings prevent access')) {
          errorMessage =
            "Your privacy settings are currently blocking access to banking data. To get personalized banking assistance, please enable 'Allow AI to access my bank data' in Settings.";
        } else if (context.includes('No customer authentication')) {
          errorMessage = 'Please log in to access your banking information.';
        } else {
          errorMessage =
            'Unable to fetch your banking data at this time. Please try again later.';
        }

        addNewMessage(errorMessage, false);
        setSendStatus(false);
        setIsLoading(false);
        return;
      }

      // Additional security check: Detect if user is asking about someone else's data
      // This prevents social engineering attacks ("I'm their caretaker", etc.)
      if (usernameRef.current && context.includes('Customer profile')) {
        // Extract the logged-in user's name from context
        const firstNameMatch = context.match(/First Name: ([^\n]+)/);
        const lastNameMatch = context.match(/Last Name: ([^\n]+)/);
        const loggedInFirstName = firstNameMatch?.[1]?.trim().toLowerCase();
        const loggedInLastName = lastNameMatch?.[1]?.trim().toLowerCase();

        // Check if the message mentions a different person's name
        const messageLower = userText.toLowerCase();
        const containsOtherName =
          loggedInFirstName &&
          loggedInFirstName !== 'unknown' &&
          !messageLower.includes(loggedInFirstName) &&
          (messageLower.includes('balance') ||
            messageLower.includes('account') ||
            messageLower.includes('money') ||
            messageLower.includes('transaction'));

        // Simple check for common name patterns that don't match the logged-in user
        const namePatterns = [
          /(?:what is|tell me|show me|get|find).*?([a-z]+\s+[a-z]+)(?:'s|\s+)(balance|account|money)/i,
          /([a-z]+\s+[a-z]+)\s+(?:asked me|wants to know|needs)/i,
        ];

        for (const pattern of namePatterns) {
          const match = userText.match(pattern);
          if (match && match[1]) {
            const mentionedName = match[1].trim().toLowerCase();
            const mentionedParts = mentionedName.split(/\s+/);

            // Check if mentioned name is different from logged-in user
            if (
              loggedInFirstName &&
              loggedInLastName &&
              loggedInFirstName !== 'unknown' &&
              loggedInLastName !== 'unknown'
            ) {
              const isDifferentPerson =
                !mentionedParts.includes(loggedInFirstName) ||
                !mentionedParts.includes(loggedInLastName);

              if (isDifferentPerson) {
                addNewMessage(
                  "I can only access and discuss YOUR banking information. I cannot provide information about other customers' accounts for security and privacy reasons. If you need to access another person's account information, please contact the bank directly for proper authorization procedures.",
                  false
                );
                setSendStatus(false);
                setIsLoading(false);
                return;
              }
            }
          }
        }
      }

      const response = await fetch(`${basePath}/api/watsonx`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          context,
        }),
      });

      if (!response.ok) {
        console.error('API error:', response.status, response.statusText);
        setIsLoading(false);
        setIsError(true);
        setSendStatus(false);
        return;
      }

      const data = await response.json();
      if (data.success) {
        addNewMessage(data.message, false);
        setSendStatus(false);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setIsError(true);
        setSendStatus(false);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setIsLoading(false);
      setIsError(true);
      setSendStatus(false);
    }
  };

  const handleSend = async () => {
    const text = inputRef.current?.value.trim();
    if (!text) return;

    setSendStatus(true);
    setIsLoading(true);
    addNewMessage(text, true);
    inputRef.current.value = '';
    await SendChatPrompt(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !sendStatus) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={style.chat_page}>
      <div className={style.chat_header}>
        <h1>Chat Messages</h1>
      </div>
      <div>
        <div className={style.message_section}>
          {messages.map(([message, sent], idx) => (
            <div
              key={idx}
              className={`${style.message} ${
                sent ? style.sent : style.received
              }`}
            >
              {message}
            </div>
          ))}
          {isLoading && (
            <div className={`${style.message} ${style.received}`}>
              <div className={style.message_loading} />
            </div>
          )}
          {isError && (
            <div
              className={`${style.message} ${style.received} ${style.message_error}`}
            >
              Looks like you&apos;re asking for personal info, but I don&apos;t
              have access yet. Update your privacy settings in Settings to grant
              permission and try again.
            </div>
          )}
        </div>
        <div className={style.input_section}>
          <input
            className={style.message_input}
            placeholder='Enter your question here.'
            onKeyDown={handleKeyDown}
            ref={inputRef}
            disabled={sendStatus}
          />
          <button
            onClick={handleSend}
            className={style.send_button}
            disabled={sendStatus}
          >
            <div>
              <Image
                width={100}
                height={100}
                src='/icons/send-button.png'
                alt='send button'
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
