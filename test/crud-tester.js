'use strict';

const logger = require('simple-node-logger').createSimpleLogger();
const _ = require('lodash');
const assert = require('chai').assert;

class CrudTester {

  constructor(crudService, fixture) {
    this.crudService = crudService;
    this.fixture = fixture;
  }

  static validateObject(actual, expected) {
    assert.isDefined(actual._id);
    assert.isTrue(_.isMatch(actual, expected));
  }

  static validateID(actualObject, expectedId) {
    assert._isDefined(actualObject._id);
    assert.strictEqual(actualObject._id, expectedId);
  }

  static getIdOfObject(obj) {
    let id = obj._id;
    if (!id) {
      // try with just id
      id = obj.id;
    }
    if (!id) {
      const message = 'Object does not contain an id field.';
      logger.error(message, obj);
    }
    assert.isDefined(id);
    return id;
  }

  static validateObjectArray(actual, expected) {
    assert.strictEqual(actual.length, expected.length);
    for (const index in actual) {
      CrudTester.validateObject(expected[index], actual[index]);
    }
  }

  getSingleObject() {
    return this.fixture.singleObject;
  }
  
  getObjectList() {
    return this.fixture.objectList;
  }

  // Create Block

  create(obj) {
    const result = this.crudService.create(obj);
    CrudTester.validateObject(result, obj);
    return result;
  }

  createOne() {
    const obj = this.getSingleObject();
    return this.create(obj);
  }

  createMany() {
    const objects = this.getObjectList();
    const result = [];
    for (const obj of objects) {
      result.push(this.create(obj));
    }
    return result;
  }

  createAll() {
    const result = [];
    result.push(this.createOne());
    result.concat(this.createMany());
    return result;
  }


  // Get block

  getById(id) {
    const result = this.crudService.getOne(id);
    CrudTester.validateID(result, id);
    return result;
  }

  getByObject(obj) {
    const id = CrudTester.getIdOfObject(obj);
    const result = this.getOneById(id);
    CrudTester.validateObject(result, obj);
    return result;
  }

  getByIdArray(idArr) {
    const result = this.crudService.getSomeById(idArr);
    assert.isArray(result);
    if (idArr) {
      assert.strictEqual(result.length, idArr.length);

      for (const index in idArr) {
        CrudTester.validateID(result[index], idArr[index]);
      }
    }

    for(const obj of result) {
      CrudTester.getIdOfObject(obj);
    }

    return result;
  }

  getByObjectArray(objectArr) {
    let idArr = null;

    if (objectArr) {
      idArr = [];
      for (const obj in objectArr) {
        idArr.push(CrudTester.getIdOfObject(obj));
      }
    }

    const result = this.getByIdArray(idArr);

    if (objectArr) {
      CrudTester.validateObjectArray(result, objectArr);
    }

    return result;
  }

  getOne() {
    const obj = this.getSingleObject();
    return this.getByObject(obj);
  }

  getSome() {
    const objects = this.getObjectList();
    const byArrayResult = this.getByObjectArray(objects);

    const byOneByOneResult = [];
    for(const obj of objects) {
      byOneByOneResult.push(this.getByObject(obj));
    }

    CrudTester.validateObjectArray(byArrayResult, byOneByOneResult);

    return byArrayResult;
  }

  getAll() {
    return this.getByIdArray();
  }


  // Change block

  static validateChangedObject(actual, changedAttr, previous) {
    const expectedObj = _.merge(_.clone(previous), changedAttr);
    CrudTester.validateObject(actual, expectedObj);
  }

  change(id, changedAttr) {
    const previous = this.getById(id);
    const result = this.crudService.update(id, changedAttr);
    CrudTester.validateChangedObject(result, changedAttr, previous);
    return result;
  }

  changeByObject(obj, changedAttr) {
    // for validation
    this.getByObject(obj);

    const id = CrudTester.getIdOfObject(obj);
    return this.change(id, changedAttr);
  }

  changeOne() {
    const object = this.getSingleObject();
    const changedAttr = this.fixture.changedAttributes;
    return this.changeByObject(object, changedAttr);
  }

  changeSome() {
    const objectList = this.getObjectList();
    const changedAttr = this.fixture.changedAttributes;
    const result = [];

    for(const obj of objectList) {
      result.push(this.changeByObject(obj, changedAttr));
    }

    return result;
  }

  changeAll() {
    const result = [this.changeOne()];
    result.concat(this.changeSome());
    return result;
  }


  // Delete block

  static validateDeleteResult(result) {
    assert(result === 200 || result === 204);
  }

  deleteById(id) {
    const result = this.crudService.deleteOne(id);
    CrudTester.validateDeleteResult(result);
    return true;
  }

  deleteByObj(obj) {
    const id = CrudTester.getIdOfObject(obj);
    return this.deleteById(id);
  }

  deleteByIdArr(ids) {
    const result = this.crudService.deleteSomeById(ids);
    CrudTester.validateDeleteResult(result);
    return true;
  }

  deleteByObjArray(objArr) {
    let idArr = null;

    if (objArr){
      assert.isArray(objArr);
      idArr = [];

      for (const obj of objArr) {
        idArr.push(CrudTester.getIdOfObject(obj));
      }
    }

    return this.deleteByIdArr(idArr);
  }
  
  deleteOne() {
    const obj = this.getSingleObject();
    return this.deleteByObj(obj);
  }

  deleteSome() {
    const objects = this.getObjectList();
    return this.deleteByObjArray(objects);
  }

  deleteAll() {
    return this.deleteByIdArr();
  }
}

module.exports = CrudTester;