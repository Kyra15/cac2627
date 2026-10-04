// set EXPO_PUBLIC_API_URL in test-app/.env, see .env.example
const base = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:4200';

export const API_URL = base.replace(/\/+$/, '');
