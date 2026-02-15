/**
 * Environment configuration and utilities
 * Centralizes all environment-based logic for the application
 */

export const ENV_CONFIG = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
} as const;
