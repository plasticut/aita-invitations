const moment = require('moment');
const pug = require('pug');

const Invitation = require('./invitation.model');
const generateBarcodeImageBuffer = require('../../utils/generateBarcodeImageBuffer');
const htmlToImage = require('../../utils/htmlToImage');

const invitationTemplate = pug.compileFile(`${__dirname}/invitation.template.pug`);

class InvitationService {
  /**
   * Generate image for invitation
   * @async
   * @param {Invitation} options.invitation - invitation object
   * @param {Traveler} options.traveler - traveler object
   * @param {Event} options.event - event object
   * @param {String} [options.imageType=png] - type of generated image
   * @return {Buffer}
   */
  async generateInvitationImage({invitation, traveler, event, imageType = 'png'}) {
    const barcodeImageBuffer = await generateBarcodeImageBuffer(String(invitation._id));

    const invitationHtml = await invitationTemplate({
      barcodeImageURI: barcodeImageBuffer.toString('base64'),
      invitation,
      traveler,
      event,
      moment
    });

    return await htmlToImage(invitationHtml, {type: imageType});
  }

  /**
   * Returns an array of random invitations for the specified period
   * @async
   * @param {number} period - ms from now
   * @param {number} count - max count of invitation samples
   * @return {[Invitation]}
   */
  async getRandomLatestUsedInvitations(period, count = 1) {
    const invitations = await Invitation
        .aggregate([
          {
            $match: {
              activated: true,
              updatedAt: {
                $gte: new Date(Date.now() - period),
                $lte: new Date()
              }
            }
          },
          {
            $sample: {
              size: count
            }
          },
          {
            $project: {
              traveler: 1
            }
          }
        ]);

    return invitations;
  }
}

module.exports = new InvitationService();
