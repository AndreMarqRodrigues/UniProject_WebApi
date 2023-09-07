const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const user = require('../models/user');
const auth = require('../controllers/auth.js');
const can = require('../permissions/users.js');
const router = Router({prefix: '/api/v1/users'});
const {validateUser} = require('../controllers/validation.js');

router.get('/', auth, getAll);
router.post('/', bodyParser(), validateUser, createUser);
router.get('/:id([0-9]{1,})', auth, getById);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateUser, updateUser);
router.del('/:id([0-9]{1,})', auth, deleteUser);

async function getAll(ctx) {
  const permission = can.readAll(ctx.state.user);
    if (!permission.granted) {
      ctx.status = 403;
    } else {
      const result = await user.getAll();
      if (result.length) {
        ctx.body = result;
      }
    }
}

async function getById(ctx) {
  const id = ctx.params.id;
  const result = await user.getById(id);
  if (result.length) {
    const data = result[0]
    const permission = can.read(ctx.state.user, data);
    if (!permission.granted) {
      ctx.status = 403;
    } else {
      ctx.body = permission.filter(data);
    }
  }
}

async function createUser(ctx) {
const body = ctx.request.body;
let result = await user.add(body); 
if (result) {
ctx.status = 201;
ctx.body = {ID: result.insertId}
}
}
async function updateUser(ctx) {
  const id = ctx.params.id;
  let result = await user.getById(id);  
  if (result.length) {
    let users = result[0];
    const {ID, dateRegistered, ...body} = ctx.request.body;
    const permission = can.update(ctx.state.user, users);
    if (!permission.granted) {
      ctx.state = 403;
    }
    else{
    const newData = permission.filter(ctx.request.body);
    Object.assign(newData, {ID: id});
    result = await user.update(newData);
    if (result.affectedRows) {
      ctx.status = 200;
      ctx.body = {ID: id, updated: true, link: ctx.request.path};
    } else {
      ctx.status = 500; 
      ctx.body = {error: 'Unable to find a user.'};
    }
    }
  } else {
    ctx.status = 404;
    ctx.body = {error: 'user not found.'};
  }
}
async function deleteUser(ctx) {
  const id = ctx.params.id;
  let result = await user.getById(id);
  if (result.length) {
    const data = result[0];
    console.log("trying to delete", data);
    const permission = can.delete(ctx.state.user, data);
    if (!permission.granted) {
      ctx.status = 403;
    } else {
      result = await user.deleteById(id);
      if (result.affectedRows) {
        ctx.body = {ID: id, deleted: true}
        ctx.status = 200;
      }
    }
  }
}
    


module.exports = router;