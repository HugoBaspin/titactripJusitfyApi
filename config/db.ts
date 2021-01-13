import pg from "pg";
import Knex from "knex";
import Bookshelf from "bookshelf";
const _knex: Knex = Knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER, // user name for your database
    password: process.env.DB_PASSWORD, // user password
    database: process.env.DB_DATABASE, // database name
    charset: "utf8",
  },
  acquireConnectionTimeout: 5000,
});

const _bookshelf: Bookshelf = Bookshelf(_knex);
// Reference: https://github.com/brianc/node-pg-types
// These two lines convert all bigint values coming from Postgres from JS string to JS integer.
// Removing these lines will mess up with Bookshelf count() methods and bigserial values
pg.types.setTypeParser(20, "text", parseInt);
const PG_DECIMAL_OID = 1700;
pg.types.setTypeParser(PG_DECIMAL_OID, "text", parseFloat);

_bookshelf.plugin(["bookshelf-camelcase"]);

export { _knex, _bookshelf };
