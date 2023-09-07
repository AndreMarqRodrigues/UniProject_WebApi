const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const api = require('../root/integrations/FreetoplaygamesApi/TriviaQuestionApi.js');

const router = Router({prefix: '/api/v1/triviaquestion'});


router.get('/', bodyParser(), getAnApi);

async function getAnApi(ctx) {
    let result = await api.getApiData();
    console.log(result)
      if (result) {
      questionCategory = result.results.map(res => res.category);
      questionIndex = result.results.map(res => res.question);
      rightAnswer = result.results.map(res => res.correct_answer);
      wrongAnswer = result.results.map(res => res.incorrect_answers);
      ctx.body = { "questionCategory": questionCategory, "question": questionIndex, "right answer": rightAnswer, "wrong answer": wrongAnswer};
    }
  }

  
  module.exports = router;