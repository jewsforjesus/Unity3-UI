export const environment = {
  production: true,
  apiBaseURL: 'https://integally-stage-api.herokuapp.com/api/',
  allowedOrigins:'https://integally-stage-api.herokuapp.com',
  issuer: 'https://dev-268636.okta.com/oauth2/default',
  redirectUri: window.location.origin + '/callback',
  clientId: '0oabodyv4BX7TqDtc4x6',
  autoLoadInterval: 60000,
  scopes: ['openid', 'profile']

};


