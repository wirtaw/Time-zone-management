'use strict';

const { faker } = require('@faker-js/faker');
const { DateTime } = require('luxon');

class Client {
  constructor(zone = '') {
    this.id = faker.string.uuid();
    this.firstName = faker.person.firstName();
    this.timezone = zone || faker.location.timeZone();
  }

  getZone() {
    return this.timezone;
  }

  getId() {
    return this.id;
  }

  getFirstName() {
    return this.firstName;
  }

  getNow() {
    return DateTime.now().setZone(this.timezone).toISO();
  }
}

module.exports = Client;