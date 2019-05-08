<template>
  <div class="SalesContract">
    <v-container class="containerbackground" fluid grid-list-xl fill-height>
      <v-layout>
        <v-flex md4>
          <v-card transparent flat color="accent">
            <v-card-text>
              <div>
                <h2>Seller</h2>
                <v-divider class="divider"></v-divider>
                <table>
                  <tr>
                    <td>Account Name:</td>
                    <td>{{contract.seller}}</td>
                  </tr>
                  <tr>
                    <td>Item Set?</td>
                    <td>
                      <v-chip small dark color="success" v-if="contract.itemSet">
                        Yes
                        <v-icon dark right>check_circle</v-icon>
                      </v-chip>
                      <v-chip small dark color="error" v-else>
                        No
                        <v-icon dark right>offline_bolt</v-icon>
                      </v-chip>
                    </td>
                  </tr>
                  <tr>
                    <td>Retracted?</td>
                    <td>
                      <v-chip small dark color="success" v-if="getAgreement.sellerRetract">
                        Yes
                        <v-icon dark right>check_circle</v-icon>
                      </v-chip>
                      <v-chip small dark color="error" v-else>
                        No
                        <v-icon dark right>offline_bolt</v-icon>
                      </v-chip>
                    </td>
                  </tr>
                </table>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex md4>
          <v-card transparent flat color="accent">
            <v-card-text>
              <div>
                <h2>Buyer</h2>
                <v-divider class="divider"></v-divider>
                <table>
                  <tr>
                    <td>Account Name:</td>
                    <td>{{contract.buyer}}</td>
                  </tr>
                  <tr>
                    <td>Paid?</td>
                    <td>
                      <v-chip small dark color="success" v-if="getItem.itemPaid">
                        Yes
                        <v-icon dark right>check_circle</v-icon>
                      </v-chip>
                      <v-chip small dark color="error" v-else>
                        No
                        <v-icon dark right>offline_bolt</v-icon>
                      </v-chip>
                    </td>
                  </tr>
                  <tr>
                    <td>Received?</td>
                    <td>
                      <v-chip small dark color="success" v-if="getItem.itemReceived">
                        Yes
                        <v-icon dark right>check_circle</v-icon>
                      </v-chip>
                      <v-chip small dark color="error" v-else>
                        No
                        <v-icon dark right>offline_bolt</v-icon>
                      </v-chip>
                    </td>
                  </tr>
                  <tr>
                    <td>Payback?</td>
                    <td>
                      <v-chip small dark color="success" v-if="getBuyerIsPaidBack">
                        Yes
                        <v-icon dark right>check_circle</v-icon>
                      </v-chip>
                      <v-chip small dark color="error" v-else>
                        No
                        <v-icon dark right>offline_bolt</v-icon>
                      </v-chip>
                    </td>
                  </tr>
                  <tr>
                    <td>Retracted?</td>
                    <td>
                      <v-chip small dark color="success" v-if="getAgreement.buyerRetract">
                        Yes
                        <v-icon dark right>check_circle</v-icon>
                      </v-chip>
                      <v-chip small dark color="error" v-else>
                        No
                        <v-icon dark right>offline_bolt</v-icon>
                      </v-chip>
                    </td>
                  </tr>
                </table>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex md4>
          <v-card transparent flat color="accent">
            <v-card-text>
              <div>
                <h2>Intermediator</h2>
                <v-divider class="divider"></v-divider>
                <table>
                  <tr>
                    <td>Account Name:</td>
                    <td>{{contract.intermediator}}</td>
                  </tr>
                  <tr>
                    <td>Retracted?</td>
                    <td>
                      <v-chip small dark color="success" v-if="getAgreement.intermediatorRetract">
                        Yes
                        <v-icon dark right>check_circle</v-icon>
                      </v-chip>
                      <v-chip small dark color="error" v-else>
                        No
                        <v-icon dark right>offline_bolt</v-icon>
                      </v-chip>
                    </td>
                  </tr>
                </table>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex md4>
          <v-card transparent flat color="accent">
            <v-card-text>
              <div>
                <h2>Contract Status</h2>
                <v-divider class="divider"></v-divider>
                <table>
                  <tr>
                    <td>Account Name:</td>
                    <td>{{getContractName}}</td>
                  </tr>
                  <tr>
                    <td>Item Name:</td>
                    <td>{{getItem.name}}</td>
                  </tr>
                  <tr>
                    <td>Item Price:</td>
                    <td>{{getItem.price}}</td>
                  </tr>
                  <tr>
                    <td>Closed?</td>
                    <td>
                      <v-chip small dark color="success" v-if="contract.contractClosed">
                        Yes
                        <v-icon dark right>check_circle</v-icon>
                      </v-chip>
                      <v-chip small dark color="error" v-else>
                        No
                        <v-icon dark right>offline_bolt</v-icon>
                      </v-chip>
                    </td>
                  </tr>
                  <tr>
                    <td>Retracted?</td>
                    <td>
                      <v-chip small dark color="success" v-if="contract.retracted">
                        Yes
                        <v-icon dark right>check_circle</v-icon>
                      </v-chip>
                      <v-chip small dark color="error" v-else>
                        No
                        <v-icon dark right>offline_bolt</v-icon>
                      </v-chip>
                    </td>
                  </tr>
                </table>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container fluid>
      <v-layout fill-height>
        <v-flex mx-2 md4>
          <v-card color="secondary">
            <v-toolbar color="primary" dark dense flat card>
              <v-toolbar-title class="subheading">Actions Seller</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-layout align-center justify-center>
                <v-flex shrink>
                  <v-btn
                    :loading="loadingSellerSetItem"
                    :disabled="loadingSellerSetItem
                  || Boolean(getItemSet)
                  || Boolean(contract.contractClosed)
                  || Boolean(getAgreement.intermediatorRetract)"
                    class="cardbutton v-btn--content-left"
                    block
                    large
                    color="primary"
                    @click.stop="setItemDialog=true"
                  >
                    <v-icon color="info" x-large left>add</v-icon>Set Item...
                  </v-btn>
                  <v-btn
                    :loading="loadingSellerWithdraw"
                    class="cardbutton v-btn--content-left"
                    :disabled="loadingSellerWithdraw || Boolean(contract.contractClosed)
                    || Boolean(getBuyerIsPaidBack)"
                    large
                    block
                    color="primary"
                    @click="withdraw();loader = 'loadingSellerWithdraw'"
                  >
                    <v-icon color="info" x-large left>attach_money</v-icon>Withdraw
                  </v-btn>
                  <v-btn
                  :loading="loadingSellerChange"
                  :disabled="loadingSellerChange
                  || Boolean(contract.contractClosed)
                  || Boolean(getAgreement.intermediatorRetract)"
                  class="cardbutton v-btn--content-left" block
                  large color="primary" @click.stop="changeSellerDialog=true"
                  >
                    <v-icon color="warning" x-large left>loop</v-icon>
                    Change Seller...
                  </v-btn>
                  <v-btn
                    class="cardbutton v-btn--content-left"
                    :loading="loadingSellerRetract"
                    :disabled="loadingSellerRetract
                      || Boolean(getAgreement.sellerRetract)
                      || Boolean(contract.contractClosed)
                      || Boolean(getAgreement.intermediatorRetract)"
                    large
                    block
                    color="primary"
                    @click="retractSeller();loader = 'loadingSellerRetract'"
                  >
                    <v-icon color="warning" x-large left>report</v-icon>Retract
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-dialog v-model="setItemDialog" width="500">
                    <v-card color="white" hover>
                          <v-card-title primary-title>
                            <div>
                              <v-text-field label="Name" v-model="itemName"
                              name="itemName"></v-text-field>
                              <v-text-field label="Price" v-model="itemPrice"
                              name="itemPrice"></v-text-field>
                            </div>
                          </v-card-title>
                           <v-divider></v-divider>
                          <v-card-actions>
                            <v-btn color="blue darken-1" flat
                            @click="setItemDialog = false">Close</v-btn>
                            <v-btn
                              color="blue darken-1"
                              flat
                              @click="setItemDialog = false;
                                sendItem()"
                            >Set Item</v-btn>
                          </v-card-actions>
                    </v-card>
                  </v-dialog>
              <v-dialog v-model="changeSellerDialog" width="500">
                    <v-card color="white" hover>
                          <v-card-title primary-title>
                            <div>
                              <v-text-field label="Account Name"
                              v-model="newSeller" name="newSeller"></v-text-field>
                            </div>
                          </v-card-title>
                           <v-divider></v-divider>
                          <v-card-actions>
                            <v-btn color="blue darken-1" flat
                            @click="changeSellerDialog = false">Close</v-btn>
                            <v-btn
                              color="blue darken-1"
                              flat
                              @click="changeSellerDialog = false;
                                changeSeller()"
                            >Change Seller</v-btn>
                          </v-card-actions>
                    </v-card>
                  </v-dialog>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex mx-2 md4>
          <div>
            <v-card color="secondary" flat transparent>
              <v-toolbar color="primary" dark dense flat card>
                <v-toolbar-title class="subheading">Actions Buyer</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-layout align-center justify-center>
                  <v-flex shrink>
                    <v-btn
                      :loading="loadingBuyerPay"
                      class="cardbutton v-btn--content-left"
                      :disabled="loadingBuyerPay
                      || Boolean(getItem.itemPaid)
                      || Boolean(contract.contractClosed)
                      || Boolean(getAgreement.intermediatorRetract)"
                      large
                      block
                      color="primary"
                      @click="pay(getItem.price);loader = 'loadingBuyerPay'"
                    >
                      <v-icon color="info" x-large dark left>payment</v-icon>
                      Pay {{getItem.price}}
                    </v-btn>
                    <v-btn
                      :loading="loadingBuyerReceived"
                      class="cardbutton v-btn--content-left"
                      :disabled="loadingBuyerReceived
                    || Boolean(getItem.itemReceived)
                    || Boolean(contract.contractClosed)
                    || Boolean(getAgreement.intermediatorRetract)"
                      block
                      large
                      color="primary"
                      @click="received();loader = 'loadingBuyerReceived'"
                    >
                      <v-icon color="info" x-large dark left>mail</v-icon>Received
                    </v-btn>
                    <v-btn
                      :loading="loadingBuyerRetract"
                      class="cardbutton v-btn--content-left"
                      :disabled="loadingBuyerRetract
                      || Boolean(getAgreement.buyerRetract)
                      || Boolean(contract.contractClosed)
                      || Boolean(getAgreement.intermediatorRetract)"
                      large
                      block
                      color="primary"
                      @click="retractBuyer();loader = 'loadingBuyerRetract'"
                    >
                      <v-icon color="warning" x-large left>report</v-icon>Retract
                    </v-btn>
                    <v-btn
                      :loading="loadingBuyerWithdraw"
                      class="cardbutton v-btn--content-left"
                      :disabled="loadingBuyerWithdraw
                      || (!Boolean(getBuyerIsPaidBack))
                      || Boolean(contract.contractClosed)"
                      large
                      block
                      color="primary"
                      @click="withdrawAfterDisputeBuyer();loader = 'loadingBuyerWithdraw'"
                    >
                      <v-icon color="info" x-large left>attach_money</v-icon>Withdraw
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </div>
        </v-flex>
        <v-flex mx-2 md4>
          <div>
            <v-card color="secondary" flat transparent>
              <v-toolbar color="primary" dark dense flat card>
                <v-toolbar-title class="subheading">Actions Intermediator</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-layout align-center justify-center>
                  <v-flex shrink>
                    <v-btn
                      class="cardbutton v-btn--content-left"
                      :loading="loadingIntermediatorSellerRetract"
                      :disabled="loadingIntermediatorSellerRetract
                    || Boolean(contract.retracted)
                    || Boolean(contract.contractClosed)"
                      large
                      block
                      color="primary"
                      @click="retractIntermed(false);loader = 'loadingIntermediatorSellerRetract'"
                    >
                      <v-icon color="warning" x-large left>report</v-icon>Retract favoring Seller
                    </v-btn>
                    <v-btn
                      class="cardbutton v-btn--content-left"
                      :loading="loadingIntermediatorBuyerRetract"
                      :disabled="loadingIntermediatorBuyerRetract
                    || Boolean(contract.retracted)
                    || Boolean(contract.contractClosed)"
                      large
                      block
                      color="primary"
                      @click="retractIntermed(true);loader = 'loadingIntermediatorBuyerRetract'"
                    >
                      <v-icon color="warning" x-large left>report</v-icon>Retract favoring Buyer
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SalesContract',
  data() {
    return {
      loader: null,
      loadingSeller: false,
      loadingSellerSetItem: false,
      loadingSellerRetract: false,
      loadingSellerChange: false,
      loadingSellerWithdraw: false,
      loadingBuyerReceived: false,
      loadingBuyerPay: false,
      loadingBuyerRetract: false,
      loadingBuyerWithdraw: false,
      loadingIntermediatorBuyerRetract: false,
      loadingIntermediatorSellerRetract: false,
      itemName: '',
      itemPrice: null,
      newSeller: null,
      setItemDialog: false,
      changeSellerDialog: false,
    };
  },
  computed: {
    ...mapGetters({
      getItem: 'getItem',
      getStatus: 'getStatus',
      getAgreement: 'getAgreement',
      getBuyerIsPaidBack: 'getBuyerIsPaidBack',
      getBalance: 'getBalance',
      getContractName: 'getContractName',
      getItemSet: 'getItemSet',
    }),
    contract() {
      return this.$store.state.eosModule.contractState;
    },
    loadingFlag() {
      return this.$store.state.eosModule.loadingFlag;
    },
  },
  methods: {
    sendItem() {
      // this.loader = this.loadingSeller;
      const name = this.itemName;
      const price = this.itemPrice;
      this.$store.dispatch('setItem', { name, price });
    },
    received() {
      this.$store.dispatch('receivedItem');
    },
    pay(price) {
      this.$store.dispatch('pay', price);
    },
    withdraw() {
      this.$store.dispatch('withdraw');
    },
    withdrawAfterDisputeBuyer() {
      this.$store.dispatch('withdrawAfterDisputeBuyer');
    },
    retractBuyer() {
      this.$store.dispatch('retractBuyer');
    },
    retractIntermed(buyerIsRight) {
      this.$store.dispatch('retractIntermed', buyerIsRight);
    },
    retractSeller() {
      this.$store.dispatch('retractSeller');
    },
    changeSeller() {
      const newSellerAddress = this.newSeller;
      this.$store.dispatch('changeSeller', newSellerAddress);
    },
  },
  watch: {
    loader() {
      const l = this.loader;

      this[l] = !this[l];

      setTimeout(() => {
        this[l] = false;
      }, 15000);

      this.loader = null;
    },
    loadingFlag() {
      if (this.loadingFlag) {
        this.loadingSellerSetItem = false;
        this.loadingSellerRetract = false;
        this.loadingSellerChange = false;
        this.loadingSellerWithdraw = false;
        this.loadingBuyerReceived = false;
        this.loadingBuyerPay = false;
        this.loadingBuyerRetract = false;
        this.loadingBuyerWithdraw = false;
        this.loadingIntermediator = false;
        this.loadingIntermediatorBuyerRetract = false;
        this.loadingIntermediatorSellerRetract = false;
        this.$store.commit('changeLoadingFlag');
      }
    },
  },
};
</script>

<style>
.containerbackground {
  background-color: #bbdefb;
}

table,
th,
td {
  border: 0px;
}

th,
td {
  padding: 6px;
  text-align: left;
  font-size: 12pt;
}

.actions {
  margin-left: 10px;
}

h1 {
  font-size: 20px;
  margin: 20px;
}

.divider {
  margin-top: 5px;
  margin-bottom: 5px;
}

.pageDivider {
  margin-top: 20px;
  margin-bottom: 20px;
}

.balance {
  margin: 5px;
  font-size: 16pt;
}

.pa-3 {
  margin-top: 150px;
}

.cardbutton {
  margin: 10px 0px !important;
}

.testing {
  align-content: left;
}

.v-chip {
  margin: 0 !important;
}

.v-btn--content-left .v-btn__content {
  justify-content: flex-start;
}

</style>
