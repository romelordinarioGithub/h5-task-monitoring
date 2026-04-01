export const env = {
  apiBaseUrl: import.meta.env.VITE_API_URL,
  apiTokenUrl: import.meta.env.VITE_API_TOKEN_URL,
  adweaveURL: import.meta.env.VITE_ADWEAVE_URL,
  allowedEmailDomain: String(import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN)
    .trim()
    .toLowerCase(),
};
