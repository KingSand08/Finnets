import { executeQuery } from "../MySQLDriver";

/**
 * Authenticates a user by username, email, and password.
 * 
 * IMPORTANT: All three fields (username, email, password) must belong to the SAME customer.
 * You cannot mix Customer 1's username with Customer 2's email and password, or any other combination.
 * 
 * @param {string} username - User's username (must match the customer)
 * @param {string} email - User's email address (must match the customer)
 * @param {string} password - User's password (must match the customer)
 * @returns {Promise<Object|null>} Customer data with email if found, null otherwise
 */
export const authenticateUser = async (username, email, password) => {
  // Authenticate by checking that username, email, and password all belong to the same customer
  // This ensures you cannot mix and match fields from different customers
  const query = `
    SELECT 
      C.cid,
      C.first_name,
      C.last_name,
      C.username,
      E.email_address AS email
    FROM Customers C
    INNER JOIN Emails E ON C.cid = E.cid
    WHERE C.username = ?
      AND E.email_address = ?
      AND C.password = ?
    LIMIT 1;
  `;

  const result = await executeQuery(query, [username, email, password]);
  
  // Return the customer data if found, null otherwise
  return result && result.length > 0 ? result[0] : null;
};

