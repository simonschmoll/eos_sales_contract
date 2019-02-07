const testService = require('../services/testService');
const { assert } = require('chai');
const shell = require('shelljs');

initData = {
  seller: 'seller',
  buyer: 'buyer',
  intermediator: 'intermed'
}

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


/***********************************************************************************
 sales functionality
/**********************************************************************************/

describe('Errorful sales functionality', () => {

/***********************************************************************************
 setItem tests
/**********************************************************************************/

  it('Item is tried to set by other than seller', async () => {
    // When
    try {
      await testService.setItem('buyer');
      assert.fail();
    } catch (error) {
      // Then
      assert.deepEqual('missing authority of seller', error.json.error.details[0].message);
    }
  }) 

  it('Seller tries to call setitem twice', async () => {
    try {
      // Given
      await testService.setItem('seller')
    } catch (error) {
      assert.equal(true, false, 'Setup is throwing an error')
    }

    try {
      // Then
      await testService.setItem('seller', {
        itemName: "bike2", 
        itemPrice: 100000
      });
      assert.fail();
    } catch (error) {
       // Then
      console.log(error);
      
      assert.deepEqual('assertion failure with message: Item already set', error.json.error.details[0].message);
    }
  });

/***********************************************************************************
 payItem tests
/**********************************************************************************/
  it('Item paid by other than buyer', async () => {
    // Given
    try {
      await testService.setItem('seller');
    } catch (error) {
      assert.equal(true, false, 'Setup is throwing an error')
    }
    // When
    try {
      await testService.pay('seller')
      assert.fail();
    } catch (error) {
      // Then
      assert.deepEqual('assertion failure with message: Transfer must come from buyer', error.json.error.details[0].message);
    }
  }) 

  it('Buyer wants to pay item, but contract is not intact', async () => {
    // Given
    try {
      await testService.setItem('seller');
      await testService.pay('buyer');
      await testService.itemReceived('buyer');
      await testService.withdraw('seller');
    } catch (error) {
      console.log(error);
      
      assert.equal(true, false, 'Setup is throwing an error')
    }
    // When
    try {
      await testService.pay('buyer')
      assert.fail();
    } catch (error) {
      console.log(error);
      assert.deepEqual('assertion failure with message: Contract is closed', error.json.error.details[0].message);
    }
  }) 

  it('Payment is not equal to the price', async () => {
    // Given
    try {
      await testService.setItem('seller');
    } catch (error) {
      assert.equal(true, false, 'Setup is throwing an error')
    }
    // When
    try {
      const contractName = testService.getContractName();
      const wrongPriceData = {
        from: 'buyer', 
        to: contractName,
        quantity: '1.0000 SYS',
        memo: ''
      }
      await testService.send('eosio.token', 'transfer', 'buyer', 'active', wrongPriceData);
      assert.fail();
    } catch (error) {
      assert.deepEqual('assertion failure with message: assertPriceEqualsValue: Transfer value must be equal to price', error.json.error.details[0].message);
    }
  }) 

/***********************************************************************************
 itemReceived tests
/**********************************************************************************/

  it('Item received by other than buyer', async () => {
    // Given
    try {
      await testService.setItem('seller');
      await testService.pay('buyer');
    } catch (error) {
      assert.equal(true, false, 'Setup is throwing an error')
    }
    // When
    try {
      await testService.itemReceived('seller');
      assert.fail();
    } catch (error) {
      // Then
      assert.deepEqual('missing authority of buyer', error.json.error.details[0].message);
    }
  })

  it('Buyer wants to mark item as received, but it is not yet paid', async () => {
    // Given
    try {
      await testService.setItem('seller');
    } catch (error) {
      assert.equal(true, false, 'Setup is throwing an error')
    }
    // When
    try {
      await testService.itemReceived('buyer');
      assert.fail();
    } catch (error) {
      // Then
      assert.deepEqual('assertion failure with message: assertItemPaid: Item was not paid', error.json.error.details[0].message);
    }
  })

/***********************************************************************************
 withdraw tests
/**********************************************************************************/

  it('Money withdraw by other than seller', async () => {
    // Given
    try {
      await testService.setItem('seller');
      await testService.pay('buyer');
      await testService.itemReceived('buyer');
    } catch (error) {
      assert.equal(true, false, 'Setup is throwing an error')
    }
    // When
    try {
      await testService.withdraw('buyer');
      assert.fail();
    } catch (error) {
      // Then
      assert.deepEqual('missing authority of seller', error.json.error.details[0].message);
    }
  })
  
  it('Item is not marked as received, but seller wants to withdraw money', async () => {
    // Given
    try {
      await testService.setItem('seller');
      await testService.pay('buyer');
    } catch (error) {
      assert.equal(true, false, 'Setup is throwing an error')
    }
    // When
    try {
      await testService.withdraw('seller');
      assert.fail();
    } catch (error) {
      // Then
      assert.deepEqual('assertion failure with message: assertItemReceived: Item was not marked as received', 
        error.json.error.details[0].message);
    }
  })

  it('Contract is not intact anymore, but seller wants to withdraw money', async () => {
    // Given
    try {
      await testService.setItem('seller');
      await testService.pay('buyer');
      await testService.itemReceived('buyer');
      await testService.withdraw('seller');
    } catch (error) {
      assert.equal(true, false, 'Setup is throwing an error')
    }
    // When
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Necessary otherwise rpc will say that it is a duplicate transaction
      await testService.withdraw('seller');
      assert.fail();
    } catch (error) {
      // Then
      assert.deepEqual('assertion failure with message: Contract is closed', 
        error.json.error.details[0].message);
    }
  })

  it('Buyer is ruled to be correct in dispute, but seller wants to withdraw money', async () => {
    // Given
    try {
      await testService.setItem('seller');
      await testService.pay('buyer');
      await testService.itemReceived('buyer')
      await testService.retract('buyer', 'buyer');
      await testService.retract('intermed', 'intermed');
    } catch (error) {
      assert.equal(true, false, 'Setup is throwing an error')
    }
    // When
    try {
      await testService.withdraw('seller');
      assert.fail();
    } catch (error) {
      // Then
      assert.deepEqual('missing authority of buyer', error.json.error.details[0].message);
    }
  })
});
