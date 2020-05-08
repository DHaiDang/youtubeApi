const express = require('express')
const app = express()
const port = 3000
const cookieParser = require('cookie-parser')
app.use(cookieParser())
const pug = require('pug')
app.set('views', './views')
app.set('view engine', 'pug')

const config = require('./config')
const jwt = require('jsonwebtoken')
const google = require('googleapis').google
const OAuth2 = google.auth.OAuth2


app.get('/',(req,res) => {
  const oauth2client = new OAuth2(
    config.oauth2Credentials.client_id,
    config.oauth2Credentials.client_secret,
    config.oauth2Credentials.redirect_uris[0]
  )
  const loginLink = oauth2client.generateAuthUrl({
    access_type: 'offline',
    scope : config.oauth2Credentials.scopes
  })

  return res.render('index', {
    loginLink : loginLink
  })
})

app.get('/oauth2callback', (req,res) => {
  const oauth2client = new OAuth2(
    config.oauth2Credentials.client_id,
    config.oauth2Credentials.client_secret,
    config.oauth2Credentials.redirect_uris[0]
  )

  if(req.query.err) {
    res.redirect('/')
    return
  }
  else {
    oauth2client.getToken(req.query.code, (err,token) => {
      if(err) {
        res.redirect('/')
        return
      }

      res.cookie('jwt' , jwt.sign(token, config.JWTsecret))
      res.redirect('/subcription')
    })
  }
})

app.get('/subcription', (req, res) => {
  console.log('dang')
  if(!req.cookies.jwt) {
    res.redirect('/')
    return
  }
  const oauth2client = new OAuth2(
    config.oauth2Credentials.client_id,
    config.oauth2Credentials.client_secret,
    config.oauth2Credentials.redirect_uris[0]
  )
  oauth2client.credentials = jwt.verify(req.cookies.jwt, config.JWTsecret)

  const service = google.youtube('v3')

  service.subscriptions.list({
    auth: oauth2client,
    mine : true,
    part : 'snippet,contentDetails',
    maxResults:50
  })
  .then(resp => {
    console.log(resp.data.items)
    res.render('subcription', {
      subcription : resp.data.items
    })
  })
})

app.listen(port, () => {
})