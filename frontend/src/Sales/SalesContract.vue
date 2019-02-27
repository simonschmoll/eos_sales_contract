<template>
  <div>
    <div class="SalesContract">
      <p class="account">Contract Balance: {{getBalance}}</p>
      <h1>Overview:</h1>
      <table>
          <tr>
            <th>Seller</th>
            <th>Buyer</th>
            <th>Intermediator</th>
            <th>Itemname</th>
            <th>Price</th>
          </tr>
        <tr>
          <td>{{contract.seller}}</td>
          <td>{{contract.buyer}}</td>
          <td>{{contract.intermediator}}</td>
          <td>{{getItem.name}}</td>
          <td>{{getItem.price}}</td>
        </tr>
      </table>
      <table>
          <tr>
            <th>Paid?</th>
            <th>Received?</th>
            <th>Closed?</th>
            <th>Buyer is Paid Back?</th>
          </tr>
        <tr>
          <td v-if="getItem.itemPaid==false" style="background-color: #F66666">No</td>
          <td v-else style="background-color: green">Yes</td>
          <td v-if="getItem.itemReceived==false" style="background-color: #F66666">No</td>
          <td v-else style="background-color: green">Yes</td>
          <td v-if="getStatus==false" style="background-color: #F66666">No</td>
          <td v-else style="background-color: green">Yes</td>
          <td v-if="getBuyerIsPaidBack==false" style="background-color: #F66666">No</td>
          <td v-else style="background-color: green">Yes</td>
        </tr>
      </table>
      <table>
          <caption><strong>Retraction Status</strong></caption>
          <tr>
            <th>Seller?</th>
            <th>Buyer?</th>
            <th>Intermediator?</th>
          </tr>
        <tr>
          <td v-if="getAgreement.sellerRetract==true"
            style="background-color: #F66666">Retracted!</td>
          <td v-else style="background-color: green">Valid</td>
          <td v-if="getAgreement.buyerRetract==true"
            style="background-color: #F66666">Retracted!</td>
          <td v-else style="background-color: green">Valid</td>
          <td v-if="getAgreement.intermediatorRetract==true"
            style="background-color: #F66666">Retracted!</td>
          <td v-else style="background-color: green">Valid</td>
        </tr>
      </table>
      <hr>
      <div class="actions">
        <h1>Actions Seller:</h1>
        <table class="actionTable">
          <tr>
            <th class="thAction">Set Item</th>
            <th class="thAction">Withdraw</th>
            <th class="thAction">Retract</th>
          </tr>
          <tr>
            <td class="tdAction">
              <div class="input-container">
                <label for="ItemName">Name:</label>
                <input v-model="itemName" type="text" name="ItemName">
              </div>
              <div class="input-container">
                <label for="ItemPrice">Price:</label>
                <input v-model="itemPrice" type="text" name="ItemPrice">
              </div>
              <button class="buttonSeller buttonSubmit" @click="sendItem()">Submit</button>
            </td>
            <td class="tdAction">
              <button class="buttonSeller" @click="withdraw()">Withdraw</button>
            </td>
            <td class="tdAction">
              <button class="buttonRetract" @click="retractSeller()">Retract</button>
            </td>
          </tr>
        </table>
      </div>
      <div class="actions">
        <h1>Actions Buyer:</h1>
        <table class="actionTable">
          <tr>
            <th class="thAction">Received Item</th>
            <th class="thAction">Price: {{getItem.price}}</th>
            <th class="thAction">Retract</th>
            <th v-if="getBuyerIsPaidBack" class="thAction">Withdraw after dispute</th>
          </tr>
          <tr>
            <td class="tdAction">
              <button class="buttonBuyer" @click="received()">Received Item</button>
            </td>
            <td class="tdAction">
              <button class="buttonBuyer" @click="pay(getItem.price)">Pay Item</button>
            </td>
            <td class="tdAction">
              <button class="buttonRetract" @click="retractBuyer()">Retract</button>
            </td>
            <td v-if="getBuyerIsPaidBack" class="tdAction">
              <button class="buttonWithdrawDispute"
                @click="withdrawAfterDisputeBuyer()">Withdraw</button>
            </td>
          </tr>
        </table>
      </div>
     <div class="actions">
        <h1>Actions Intermediator:</h1>
        <table class="actionTable">
          <tr>
            <th class="thAction">Retract in favor of seller</th>
            <th class="thAction">Retract in favor of buyer</th>
          </tr>
          <tr>
            <td class="tdAction">
              <button class="buttonRetract" @click="retractIntermed(false)">Retract</button>
            </td>
            <td class="tdAction">
              <button class="buttonRetract" @click="retractIntermed(true)">Retract</button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SalesContract',
  data() {
    return {
      itemName: '',
      itemPrice: 0,
    };
  },
  computed: {
    ...mapGetters({
      getItem: 'getItem',
      getStatus: 'getStatus',
      getAgreement: 'getAgreement',
      getBuyerIsPaidBack: 'getBuyerIsPaidBack',
      getBalance: 'getBalance',
    }),
    contract() {
      return this.$store.state.eosModule.contractState;
    },
  },
  methods: {
    sendItem() {
      const name = this.itemName;
      const price = this.itemPrice.toString();
      console.log('Item price in sendItem:', price);
      this.$store.dispatch('setItem', { name, price });
    },
    received() {
      console.log('received called from component');
      this.$store.dispatch('receivedItem');
    },
    pay(price) {
      console.log('User wants to pay item (SalesContract)', price);
      this.$store.dispatch('pay', price);
    },
    withdraw() {
      console.log('Seller wants to withdraw money');
      this.$store.dispatch('withdraw');
    },
    withdrawAfterDisputeBuyer() {
      console.log('Buyer wants to withdraw money after dispute');
      this.$store.dispatch('withdrawAfterDisputeBuyer');
    },
    retractBuyer() {
      console.log('Buyer wants to retract (SalesContract)');
      this.$store.dispatch('retractBuyer');
    },
    retractIntermed(buyerIsRight) {
      console.log('Intermed wants to retract (SalesContract)');
      this.$store.dispatch('retractIntermed', buyerIsRight);
    },
    retractSeller() {
      console.log('Seller wants to retract (SalesContract)');
      this.$store.dispatch('retractSeller');
    },
  },
};
</script>

<style>
table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
}

table {
  margin: 20px;
}

h1 {
  font-size: 20px;
  margin: 20px;
}

.actions {
  margin-top: 30px;
  width: 100%;
  border: 1px solid black;
  background: grey;
}

footer {
  width: 100%;
  bottom: 10px;
  text-align: center;
}

hr {
  background-color: black;
  margin-top: 30px;
  height: 1px;
  border: 0;
}

input {
  background-color: #E2DFDF;
}

label {
  margin-right: 5px;
}

button {
  color: white;
  padding: 15px 30px;
  text-align: center;
  margin: auto;
  display:flex;
  cursor: pointer;
}

.input-container {
  display: table-row;
}
.input-container * {
  display: table-cell;
  margin-left: 5px;
}

.buttonWithdrawDispute,
.buttonSeller,
.buttonBuyer {
  background-color: rgb(125, 180, 126);
}

.buttonRetract
{
  background-color: rgb(243, 147, 147);
}

.buttonSubmit {
  margin-top: 10px;
}

.tdAction,
.thAction {
  width: 200px;
}

.tdAction {
  height: 100px;
}

.account {
  margin: 20px;
}

</style>
