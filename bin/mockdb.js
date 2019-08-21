const {factory, MongooseAdapter} = require('factory-girl');

const seeders = require('../app/test/seeders');
const mongoose = require('../app/libs/mongoose');

const TRAVELER_COUNT = 100;
const EVENT_COUNT = 10;

function createFactory() {
  const fact = new factory.FactoryGirl();
  fact.setAdapter(new MongooseAdapter());

  seeders.forEach((defineSeeder) => defineSeeder(fact));

  return fact;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

void async function main() {
  await mongoose.waitConnection();

  await mongoose.connection.dropDatabase();

  const factory = createFactory();

  const travelers = await factory.createMany('Traveler', TRAVELER_COUNT);
  console.log(`Generated ${travelers.length} travelers`);

  const events = await factory.createMany('Event', EVENT_COUNT);
  console.log(`Generated ${events.length} events`);

  const invitationPromises = travelers.map(async (traveler) => {
    let index = 0;
    return factory.createMany('Invitation', randomInt(1, EVENT_COUNT), {
      traveler: traveler._id,
      event: () => events[index++]
    });
  });

  const invitaitons = await Promise.all(invitationPromises);

  const invitaitonCount = invitaitons.reduce((acc, cur) => acc + cur.length, 0);

  console.log(`Generated ${invitaitonCount} events`);

  process.exit(0);
}()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });

