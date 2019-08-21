const pug = require('pug');
const uglify = require('uglify-js');
const fs = require('fs');

const Invitation = require('../../api/invitations/invitation.model');

const boardingTemplate = pug.compileFile(`${__dirname}/boarding.template.pug`, {basedir: 'app/pages'});
const script = uglify.minify(fs.readFileSync(`${__dirname}/boarding.client.js`).toString()).code;

const HOUR = 60 * 60 * 1000;

module.exports = {renderBoarding};

async function renderBoarding(ctx) {
  const [invitation] = await Invitation
      .find({
        activated: true,
        updatedAt: {
          $gte: new Date(Date.now() - HOUR),
          $lte: new Date()
        }
      })
      .sort('-updatedAt')
      .limit(1)
      .populate('traveler');

  const locals = {
    title: 'Boarding now',
    script,
    name: invitation ? invitation.traveler.fullName : '',
    distance: invitation ? invitation.traveler.statistics.distance : '',
    hours: invitation ? invitation.traveler.statistics.hours : '',
  };

  ctx.body = boardingTemplate(locals);
  ctx.type = 'html';
}
