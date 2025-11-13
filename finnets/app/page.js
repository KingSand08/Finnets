'use server';
import Link from 'next/link';
import { headers } from 'next/headers';
import styles from './page.module.css';
import {
  getSessionFromCookie,
  decodeJWT,
} from '@/lib/cookies/getSessionFromCookie';
import { generateFinancialAdvice } from '@/lib/generateFinancialAdvice';

export default async function Home() {
  let username = null;
  let accounts = [];
  let adviceMessages = [];
  let hasError = false;

  const chatLink =
    process.env.NODE_ENV === 'production' ? '/finnets/chat' : '/chat';

  // Get session from cookie
  const sessionCookie = await getSessionFromCookie();

  if (sessionCookie) {
    const payload = await decodeJWT(sessionCookie);
    if (payload?.user?.username) {
      username = payload.user.username;

      try {
        // Fetch accounts from the database
        // Construct absolute URL for server-side fetch
        const headersList = await headers();
        const host = headersList.get('host') || 'localhost:3001';
        const protocol =
          process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const basePath =
          process.env.NODE_ENV === 'production' ? '/finnets' : '';
        const apiUrl = `${protocol}://${host}${basePath}/api/bank_database/getAccounts?username=${username}`;

        const accountsResponse = await fetch(apiUrl, {
          cache: 'no-store',
          headers: {
            Cookie: `session=${sessionCookie}`,
          },
        });

        if (accountsResponse.ok) {
          const accountsData = await accountsResponse.json();

          if (accountsData.success && accountsData.data) {
            accounts = accountsData.data;
            // Generate financial advice messages
            adviceMessages = await generateFinancialAdvice(accounts, username);
          }
        } else {
          hasError = true;
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
        hasError = true;
      }
    }
  }

  const totalBalance = accounts.reduce(
    (sum, acc) => sum + parseFloat(acc.balance || 0),
    0
  );

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Welcome to Finnets</h1>
          <p>Your personal financial assistant</p>
        </div>

        {username ? (
          <div className={styles.content}>
            {/* Accounts Section */}
            <section className={styles.accounts_section}>
              <h2 className={styles.section_title}>Your Accounts</h2>
              {hasError ? (
                <p className={styles.error_message}>
                  Unable to load account information. Please try again later.
                </p>
              ) : accounts.length > 0 ? (
                <>
                  <div className={styles.total_balance}>
                    <span className={styles.total_label}>Total Balance:</span>
                    <span className={styles.total_amount}>
                      ${totalBalance.toFixed(2)}
                    </span>
                  </div>
                  <div className={styles.accounts_list}>
                    {accounts.map((account) => (
                      <div
                        key={account.account_number}
                        className={styles.account_card}
                      >
                        <div className={styles.account_header}>
                          <span className={styles.account_type}>
                            {account.account_type?.toUpperCase() || 'ACCOUNT'}
                          </span>
                          <span className={styles.account_number}>
                            #{account.account_number}
                          </span>
                        </div>
                        <div className={styles.account_balance}>
                          ${parseFloat(account.balance || 0).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className={styles.no_accounts}>
                  No accounts found. Please contact support if you believe this
                  is an error.
                </p>
              )}
            </section>

            {/* Financial Advice Messages Section */}
            {adviceMessages.length > 0 && (
              <section className={styles.advice_section}>
                <h2 className={styles.section_title}>Financial Insights</h2>
                <div className={styles.advice_messages}>
                  {adviceMessages.map((message, index) => (
                    <div key={index} className={styles.advice_card}>
                      <div className={styles.advice_icon}>💡</div>
                      <p className={styles.advice_text}>{message}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Chat Link */}
            <div className={styles.ctas}>
              <Link href={chatLink} className={styles.primary}>
                Chat with Finnet Bot
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.content}>
            <p className={styles.login_prompt}>
              Please log in to view your accounts and financial insights.
            </p>
            <div className={styles.ctas}>
              <Link href='/finnets/chat' className={styles.secondary}>
                Finnet Bot Chat
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
