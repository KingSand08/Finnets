import { executeQuery } from '@/db/MySQLDriver';

export const getAccounts = async (username) => {
  const query = `
    SELECT A.account_number, A.type AS account_type, A.balance
    FROM Customers C
    LEFT JOIN Accounts A
    ON C.cid = A.cid
    WHERE C.username = ?;
  `;

  const result = await executeQuery(query, [username]);
  return result || null;
};

