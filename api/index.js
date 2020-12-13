const os = require('os')
const path = require('path')
const fs = require('fs')
const app = require('express')()
const { generate } = require('../index')

app.get('/api', (req, res) => {
  if (req.query.pwd !== process.env.SECRET_KEY) {
    return res.status(401);
  }
  let platform = ''
  const ua = req.get('User-Agent');
  if (ua.includes('Windows')) {
    platform = 'win'
  }
  generate({
    platform,
  })
  .then(yaml => {
    const filePath = path.resolve(os.tmpdir(), 'config.yaml')
    fs.writeFile(filePath, yaml, (error) => {
      if (error) {
        console.error(error);
        return;
      }
      res.sendFile(filePath);
    });
  })
  .catch(error => {
    console.error(error);
    res.status(500).end(error.message);
  });
})

module.exports = app