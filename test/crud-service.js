'use strict';

const HttpService = require('./sync-http-service');

class CrudService {

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
    let queryObject = null;
    if (ids) {
      queryObject = {ids: ids};
    }
    return this.httpService.get(this.getUrl(), queryObject);
  }

  update(id, changedAttributes) {
    return this.httpService.put(this.getUrl(id), changedAttributes);
  }

  deleteOne(id) {
    return this.httpService.delete(this.getUrl(id));
  }

  deleteSomeById(ids) {
    return this.httpService.delete(this.getUrl(), ids);
  }

  getUrl(id) {
    return this.apiUrl + id ? +`/${id}` : '';
  }

}

module.exports = CrudService;