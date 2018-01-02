'use strict';

const CrudTester = require('../crud-tester');
const fixtures = require('./user-fixtures-local');
const adminFixtures = require('../admin/admin-fixtures-local');
const logger = require('simple-node-logger').createSimpleLogger();

// eslint-disable-next-line no-undef
suite('User api test', function () {

  /**
   * Information:
   *  one -> single object of fixture
   *  some -> object list of fixture
   *  all -> one + some combined
   *      -> in case of DELETE and GET: every available entry. Not only from fixtures
   *
   */

  const crudTester = new CrudTester(fixtures);

  const logSuccess = function(name) {
    logger.info(`Successfully tested: ${name}`);
  };


  // eslint-disable-next-line no-undef
  suite('Admin Tests', function () {

    let users;

    // eslint-disable-next-line no-undef
    setup('Login admin and create users', function () {
      crudTester.setAdminAuth(adminFixtures);
      crudTester.deleteAll();
      const user = crudTester.loginUser(fixtures, crudTester);
      users = [user].concat(crudTester.createSome());
      crudTester.setAdminAuth(adminFixtures);
    });

    // eslint-disable-next-line no-undef
    teardown('Logout admin and delete users', function () {
      crudTester.deleteAll();
      crudTester.unsetAuth();
    });

    const getOneAllName = 'Get one from all';
    // eslint-disable-next-line no-undef
    test(getOneAllName, function () {
      crudTester.getByObject(users[0]);
      logSuccess(getOneAllName);
    });

    const getSomeAllName = 'Get many from all';
    // eslint-disable-next-line no-undef
    test(getSomeAllName, function () {
      crudTester.getByObjectArray(users.splice(1));
      logSuccess(getSomeAllName);
    });

    const delOneAllName = 'Delete one of all';
    // eslint-disable-next-line no-undef
    test(delOneAllName, function () {
      crudTester.deleteByObj(users[0]);
      logSuccess(delOneAllName);
    });

    const delSomeAllName = 'Delete some of all';
    // eslint-disable-next-line no-undef
    test(delSomeAllName, function () {
      crudTester.deleteByObjArray(users.slice(1));
      logSuccess(delSomeAllName);
    });

  });

  // eslint-disable-next-line no-undef
  suite('User Tests', function () {
    let user;

    // eslint-disable-next-line no-undef
    setup('Login user, delete some', function () {
      crudTester.setAdminAuth(adminFixtures);
      crudTester.deleteAll();
      user = crudTester.loginUser(fixtures, crudTester);
    });

    // eslint-disable-next-line no-undef
    teardown('Logout user', function () {
      if (user) {
        crudTester.logoutUser(user, crudTester);
      }
    });

    const createManyName = 'Create many';
    // eslint-disable-next-line no-undef
    test(createManyName, function () {
      crudTester.createSome();
      logSuccess(createManyName);
    });

    const getOneOneName = 'Get one from one';
    // eslint-disable-next-line no-undef
    test(getOneOneName, function () {
      crudTester.getByObject(user);
      logSuccess(getOneOneName);
    });

    const getOneAllName = 'Get one from all';
    // eslint-disable-next-line no-undef
    test(getOneAllName, function () {
      crudTester.createSome();
      crudTester.getByObject(user);
      logSuccess(getOneAllName);
    });

    const getSomeAllName = 'Get many from all';
    // eslint-disable-next-line no-undef
    test(getSomeAllName, function () {
      crudTester.getSome();
      logSuccess(getSomeAllName);
    });

    const changeOneOneName = 'Change one of one';
    // eslint-disable-next-line no-undef
    test(changeOneOneName, function () {
      crudTester.changeByObject(user, fixtures.changedAttributes);
      logSuccess(changeOneOneName);
    });

    const changeOneAllName = 'Change one of all';
    // eslint-disable-next-line no-undef
    test(changeOneAllName, function () {
      crudTester.createSome();
      crudTester.changeByObject(user, fixtures.changedAttributes);
      logSuccess(changeOneAllName);
    });

    const delOneOneName = 'Delete one of one';
    // eslint-disable-next-line no-undef
    test(delOneOneName, function () {
      crudTester.deleteByObj(user);
      user = null;
      logSuccess(delOneOneName);
    });

    const delOneAllName = 'Delete one of all';
    // eslint-disable-next-line no-undef
    test(delOneAllName, function () {
      crudTester.createSome();
      crudTester.deleteByObj(user);
      user = null;
      logSuccess(delOneAllName);
    });

  });
});