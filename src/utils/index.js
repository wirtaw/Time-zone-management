'use strict';

const { DateTime} = require('luxon');

const Client = require('../models/client');
const Store = require('../models/store');
const getInfo = () => {
  const dt = DateTime.local();

  const clientA = new Client();
  const clientB = new Client();

  const store = new Store('utc');

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

module.exports = getInfo;
