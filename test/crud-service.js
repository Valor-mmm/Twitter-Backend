'use strict';

const HttpService = require('./sync-http-service');

class CrudService {

  static getQueryIdsObject(ids) {
    let queryObject = null;
    if (ids) {
      queryObject= {ids: ids};
    }
    return queryObject;
  }

  constructor(baseUrl, apiUrl) {
    this.apiUrl = apiUrl;
    this.httpService = new HttpService(baseUrl);
  }

  create(object) {
    return this.httpService.post(this.getUrl(), object);
  }

  getOne(id) {
    return this.httpService.get(this.getUrl(id));
  }

  getSomeById(ids) {
    const queryObject = CrudService.getQueryIdsObject(ids);
    return this.httpService.get(this.getUrl(), queryObject);
  }

  update(id, changedAttributes) {
    return this.httpService.put(this.getUrl(id), changedAttributes);
  }

  deleteOne(id) {
    return this.httpService.delete(this.getUrl(id));
  }

  deleteSomeById(ids) {
    const queryObject = CrudService.getQueryIdsObject(ids);
    return this.httpService.delete(this.getUrl(), queryObject);
  }

  getUrl(id) {
    let url = this.apiUrl;
    if (id) {
      url += `/${id}`;
    }
    return url;
  }

}

module.exports = CrudService;