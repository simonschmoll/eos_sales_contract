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
      rowsConfig = await testService.getRowsSaleCon('config')
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

    const rowsAgreement = await testService.getRowsSaleCon('agreement')
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
    const data = await testService.getRowsSaleCon('item')
    const { key, itemName, itemPrice} = data.rows[0]

    // Then
    assert.deepEqual(key, 0)
    assert.deepEqual(itemName, 'bike')
    assert.deepEqual(itemPrice, '10.0000 SYS')
  })

  it('Item is paid by buyer', async () => {
    // When
    let tokenBalanceBuyerBefore;
    try {
      tokenBalanceBuyerBefore = await testService.getRowsGeneral('eosio.token', 'buyer', 'accounts');
    } catch (error) {
      assert.ifError(error)
    }
    const { balance: balanceBuyerBefore } = tokenBalanceBuyerBefore.rows[0];    

    try {
      await testService.setItem('seller');
      await testService.pay('buyer');
    } catch (error) {
      assert.ifError(error)
    }
    const data = await testService.getRowsSaleCon('config')
    const { itemPaid, balance } = data.rows[0]

    // Then
    assert.deepEqual(itemPaid, 1)
    assert.deepEqual(balance, '10.0000 SYS')
    let tokenBalanceContract;
    let tokenBalanceBuyerAfter;
    try {
      tokenBalanceContract = await testService.getRowsGeneral('eosio.token', testService.getContractName(), 'accounts');
      tokenBalanceBuyerAfter = await testService.getRowsGeneral('eosio.token', 'buyer', 'accounts');
    } catch (error) {
      assert.ifError(error)
    }
    const { balance: balanceContract } = tokenBalanceContract.rows[0];
    const { balance: balanceBuyerAfter } = tokenBalanceBuyerAfter.rows[0];    
    assert.deepEqual(balanceContract, '10.0000 SYS')
    assert.deepEqual(parseFloat(balanceBuyerBefore) - parseFloat(balanceBuyerAfter), 10.0000)    
  })

  it('item is received by buyer', async () => {
    // When
    try {
      await testService.setItem('seller');
      await testService.pay('buyer');
      await testService.itemReceived('buyer');
    } catch (error) {
      assert.ifError(error)
    }
    const data = await testService.getRowsSaleCon('config')
    const { itemReceived } = data.rows[0]

    // Then
    assert.deepEqual(itemReceived, 1)
  })

  it('Withdraw money by seller', async () => {
    // When
    let tokenBalanceSellerBefore;
    try {
      tokenBalanceSellerBefore = await testService.getRowsGeneral('eosio.token', 'seller', 'accounts');
    } catch (error) {
      assert.ifError(error)
    }
    const { balance: balanceSellerBefore } = tokenBalanceSellerBefore.rows[0];

    try {
      await testService.setItem('seller');
      await testService.pay('buyer');
      await testService.itemReceived('buyer');
      await testService.withdraw('seller');
    } catch (error) {
      assert.ifError(error)
    }
    const data = await testService.getRowsSaleCon('config')
    const { contractIsClosed, balance } = data.rows[0]

    // Then
    assert.deepEqual(contractIsClosed, 1)
    assert.deepEqual(balance, '0.0000 SYS')
    let tokenBalanceContractAfter;
    let tokenBalanceSellerAfter;
    try {
      tokenBalanceContractAfter = await testService.getRowsGeneral('eosio.token', testService.getContractName(), 'accounts');
      tokenBalanceSellerAfter = await testService.getRowsGeneral('eosio.token', 'seller', 'accounts');
    } catch (error) {
      assert.ifError(error)
    }
    const { balance: balanceContractAfter } = tokenBalanceContractAfter.rows[0];
    const { balance: balanceSellerAfter } = tokenBalanceSellerAfter.rows[0];    
    assert.deepEqual(balanceContractAfter, '0.0000 SYS')
    assert.deepEqual(parseFloat(balanceSellerAfter) - parseFloat(balanceSellerBefore), 10.0000)    
  })
});