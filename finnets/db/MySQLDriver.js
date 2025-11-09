/**
 * @fileoverview
 * Database connection utility using mysql2/promise.
 * Provides global connection pooling, safe query execution, and transaction handling.
 */

import mysql from "mysql2/promise";

let pool;

/**
 * Create a global MySQL connection pool if not already initialized.
 * Ensures only one pool exists.
 */
if (!global._mysqlPool) {
  global._mysqlPool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DATABASE_PASS,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
  });
}

pool = global._mysqlPool;

/**
 * Executes a single SQL query with parameters safely.
 * Automatically handles pooled connections and errors.
 *
 * @async
 * @function executeQuery
 * @param {string} query - The SQL statement to execute.
 * @param {Array} [data] - Optional array of parameters for the query.
 * @returns {Promise<Object[]>} Result rows.
 * @throws Will throw an error if query execution fails.
 *
 * @example
 * const users = await executeQuery("SELECT * FROM Users WHERE id = ?", [1]);
 */
export const executeQuery = async (query, data) => {
  try {
    const [result] = await pool.execute(query, data);
    return result;
  } catch (error) {
    console.error("Query Error:", error.message);
    throw error;
  }
};

export const executeTransaction = async (queries) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    for (const { query, data } of queries) {
      await connection.execute(query, data);
    }
    await connection.commit();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    console.error("Transaction Error:", error.message);
    return { success: false, error };
  } finally {
    connection.release();
  }
};
