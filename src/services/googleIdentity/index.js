const GOOGLE_IDENTITY_SERVICES_SRC = 'https://accounts.google.com/gsi/client';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

let googleIdentityServicesPromise;

const getGoogleIdentityError = (error, fallbackMessage) => {
  const message =
    (error &&
      (error.error_description ||
        error.details ||
        error.message ||
        error.error ||
        error.type)) ||
    fallbackMessage;

  const normalizedError = new Error(message);
  normalizedError.error = error && error.error;
  normalizedError.type = error && error.type;

  return normalizedError;
};

export const isGooglePopupClosedError = (error) =>
  error &&
  (error.error === 'popup_closed_by_user' || error.type === 'popup_closed');

export const loadGoogleIdentityServices = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.reject(
      new Error('Google Identity Services requires a browser')
    );
  }

  if (window.google && window.google.accounts) {
    return Promise.resolve(window.google);
  }

  if (googleIdentityServicesPromise) return googleIdentityServicesPromise;

  googleIdentityServicesPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      `script[src="${GOOGLE_IDENTITY_SERVICES_SRC}"]`
    );
    let script;
    let settled = false;
    let timeoutId;

    function cleanup() {
      if (timeoutId) window.clearTimeout(timeoutId);
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
    }

    function handleLoad() {
      if (settled) return;

      if (window.google && window.google.accounts) {
        settled = true;
        cleanup();
        resolve(window.google);
        return;
      }

      handleError();
    }

    function handleError() {
      if (settled) return;

      settled = true;
      cleanup();
      reject(new Error('Unable to load Google Identity Services'));
    }

    script = existingScript || document.createElement('script');
    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });

    timeoutId = window.setTimeout(handleError, 10000);

    if (existingScript) {
      if (window.google && window.google.accounts) handleLoad();
      return;
    }

    script.src = GOOGLE_IDENTITY_SERVICES_SRC;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }).catch((error) => {
    googleIdentityServicesPromise = null;
    throw error;
  });

  return googleIdentityServicesPromise;
};

export const requestGoogleAccessToken = async ({ clientId, scope, prompt }) => {
  if (!clientId) throw new Error('Google client ID is not configured');

  const google = await loadGoogleIdentityServices();

  return new Promise((resolve, reject) => {
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope,
      callback: (response) => {
        if (response && response.error) {
          reject(
            getGoogleIdentityError(response, 'Google authorization failed')
          );
          return;
        }

        if (response && response.access_token) {
          resolve({
            accessToken: response.access_token,
            expiresIn: response.expires_in,
            scope: response.scope,
            tokenType: response.token_type,
            raw: response,
          });
          return;
        }

        reject(new Error('Google access was not granted'));
      },
      error_callback: (error) => {
        reject(getGoogleIdentityError(error, 'Google authorization failed'));
      },
    });

    const requestOptions = {};
    if (prompt !== undefined) requestOptions.prompt = prompt;

    tokenClient.requestAccessToken(requestOptions);
  });
};

export const requestGoogleProfile = async ({ clientId }) => {
  const { accessToken } = await requestGoogleAccessToken({
    clientId,
    scope: 'profile email',
    prompt: 'select_account',
  });

  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Unable to fetch Google profile');
  }

  const profile = await response.json();

  return {
    googleId: profile.sub,
    email: profile.email,
    name: profile.name,
    givenName: profile.given_name,
    familyName: profile.family_name,
    imageUrl: profile.picture,
  };
};
