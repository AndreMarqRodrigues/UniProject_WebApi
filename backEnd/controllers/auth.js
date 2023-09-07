const passport = require('koa-passport');
const basicAuth = require('../root/strategies/basic.js');
passport.use(basicAuth);

module.exports = passport.authenticate(['basic'], {session:false});