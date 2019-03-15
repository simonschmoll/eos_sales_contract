<template>
  <div class="SalesContract">
    <div class="balance text-xs-center">
      <v-btn large round color="black" outline depressed>
        Contract Balance: {{getBalance}}
      </v-btn>
    </div>
    <h1>Overview</h1>
    <v-container fluid grid-list-xl fill-height>
      <v-layout>
        <v-flex md4>
          <v-card color="secondary" hover>
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
                    <td>Retracted?</td>
                    <td>
                      <v-chip small dark color="success"
                        v-if="getAgreement.sellerRetract==true">Yes
                        <v-icon dark right>check_circle</v-icon>
                      </v-chip>
                      <v-chip small dark color="error" v-else>No
                        <v-icon dark right>cancel</v-icon>
                      </v-chip>
                    </td>
                  </tr>
                </table>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex md4>
          <v-card color="secondary" hover>
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
                    <td>Retracted?</td>
                    <td>
                      <v-chip small dark color="success" v-if="getAgreement.buyerRetract==true">Yes
                        <v-icon dark right>check_circle</v-icon>
                      </v-chip>
                      <v-chip small dark color="error" v-else>No
                        <v-icon dark right>cancel</v-icon>
                      </v-chip>
                    </td>
                  </tr>
                  <tr>
                    <td>Paid?</td>
                    <td>
                      <v-chip small dark color="success" v-if="getItem.itemPaid==true">Yes
                        <v-icon dark right>check_circle</v-icon>
                      </v-chip>
                      <v-chip small dark color="error" v-else>No
                        <v-icon dark right>cancel</v-icon>
                      </v-chip>
                    </td>
                  </tr>
                  <tr>
                    <td>Received?</td>
                    <td>
                      <v-chip small dark color="success" v-if="getItem.itemReceived==true">Yes
                        <v-icon dark right>check_circle</v-icon>
                      </v-chip>
                      <v-chip small dark color="error" v-else>No
                        <v-icon dark right>cancel</v-icon>
                      </v-chip>
                    </td>
                  </tr>
                  <tr>
                    <td>Paid Back?</td>
                    <td>
                      <v-chip small dark color="success" v-if="getBuyerIsPaidBack==true">Yes
                        <v-icon dark right>check_circle</v-icon>
                      </v-chip>
                      <v-chip small dark color="error" v-else>No
                        <v-icon dark right>cancel</v-icon>
                      </v-chip>
                    </td>
                  </tr>
                </table>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex md4>
          <v-card color="secondary" hover>
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
                      <v-chip
                        small
                        dark
                        color="success"
                        v-if="getAgreement.intermediatorRetract==true"
                      >Yes
                        <v-icon dark right>check_circle</v-icon>
                      </v-chip>
                      <v-chip small dark color="error" v-else>No
                        <v-icon dark right>cancel</v-icon>
                      </v-chip>
                    </td>
                  </tr>
                </table>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex md4>
          <v-card color="secondary" hover>
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
                    <td>Item Name</td>
                    <td>{{getItem.name}}</td>
                  </tr>
                  <tr>
                    <td>Item Price</td>
                    <td>{{getItem.price}}</td>
                  </tr>
                  <tr>
                    <td>Retracted?</td>
                    <td>
                      <v-chip small dark color="success" v-if="contract.retracted==true">Yes
                        <v-icon dark right>check_circle</v-icon>
                      </v-chip>
                      <v-chip small dark color="error" v-else>No
                        <v-icon dark right>cancel</v-icon>
                      </v-chip>
                    </td>
                  </tr>
                  <tr>
                    <td>Closed?</td>
                    <td>
                      <v-chip small dark color="success" v-if="contract.contractClosed==true">Yes
                        <v-icon dark right>check_circle</v-icon>
                      </v-chip>
                      <v-chip small dark color="error" v-else>No
                        <v-icon dark right>cancel</v-icon>
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
    <v-divider class="pageDivider"></v-divider>
    <v-container fluid fill-height>
      <v-flex class="actions" md4>
      <h1>Actions Seller:</h1>
      <div>
        <!-- <v-layout fill-height> -->
          <v-tabs color="primary" dark slider-color="yellow">
            <v-tab>Set Item</v-tab>
            <v-tab>Withdraw</v-tab>
            <v-tab>Retract</v-tab>
            <v-tab>Change Seller</v-tab>
            <v-tab-item>
              <v-card color="secondary" hover>
                <v-layout align-center justify-center row fill-height>
                  <v-flex>
                    <v-card-title primary-title>
                      <div>
                        <v-text-field label="Name"
                          v-model="itemName" name="itemName"></v-text-field>
                        <v-text-field label="Price"
                          v-model="itemPrice" name="itemPrice"></v-text-field>
                      </div>
                    </v-card-title>
                  </v-flex>
                  <v-flex>
                    <v-card-actions>
                      <v-btn large round color="primary" @click="sendItem()">Set Item
                      <v-icon color="info" x-large right>add</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="secondary" hover>
                <v-layout align-center justify-center fill-height>
                  <v-card-actions>
                    <v-btn large round color="primary" @click="withdraw()">Withdraw
                      <v-icon color="info" x-larage right>attach_money</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-layout>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="secondary" hover>
                <v-layout align-center justify-center row fill-height>
                  <v-card-actions>
                    <v-btn large round color="primary" @click="retractSeller()">Retract
                      <v-icon color="warning" x-large right>report</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-layout>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="secondary" hover>
                <v-layout align-center justify-center row fill-height>
                  <v-card-title primary-title>
                    <div>
                      <v-text-field label="New Seller"
                      v-model="newSeller" name="newSeller"></v-text-field>
                    </div>
                  </v-card-title>
                  <v-card-actions>
                    <v-btn large round color="primary" @click="changeSeller()">Change
                      <v-icon color="info" x-large dark right>loop</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-layout>
              </v-card>
            </v-tab-item>
          </v-tabs>
        <!-- </v-layout> -->
      </div>
      </v-flex>
      <v-flex class="actions" md4>
      <h1>Actions Buyer:</h1>
      <div>
        <!-- <v-layout fill-height> -->
          <v-tabs color="primary" dark slider-color="yellow">
            <v-tab>Received Item</v-tab>
            <v-tab>Pay</v-tab>
            <v-tab>Retract</v-tab>
            <v-tab>Withdraw Dispute</v-tab>
            <v-tab-item>
              <v-card color="secondary" hover>
                <v-layout align-center justify-center row fill-height>
                  <v-card-actions>
                    <v-btn round large color="primary" @click="received()">Received
                      <v-icon color="info" x-large dark right>mail</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-layout>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="secondary" hover>
                <v-layout align-center justify-center row fill-height>
                  <v-card-actions>
                    <v-btn
                      large
                      round
                      color="primary"
                      @click="pay(getItem.price)"
                    >Pay {{getItem.price}}
                    <v-icon color="info" x-large dark right>payment</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-layout>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="secondary" hover>
                <v-layout align-center justify-center row fill-height>
                  <v-card-actions>
                    <v-btn large round color="primary" @click="retractBuyer()">Retract
                      <v-icon color="warning" x-large right>report</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-layout>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="secondary" hover>
                <v-layout align-center justify-center fill-height>
                  <v-card-actions>
                    <v-btn
                      large
                      round
                      v-if="getBuyerIsPaidBack"
                      color="primary"
                      @click="withdrawAfterDisputeBuyer()"
                    >Withdraw
                      <v-icon color="info" x-larage right>attach_money</v-icon>
                    </v-btn>
                    <v-btn
                      large
                      round
                      v-else
                      disabled
                      color="primary"
                      @click="withdrawAfterDisputeBuyer()"
                    >Withdraw
                      <v-icon color="info" x-larage right>attach_money</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-layout>
              </v-card>
            </v-tab-item>
          </v-tabs>
        <!-- </v-layout> -->
      </div>
      </v-flex>
      <v-flex class="actions" md4>
      <h1>Actions Intermediator:</h1>
      <div>
        <!-- <v-layout fill-height> -->
          <v-tabs color="primary" dark slider-color="yellow">
            <v-tab>Retract favoring seller</v-tab>
            <v-tab>Retract favoring buyer</v-tab>
            <v-tab-item>
              <v-card color="secondary" hover>
                <v-layout align-center justify-center fill-height>
                  <v-card-actions>
                    <v-btn large round color="primary" @click="retractIntermed(false)">Retract
                      <v-icon color="warning" x-large right>report</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-layout>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card color="secondary" hover>
                <v-layout align-center justify-center fill-height>
                  <v-card-actions>
                    <v-btn large round color="primary" @click="retractIntermed(true)">Retract
                      <v-icon color="warning" x-large right>report</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-layout>
              </v-card>
            </v-tab-item>
          </v-tabs>
        <!-- </v-layout> -->
      </div>
      </v-flex>
    </v-container>
    <v-footer class="pa-3">
      <v-spacer></v-spacer>
      <div>&copy; {{ new Date().getFullYear() }}</div>
    </v-footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SalesContract',
  data() {
    return {
      itemName: '',
      itemPrice: null,
      newSeller: null,
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
    changeSeller() {
      const newSellerAddress = this.newSeller;
      console.log('User wants to change seller', newSellerAddress);
      this.$store.dispatch('changeSeller', newSellerAddress);
    },
  },
};
</script>

<style>

table,
th,
td {
  border: 0px;
}

th,
td {
  padding: 2px;
  text-align: center;
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
</style>
