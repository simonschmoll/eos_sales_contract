const testService = require('../services/testService');
const { assert } = require('chai');

beforeEach(() =>  testService.beforeEach());
// before(() => testService.before());

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
      assert.deepEqual('Error: missing authority of seller', error.toString());
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
        itemPrice: '10.0000 EOS'
      });
      assert.fail();
    } catch (error) {
       // Then
      assert.deepEqual('Error: assertion failure with message: Item already set', error.toString());
    }
  });

  it('Item is set without itemName', async () => {
    // When
    try {
      await testService.setItem('seller', {
        itemPrice: '10.0000 EOS'
      });
      assert.fail();
    } catch (error) {
      // Then
      assert.deepEqual('Error: missing setitem.itemName (type=string)', error.toString());
    }
  }) 
  
  it('Item is set with empty itemName', async () => {
    // When
    try {
      await testService.setItem('seller', {
        itemName: '',
        itemPrice: '10.0000 EOS'
      });
      assert.fail();
    } catch (error) {
      // Then
      assert.deepEqual('Error: assertion failure with message: Item name must not be null', error.toString());
    }
  }) 

  it('Item is set without itemPrice', async () => {
    // When
    try {
      await testService.setItem('seller', {
        itemName: "bike2",
      });
      assert.fail();
    } catch (error) {
      // Then
      assert.deepEqual('Error: missing setitem.itemPrice (type=asset)', error.toString());
    }
  }) 

  it('Item is set with wrong format of itemPrice (without EOS)', async () => {
    // When
    try {
      await testService.setItem('seller', {
        itemName: "bike2",
        itemPrice: '10.0000'
      });
      assert.fail();
    } catch (error) {
      // Then
      assert.deepEqual('Error: assertion failure with message: Invalid quantity', error.toString());
    }
  }) 

  it('Item is set with wrong format of itemPrice (wrong decimal places)', async () => {
    // When
    try {
      await testService.setItem('seller', {
        itemName: "bike2",
        itemPrice: '10.000 EOS'
      });
      assert.fail();
    } catch (error) {
      // Then
      assert.deepEqual('Error: assertion failure with message: Asset must be of type EOS and with exact 4 decimal places', error.toString());
    }
  }) 

  it('Item is set with wrong format of itemPrice (no decimal places)', async () => {
    // When
    try {
      await testService.setItem('seller', {
        itemName: "bike2",
        itemPrice: '10 EOS'
      });
      assert.fail();
    } catch (error) {
      // Then
      assert.deepEqual('Error: assertion failure with message: Asset must be of type EOS and with exact 4 decimal places', error.toString());
    }
  }) 

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
      assert.deepEqual('Error: assertion failure with message: Transfer must come from buyer', error.toString());
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
      assert.deepEqual('Error: assertion failure with message: Contract is closed', error.toString());
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
        quantity: '1.0000 EOS',
        memo: ''
      }
      await testService.send('eosio.token', 'transfer', 'buyer', 'active', wrongPriceData);
      assert.fail();
    } catch (error) {
      assert.deepEqual('Error: assertion failure with message: assertPriceEqualsValue: Transfer value must be equal to price', error.toString());
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
      assert.deepEqual('Error: missing authority of buyer', error.toString());
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
      assert.deepEqual('Error: assertion failure with message: assertItemPaid: Item was not paid', error.toString());
    }
  })

/***********************************************************************************
 withdraw tests
/**********************************************************************************/

  it('Money withdraw by other than seller (normal flow)', async () => {
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
      assert.deepEqual('Error: missing authority of seller', error.toString());
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
      assert.deepEqual('Error: assertion failure with message: assertItemReceived: Item was not marked as received', 
        error.toString());
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
      assert.deepEqual('Error: assertion failure with message: Contract is closed', 
        error.toString());
    }
  })

  it('Buyer is ruled to be correct in dispute, but seller wants to withdraw money', async () => {
    // Given
    try {
      await testService.setItem('seller');
      await testService.pay('buyer');
      await testService.retract('buyer');
      await testService.retract('intermed');
    } catch (error) {
      assert.equal(true, false, 'Setup is throwing an error')
    }
    // When
    try {
      await testService.withdraw('seller');
      assert.fail();
    } catch (error) {
      // Then
      assert.deepEqual('Error: missing authority of buyer', error.toString());
    }
  })

  it('Seller is ruled to be correct in dispute, but buyer wants to withdraw money', async () => {
    // Given
    try {
      await testService.setItem('seller');
      await testService.pay('buyer');
      await testService.itemReceived('buyer')
      await testService.retract('seller');
      await testService.retract('intermed');
    } catch (error) {
      assert.equal(true, false, 'Setup is throwing an error')
    }
    // When
    try {
      await testService.withdraw('buyer');
      assert.fail();
    } catch (error) {
      // Then
      assert.deepEqual('Error: missing authority of seller', error.toString());
    }
  })
});
