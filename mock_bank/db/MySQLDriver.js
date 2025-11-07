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
  // Validate environment variables
  const requiredEnvVars = {
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error("Missing required database environment variables:", missingVars);
    throw new Error(
      `Missing required database environment variables: ${missingVars.join(", ")}`
    );
  }

  console.log("Creating MySQL pool with config:", {
    host: requiredEnvVars.DB_HOST,
    port: Number(requiredEnvVars.DB_PORT),
    database: requiredEnvVars.DB_NAME,
    user: requiredEnvVars.DB_USER,
    password: requiredEnvVars.DB_PASS ? "***" : undefined,
  });

  global._mysqlPool = mysql.createPool({
    host: requiredEnvVars.DB_HOST,
    port: Number(requiredEnvVars.DB_PORT),
    database: requiredEnvVars.DB_NAME,
    user: requiredEnvVars.DB_USER,
    password: requiredEnvVars.DB_PASS,
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
    if (!pool) {
      throw new Error("Database pool is not initialized");
    }
    const [result] = await pool.execute(query, data);
    return result;
  } catch (error) {
    console.error("Query Error:", error.message);
    console.error("Query:", query);
    console.error("Data:", data);
    if (error.code) {
      console.error("Error Code:", error.code);
    }
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
