const fs = require('fs');
const t = require('tap');
const mongoose = require('mongoose');

const {createTestContext} = require('../../../test/TestContext');
const {NOT_FOUND} = require('../../../errors/codes');
const Invitation = require('../invitation.model');

const {ObjectId} = mongoose.Types;

const testPngFilePath = `${__dirname}/../../../test/files/invitation.png`;
const testPngFileSize = fs.statSync(testPngFilePath).size;
const testJpgFilePath = `${__dirname}/../../../test/files/invitation.jpeg`;
const testJpgFileSize = fs.statSync(testJpgFilePath).size;
const fakeObjectId = '000000000000000000000abc';

const generateInvitationImageUri = '/api/v1/invitations/:invitationId/image';

const TRAVELER_COUNT = 5;
const EVENT_COUNT = 2;
const INVITATION_PER_TRAVELER_COUNT = 2;

t.test(`GET ${generateInvitationImageUri}`, async (t) => {
  const testContext = await createTestContext({t});

  const [events, travelers, event, traveler] = await Promise.all([
    testContext.createMany('Event', EVENT_COUNT, {}),
    testContext.createMany('Traveler', TRAVELER_COUNT, {}),
    testContext.createOne('Event', {
      address: 'Pan Am Experience, 13240 Weidner Street, Pacoima Los Angeles, CA',
      startDate: '2019-03-07T15:30:00.000Z'
    }),
    testContext.createOne('Traveler', {
      firstName: 'Sergey',
      lastName: 'Pronin'
    }),
  ]);

  await Promise.all(
      [traveler, ...travelers].map(async (traveler) => {
        const invitations = await testContext.createMany('Invitation', INVITATION_PER_TRAVELER_COUNT, {
          traveler: traveler._id,
          event: event._id
        });

        return invitations[0];
      })
  );

  await Invitation.remove({_id: fakeObjectId});

  const invitation = await testContext.createOne('Invitation', {
    _id: new ObjectId(fakeObjectId),
    traveler: traveler._id,
    event: event._id
  });

  await t.test('validate fields', async (t) => {
    const tests = [
      {message: 'validate imageType enum', invitationId: invitation._id, query: {imageType: 'bmp'}}
    ];

    for (const {message, invitationId, query} of tests) {
      const {body, status} = await generateInvitationImageRequest(invitationId, query)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/);

      t.deepEqual({code: body.code, status}, {
        status: 400,
        code: 'SWAGGER_REQUEST_VALIDATION_FAILED'
      }, message);
    }
  });

  await t.test('invitation should exist', async (t) => {
    const {body, status} = await generateInvitationImageRequest(new ObjectId());

    t.deepEqual({body, status}, {
      status: 404,
      body: {error: NOT_FOUND.INVITATION}
    }, 'sends not found error');
  });

  await t.test('generate invitation png image', async (t) => {
    const {body, status, headers} = await generateInvitationImageRequest(invitation._id);

    t.equal(status, 200, 'sends status 200');
    // t.equal(body.length, testPngFileSize, 'size match');
    t.equal(headers['content-type'], 'image/png', 'sends correct content type');
    // t.equal(headers['content-length'], `${testPngFileSize}`, 'has content-length header');
    t.equal(headers['content-disposition'], 'attachment; filename=Sergey%20Pronin%20invitation.png', 'has correct file name');
  });

  await t.test('generate invitation jpeg image', async (t) => {
    const {body, status, headers} = await generateInvitationImageRequest(invitation._id, {imageType: 'jpeg'});

    t.equal(status, 200, 'sends status 200');
    // t.equal(body.length, testJpgFileSize, 'size match');
    t.equal(headers['content-type'], 'image/jpeg', 'sends correct content type');
    // t.equal(headers['content-length'], `${testJpgFileSize}`, 'has content-length header');
    t.equal(headers['content-disposition'], 'attachment; filename=Sergey%20Pronin%20invitation.jpeg', 'has correct file name');
  });

  function generateInvitationImageRequest(invitationId, query = {}) {
    return testContext.requestSimple('GET', generateInvitationImageUri.replace(':invitationId', invitationId)).query(query);
  }
});
