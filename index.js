
require('dotenv').config();
const express = require('express');

const app = express();
const port = 3000;

// Configurar el cliente de Auth0
const auth0Domain = process.env.AUTH0_DOMAIN;
const auth0ClientId = process.env.CLIENT_ID;
const auth0RedirectUri = process.env.AUTH0_REDIRECT_URI;
const auth0ClientSecret = process.env.CLIENT_SECRET


// Ruta para obtener la URL de autenticación con Google
app.get('/auth/google', async (req, res) => {
  try {
    const authorizeUrl = `https://${auth0Domain}/authorize?client_id=${auth0ClientId}&redirect_uri=${auth0RedirectUri}&response_type=code&scope=openid profile email&connection=google-oauth2`;

    // Devolver la URL de autenticación al front-end
    res.json({ url: authorizeUrl });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error al generar la URL de autenticación' });
  }
});
// Ruta para obtener la URL de autenticación con Facebook
app.get('/auth/facebook', async (req, res) => {
  try {
    const authorizeUrl = `https://${auth0Domain}/authorize?client_id=${auth0ClientId}&redirect_uri=${auth0RedirectUri}&response_type=code&scope=openid profile email&connection=facebook`;
    // Devolver la URL de autenticación al front-end
    res.json({ url: authorizeUrl });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error al generar la URL de autenticación' });
  }
});
app.get('/auth/linkedin', async (req, res) => {
  try {
    const authorizeUrl = `https://${auth0Domain}/authorize?client_id=${auth0ClientId}&redirect_uri=${auth0RedirectUri}&response_type=code&scope=openid%20profile%20email&connection=linkedin`;

    // Devolver la URL de autenticación al front-end
    res.json({ url: authorizeUrl });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error al generar la URL de autenticación' });
  }
});


app.get('/auth/callback', async (req, res) => {
  try {
    const code = req.query.code;

    // Intercambiar el código de autorización por un token de acceso usando la API de Auth0
    const tokenResponse = await fetch(`https://${auth0Domain}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: auth0ClientId,
        client_secret: auth0ClientSecret,
        redirect_uri: auth0RedirectUri,
        code,
        grant_type: 'authorization_code',
      }),
    });
    const tokenData = await tokenResponse.json();

    // Usar el token de acceso para obtener información del usuario
    const userInfoResponse = await fetch(`https://${auth0Domain}/userinfo`, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userInfo = await userInfoResponse.json();

    return res.json({
      profile: userInfo,
      access_token: "access_token",
      refresh_token: "refresh_token"
    })

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error al generar la URL de autenticación' });
  }
});
app.get('/', async (req, res) => {
  try {
    res.json({ url: "hello world!" });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error al generar la URL de autenticación' });
  }
});


app.get('/auth/callback', async (req, res) => {
  try {
    const code = req.query.code;

    // Intercambiar el código de autorización por un token de acceso usando la API de Auth0
    const tokenResponse = await fetch(`https://${auth0Domain}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: auth0ClientId,
        client_secret: auth0ClientSecret,
        redirect_uri: auth0RedirectUri,
        code,
        grant_type: 'authorization_code',
      }),
    });
    const tokenData = await tokenResponse.json();

    // Usar el token de acceso para obtener información del usuario
    const userInfoResponse = await fetch(`https://${auth0Domain}/userinfo`, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userInfo = await userInfoResponse.json();

    return res.json({
      profile: userInfo,
      access_token: "access_token",
      refresh_token: "refresh_token"
    })

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error al generar la URL de autenticación' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
