const testService = require('../services/testService');
const { assert } = require('chai');


// before(() => testService.before());

beforeEach(() =>  testService.beforeEach());

/***********************************************************************************
 Retract functionality
/**********************************************************************************/

describe('Errorful retracting contract tests', () => {

  /***********************************************************************************
   retract() tests
  /**********************************************************************************/
    
  it('Person outside the contract wants to retract', async () => {
    try {
      // When
      await testService.retract('random');
      assert.fail()
    } catch (error) {
      // Then
      assert.deepEqual('assertion failure with message: Caller does not have the permission to call this method', error.json.error.details[0].message);
    }
  })

  it('Buyer wants retract after seller', async () => {
    try {
      // When
      await testService.retract('seller');
      await testService.retract('buyer');
      assert.fail()
    } catch (error) {
      // Then
      assert.deepEqual('assertion failure with message: can not retract, because seller already retracted', error.json.error.details[0].message);
    }
  })

  it('Seller wants retract after buyer', async () => {
    try {
      // When
      await testService.retract('buyer');
      await testService.retract('seller');
      assert.fail()
    } catch (error) {
      // Then
      assert.deepEqual('assertion failure with message: can not retract, because buyer already retracted', error.json.error.details[0].message);
    }
  })

  it('Retraction after contract is not intact anymore', async () => {
    try {
      // When
      await testService.retract('buyer');
      await testService.retract('intermed');
      await new Promise(resolve => setTimeout(resolve, 500)); // Necessary otherwise rpc will say that it is a duplicate transaction
      await testService.retract('intermed');
      assert.fail()
    } catch (error) {
      // Then
      assert.deepEqual('assertion failure with message: Contract is closed', error.json.error.details[0].message);
    }
  })

  it('Retraction after contract is already retracted', async () => {
    try {
      // When
      await testService.retract('intermed');
      await testService.setItem('seller');
      await testService.pay('buyer');
      await testService.retract('buyer');
      await testService.retract('intermed');
      assert.fail()
    } catch (error) {
      // Then
      assert.deepEqual('assertion failure with message: Contract must not be retracted', error.json.error.details[0].message);
    }
  })
})