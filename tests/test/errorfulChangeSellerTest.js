const testService = require('../services/testService');
const { assert } = require('chai');


// before(() => testService.before());

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
        assert.deepEqual('Error: missing authority of seller', error.toString());
      }
    })
  
    it('Contract is retracted, seller tries to disown', async () => {
      // console.log('Current contractname', contractName);
      // Given
      try {
        await testService.setItem('seller');
        await testService.pay('buyer');
        await testService.retract('seller');
        await testService.retract('intermed');
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
        assert.deepEqual('Error: assertion failure with message: Contract must not be retracted', error.toString());
      }
    });
});