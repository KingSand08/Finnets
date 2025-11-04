/** @type {import('next').NextConfig} */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); // Adjust path as needed

const nextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    // You can also explicitly expose specific variables here
    SHARED_VARIABLE: process.env.SHARED_VARIABLE,
  },
};

export default nextConfig;
