'use strict';

const assert = require('chai').assert;
const fixtures = require('./image-fixtures-local');

const RequestService = require('../request-service');

// eslint-disable-next-line no-undef
suite('Image api test', function () {

  const requestService = new RequestService(fixtures.baseUrl);

  const getImagePath = function() {
    return __dirname + '/' + fixtures.imageName;
  };

  const uploadImage = async function (path) {
    const rawResult = await requestService.post(fixtures.apiUrl, 'image', path);
    const result = JSON.parse(rawResult);
    assert(result.bytes, fixtures.bytes);
    assert(result.height, fixtures.height);
    assert(result.width, fixtures.width);
    assert(result.type, fixtures.type);
    assert(result.resource_type, fixtures.resource_type);
    assert(result.format, fixtures.format);
    return result;
  };


  const testUriForPublicId = async function (uploadImagePromise) {
    try {
      const uploadResult = await uploadImagePromise;
      assert.isDefined(uploadResult.secure_url);
      assert.isDefined(uploadResult.public_id);
      const query = {publicId: uploadResult.public_id};
      const actualSecureUrl = await requestService.get(fixtures.apiUrl, query);
      assert(actualSecureUrl, uploadResult.secure_url);
    } catch (error) {
      assert(error, 1);
    }
  };


  // eslint-disable-next-line no-undef
  test('Upload image', function () {
    const path = getImagePath();
    uploadImage(path);
  });


  // eslint-disable-next-line no-undef
  test('Get url for uploaded image', async function () {
    const path = getImagePath();
    testUriForPublicId(uploadImage(path));
  });
});