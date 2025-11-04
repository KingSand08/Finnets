import { executeQuery } from "../MySQLDriver";

export const getTotalBalanceByUsername = async (username) => {
  const query = `
    SELECT C.first_name, C.last_name, C.username, SUM(A.BALANCE) AS total_balance
    FROM Customers C
    LEFT JOIN Accounts A
    ON C.cid = A.cid
    WHERE C.username = ?
    GROUP BY C.username;
  `;

  const result = await executeQuery(query, [username]);
  return result[0] || null;
};

export const getBalanceByUsernameAndType = async (username, type) => {
  const query = `
    SELECT C.first_name, C.last_name, C.username, SUM(A.balance) AS total_balance
    FROM Customers C
    LEFT JOIN Accounts A ON C.cid = A.cid
    WHERE C.username = ? AND A.type = ?
    GROUP BY C.username;
    `;
  const results = await executeQuery(query, [username, type]);
  return results[0] || null;
};
