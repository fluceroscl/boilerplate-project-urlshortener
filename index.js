require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Middleware para manejar JSON
app.use(express.urlencoded({ extended: true })); // Middleware para manejar datos URL-encoded

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Endpoint para acortar URL
app.post('/api/shorturl', function(req, res) {
  const url = req.body.url;
  console.log(url);
  
  // Validar la URL
  try {
    const urlObj = new URL(url);
    
    // Verificar la URL con dns.lookup
    dns.lookup(urlObj.hostname, (err) => {
      if (err) {
        return res.json({ error: 'invalid url' });
      }
      
      // Aquí iría la lógica para acortar la URL
      const shortUrlId = Math.floor(Math.random() * 10000); // Generar un ID corto aleatorio
      res.json({ original_url: url, short_url: shortUrlId }); // Ejemplo de respuesta
    });
  } catch (error) {
    res.json({ error: 'invalid url' });
  }
});


// Ruta para redirigir a la URL original
app.get('/api/shorturl/:url(*)', (req, res) => { // Permite URLs completas como parámetro
  const url = decodeURIComponent(req.params.url); // Decodificar la URL
  console.log('SHORT URL: ', url);
  try {
    const urlObj = new URL(url);

    dns.lookup(urlObj.hostname, (err) => {
      if (err) return res.redirect('/');
      return res.redirect(url); 
    });
  } catch (error) {
      return res.redirect('/');
  }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
//https://3000-fluceroscl-boilerplatep-7eiw6mf0go0.ws-us116.gitpod.io/api/shorturl/http://www.google.com
