const testService = require('../services/testService');
const { assert } = require('chai');

// TODO: uncomment next line (1) for testing single files
// before(() => testService.before());

beforeEach(() =>  testService.beforeEach());

/***********************************************************************************
 Retract functionality
/**********************************************************************************/

describe('Successful retracting contract tests', () => {

  /***********************************************************************************
   retract() tests
  /**********************************************************************************/
    
  it('Seller retracts, should be noted in agreement struct', async () => {
      // When
      let agreementTable
      try {
        await testService.retract('seller');
        agreementTable = await testService.getRowsSaleCon('agreement')
      } catch (error) {
        assert.ifError(error, 'Setup is throwing an error')
      }
      const { sellerRetract } = agreementTable.rows[0]
  
      // Then
      assert.deepEqual(sellerRetract, 1)
    })

  it('Buyer retracts, should be noted in agreement struct', async () => {
      // When
      let agreementTable
      try {
        await testService.retract('buyer');
        agreementTable = await testService.getRowsSaleCon('agreement')
      } catch (error) {
        assert.ifError(error, 'Setup is throwing an error')
      }
      const { buyerRetract } = agreementTable.rows[0]
  
      // Then
      assert.deepEqual(buyerRetract, 1)
    })

  it('Intermediator retracts, should be noted in agreement struct', async () => {
      // When
      let agreementTable
      try {
        await testService.retract('buyer');
        await testService.finalretract('intermed', true);
        agreementTable = await testService.getRowsSaleCon('agreement')
      } catch (error) {
        assert.ifError(error, 'Setup is throwing an error')
      }
      const { intermediatorRetract } = agreementTable.rows[0]
  
      // Then
      assert.deepEqual(intermediatorRetract, 1)
    })

/***********************************************************************************
 retractContract() test (seller and intermediator)
/**********************************************************************************/

  it('Retract contract (seller and intermediator) without balance, should set contract to closed', async () => {
      // When
      let configTable;
      let agreementTable;
      try {
        await testService.retract('seller');
        await testService.finalretract('intermed', false);
        configTable = await testService.getRowsSaleCon('config')
        agreementTable = await testService.getRowsSaleCon('agreement')
      } catch (error) {
        assert.ifError(error, 'Setup is throwing an error')
      }
      const { buyerIsPaidBack, contractRetracted, contractIsClosed } = configTable.rows[0]
      const { sellerRetract, intermediatorRetract } = agreementTable.rows[0]
  
      // Then
      assert.deepEqual(contractRetracted, 1, 'Contract should be retracted')
      assert.deepEqual(contractIsClosed, 1, 'Contract should be closed')
      assert.deepEqual(sellerRetract, 1), 'Seller should have retracted'
      assert.deepEqual(intermediatorRetract, 1, 'Intermediator should have retracted')
    })

  it('Retract paid contract from seller and intermediator, should set right config', async () => {
    // When
    let configTable;
    let agreementTable;
    try {
      await testService.setItem('seller');
      await testService.pay('buyer');
      await testService.retract('seller');
      await testService.finalretract('intermed', false);
      configTable = await testService.getRowsSaleCon('config')
      agreementTable = await testService.getRowsSaleCon('agreement')
    } catch (error) {
      assert.ifError(error, 'Setup is throwing an error')
    }
    const { contractRetracted, contractIsClosed, buyerIsPaidBack } = configTable.rows[0]
    const { sellerRetract, intermediatorRetract } = agreementTable.rows[0]

    // Then
    assert.deepEqual(contractRetracted, 1, 'Contract should be retracted')
    assert.deepEqual(contractIsClosed, 0, 'Contract should not be closed')
    assert.deepEqual(sellerRetract, 1, 'Seller should have retracted')
    assert.deepEqual(intermediatorRetract, 1, 'Intermediator should have retracted')
    assert.deepEqual(buyerIsPaidBack, 0, 'Buyer should not be marked as paid back')
  })
/***********************************************************************************
 retractContract() test (buyer and intermediator)
/**********************************************************************************/

    it('Retract contract (buyer and intermediator) without balance, should set contract to closed', async () => {
      // When
      let configTable;
      let agreementTable;
      try {
        await testService.retract('buyer');
        await testService.finalretract('intermed', true);
        configTable = await testService.getRowsSaleCon('config')
        agreementTable = await testService.getRowsSaleCon('agreement')
      } catch (error) {
        assert.ifError(error, 'Setup is throwing an error')
      }
      const { buyerIsPaidBack, contractRetracted, contractIsClosed } = configTable.rows[0]
      const { buyerRetract, intermediatorRetract } = agreementTable.rows[0]
  
      // Then
      assert.deepEqual(contractRetracted, 1, 'Contract should be retracted')
      assert.deepEqual(contractIsClosed, 1, 'Contract should be closed')
      assert.deepEqual(buyerRetract, 1, 'Seller should have retracted')
      assert.deepEqual(intermediatorRetract, 1, 'Intermediator should have retracted')
    })

  it('Retract paid contract from buyer and intermediator, should set right config', async () => {
      // When
      let configTable;
      let agreementTable;
      try {
        await testService.setItem('seller');
        await testService.pay('buyer');
        await testService.retract('buyer');
        await testService.finalretract('intermed', true);
        configTable = await testService.getRowsSaleCon('config')
        agreementTable = await testService.getRowsSaleCon('agreement')
      } catch (error) {
        assert.ifError(error, 'Setup is throwing an error')
      }
      const { contractRetracted, contractIsClosed, buyerIsPaidBack } = configTable.rows[0]
      const { buyerRetract, intermediatorRetract } = agreementTable.rows[0]
  
      // Then
      assert.deepEqual(contractRetracted, 1, 'Contract should be retracted')
      assert.deepEqual(contractIsClosed, 0, 'Contract should not be closed')
      assert.deepEqual(buyerRetract, 1, 'Seller should have retracted')
      assert.deepEqual(intermediatorRetract, 1, 'Intermediator should have retracted')
      assert.deepEqual(buyerIsPaidBack, 1, 'Buyer be marked as paid back')
    })
})