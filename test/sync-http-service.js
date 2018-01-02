'use strict';

const request = require('sync-request');
const _ = require('lodash');

class SyncHttpService {

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getConf(specificConfig) {
    if (this.authHeadder && specificConfig) {
      return _.merge({headers: this.authHeadder}, specificConfig);
    }
    if (this.authHeadder) {
      return {headers: this.authHeadder};
    }
    return specificConfig;
  }

  setAuth(url, payload) {
    const res = request('POST', this.baseUrl + url, { json: payload });
    if (res.statusCode === 201) {
      const result = JSON.parse(res.getBody('utf8'));
      if (result.success) {
        this.authHeadder = { Authorization: 'bearer ' + result.token, };
        return result.token;
      }
    }

    this.authHeadder = null;
    return false;
  }

  clearAuth() {
    this.authHeadder = null;
  }

  get(url, query) {
    const res = request('GET', this.baseUrl + url, query ? this.getConf({qs: query}) : this.getConf({}));
    if (res.statusCode < 300) {
      return JSON.parse(res.getBody('utf8'));
    }

    const error = this.getErrorObject(res.statusCode, 'GET', this.baseUrl + url);
    throw error;
  }

  post(url, obj) {
    const res = request('POST', this.baseUrl + url, this.getConf({ json: obj }));
    if (res.statusCode < 300) {
      return JSON.parse(res.getBody('utf8'));
    }

    const error = this.getErrorObject(res.statusCode, 'POST', this.baseUrl + url);
    throw error;
  }

  delete(url, obj) {
    const res = request('DELETE', this.baseUrl + url, obj ? this.getConf({qs: obj}) : this.getConf(void(0)));
    return res.statusCode;
  }

  put(url, obj) {
    const res = request('PUT', this.baseUrl + url, this.getConf({ json: obj }));
    if (res.statusCode <= 204) {
      return JSON.parse(res.getBody('utf8'));
    }

    const error = this.getErrorObject(res.statusCode, 'PUT', this.baseUrl + url);
    throw error;
  }

  getErrorObject(code, method, url, cause) {
    const errCause = cause ? cause : 'The returned status code was an error code';

    const errObject = {
      cause: errCause,
      code: code,
      method: method,
      url: url,
    };

    return errObject;
  }
}

module.exports = SyncHttpService;