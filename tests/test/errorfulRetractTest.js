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
      assert.fail('retract by random should fail')
    } catch (error) {
      // Then
      assert.deepEqual('Error: assertion failure with message: Caller does not have the permission to call this method', error.toString());
    }
  })

/***********************************************************************************
 retractContract test while contract not intact
/**********************************************************************************/

  it('Retraction after contract is not intact anymore through direct retraction', async () => {
    // When
    await testService.retract('buyer');
    await testService.finalretract('intermed', true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Necessary otherwise rpc will say that it is a duplicate transaction
    try {
      await testService.retract('buyer');
      assert.fail('retract by buyer should fail')
    } catch (error) {
      // Then
      assert.deepEqual('Error: assertion failure with message: Contract is closed', error.toString());
    }
  })  

  /***********************************************************************************
   retractContract test, attempt by third participant to also retract
  /**********************************************************************************/

  it('Contract is retracted (intermediator, buyer), seller tries to retract', async () => {
    await testService.setItem('seller');
    await testService.pay('buyer');
    await testService.retract('buyer');
    await testService.finalretract('intermed', true);
    try {
      // When
      await testService.retract('seller');
      assert.fail('retract by seller should fail')
    } catch (error) {
      // Then
      assert.deepEqual('Error: assertion failure with message: Contract must not be retracted', error.toString());
    }
  })

  it('Contract is retracted (intermediator, seller), buyer tries to retract', async () => {
    await testService.setItem('seller');
    await testService.pay('buyer');
    await testService.retract('seller');
    await testService.finalretract('intermed', false);
    try {
      // When
      await testService.retract('buyer');
      assert.fail('retract by buyer should fail')
    } catch (error) {
      // Then
      assert.deepEqual('Error: assertion failure with message: Contract must not be retracted', error.toString());
    }
  })

    /***********************************************************************************
     finalizeRetraction test
    /**********************************************************************************/
    
    it("Finalize Retraction by buyer should fail", async () => {    
      await testService.retract('buyer');
      try {
          // When
          await testService.finalretract('buyer', true);
          assert.fail("finalretract from buyer should fail")            
      } catch (error) {
          // Then
          assert.deepEqual('Error: missing authority of intermed', error.toString());
      }
  }) 

  it("Finalize Retraction by seller should fail", async () => {    
    await testService.retract('seller');
    try {
        // When
        await testService.finalretract('seller', false);
        assert.fail("finalretract from buyer should fail")            
    } catch (error) {
        // Then
        assert.deepEqual('Error: missing authority of intermed', error.toString());
    }
  })

  it("Contract is retracted, but intermediator calls finalize again", async () => {    
      // Given
      await testService.setItem('seller');
      await testService.pay('buyer');
      await testService.retract('seller');
      await testService.finalretract('intermed', false);
      await new Promise(resolve => setTimeout(resolve, 500)); // Necessary otherwise rpc will say that it is a duplicate transaction
      try {
          // When
          await testService.finalretract('intermed', false);
          assert.fail("finalretract from intermediator should fail")            
      } catch (error) {
          // Then
          assert.deepEqual('Error: assertion failure with message: Contract must not be retracted', error.toString());
      }
  })

  it("Contract is not intact, but intermediator calls finalize", async () => {    
      // Given
      await testService.setItem('seller');
      await testService.pay('buyer');
      await testService.itemReceived('buyer');
      await testService.withdraw('seller');
      try {
          // When
          await testService.finalretract('intermed', false);
          assert.fail("finalretract from intermediator should fail")           
      } catch (error) {
          // Then
          assert.deepEqual('Error: assertion failure with message: Contract is closed', error.toString());
      }
  })

  it("Contract is not marked as retracted by buyer or seller, but intermediator calls finalize", async () => {    
      // Given
      await testService.setItem('seller');
      await testService.pay('buyer');
      try {
          // When
          await testService.finalretract('intermed', false);
          assert.fail("finalretract from intermediator should fail")            
      } catch (error) {
          // Then
          assert.deepEqual('Error: assertion failure with message: Contract is not marked as retracted by buyer or seller', error.toString()); 
      }
  })
})