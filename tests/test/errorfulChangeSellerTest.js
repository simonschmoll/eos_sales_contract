const testService = require('../services/testService');
const { assert } = require('chai');


before(() => testService.before());

beforeEach(() =>  testService.beforeEach());

/***********************************************************************************
 changing Seller functionality
/**********************************************************************************/

describe('Errorful changing seller tests', () => {

  /***********************************************************************************
   changeSeller() tests
  /**********************************************************************************/
    
    it('Wrong permission for changing seller', async () => {
      try {
        // When
        await testService.changeSeller('buyer', 'intermed');
        assert.fail()
      } catch (error) {
        // Then
        assert.deepEqual('missing authority of seller', error.json.error.details[0].message);
      }
    })
  
    it('Contract is retracted, seller tries to disown', async () => {
      // console.log('Current contractname', contractName);
      // Given
      try {
        await testService.setItem('seller');
        await testService.pay('buyer');
        await testService.retract('seller', 'seller');
        await testService.retract('intermed', 'intermed');
      }
      catch(error) {
        console.log(error);
        assert.equal(true, false, 'Setup is throwing an error');
      }
      // When
      try {
        await testService.changeSeller('seller', 'intermed');
        assert.fail();
      } catch (error) {
        // Then
        assert.deepEqual('assertion failure with message: Contract must not be retracted', error.json.error.details[0].message);
      }
    });
});