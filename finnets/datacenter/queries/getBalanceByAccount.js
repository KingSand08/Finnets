import { executeQuery } from "../MySQLDriver";

export const getBalanceByAccount = async (username, account_number) => {
  const query = `
    SELECT C.first_name, C.last_name, C.username, A.account_number, A.type AS account_type, A.balance
    FROM Accounts A
    LEFT JOIN Customers C
    ON A.cid = C.cid
    WHERE C.username = ? AND A.account_number = ?;
  `;

  const result = await executeQuery(query, [username, account_number]);
  return result[0] || null;
};
