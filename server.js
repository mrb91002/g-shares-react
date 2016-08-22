'use strict';

const express = require('express');
const app = express();

app.disable('x-powered-by');

const morgan = require('morgan');

switch (app.get('env')) {
  case 'development':
    app.use(morgan('dev'));
    break;

  case 'production':
    app.use(morgan('short'));
    break;

    default:
}

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', (req, res, next) => {
  if (/json/.test(req.get('Accept'))) {
    return next();
  }

  res.sendStatus(406);
});

const bodyParser = require('body-parser');

app.use(bodyParser.json());

const posts = require('./routes/posts');

app.use('/api', posts);

app.use((_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.sendStatus(500);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log('listening on port', port);
});


// what is the difference between client side routing and server side routing?
// Server side routing: Means you have to hit the server everytime a page changes.  This is process intensive on the server.

// While...

// Client side routing allows for the base structure of the site to be downloaded from the server in one shot and requests are made to the server only for data that is needed to fill in the pages.
