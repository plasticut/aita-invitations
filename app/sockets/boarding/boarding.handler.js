const Invitation = require('../../api/invitations/invitation.model');
const Traveler = require('../../api/travelers/traveler.model');
const io = require('../../socketIo');
const logger = require('../../libs/logger')(module);

const boardingNs = io.of('boarding');

let changeStream;
let connectedClients = 0;

const watchFilter = [
  {
    $match: {
      $and: [
        {'updateDescription.updatedFields.activated': true},
        {operationType: 'update'}
      ]
    }
  }
];

const watchOptions = {
  fullDocument: 'updateLookup'
};

boardingNs.on('connect', onSocketConnect);

function onSocketConnect(socket) {
  connectedClients++;

  logger.debug('BOARDING:onSocketConnect', {connectedClients});

  if (!changeStream) {
    changeStream = Invitation.watch(watchFilter, watchOptions);
    changeStream.on('close', onChangeStreamClose);
    changeStream.on('change', onInvitationChange);
  }

  socket.on('disconnect', onSocketDisconnect);
}

function onSocketDisconnect() {
  connectedClients--;

  logger.debug('BOARDING:onSocketDisconnect', {connectedClients});

  if (connectedClients === 0 && changeStream) {
    changeStream.removeListener('change', onInvitationChange);
    changeStream.removeListener('close', onChangeStreamClose);
    changeStream.close();
    changeStream = null;
  }
}

async function onInvitationChange(change) {
  logger.debug('BOARDING:onInvitationChange', change);

  const traveler = await Traveler.findById(change.fullDocument.traveler);

  boardingNs.emit('traveler', traveler.toJSON({virtuals: true}));
}

function onChangeStreamClose() {
  changeStream = null;
}
