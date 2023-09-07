const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const auth = require('../controllers/auth');
const can = require('../permissions/reviews.js')
const reviews = require('../models/reviews.js');

const router = Router({prefix: '/api/v1/reviews'});

router.get('/:id([0-9]{1,})', getById);
router.del('/:id([0-9]{1,})' , auth, deleteById);

async function getById(ctx) {
  const id = ctx.params.id;
  const result = await reviews.getById(id);
  if (result.length) {
    ctx.body = result[0];
  }
}

async function deleteById(ctx) {
  const id = ctx.params.id;
  let result = await reviews.getById(id);
  if (result.length) {
    const data = result[0];
    console.log("trying to delete", data);
    const permission = can.delete(ctx.state.user, data);
    if (!permission.granted) {
      ctx.status = 403;
    } else {
      result = await reviews.deleteById(id);
      if (result.affectedRows) {
        ctx.body = {ID: id, deleted: true};
        ctx.status = 204;
      }
      else{
        ctx.status = 404;
        ctx.body = {error: "review not found."}
      }
    }
  }
}


module.exports = router;