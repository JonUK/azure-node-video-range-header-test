const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.htm'))
});

app.get('/video', function(req, res) {
  let path = 'assets/sample.mp4';
  let contentType = 'video/mp4';

  if (req.query['format'] === 'webm') {
    console.info('format is webm');
    path = 'assets/sample.webm';
    contentType = 'video/webm';
  }

  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize-1;

    if(start >= fileSize) {
      res.status(416).send('Requested range not satisfiable\n'+start+' >= '+fileSize);
      return
    }

    const chunkSize = (end-start) + 1;
    const file = fs.createReadStream(path, {start, end});
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': contentType,
    };

    if (req.query['no-accept-ranges'] === 'true') {
      console.info('no-accept-ranges querystring is true');
      delete head['Accept-Ranges'];
    }


    res.writeHead(206, head);
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res)
  }
});

module.exports = app;
