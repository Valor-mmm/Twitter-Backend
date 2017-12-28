'use strict';

const CrudTester = require('../crud-tester');
const fixtures = require('./user-fixtures');
const logger = require('simple-node-logger').createSimpleLogger();

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

  const beforeEachName = 'Delete all';
  setup(beforeEachName, function() {
    crudTester.deleteAll();
    logSuccess(beforeEachName);
  });

  const createOneName = 'Create one';
  test(createOneName, function () {
    crudTester.createOne();
    logSuccess(createOneName);
  });

  const createManyName = 'Create many';
  test(createManyName, function () {
    crudTester.createSome();
    logSuccess(createManyName);
  });

  const createAllName = 'Create all';
  test(createAllName, function () {
    crudTester.createAll();
    logSuccess(createAllName);
  });

  const getOneOneName = 'Get one from one';
  test(getOneOneName, function () {
    crudTester.getOne();
    logSuccess(getOneOneName);
  });

  const getOneAllName = 'Get one from all';
  test(getOneAllName, function () {
    crudTester.createSome();
    crudTester.getOne();
    logSuccess(getOneAllName);
  });

  const getSomeSomeName = 'Get many from many';
  test(getSomeSomeName, function () {
    crudTester.getSome();
    logSuccess(getSomeSomeName);
  });

  const getSomeAllName = 'Get many from all';
  test(getSomeAllName, function () {
    crudTester.createOne();
    crudTester.getSome();
    logSuccess(getSomeAllName);
  });


  const changeOneOneName = 'Change one of one';
  test(changeOneOneName, function () {
    crudTester.changeOne();
    logSuccess(changeOneOneName);
  });

  const changeOneAllName = 'Change one of all';
  test(changeOneAllName, function () {
    crudTester.createSome();
    crudTester.changeOne();
    logSuccess(changeOneAllName);
  });

  const changeSomeSomeName = 'Change some of some';
  test(changeSomeSomeName, function () {
    crudTester.changeSome();
    logSuccess(changeSomeSomeName);
  });

  const changeSomeAllName = 'Change some of all';
  test(changeSomeAllName, function () {
    crudTester.createOne();
    crudTester.changeSome();
    logSuccess(changeSomeAllName);
  });


  const delOneOneName = 'Delete one of one';
  test(delOneOneName, function () {
    crudTester.deleteOne();
    logSuccess(delOneOneName);
  });

  const delOneAllName = 'Delete one of all';
  test(delOneAllName, function () {
    crudTester.createSome();
    crudTester.deleteOne();
    logSuccess(delOneAllName);
  });

  const delSomeSomeName = 'Delete some of some';
  test(delSomeSomeName, function () {
    crudTester.deleteSome();
    logSuccess(delSomeSomeName);
  });

  const delSomeAllName = 'Delete some of all';
  test(delSomeAllName, function () {
    crudTester.createOne();
    crudTester.deleteSome();
    logSuccess(delSomeAllName);
  });

});