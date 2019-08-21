const t = require('tap');
const fs = require('fs');
const {promisify} = require('util');
const mongoose = require('mongoose');

const Invitation = require('../invitation.model');

const {createTestContext} = require('../../../test/TestContext');

const writeFile = promisify(fs.writeFile);
const generateInvitationImageUri = '/api/v1/invitations/:invitationId/image';

const {ObjectId} = mongoose.Types;
const testPngFilePath = `${__dirname}/../../../test/files/invitation.png`;
const testJpgFilePath = `${__dirname}/../../../test/files/invitation.jpeg`;
const fakeObjectId = '000000000000000000000abc';

t.test(`GET ${generateInvitationImageUri}`, async (t) => {
  const testContext = await createTestContext({t});

  const [event, traveler] = await Promise.all([
    testContext.createOne('Event', {
      address: 'Pan Am Experience, 13240 Weidner Street, Pacoima Los Angeles, CA',
      startDate: '2019-03-07T15:30:00.000Z'
    }),
    testContext.createOne('Traveler', {
      firstName: 'Sergey',
      lastName: 'Pronin'
    })
  ]);

  await Invitation.remove({_id: fakeObjectId});

  const invitation = await testContext.createOne('Invitation', {
    _id: new ObjectId(fakeObjectId),
    traveler: traveler._id,
    event: event._id
  });

  await t.test('generate invitation png image', async (t) => {
    const {body, status, headers} = await generateInvitationImageRequest(invitation._id);

    t.equal(status, 200, 'sends status 200');
    t.equal(headers['content-type'], 'image/png', 'sends correct content type');
    t.equal(headers['content-disposition'], 'attachment; filename=Sergey%20Pronin%20invitation.png', 'has correct file name');

    await writeFile(testPngFilePath, body);
  });

  await t.test('generate invitation jpeg image', async (t) => {
    const {body, status, headers} = await generateInvitationImageRequest(invitation._id, {imageType: 'jpeg'});

    t.equal(status, 200, 'sends status 200');
    t.equal(headers['content-type'], 'image/jpeg', 'sends correct content type');
    t.equal(headers['content-disposition'], 'attachment; filename=Sergey%20Pronin%20invitation.jpeg', 'has correct file name');

    await writeFile(testJpgFilePath, body);
  });

  function generateInvitationImageRequest(invitationId, query = {}) {
    return testContext.requestSimple('GET', generateInvitationImageUri.replace(':invitationId', invitationId)).query(query);
  }
});
