// My blog API 
// Set up the application and its router

const Koa = require('koa');
const Router = require ('koa-router');

const app = new Koa();
const router = new Router();
const config = require('./root/config.js');
const special = require('./routes/special.js');
const user = require('./routes/user.js');
const game = require('./routes/games.js');
const freetoplayapi = require('./routes/TriviaQuestionApi.js')
const ApiExample = require('./routes/CheapsharkApi.js');
app.use(ApiExample.routes());
app.use(user.routes());
app.use(game.routes());
app.use(special.routes())
app.use(freetoplayapi.routes());


module.exports = app