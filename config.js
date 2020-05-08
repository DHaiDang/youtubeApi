const port = 3000
const baseUrl = `http://localhost:${port}`
const clientKeys = require('./client_secret.json')

module.exports = {

  JWTsecret : 'mysecret',
  baseUrl : baseUrl,
  port : port,
  oauth2Credentials : {
    client_id : clientKeys.web.client_id,
    project_id : clientKeys.web.project_id,
    auth_uri : clientKeys.web.auth_uri,
    token_uri : clientKeys.web.token_uri,
    auth_provider_x509_cert_url : clientKeys.web.auth_provider_x509_cert_url,
    client_secret : clientKeys.web.client_secret,
    redirect_uris : [
      clientKeys.web.redirect_uris[0]
    ],
    javascript_origins : [
      clientKeys.web.javascript_origins[0]
    ],
    scopes : [
      'https://www.googleapis.com/auth/youtube.readonly'
    ]
  }
}