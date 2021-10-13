export const environment = {
  production: true,
  apiBaseURL: 'https://unity3-prod-api.herokuapp.com/api/',
  allowedOrigins:'https://unity3-prod-api.herokuapp.com',
  issuer: 'https://dev-268636.okta.com/oauth2/default',
  redirectUri: window.location.origin + '/callback',
  clientId: '0oabodyv4BX7TqDtc4x6',
  autoLoadInterval: 10000,
  scopes: ['openid', 'profile']
};


