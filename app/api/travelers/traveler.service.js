const InvitationService = require('../invitations/invitation.service');
const Traveler = require('./traveler.model');

class TravelerService {
  /**
   * Returns an array of random arrived travelers for the specified period
   * @async
   * @param {number} period - ms from now
   * @param {number} count - max count of travelers samples
   * @return {[Traveler]} - array of travelers objects
   */
  async getRandomArrivedTravelers(period, count = 1) {
    const invitations = await InvitationService.getRandomLatestUsedInvitations(period, count);

    const travelersIds = invitations.map((invitation) => invitation.traveler);

    const travelers = await Traveler.find({
      _id: {$in: travelersIds}
    });

    return travelers;
  }
}

module.exports = new TravelerService;
