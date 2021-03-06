import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

dotenv.config({ path: `../.env` });

import { logger } from './config/logger';
import { log } from './middlewares/logger';
import { errorLog } from './middlewares/errorLogger';

// HED: Routing
const routing = [
  // GET    /test
  { prefix: '/test', router: require('./routes/test/get').router },
  // GET    /test/database
  { prefix: '/test', router: require('./routes/test/database').router },

  // POST   /token
  { prefix: '/token', router: require('./routes/users/login').router },
  // POST   /justify
  { prefix: '/justify', router: require('./routes/text/justify').router },
];

const app = express();

// bodyParser configuration
app.use(
  bodyParser.json({
    verify: (req: Request, res: Response, buf: Buffer) => {
      try {
        return JSON.stringify(buf);
      } catch (e) {
        logger().log('info', {
          error: 'INVALID_JSON_BODY',
          additionalInfo: {
            headers: req.headers,
          },
        });
        return res.end(
          JSON.stringify({
            code: 400,
            message: 'INVALID_JSON_BODY',
            innerException: new Error(),
          })
        );
      }
    },
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.is('text/*')) {
    req.body.text = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
      req.body.text += chunk;
    });
    req.on('end', next);
  } else {
    next();
  }
});

// OPTIONS method
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    const headers: any = {};
    headers['Access-Control-Allow-Origin'] = process.env.ACCESS_CONTROL_ALLOW_ORIGIN;
    headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS';
    headers['Access-Control-Allow-Credentials'] = false;
    headers['Access-Control-Max-Age'] = '86400'; // 24 hours
    headers[
      'Access-Control-Allow-Headers'
    ] = `X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, ${process.env.JWT_HEADER_NAME}`;
    res.writeHead(200, headers);
    res.end();
  } else {
    res.header('Access-Control-Allow-Origin', process.env.ACCESS_CONTROL_ALLOW_ORIGIN);
    res.header(
      'Access-Control-Allow-Headers',
      `Origin, X-Requested-With, Content-Type, Accept, ${process.env.JWT_HEADER_NAME}`
    );
    res.header('X-Developed-By', 'Hugo Baspin');
    res.header('Version', '0.1.0');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    next();
  }
});

// API routes
app.use('/api/help', express.static(`${__dirname}/public/api/help`));
routing.forEach(route => {
  app.use(`/api${route.prefix ? route.prefix : ''}`, route.router);
});
app.use(log);
app.use(errorLog);

app.listen(process.env.NODE_LISTEN_PORT);

// eslint-disable-next-line no-console
console.log(
  `If you're running VSCode and don't see the log "Server running on port ${process.env.NODE_LISTEN_PORT} 🚀", check the README`
);
logger().log('info', `Server running on port ${process.env.NODE_LISTEN_PORT} 🚀`);

module.exports = app;
