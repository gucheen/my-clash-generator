const os = require('os')
const path = require('path')
const fs = require('fs')
const app = require('express')()
const { generate } = require('../index')

app.get('/api', (req, res) => {
  if (req.query.pwd !== process.env.SECRET_KEY) {
    return res.status(401);
  }
  generate()
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