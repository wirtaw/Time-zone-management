'use strict';

const { faker } = require('@faker-js/faker');
const { DateTime } = require('luxon');

class Store {
  constructor(zone = '') {
    this.products = [];
    this.timezone = zone || faker.location.timeZone();
  }

  getZone() {
    return this.timezone;
  }

  getProducts() {
    for (const product of this.products) {
      const { id, title, createdAt, updatedAt, availalbleAt } = product;
      console.info(`${id}
      ${title}
      availalbleAt ${DateTime.fromMillis(availalbleAt).toISO()}
      created ${DateTime.fromMillis(createdAt).toISO()}
      updatedAt ${DateTime.fromMillis(updatedAt).toISO()}
      `);
    }
  }

  loadProducts(len = 10) {
    this.products = Array.from({ length: len }, (v, i) => ({
      id: faker.string.uuid(),
      title: faker.word.words({ count: 5, min: 1, max: 5 }),
      availalbleAt: DateTime.fromJSDate(faker.date.future()).setZone(this.timezone).toMillis(),
      createdAt: DateTime.fromJSDate(faker.date.past()).setZone(this.timezone).toMillis(),
      updatedAt: DateTime.fromJSDate(faker.date.past()).setZone(this.timezone).toMillis(),
    }));
  }
}

module.exports = Store;