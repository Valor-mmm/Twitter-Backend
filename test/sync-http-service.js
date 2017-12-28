'use strict';

const request = require('sync-request');

class SyncHttpService {

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  get(url, query) {
    const res = request('GET', this.baseUrl + url, query ? {qs: query} : {});
    if (res.statusCode < 300) {
      return JSON.parse(res.getBody('utf8'));
    }

    const error = this.getErrorObject(res.statusCode, 'GET', this.baseUrl + url);
    throw error;
  }

  post(url, obj) {
    const res = request('POST', this.baseUrl + url, { json: obj });
    if (res.statusCode < 300) {
      return JSON.parse(res.getBody('utf8'));
    }

    const error = this.getErrorObject(res.statusCode, 'POST', this.baseUrl + url);
    throw error;
  }

  delete(url, obj) {
    const res = request('DELETE', this.baseUrl + url, obj ? {qs: obj} : void(0));
    return res.statusCode;
  }

  put(url, obj) {
    const res = request('PUT', this.baseUrl + url, { json: obj });
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