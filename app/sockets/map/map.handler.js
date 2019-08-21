const _ = require('lodash');
const logger = require('../../libs/logger')(module);
const TravelerService = require('../../api/travelers/traveler.service');
const io = require('../../socketIo');

const mapNs = io.of('map');

const UPDATE_PERIOD = 10 * 1000;
const HOUR = 60 * 60 * 1000;

let connectedClients = 0;
let traveler;
let lastUpdateDate = 0;
let updateInterval;

mapNs.on('connect', onSocketConnect);

async function onSocketConnect(socket) {
  connectedClients++;

  logger.debug('MAP:onSocketConnect', {connectedClients});

  const needUpdate = lastUpdateDate + HOUR < Date.now();

  if (!traveler || needUpdate) {
    await updateTraveler();
  }

  if (traveler) {
    mapNs.emit('traveler', traveler.toJSON({virtuals: true}));
  }

  if (!updateInterval) {
    updateInterval = setInterval(onInterval, UPDATE_PERIOD);
  }

  socket.on('disconnect', onSocketDisconnect);
}

function onSocketDisconnect() {
  connectedClients--;

  logger.debug('MAP:onSocketDisconnect', {connectedClients});

  if (connectedClients === 0) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
}

async function updateTraveler() {
  let travelers = await TravelerService.getRandomArrivedTravelers(HOUR, 3);

  logger.debug('MAP:updateTraveler', {travelers});

  if (traveler) {
    travelers = _.reject(travelers, (newTraveler) => String(newTraveler._id) === String(traveler._id));
  }

  traveler = _.sample(travelers);

  lastUpdateDate = new Date();
}

async function onInterval() {
  await updateTraveler();

  logger.debug('MAP:onInterval', {traveler, lastUpdateDate});

  if (traveler && connectedClients) {
    mapNs.emit('traveler', traveler.toJSON({virtuals: true}));
  }
}
