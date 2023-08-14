// OAuth2 library for Eve Online
const EveOAuth2 = {};

/**
 * Authorizes the user and returns an OAuth2 token.
 * @param {string} clientId - The client ID for your Eve Online application.
 * @param {string} clientSecret - The client secret for your Eve Online application.
 * @param {string[]} scopes - An array of OAuth2 scopes to request.
 * @returns {string} The OAuth2 token.
 */
EveOAuth2.authorize = async (clientId, clientSecret, scopes) => {
  const service = getOAuth2Service(clientId, clientSecret, scopes);
  const authorizationUrl = service.getAuthorizationUrl();
  const response = await getAuthorizationCode(authorizationUrl);
  const token = service.getAccessToken(response);
  return token;
};

/**
 * Gets an OAuth2 service object.
 * @param {string} clientId - The client ID for your Eve Online application.
 * @param {string} clientSecret - The client secret for your Eve Online application.
 * @param {string[]} scopes - An array of OAuth2 scopes to request.
 * @returns {OAuth2Service} An OAuth2 service object.
 */
function getOAuth2Service(clientId, clientSecret, scopes) {
  return OAuth2.createService('eveonline')
    .setAuthorizationBaseUrl('https://login.eveonline.com/oauth/authorize')
    .setTokenUrl('https://login.eveonline.com/oauth/token')
    .setClientId(clientId)
    .setClientSecret(clientSecret)
    .setScopes(scopes)
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties());
}

/**
 * Gets an authorization code from the user.
 * @param {string} authorizationUrl - The authorization URL to redirect the user to.
 * @returns {string} The authorization code.
 */
async function getAuthorizationCode(authorizationUrl) {
  const template = HtmlService.createTemplate(
    `<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>`
  );
  template.authorizationUrl = authorizationUrl;
  const htmlOutput = template.evaluate();
  htmlOutput.setWidth(600);
  htmlOutput.setHeight(425);
  const userInterface = SpreadsheetApp.getUi();
  const response = await userInterface.showModalDialog(htmlOutput, 'Authorize');
  return response;
}

/**
 * Handles the OAuth2 callback.
 * @param {object} request - The HTTP request object.
 * @returns {HtmlOutput} An HTML output.
 */
function authCallback(request) {
  const service = getOAuth2Service();
  const authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('Authorization successful.');
  } else {
    return HtmlService.createHtmlOutput('Authorization failed.');
  }
}
