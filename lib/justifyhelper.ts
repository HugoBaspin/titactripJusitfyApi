import User from "../models/user";
import moment, { Moment } from "moment";
import { generateCustomError, level } from "../config/error";

const countWords = require("count-words");

const splitMultipleLines = (text: string, length: number) => {
  const regex: RegExp = RegExp(
    "(?:\\s|^)(.{1," + length + "}|\n)(?=\\s|$)",
    "gs"
  );
  const res: string[] = [];
  let m;
  while ((m = regex.exec(text)) !== null) {
    if (m[1].split("\n").length < 3) {
      res.push(m[1]);
    } else {
      const str = m[1].split("\n");
      res.push(...str);
    }
  }
  return res;
};

const sumValues = (list: any) => {
  let count: number = 0;
  for (let i in list) {
    count += parseInt(list[i]);
  }
  return count;
};

export const justify = (text: string, length: number) => {
  const res: string[] = splitMultipleLines(text, length);
  const finalResult = [];
  for (let i = 0; i < res.length - 1; i++) {
    if (res[i + 1] !== "" && res[i].indexOf(" ") !== -1) {
      res[i] = res[i].replace("\n", "");
      while (res[i].length < length) {
        for (let j = 0; j < res[i].length - 1; j++) {
          if (res[i][j] == " ") {
            res[i] = res[i].substring(0, j) + " " + res[i].substring(j);
            if (res[i].length == length) break;
            while (res[i][j] == " ") j++;
          }
        }
      }
    }
    finalResult.push(res[i]);
    if (res[i + 1] === "") i++;
  }

  finalResult.push(res[res.length - 1]);

  return finalResult.join("\n");
};

export async function paymentRequired(userId: number, text: string) {
  let result: any = {};
  const dateNow: moment.Moment = moment().utc();
  try {
    const user = await new User()
      .where({ id: userId })
      .fetch({ require: true });
    if (
      dateNow.isAfter(
        moment(user.get("checked"))
          .utc()
          .add(24, "h")
      )
    ) {
      user.save({ words: 0, checked: dateNow });
      result = {
        paymentRequired: false,
        userWords: sumValues(countWords(text)),
      };
    } else {
      const paymentRequired: boolean =
        user.get("words") + sumValues(countWords(text)) >
        process.env.RATE_LIMIT_WORDS!;
      result = {
        paymentRequired,
        userWords: user.get("words") + sumValues(countWords(text)),
      };
    }
  } catch (exc) {
    if (exc.message === "EmptyResponse") {
      throw generateCustomError(level.ERROR, new Error("USER_NOT_FOUND"), 404, {
        exc,
      });
    }
  }
  return result;
}
