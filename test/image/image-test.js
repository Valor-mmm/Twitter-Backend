'use strict';

const assert = require('chai').assert;
const logger = require('simple-node-logger').createSimpleLogger();
const fixtures = require('./image-fixtures-local');

const CrudTester = require('../crud-tester');
const userFixtures = require('../user/user-fixtures-local');
const adminFixtures = require('../admin/admin-fixtures-local');

const RequestService = require('../request-service');

// eslint-disable-next-line no-undef
suite('Image api test', function () {

  const requestService = new RequestService(fixtures.baseUrl);
  const userTester = new CrudTester(userFixtures);
  const adminTester = new CrudTester(adminFixtures);

  const getImagePath = function () {
    return __dirname + '/' + fixtures.imageName;
  };

  const loginUser = () => {
    const user = userTester.createOne();
    const token = userTester.setUserAuth();
    requestService.setToken(token);
    return user;
  };

  const logoutUser = (user) => {
    requestService.setToken(null);
    userTester.deleteByObj(user);
    userTester.unsetAuth();
  };

  const loginAdmin = () => {
    const token = adminTester.setAdminAuth();
    requestService.setToken(token);
  };

  const logoutAdmin = () => {
    adminTester.unsetAuth();
    requestService.setToken(null);
  };

  const uploadImage = async function (path) {
    const user = loginUser();
    let rawResult;
    try {
      rawResult = await requestService.post(fixtures.apiUrl, 'image', path);
    } catch (error) {
      logger.error(error);
      throw error;
    }
    const result = JSON.parse(rawResult);
    assert(result.bytes, fixtures.bytes);
    assert(result.height, fixtures.height);
    assert(result.width, fixtures.width);
    assert(result.type, fixtures.type);
    assert(result.resource_type, fixtures.resource_type);
    assert(result.format, fixtures.format);

    logoutUser(user);
    return result;
  };


  const testUriForPublicId = async function (uploadImagePromise, asAdmin) {
    let user;
    try {
      const uploadResult = await uploadImagePromise;
      assert.isDefined(uploadResult.secure_url);
      assert.isDefined(uploadResult.public_id);
      const query = {publicId: uploadResult.public_id};

      if (asAdmin) {
        loginAdmin();
      } else {
        user = loginUser();
      }
      const actualSecureUrl = await requestService.get(fixtures.apiUrl, query);
      assert(actualSecureUrl, uploadResult.secure_url);
    } catch (error) {
      logger.error(error);
      assert(error, 1);
      throw error;
    }

    if (asAdmin) {
      logoutAdmin();
    } else {
      logoutUser(user);
    }
  };


  const name_UploadImage = 'Upload image';
  const test_UploadImage = function () {
    const path = getImagePath();
    uploadImage(path);
  };


  const name_GetUrlForImageId = 'Get url for uploaded image';
  const test_GetUrlForImageId = function (uploadResult, asAdmin) {
    const path = getImagePath();
    testUriForPublicId(uploadResult ? uploadResult : uploadImage(path), asAdmin).then((result) => {
      logger.info('Test success.', result);
      assert(1, 1);
    }).catch(err => {
      logger.error(err);
      assert(err, 1);
      throw err;
    });
  };


  // eslint-disable-next-line no-undef
  test(name_UploadImage, test_UploadImage);


  // eslint-disable-next-line no-undef
  test(name_GetUrlForImageId + 'asUser', function () {
    test_GetUrlForImageId(null, false);
  });

  // eslint-disable-next-line no-undef
  test(name_GetUrlForImageId + 'asAdmin', function () {
    const uploadResult = uploadImage(getImagePath());
    test_GetUrlForImageId(uploadResult, true);
  });


});