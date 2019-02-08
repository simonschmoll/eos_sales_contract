const testService = require('../services/testService');
const { assert } = require('chai');

// TODO: uncomment next line (1) for testing single files
before(() => testService.before()); 

beforeEach(() =>  testService.beforeEach());

/***********************************************************************************
 sales functionality
/**********************************************************************************/
describe('Successful sales functionality', () => {
/***********************************************************************************
 contract Correct initialized
/**********************************************************************************/
  it('Tables are initialized', async () => {
    // Then
    let rowsConfig;
    try {
      rowsConfig = await testService.getRows('config')
    } catch (error) {
      assert.ifError(error)
    }
    const config = rowsConfig.rows[0];
    assert.deepEqual(config.key, 0)
    assert.deepEqual(config.itemSet, 0)
    assert.deepEqual(config.itemPaid, 0)
    assert.deepEqual(config.itemReceived, 0)
    assert.deepEqual(config.contractIsClosed, 0)
    assert.deepEqual(config.contractRetracted, 0)
    assert.deepEqual(config.buyerIsPaidBack, 0)
    assert.deepEqual(config.balance, '0.0000 SYS')
    assert.deepEqual(config.seller, 'seller')
    assert.deepEqual(config.buyer, 'buyer')
    assert.deepEqual(config.intermediator, 'intermed')

    const rowsAgreement = await testService.getRows('agreement')
    const agreement = rowsAgreement.rows[0];
    assert.deepEqual(agreement.key, 0)
    assert.deepEqual(agreement.sellerRetract, 0)
    assert.deepEqual(agreement.buyerRetract, 0)
    assert.deepEqual(agreement.intermediatorRetract, 0)
  })

  it('Item is set by seller', async () => {
    // When
    try {
      await testService.setItem('seller');
    } catch (error) {
      assert.ifError(error)
    }
    const data = await testService.getRows('item')
    const { key, itemName, itemPrice} = data.rows[0]

    // Then
    assert.deepEqual(key, 0)
    assert.deepEqual(itemName, 'bike')
    assert.deepEqual(itemPrice, '10.0000 SYS')
  })
});