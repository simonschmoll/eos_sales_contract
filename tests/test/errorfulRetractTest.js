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
    
  /***********************************************************************************
   retractContract test without permission
  /**********************************************************************************/

  it('Person outside the contract wants to retract', async () => {
    try {
      // When
      await testService.retract('random');
      assert.fail()
    } catch (error) {
      // Then
      assert.deepEqual('Error: assertion failure with message: Caller does not have the permission to call this method', error.toString());
    }
  })

/***********************************************************************************
 retractContract test while contract not intact
/**********************************************************************************/

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
      assert.deepEqual('Error: assertion failure with message: Contract is closed', error.toString());
    }
  })  

  /***********************************************************************************
   retractContract test, attempt by third participant to also retract
  /**********************************************************************************/

  it('Contract is retracted (intermediator, buyer), buyer tries to retract', async () => {
    await testService.setItem('seller');
    await testService.pay('buyer');
    await testService.retract('buyer');
    await testService.retract('intermed');
    try {
      // When
      await testService.retract('seller');
      assert.fail()
    } catch (error) {
      // Then
      assert.deepEqual('Error: assertion failure with message: Contract must not be retracted', error.toString());
    }
  })

  it('Contract is retracted (intermediator, seller), buyer tries to retract', async () => {
    await testService.setItem('seller');
    await testService.pay('buyer');
    await testService.retract('seller');
    await testService.retract('intermed');
    try {
      // When
      await testService.retract('buyer');
      assert.fail()
    } catch (error) {
      // Then
      assert.deepEqual('Error: assertion failure with message: Contract must not be retracted', error.toString());
    }
  })

  /***********************************************************************************
   retractContract test seller and buyer try both to retract while contract is intact
  /**********************************************************************************/

  it('Buyer wants retract after seller', async () => {
    try {
      // When
      await testService.retract('seller');
      await testService.retract('buyer');
      assert.fail()
    } catch (error) {
      // Then
      assert.deepEqual('Error: assertion failure with message: Can not retract, because seller already retracted', error.toString());
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
      assert.deepEqual('Error: assertion failure with message: Can not retract, because buyer already retracted', error.toString());
    }
  })
})