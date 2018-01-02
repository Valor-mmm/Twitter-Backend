'use strict';

const request = require('request-promise-native');
const fs = require('fs');

class RequestService {

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  setToken(token) {
    this.token = token;
  }

  setAuth(options) {
    if (this.token) {
      const headers = {
        Authorization: 'bearer ' + this.token
      };
      options.headers = headers;
    }
    return options;
  }

  get(url, query) {
    let options = {
      method: 'GET',
    };

    options = this.setAuth(options);

    if (query) {
      options.qs = query;
    }

    return this.sendRequest(url, options);
  }

  post(url, prop_name, file_path) {
    let options = {
      method: 'POST'
    };

    options = this.setAuth(options);

    if (prop_name && file_path) {
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