const pug = require('pug');

const defaultTemplate = pug.compileFile(`${__dirname}/default.template.pug`, {basedir: 'app/pages'});

module.exports = {renderDefault};

async function renderDefault(ctx) {
  const locals = {
    title: ''
  };

  ctx.body = defaultTemplate(locals);
  ctx.type = 'html';
}
