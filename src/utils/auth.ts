import { getCookie } from './cookie';

const normalizeToken = (token: string) => token.replace(/^Bearer\s+/i, '');

const isTokenValid = (token: string): boolean => {
  try {
    const payloadPart = normalizeToken(token).split('.')[1];
    if (!payloadPart) return false;

    const normalizedPayload = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(normalizedPayload)) as {
      exp?: number;
    };

    if (!payload.exp) return false;

    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const isUserAuthenticated = (): boolean => {
  const accessToken = getCookie('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken || !refreshToken) {
    return false;
  }

  return isTokenValid(accessToken);
};
