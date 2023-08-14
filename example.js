function getCharacterInfo() {
  const clientId = 'your-client-id';
  const clientSecret = 'your-client-secret';
  const scopes = ['publicData'];
  const token = EveOAuth2.authorize(clientId, clientSecret, scopes);
  const response = UrlFetchApp.fetch('https://esi.evetech.net/latest/characters/1234567890/', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const characterInfo = JSON.parse(response.getContentText());
  Logger.log(characterInfo);
}
