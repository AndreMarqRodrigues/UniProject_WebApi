const {Validator, ValidationError} = require('jsonschema');
const gameSchema = require('../root/schemas/games.schema.json');
const userSchema = require('../root/schemas/users.schema.json').definitions.user;
const reviewsSchema = require('../root/schemas/reviews.schema.json').definitions.reviews;
const gamesRatingSchema = require('../root/schemas/games.schema.json').definitions.games;


const makeKoaValidator = (schema, resource) => {
  const v = new Validator();
  const validationOptions = {
    throwError: true,
    propertyName: resource
  };
  const handler = async (ctx, next) => {
    const body = ctx.request.body;
    try {
      v.validate(body, schema, validationOptions);
      await next();
    } catch (error) {
      if (error instanceof ValidationError) {
        console.error(error);
        ctx.body = {message: error.stack};
        ctx.status = 400;
      } else {
        throw error;
      }
    }
  }
  return handler;
}

exports.validateGame = makeKoaValidator(gameSchema, 'games');
exports.validateUser = makeKoaValidator(userSchema, 'users');
exports.validateReview = makeKoaValidator(reviewsSchema, 'reviews');
exports.validateRate = makeKoaValidator(gamesRatingSchema, 'rates');