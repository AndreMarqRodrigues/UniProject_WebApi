const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const api = require('../root/integrations/ApiExample/CheapsharkApi.js')

const router = Router({prefix: '/api/v1/cheapsharkapi'});


router.get('/', bodyParser(), getAnApi);

async function getAnApi(ctx) {
    let result = await api.getApiData();
    console.log(result)
      if (result) {
        console.log(result)
      ctx.body = {  "title": result.info.title, "Best Prices": result.deals.map(deal => deal.retailPrice)};
      content = result.deals.map(deal => deal.retailPrice);
      if (!result.info.title || result.deals === []){ 
        ctx.status = 404; // not found
      }
    }
  }

  
  module.exports = router;