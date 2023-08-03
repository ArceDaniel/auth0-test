require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Configurar el cliente de Auth0
const auth0Domain = process.env.AUTH0_DOMAIN;
const auth0ClientId = process.env.CLIENT_ID;
const auth0RedirectUri = process.env.AUTH0_REDIRECT_URI;
const auth0ClientSecret = process.env.CLIENT_SECRET;

// Función para intercambiar el código de autorización por un token de acceso usando la API de Auth0
const exchangeCodeForToken = async (code) => {
  const tokenResponse = await axios.post(`https://${auth0Domain}/oauth/token`, {
    client_id: auth0ClientId,
    client_secret: auth0ClientSecret,
    redirect_uri: auth0RedirectUri,
    code,
    grant_type: 'authorization_code',
  });
  return tokenResponse.data;
};

// Función para obtener información del usuario usando el token de acceso
const getUserInfo = async (accessToken) => {
  const userInfoResponse = await axios.get(`https://${auth0Domain}/userinfo`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return userInfoResponse.data;
};

// Rutas de autenticación
app.get('/auth/google', async (req, res) => {
  try {
    const authorizeUrl = `https://${auth0Domain}/authorize?client_id=${auth0ClientId}&redirect_uri=${auth0RedirectUri}&response_type=code&scope=openid profile email&connection=google-oauth2`;
    res.json({ url: authorizeUrl });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error al generar la URL de autenticación' });
  }
});

app.get('/auth/facebook', async (req, res) => {
  try {
    const authorizeUrl = `https://${auth0Domain}/authorize?client_id=${auth0ClientId}&redirect_uri=${auth0RedirectUri}&response_type=code&scope=openid profile email&connection=facebook`;
    res.json({ url: authorizeUrl });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error al generar la URL de autenticación' });
  }
});

app.get('/auth/linkedin', async (req, res) => {
  try {
    const authorizeUrl = `https://${auth0Domain}/authorize?client_id=${auth0ClientId}&redirect_uri=${auth0RedirectUri}&response_type=code&scope=openid%20profile%20email&connection=linkedin`;
    res.json({ url: authorizeUrl });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error al generar la URL de autenticación' });
  }
});

// Ruta de callback
app.get('/auth/callback', async (req, res) => {
  try {
    const code = req.query.code;
    const tokenData = await exchangeCodeForToken(code);
    const userInfo = await getUserInfo(tokenData.access_token);

    res.json({
      profile: userInfo,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error al procesar la autorización' });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Hello world!' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
