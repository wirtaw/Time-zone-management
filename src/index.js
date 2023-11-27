'use strict';

const path = require('path');

const fastify = require('fastify')({ logger: true });
const helmet = require('@fastify/helmet');
const { DateTime, Settings } = require('luxon');

const Client = require('./models/client');
const Store = require('./models/store');

Settings.defaultZone = 'utc';
console.info(`defaultZone zoneName ${DateTime.local().zoneName}`);

const dt = DateTime.local();

fastify.register(require('@fastify/static'), {
 root: path.join(__dirname, '../public'),
 prefix: '/public/'
});

fastify.register(
  helmet,
  { contentSecurityPolicy: false, global: true }
);

fastify.register(require('@fastify/view'), {
  engine: {
    ejs: require('ejs')
  },
  templates: 'templates',
  includeViewExtension: true,
  options: {
    partials: {
      header: './partials/header.ejs',
      footer: './partials/footer.ejs',
      source: './partials/source.ejs'
    }
  }
});

fastify.setErrorHandler(function (error, request, reply) {
 if (error.message.includes('The partial') && error.message.includes('could not be found')) {
  fastify.log.error(error.message);
   reply.code(404).send({ error: 'Partial not found' });
 } else {
   reply.send(error);
 }
});

const clientA = new Client();
const clientB = new Client();

const store = new Store('utc');

const getInfo = () => {
    console.group('CLIENTS');

    console.info(`clientA ${clientA.getId()}
    zone: ${clientA.getZone()} 
    now ${clientA.getNow()}`);

    console.info(`clientB ${clientB.getId()}
    zone: ${clientB.getZone()} 
    now: ${clientB.getNow()}`);

    console.groupEnd('CLIENTS');

    console.group('PRODUCTS');

    store.loadProducts(5);
    store.getProducts();

    console.groupEnd('PRODUCTS');

    console.group('SERVER TIME');
    // console.dir(dt, { depth: 3 });
    console.info(`iso ${dt.toISO()}`);
    console.info(`offset ${dt.offset}`);
    console.info(`timestamp ${dt.toMillis()}`);
    console.info(`zone ${dt.zoneName}`);
    console.groupEnd('SERVER TIME');

    return { dt, clientA, clientB, products: store.products };
};

const start = async () => {
  try {
    getInfo();

    await fastify.listen({ port: 3000 });
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (exc) {
    Settings.defaultZone = 'system';
    console.info(`defaultZone zoneName ${DateTime.local().zoneName}`);

    console.error(' Error ', exc.message);
    fastify.log.error(exc);
    process.exit(1);
  }
};

fastify.get('/', (req, reply) => {
  const info = getInfo();
  reply.view('./main.ejs', { info, title: 'DateTime Luxon' });
});

start();