'use strict';

const CrudTester = require('../crud-tester');
const fixtures = require('./tweet-fixtures');
const userFixtures = require('../user/user-fixtures');
const adminFixtures = require('../admin/admin-fixtures');
const logger = require('simple-node-logger').createSimpleLogger();


// eslint-disable-next-line no-undef
suite('Tweet api test', function () {

  /**
   * Information:
   *  one -> single object of fixture
   *  some -> object list of fixture
   *  all -> one + some combined
   *      -> in case of DELETE and GET: every available entry. Not only from fixtures
   *
   */

  let crudTester = new CrudTester(fixtures);
  const userCrudTester = new CrudTester(userFixtures);

  const logSuccess = function (name) {
    logger.info(`Successfully tested: ${name}`);
  };



  // eslint-disable-next-line no-undef
  suite('User tests', function () {

    let user;


    // eslint-disable-next-line no-undef
    setup('Login user. Delete tweets', function () {
      user = crudTester.loginUser(userFixtures, userCrudTester);
      crudTester.deleteAll();
    });


    // eslint-disable-next-line no-undef
    teardown('Logout user', function () {
      crudTester.logoutUser(user, userCrudTester);
    });

    const createOneName = 'Create one';
    // eslint-disable-next-line no-undef
    test(createOneName, function () {
      crudTester.createOne();
      logSuccess(createOneName);
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

    const delOneOneName = 'Delete one of one';
    // eslint-disable-next-line no-undef
    test(delOneOneName, function () {
      crudTester.deleteOne();
      logSuccess(delOneOneName);
    });

    const delOneAllName = 'Delete one of all';
    // eslint-disable-next-line no-undef
    test(delOneAllName, function () {
      crudTester.createSome();
      crudTester.deleteOne();
      logSuccess(delOneAllName);
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



  // eslint-disable-next-line no-undef
  suite('Admin tests', function () {

    let tweets;

    // eslint-disable-next-line no-undef
    setup('Login admin and delete tweets', function () {
      const user = crudTester.loginUser(userFixtures, userCrudTester);
      crudTester.deleteAll();
      tweets = crudTester.createAll();
      crudTester.logoutUser(user, userCrudTester);
      crudTester.setAdminAuth(adminFixtures);
    });


    // eslint-disable-next-line no-undef
    teardown('Logout admin', function () {
      crudTester.unsetAuth();
    });


    const getOneAllName = 'Get one from all';
    // eslint-disable-next-line no-undef
    test(getOneAllName, function () {
      crudTester.getByObject(tweets[0]);
      logSuccess(getOneAllName);
    });

    const getSomeAllName = 'Get many from all';
    // eslint-disable-next-line no-undef
    test(getSomeAllName, function () {
      crudTester.getByObjectArray(tweets.slice(1));
      logSuccess(getSomeAllName);
    });

    const delOneAllName = 'Delete one of all';
    // eslint-disable-next-line no-undef
    test(delOneAllName, function () {
      crudTester.deleteByObj(tweets[0]);
      logSuccess(delOneAllName);
    });

    const delSomeAllName = 'Delete some of all';
    // eslint-disable-next-line no-undef
    test(delSomeAllName, function () {
      crudTester.deleteByObjArray(tweets.slice(1));
      logSuccess(delSomeAllName);
    });
  });

});