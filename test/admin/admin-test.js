'use strict';

const CrudTester = require('../crud-tester');
const fixtures = require('./admin-fixtures-local');
const logger = require('simple-node-logger').createSimpleLogger();

// eslint-disable-next-line no-undef
suite('Admin api test', function () {

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

  const beforeEachName = 'Delete some and auth';
  // eslint-disable-next-line no-undef
  setup(beforeEachName, function() {
    crudTester.setAdminAuth();
    crudTester.deleteSome();
    logSuccess(beforeEachName);
  });

  const tearDownName = 'Unset auth';
  // eslint-disable-next-line no-undef
  teardown(tearDownName, function () {
    crudTester.unsetAuth();
    logSuccess(tearDownName);
  });

  const createManyName = 'Create many';
  // eslint-disable-next-line no-undef
  test(createManyName, function () {
    crudTester.createSome();
    logSuccess(createManyName);
  });

  const createAllName = 'Create all';
  // eslint-disable-next-line no-undef
  test(createAllName, function () {
    crudTester.createAll();
    logSuccess(createAllName);
  });

  const getOneOneName = 'Get one from one';
  // eslint-disable-next-line no-undef
  test(getOneOneName, function () {
    crudTester.getOne();
    logSuccess(getOneOneName);
  });

  const getOneAllName = 'Get one from all';
  // eslint-disable-next-line no-undef
  test(getOneAllName, function () {
    crudTester.createSome();
    crudTester.getOne();
    logSuccess(getOneAllName);
  });

  const getSomeSomeName = 'Get many from many';
  // eslint-disable-next-line no-undef
  test(getSomeSomeName, function () {
    crudTester.getSome();
    logSuccess(getSomeSomeName);
  });

  const getSomeAllName = 'Get many from all';
  // eslint-disable-next-line no-undef
  test(getSomeAllName, function () {
    crudTester.createOne();
    crudTester.getSome();
    logSuccess(getSomeAllName);
  });


  const changeOneOneName = 'Change one of one';
  // eslint-disable-next-line no-undef
  test(changeOneOneName, function () {
    crudTester.changeOne();
    logSuccess(changeOneOneName);
  });

  const changeOneAllName = 'Change one of all';
  // eslint-disable-next-line no-undef
  test(changeOneAllName, function () {
    crudTester.createSome();
    crudTester.changeOne();
    logSuccess(changeOneAllName);
  });

  const changeSomeSomeName = 'Change some of some';
  // eslint-disable-next-line no-undef
  test(changeSomeSomeName, function () {
    crudTester.changeSome();
    logSuccess(changeSomeSomeName);
  });

  const changeSomeAllName = 'Change some of all';
  // eslint-disable-next-line no-undef
  test(changeSomeAllName, function () {
    crudTester.createOne();
    crudTester.changeSome();
    logSuccess(changeSomeAllName);
  });

  const delSomeSomeName = 'Delete some of some';
  // eslint-disable-next-line no-undef
  test(delSomeSomeName, function () {
    crudTester.deleteSome();
    logSuccess(delSomeSomeName);
  });

  const delSomeAllName = 'Delete some of all';
  // eslint-disable-next-line no-undef
  test(delSomeAllName, function () {
    crudTester.createOne();
    crudTester.deleteSome();
    logSuccess(delSomeAllName);
  });

});