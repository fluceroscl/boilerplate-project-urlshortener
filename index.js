require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const { promisify } = require('util');
const app = express();

// Configuración básica
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));

const dnsLookup = promisify(dns.lookup);

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

const urlStore = new Map();

const generateShortUrl = () => Math.floor(Math.random() * 10000).toString();

const isValidUrl = async (url) => {
  try {
    const urlObj = new URL(url);
    await dnsLookup(urlObj.hostname);
    return true;
  } catch (error) {
    return false;
  }
};

app.post('/api/shorturl', async (req, res) => {
  const { url } = req.body;
  console.log(url);

  if (await isValidUrl(url)) {
    const shortUrlId = generateShortUrl();
    urlStore.set(shortUrlId, url);
    res.json({ original_url: url, short_url: shortUrlId });
  } else {
    res.json({ error: 'URL inválida' });
  }
});

app.get('/api/shorturl/:url(*)', async (req, res) => {
  const url = decodeURIComponent(req.params.url);
  console.log('URL corta:', url);

  if (urlStore.has(url)) {
    return res.redirect(urlStore.get(url));
  }

  if (await isValidUrl(url)) {
    return res.redirect(url);
  }

  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
