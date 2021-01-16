import express, { Request, Response, NextFunction } from 'express';
import authMiddleware from '../../middlewares/authentication';
import { generateCustomError, level } from '../../config/error';
import { justify, paymentRequired } from '../../services/justifyhelper';
import User from '../../models/user';

const router = express.Router();

async function controller(req: Request, res: Response, next: NextFunction) {
  let text: string = req.body.text;
  const userId: number = res.locals.requestUserId;

  try {
    const info: any = await paymentRequired(userId, text);
    if (info.paymentRequired) {
      return next(
        generateCustomError(level.ERROR, new Error('PAYMENT_REQUIRED'), 402, {
          userId,
        })
      );
    }
    text = justify(text, 80);
    await new User({ id: userId }).save({
      words: info.userWords,
    });
  } catch (exc) {
    if (exc.statusCode === 404) {
      return next(exc);
    }
    return next(generateCustomError(level.ERROR, new Error('INTERNAL_SERVER_ERROR'), 500, { exc }));
  }
  res.send(text);
  return next();
}

router.post('/', authMiddleware(), controller);

module.exports = {
  router,
};

/**
 * @api {post} /justify justify a text
 * @apiVersion 0.1.0
 * @apiName Justify
 * @apiGroup Text
 * @apiParam (body) {string} The text to justify (80 000 words by day)
 *
 * @apiDescription Allow to justify a text
 *
 *
 * @apiErrorExample {Json} Bad Credentials
 * {
 *     "code": 404,
 *     "message": "USER_NOT_FOUND"
 * }
 *
 * @apiErrorExample {Json} Exceed words limit by day
 * {
 *     "code": 402,
 *     "message": "PAYMENT_REQUIRED"
 * }UNAUTHORIZED
 *
 * @apiErrorExample {Json} Wrong header
 * {
 *     "code": 401,
 *     "message": "UNAUTHORIZED"
 * }
 *
 * @apiErrorExample {Json} Bad JWT
 * {
 *     "code": 401,
 *     "message": "BAD_JWT"
 * }
 */
