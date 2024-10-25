var express = require('express');
var router = express.Router();
const Link = require('../models/link');

router.get('/:code/stats', async function (req, res, next) {
  const code = req.params.code;
  const result = await Link.findOne({ where: { code } });
  if (!result) {
    return res.sendStatus(404);
  }
  res.render('stats', result.dataValues);
})

router.get('/:code', async function (req, res, next) {
  const code = req.params.code;

  const result = await Link.findOne({ where: { code } });
  if (!result) {
    return res.sendStatus(404);
  }
  
  result.hits++;
  await result.save();

  res.redirect(result.url);
})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Encurtador Boladão' });
});



function generateCode() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%&@*';
  for (let i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

router.post('/encurtar', async function (req, res, next) {
  const url = req.body.url;
  const code = generateCode();

  const result = await Link.create({
    url,
    code
  })

  res.render('stats', result.dataValues);
})

module.exports = router;
