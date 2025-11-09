'use client';
import style from '@/components/chat.module.css';
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
      
      const basePath = typeof window !== 'undefined' && window.location.pathname.startsWith('/finnets/')
        ? '/finnets'
        : '';
      
      
      let context = '';
      
      if (usernameRef.current) {
        // Fetch fresh banking data for each message
        try {
          const accountsRes = await fetch(`${basePath}/api/bank_database/getAccounts?username=${usernameRef.current}`, {
            credentials: 'include'
          });

          if (!accountsRes.ok) {
            throw new Error('Failed to fetch accounts');
          }

          const accounts = await accountsRes.json();
          
          if (!accounts?.data || !Array.isArray(accounts.data) || accounts.data.length === 0) {
            context = 'You are a banking assistant. No accounts found for this customer.';
          } else {
            const accountTypes = new Set(accounts.data.map(acc => acc.account_type));
            const hasChecking = accountTypes.has('checking');
            const hasSavings = accountTypes.has('savings');

            const fetchPromises = [
              fetch(`${basePath}/api/bank_database/getTotalBalance?username=${usernameRef.current}`, {
                credentials: 'include'
              })
            ];

            if (hasChecking) {
              fetchPromises.push(
                fetch(`${basePath}/api/bank_database/getTotalBalance?username=${usernameRef.current}&type=checking`, {
                  credentials: 'include'
                })
              );
            }

            if (hasSavings) {
              fetchPromises.push(
                fetch(`${basePath}/api/bank_database/getTotalBalance?username=${usernameRef.current}&type=savings`, {
                  credentials: 'include'
                })
              );
            }

            const balanceResponses = await Promise.allSettled(fetchPromises);

            // Handle responses
            const totalBal = balanceResponses[0].status === 'fulfilled' && balanceResponses[0].value.ok
              ? await balanceResponses[0].value.json()
              : null;

            let checkingBal = null;
            let savingsBal = null;
            let responseIndex = 1;

            if (hasChecking) {
              checkingBal = balanceResponses[responseIndex].status === 'fulfilled' && balanceResponses[responseIndex].value.ok
                ? await balanceResponses[responseIndex].value.json()
                : null;
              responseIndex++;
            }

            if (hasSavings) {
              savingsBal = balanceResponses[responseIndex].status === 'fulfilled' && balanceResponses[responseIndex].value.ok
                ? await balanceResponses[responseIndex].value.json()
                : null;
            }

            // Calculate balances from accounts if API calls failed
            const checkingBalance = checkingBal?.data?.total_balance ?? 
              (accounts.data.filter(acc => acc.account_type === 'checking').reduce((sum, acc) => sum + parseFloat(acc.balance), 0) ?? 'Unavailable');
            const savingsBalance = savingsBal?.data?.total_balance ?? 
              (accounts.data.filter(acc => acc.account_type === 'savings').reduce((sum, acc) => sum + parseFloat(acc.balance), 0) ?? 'None');

            const accountDetails = accounts.data
              .map(acc => `\n• [${acc.account_type.toUpperCase()}] Account #${acc.account_number}: $${acc.balance}`)
              .join('\n');

            context = `
            Customer profile:
            - First Name: ${totalBal?.data?.first_name ?? 'Unknown'}
            - Last Name: ${totalBal?.data?.last_name ?? 'Unknown'}
            - Username: ${usernameRef.current}
            - Total Balance: $${totalBal?.data?.total_balance ?? accounts.data.reduce((sum, acc) => sum + parseFloat(acc.balance), 0) ?? '0.00'}
            - Checking Balance: ${checkingBalance}
            - Savings Balance: ${savingsBalance}

            Accounts: 
            ${accountDetails}

            You are the customer's personal banking assistant. Always keep their data confidential and use it only to answer banking-related questions.
            `;
          }
        } catch (err) {
          console.error('Error fetching banking data:', err);
          context = 'You are a banking assistant. Unable to fetch customer data at this time.';
        }
      } else {
        context = 'You are a banking assistant. No customer authentication available.';
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
              Finnet AI is having trouble and cannot respond at this time.
              Sorry, try again later, goodbye! 👋
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
              <img
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
