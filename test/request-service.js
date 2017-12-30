'use strict';

const request = require('request-promise-native');
const fs = require('fs');

class RequestService {

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  get(url, query) {
    const options = {
      method: 'GET',
    };

    if (query) {
      options.qs = query;
    }

    return this.sendRequest(url, options);
  }

  post(url, prop_name, file_path) {
    const options = {
      method: 'POST'
    };

    if (prop_name, file_path) {
      const form = {};
      form[prop_name] = fs.createReadStream(file_path);
      options.formData = form;
    }

    return this.sendRequest(url, options);
  }

  sendRequest(uri, options) {
    options.uri = this.baseUrl + uri;
    return request(options);
  }
}

module.exports = RequestService;