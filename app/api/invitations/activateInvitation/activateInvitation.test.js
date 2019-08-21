const t = require('tap');
const mongoose = require('mongoose');
const _ = require('lodash');

const {createTestContext} = require('../../../test/TestContext');
const {NOT_FOUND, VALIDATION} = require('../../../errors/codes');

const {ObjectId} = mongoose.Types;

const activateInvitationUri = '/api/v1/invitations/:invitationId/activate';

t.test(`POST ${activateInvitationUri}`, async (t) => {
  const testContext = await createTestContext({t});

  const [event, traveler] = await Promise.all([
    testContext.createOne('Event', {}),
    testContext.createOne('Traveler', {})
  ]);

  const unusedInvitation = await testContext.createOne('Invitation', {
    traveler: traveler._id,
    event: event._id,
    activated: false
  });

  const activatedInvitation = await testContext.createOne('Invitation', {
    traveler: traveler._id,
    event: event._id,
    activated: true
  });

  await t.test('invitation should exist', async (t) => {
    const {body, status} = await activateInvitationRequest(new ObjectId());

    t.deepEqual({body, status}, {
      status: 404,
      body: {error: NOT_FOUND.INVITATION}
    }, 'sends not found error');
  });

  await t.test('sends error when invitation already activated', async (t) => {
    const {body, status} = await activateInvitationRequest(activatedInvitation._id);

    t.deepEqual({body, status}, {
      status: 400,
      body: {error: VALIDATION.INVITATION_ACTIVATED}
    }, 'sends validation error');
  });

  await t.test('activate invitation', async (t) => {
    const {body, status} = await activateInvitationRequest(unusedInvitation._id);

    t.equal(status, 200, 'sends status 200');
    t.deepEqual(_.pick(body, ['id', 'activated']), {
      id: String(unusedInvitation._id),
      activated: true
    }, 'sends populated invitation object');
  });

  function activateInvitationRequest(invitationId, query = {}) {
    return testContext.requestSimple('POST', activateInvitationUri.replace(':invitationId', invitationId)).query(query);
  }
});
