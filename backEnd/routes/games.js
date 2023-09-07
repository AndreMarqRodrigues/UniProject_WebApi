const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const games = require('../models/games');
const reviews = require('../models/reviews.js');
const ratings = require('../models/gamesRating.js');
const auth = require('../controllers/auth');
const can = require('../permissions/games.js');
const canReview = require('../permissions/reviews.js');
const canRate = require('../permissions/gamesRating.js');
const router = Router({prefix: '/api/v1/games'});
const {validateGame, validateReview, validateRate} = require('../controllers/validation.js');

router.get('/', getAll);
router.post('/', auth, bodyParser(), validateGame, createGames);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', auth ,bodyParser(), validateGame, updateGames);
router.del('/:id([0-9]{1,})', auth, deleteGames);

// reviews routes
router.get('/:id([0-9]{1,})/reviews', getAllReviews);
router.post('/:id([0-9]{1,})/reviews', auth, bodyParser(), addReviewsIds, validateReview, addReview);
router.put('/:id([0-9]{1,})/reviews/:id([0-9]{1,})', auth ,bodyParser(), validateReview, updateReview);
router.del('/:id([0-9]{1,})/reviews/:id([0-9]{1,})' , auth, deleteReviewById);

// Rating routes
router.get('/:id([0-9]{1,})/rates', GetRating);
router.post('/:id([0-9]{1,})/rates',auth, bodyParser(), addRateIds, RatePost);
router.del('/:id([0-9]{1,})/rates/:id([0-9]{1,})', auth, unRateById);



async function getAll(ctx) {
let result = await games.getAll();
if (result.length) {
ctx.body = result;
}
}

async function getById(ctx) {
  const id = ctx.params.id;
  const result = await games.getById(id);
  if (result.length) {
    const data = result[0]
    ctx.body = data;
    ctx.status= 200;
   } else {
      ctx.status= 404;
    }
  }




async function createGames(ctx) {
  const body = ctx.request.body;
    const permission = can.add(ctx.state.user, body);
  if (!permission.granted){
    ctx.status = 403;
  }else{
    let result = await games.add(body);
    ctx.status = 201;
    ctx.body = {ID: result.insertId}
  }
}

async function updateGames(ctx) {
  const id = ctx.params.id;
  let result = await games.getById(id); 
  if (result.length) {
    let data = result[0];
    const permission = can.update(ctx.state.user, data);
    if (!permission.granted) {
      ctx.status = 403;
    } else {
      const {ID, ...body} = ctx.request.body;
      Object.assign(data, body);
      result = await games.update(id, data);
      if (result.affectedRows) {
        ctx.body = {ID: id, updated: true, link: ctx.request.path};
      }
    }
  }
}
  async function deleteGames(ctx) {
    const id = ctx.params.id;
    let result = await games.getById(id);
    if (result.length) {
      const data = result[0];
      console.log("trying to delete", data);
      const permission = can.delete(ctx.state.user, data);
      if (!permission.granted) {
        ctx.status = 403;
      } else {
        result = await games.deleteById(id);
        if (result.affectedRows) {
          ctx.body = {ID: id, deleted: true};
          ctx.status = 204;
        }
        else{
          ctx.status = 404;
          ctx.body = {error: "game not found."}
        }
      }
    }
  }

  async function getAllReviews(ctx) {
    const id = ctx.params.id;
    const result = await reviews.getAll(id);
    if (result) {
      ctx.body = result;
      ctx.status = 200;
    }
    else{
      ctx.status = 404;
      ctx.body = {error: "review not found"}
    }
  }
  
  async function addReview(ctx) {
    const review = ctx.request.body;
    const result = await reviews.add(review);
    if (result) {
      const id = result.insertId;
      ctx.status = 201;
      ctx.body = {ID: id, created: true};
    }
  }
  
  function addReviewsIds(ctx, next) {
    // every review needs an game ID and a user ID
    const id = parseInt(ctx.params.id);
    const uid = ctx.state.user.ID;
    Object.assign(ctx.request.body, {gamesID: id, userID: uid})
    return next();
  }
  async function updateReview(ctx) {
    const id = ctx.params.id;
    let result = await reviews.getById(id);
    console.log(result.length); // check it exists
    if (result) {
      let data = result[0];
      const permission = canReview.update(ctx.state.user, data);
      if (!permission.granted) {
        ctx.status = 403;
      } else {
        // exclude fields that should not be updated
        const {ID, ...body} = ctx.request.body;
        // overwrite updatable fields with remaining body data
        Object.assign(data, body);
        result = await reviews.update(id, data);
        if (result.affectedRows) {
          ctx.body = {ID: id, updated: true, link: ctx.request.path};
        }
      }
    }
  }

  async function deleteReviewById(ctx) {
    const id = ctx.params.id;
    let result = await reviews.getById(id);
    if (result.length) {
      const data = result[0];
      console.log("trying to delete", data);
      const permission = canReview.delete(ctx.state.user, data);
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

  async function GetRating(ctx) {
    const id = ctx.params.id;
    const result = await ratings.getAll(id);
    
    if (result.length) {
      const averageRating = result.reduce((sum, item) => sum + item.rating, 0) / result.length;
      ctx.body = { averageRating };
    } else {
      ctx.body = { averageRating: 0 };
    }
  }
  

  function addRateIds(ctx, next) {
    // every review needs an game ID and a user ID
    const id = parseInt(ctx.params.id);
    const uid = ctx.state.user.ID;
    Object.assign(ctx.request.body, {gamesID: id, userID: uid})
    return next();
  }

  async function RatePost(ctx) {
    const rate = ctx.request.body;
    const result = await ratings.addRate(rate);
    if (result.affectedRows) {
      const id = result.insertId;
      ctx.status = 201;
      ctx.body = {ID: id, created: true};
    }
  }

  async function unRateById(ctx) {
      const id = ctx.params.id;
      const uid = ctx.state.user.ID;
      let result = await ratings.getById(id, uid);
      if (result.length) {
        const data = result[0];
        console.log("trying to delete", data);
        const permission = canRate.delete(ctx.state.user, data);
        if (!permission.granted) {
          ctx.status = 403;
        } else {
          result = await ratings.unrate(id);
          if (result.affectedRows) {
            ctx.body = {ID: id, deleted: true};
            ctx.status = 204;
          }
          else{
            ctx.status = 404;
            ctx.body = {error: "rate not found."}
          }
        }
      }
    }


module.exports = router;