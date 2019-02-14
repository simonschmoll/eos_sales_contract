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
        assert.ifError(error)
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
        assert.ifError(error)
      }
      const { buyerRetract } = agreementTable.rows[0]
  
      // Then
      assert.deepEqual(buyerRetract, 1)
    })

  it('Intermediator retracts, should be noted in agreement struct', async () => {
      // When
      let agreementTable
      try {
        await testService.retract('intermed');
        agreementTable = await testService.getRowsSaleCon('agreement')
      } catch (error) {
        assert.ifError(error)
      }
      const { intermediatorRetract } = agreementTable.rows[0]
  
      // Then
      assert.deepEqual(intermediatorRetract, 1)
    })

  it('Retract contract and check config, aggrement struct', async () => {
      // When
      let configTable;
      let agreementTable;
      try {
        await testService.retract('seller');
        await testService.retract('intermed');
        configTable = await testService.getRowsSaleCon('config')
        agreementTable = await testService.getRowsSaleCon('agreement')
      } catch (error) {
        assert.ifError(error)
      }
      
      const { contractRetracted } = configTable.rows[0]
      const { sellerRetract, intermediatorRetract } = agreementTable.rows[0]
  
      // Then
      assert.deepEqual(contractRetracted, 1)
      assert.deepEqual(sellerRetract, 1)
      assert.deepEqual(intermediatorRetract, 1)
    })

  it('Retract contract without balance, should set contract to closed', async () => {
      // When
      let configTable;
      let agreementTable;
      try {
        await testService.retract('seller');
        await testService.retract('intermed');
        configTable = await testService.getRowsSaleCon('config')
        agreementTable = await testService.getRowsSaleCon('agreement')
      } catch (error) {
        assert.ifError(error)
      }
      const { contractRetracted, contractIsClosed } = configTable.rows[0]
      const { sellerRetract, intermediatorRetract } = agreementTable.rows[0]
  
      // Then
      assert.deepEqual(contractRetracted, 1)
      assert.deepEqual(contractIsClosed, 1)
      assert.deepEqual(sellerRetract, 1)
      assert.deepEqual(intermediatorRetract, 1)
    })

  it('Retract contract from buyer and intermediator, should set right config', async () => {
      // When
      let configTable;
      let agreementTable;
      try {
        await testService.setItem('seller');
        await testService.pay('buyer');
        await testService.retract('buyer');
        await testService.retract('intermed');
        configTable = await testService.getRowsSaleCon('config')
        agreementTable = await testService.getRowsSaleCon('agreement')
      } catch (error) {
        assert.ifError(error)
      }
      const { contractRetracted, contractIsClosed, buyerIsPaidBack } = configTable.rows[0]
      const { buyerRetract, intermediatorRetract } = agreementTable.rows[0]
  
      // Then
      assert.deepEqual(contractRetracted, 1)
      assert.deepEqual(contractIsClosed, 0)
      assert.deepEqual(buyerRetract, 1)
      assert.deepEqual(intermediatorRetract, 1)
      assert.deepEqual(buyerIsPaidBack, 1)
    })
  it('Retract contract from seller and intermediator, should set right config', async () => {
      // When
      let configTable;
      let agreementTable;
      try {
        await testService.setItem('seller');
        await testService.pay('buyer');
        await testService.retract('seller');
        await testService.retract('intermed');
        configTable = await testService.getRowsSaleCon('config')
        agreementTable = await testService.getRowsSaleCon('agreement')
      } catch (error) {
        assert.ifError(error)
      }
      const { contractRetracted, contractIsClosed, buyerIsPaidBack } = configTable.rows[0]
      const { sellerRetract, intermediatorRetract } = agreementTable.rows[0]
  
      // Then
      assert.deepEqual(contractRetracted, 1, 'Contract not retracted')
      assert.deepEqual(contractIsClosed, 0, 'Contract is closed')
      assert.deepEqual(sellerRetract, 1, 'Seller not retracted')
      assert.deepEqual(intermediatorRetract, 1, 'Intermediator not retracted')
      assert.deepEqual(buyerIsPaidBack, 0, 'Buyer is not paid back')
    })
})