const testService = require('../services/testService');
const { assert } = require('chai');

// TODO: uncomment next line (1) for testing single files
before(() => testService.before()); 

beforeEach(() =>  testService.beforeEach());

/***********************************************************************************
 Sales functionality
/**********************************************************************************/

describe('Successful sales functionality', () => {

/***********************************************************************************
 Contract correct initialized
/**********************************************************************************/

  it('Tables are initialized', async () => {
    // Then
    let rowsConfig;
    try {
      rowsConfig = await testService.getRowsSaleCon('config')
    } catch (error) {
      assert.ifError(error, 'Setup is throwing an error')
    }
    const config = rowsConfig.rows[0];
    assert.deepEqual(config.key, 0, 'key should be 0')
    assert.deepEqual(config.itemSet, 0, 'itemSet should be false')
    assert.deepEqual(config.itemPaid, 0, 'itemPaid should be false')
    assert.deepEqual(config.itemReceived, 0, 'itemReceived should be false')
    assert.deepEqual(config.contractIsClosed, 0, 'contractIsClosed should be false')
    assert.deepEqual(config.contractRetracted, 0, 'contractRetracted should be false')
    assert.deepEqual(config.buyerIsPaidBack, 0, 'buyerIsPaidBack should be false')
    assert.deepEqual(config.balance, '0.0000 EOS', 'contract balance should be 0')
    assert.deepEqual(config.seller, 'seller', 'seller field should be initialized with seller')
    assert.deepEqual(config.buyer, 'buyer', 'buyer field should be initialized with buyer')
    assert.deepEqual(config.intermediator, 'intermed', 'intermed field should be initialized with intermed')

    const rowsAgreement = await testService.getRowsSaleCon('agreement')
    const agreement = rowsAgreement.rows[0];
    assert.deepEqual(agreement.key, 0, 'key should be 0')
    assert.deepEqual(agreement.sellerRetract, 0, 'sellerRetract should be false')
    assert.deepEqual(agreement.buyerRetract, 0, 'buyerRetract should be false')
    assert.deepEqual(agreement.intermediatorRetract, 0, 'intermediatorRetract should be false')
  })

  /***********************************************************************************
   setItem() test
  /**********************************************************************************/

  it('Item is set by seller', async () => {
    // When
    try {
      await testService.setItem('seller');
    } catch (error) {
      assert.ifError(error, 'Setup is throwing an error')
    }
    const data = await testService.getRowsSaleCon('item')
    const { key, itemName, itemPrice} = data.rows[0]

    // Then
    assert.deepEqual(key, 0, 'key should be 0')
    assert.deepEqual(itemName, 'bike', 'itemName should be bike')
    assert.deepEqual(itemPrice, '10.0000 EOS', 'itemPrice should be 10.0000 EOS')
  })

  /***********************************************************************************
   payItem() test
  /**********************************************************************************/

  it('Item is paid by buyer', async () => {
    // When
    let tokenBalanceBuyerBefore;
    try {
      tokenBalanceBuyerBefore = await testService.getRowsGeneral('eosio.token', 'buyer', 'accounts');
    } catch (error) {
      assert.ifError(error, 'Setup is throwing an error')
    }
    const { balance: balanceBuyerBefore } = tokenBalanceBuyerBefore.rows[0];    

    try {
      await testService.setItem('seller');
      await testService.pay('buyer');
    } catch (error) {
      assert.ifError(error, 'Setup is throwing an error')
    }
    const data = await testService.getRowsSaleCon('config')
    const { itemPaid, balance } = data.rows[0]

    // Then
    assert.deepEqual(itemPaid, 1, 'itemPaid should be true')
    assert.deepEqual(balance, '10.0000 EOS', 'balance should be 10.0000 EOS')
    let tokenBalanceContract;
    let tokenBalanceBuyerAfter;
    try {
      tokenBalanceContract = await testService.getRowsGeneral('eosio.token', testService.getContractName(), 'accounts');
      tokenBalanceBuyerAfter = await testService.getRowsGeneral('eosio.token', 'buyer', 'accounts');
    } catch (error) {
      assert.ifError(error, 'Setup is throwing an error')
    }
    const { balance: balanceContract } = tokenBalanceContract.rows[0];
    const { balance: balanceBuyerAfter } = tokenBalanceBuyerAfter.rows[0];    
    assert.deepEqual(balanceContract, '10.0000 EOS', 'contract balance should be 10.0000 EOS')
    assert.deepEqual(parseFloat(balanceBuyerBefore) - parseFloat(balanceBuyerAfter), 10.0000, 'buyer should have 10.0000 EOS less after sale than before')    
  })

  /***********************************************************************************
   itemReceived() test
  /**********************************************************************************/

  it('item is received by buyer', async () => {
    // When
    try {
      await testService.setItem('seller');
      await testService.pay('buyer');
      await testService.itemReceived('buyer');
    } catch (error) {
      assert.ifError(error, 'Setup is throwing an error')
    }
    const data = await testService.getRowsSaleCon('config')
    const { itemReceived } = data.rows[0]

    // Then
    assert.deepEqual(itemReceived, 1, 'itemReceived should be true')
  })

  /***********************************************************************************
   withdraw() test
  /**********************************************************************************/

  it('Withdraw money by seller', async () => {
    // When
    let tokenBalanceSellerBefore;
    try {
      tokenBalanceSellerBefore = await testService.getRowsGeneral('eosio.token', 'seller', 'accounts');
    } catch (error) {
      assert.ifError(error, 'Setup is throwing an error')
    }
    const { balance: balanceSellerBefore } = tokenBalanceSellerBefore.rows[0];

    try {
      await testService.setItem('seller');
      await testService.pay('buyer');
      await testService.itemReceived('buyer');
      await testService.withdraw('seller');
    } catch (error) {
      assert.ifError(error, 'Setup is throwing an error')
    }
    const data = await testService.getRowsSaleCon('config')
    const { contractIsClosed, balance } = data.rows[0]

    // Then
    assert.deepEqual(contractIsClosed, 1, 'contract is closed should be true')
    assert.deepEqual(balance, '0.0000 EOS', 'contract balance should be 0.0000 EOS')
    let tokenBalanceContractAfter;
    let tokenBalanceSellerAfter;
    try {
      tokenBalanceContractAfter = await testService.getRowsGeneral('eosio.token', testService.getContractName(), 'accounts');
      tokenBalanceSellerAfter = await testService.getRowsGeneral('eosio.token', 'seller', 'accounts');
    } catch (error) {
      assert.ifError(error, 'Setup is throwing an error')
    }
    const { balance: balanceContractAfter } = tokenBalanceContractAfter.rows[0];
    const { balance: balanceSellerAfter } = tokenBalanceSellerAfter.rows[0];    
    assert.deepEqual(balanceContractAfter, '0.0000 EOS', 'balance of contract after sale should be 0.0000 EOS')
    assert.deepEqual(parseFloat(balanceSellerAfter) - parseFloat(balanceSellerBefore), 10.0000, 'balance of seller after sales should be 10.0000 EOS more than before')    
  })

  /***********************************************************************************
   withdraw() after dispute test (buyer)
  /**********************************************************************************/

  it('Withdraw money by buyer after dispute', async () => {
    // When
    let tokenBalanceBuyerBefore;
    try {
      tokenBalanceBuyerBefore = await testService.getRowsGeneral('eosio.token', 'buyer', 'accounts');
    } catch (error) {
      console.log(error);
      
      assert.ifError(error, 'Setup is throwing an error')
    }
    const { balance: balanceBuyerBefore } = tokenBalanceBuyerBefore.rows[0];

    try {
      await testService.setItem('seller');
      await testService.pay('buyer');
      await testService.itemReceived('buyer');
      await testService.retract('buyer');
      await testService.finalretract('intermed', true);
      await testService.withdraw('buyer');
    } catch (error) {
      console.log(error);
      assert.ifError(error, 'Setup is throwing an error')
    }
    const data = await testService.getRowsSaleCon('config')
    const { contractIsClosed, balance, contractRetracted } = data.rows[0]

    // Then
    assert.deepEqual(contractIsClosed, 1, 'contractIsClosed should be true')
    assert.deepEqual(contractRetracted, 1, 'contractRetracted should be true')
    assert.deepEqual(balance, '0.0000 EOS', 'contract balance should be 0.0000 EOS')
    let tokenBalanceContractAfter;
    let tokenBalanceBuyerAfter;
    try {
      tokenBalanceContractAfter = await testService.getRowsGeneral('eosio.token', testService.getContractName(), 'accounts');
      tokenBalanceBuyerAfter = await testService.getRowsGeneral('eosio.token', 'buyer', 'accounts');
    } catch (error) {
      assert.ifError(error, 'Setup is throwing an error')
    }
    const { balance: balanceContractAfter } = tokenBalanceContractAfter.rows[0];
    const { balance: balanceBuyerAfter } = tokenBalanceBuyerAfter.rows[0];    
    assert.deepEqual(balanceContractAfter, '0.0000 EOS', 'balance of contract after sale should be 0.0000 EOS')
    assert.deepEqual(parseFloat(balanceBuyerAfter) - parseFloat(balanceBuyerBefore), 0, 'buyer should have equal amount of money before and after the sale')    
  })

  /***********************************************************************************
   withdraw() after dispute test (seller)
  /**********************************************************************************/

  it('Withdraw money by seller after dispute', async () => {
    // When
    let tokenBalanceSellerBefore;
    try {
      tokenBalanceSellerBefore = await testService.getRowsGeneral('eosio.token', 'seller', 'accounts');
    } catch (error) {
      assert.ifError(error, 'Setup is throwing an error')
    }
    const { balance: balanceSellerBefore } = tokenBalanceSellerBefore.rows[0];

    try {
      await testService.setItem('seller');
      await testService.pay('buyer');
      await testService.itemReceived('buyer');
      await testService.retract('seller');
      await testService.finalretract('intermed', false);
      await testService.withdraw('seller');
    } catch (error) {
      assert.ifError(error, 'Setup is throwing an error')
    }
    const data = await testService.getRowsSaleCon('config')
    const { contractIsClosed, balance, contractRetracted } = data.rows[0]

    // Then
    assert.deepEqual(contractIsClosed, 1, 'contractIsClosed should be true')
    assert.deepEqual(contractRetracted, 1, 'contract should be retracted')
    assert.deepEqual(balance, '0.0000 EOS', 'balance of contract should be 0.0000 EOS')
    let tokenBalanceContractAfter;
    let tokenBalanceSellerAfter;
    try {
      tokenBalanceContractAfter = await testService.getRowsGeneral('eosio.token', testService.getContractName(), 'accounts');
      tokenBalanceSellerAfter = await testService.getRowsGeneral('eosio.token', 'seller', 'accounts');
    } catch (error) {
      assert.ifError(error, 'Setup is throwing an error')
    }
    const { balance: balanceContractAfter } = tokenBalanceContractAfter.rows[0];
    const { balance: balanceSellerAfter } = tokenBalanceSellerAfter.rows[0];    
    assert.deepEqual(balanceContractAfter, '0.0000 EOS', 'balance of contract after sale should be 0.0000 EOS')
    assert.deepEqual(parseFloat(balanceSellerAfter) - parseFloat(balanceSellerBefore), 10.0000, 'balance of seller after sales should be 10.0000 EOS more than before')    
  })
});