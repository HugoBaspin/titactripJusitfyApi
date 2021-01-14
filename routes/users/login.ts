import express, { Request, Response, NextFunction } from "express";
import Joi from "@hapi/joi";
import * as Jwt from "../../lib/jwthelper";
import { generateCustomError, level } from "../../config/error";
import User from "../../models/user";

const router = express.Router();
const schema = Joi.object().keys({
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),
});

async function controller(req: Request, res: Response, next: NextFunction) {
  const valid = schema.validate(req.body);
  if (valid.error !== undefined) {
    return next(
      generateCustomError(level.INFO, new Error("BAD_REQUEST"), 400, {
        error: valid.error.details,
      })
    );
  }
  const emailAddress: string = req.body.email;
  let user;
  try {
    user = await new User()
      .where({ email: emailAddress })
      .fetch({ require: false });
    if (!user || user.attributes === {}) {
      user = await new User({ email: emailAddress }).save();
    }
  } catch (exc) {
    return next(
      generateCustomError(
        level.ERROR,
        new Error("INTERNAL_SERVER_ERROR"),
        500,
        { exc }
      )
    );
  }
  res.json({
    user: {
      id: user.get("id"),
      emailAddress: user.get("email"),
    },
    JWT: Jwt.encryptToken(
      JSON.stringify({
        userId: user.get("id"),
      })
    ),
  });
  return next();
}

router.post("/", controller);

module.exports = {
  router,
};

/**
 * @api {post} /users/token Login
 * @apiVersion 0.1.0
 * @apiName Login
 * @apiGroup Users
 * @apiParam (body) {String} emailAddress User email address
 *
 * @apiDescription Allow any user to login and get a JWT
 *
 * @apiSuccessExample {Json} Success
 * {
 *     "user": {
 *         "id": 1,
 *         "emailAddress": "hugo@gmail.com",
 *     },
 *     "JWT": "fd189[...]ffaa7b71a50:55928e61fab[...]b6cd5190"
 * }
 *
 * @apiErrorExample {Json} Bad Credentials
 * {
 *     "code": 404,
 *     "message": "ACCOUNT_NOT_FOUND"
 * }
 */
