export const environment = {
  production: true,
  apiBaseURL: 'http://localhost:8080/api/',
  allowedOrigins:'http://localhost',
  issuer: 'https://dev-268636.okta.com/oauth2/default',
  redirectUri: window.location.origin + '/callback',
  clientId: '0oabodyv4BX7TqDtc4x6',
  autoLoadInterval: 60000,
  scopes: ['openid', 'profile']

};


