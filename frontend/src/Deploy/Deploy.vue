<template>
  <div>
    <h1>Deploy and initialize contract</h1>
    <v-container fluid grid-list-xl fill-height>
      <v-layout>
        <v-flex md4>
          <v-card color="secondary" hover>
          <v-card-title primary-title>
            <div>
              <h3 class="display-1 mb-3">Deploy</h3>
              <div>
                Contract already deployed?
                <v-chip dark color="success" v-if="deployed">Yes
                  <v-icon dark right>check_circle</v-icon>
                </v-chip>
                <v-chip dark color="error" v-else>No</v-chip>
              </div>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-btn block color="primary" @click="deployContract()">Deploy</v-btn>
          </v-card-actions>
        </v-card>
        </v-flex>
        <v-flex md4>
          <v-card color="secondary" hover>
          <v-card-title primary-title>
            <div>
              <h3 class="display-1 mb-3">Initialize</h3>
              <div>
                <v-text-field label="Address Seller" v-model="addrSeller"
                  name="seller"></v-text-field>
                <v-text-field label="Address Buyer" v-model="addrBuyer"
                name="buyer"></v-text-field>
                <v-text-field label="Address Intermediator" v-model="addrIntermediator"
                name="intermediator"></v-text-field>
              </div>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-btn block color="primary" @click="initialize()">Initialize</v-btn>
          </v-card-actions>
        </v-card>
        </v-flex>
        <v-flex md4>
          <v-card color="secondary" hover>
          <v-card-title primary-title>
            <div>
              <h3 class="display-1 mb-3">Connect to contract</h3>
              <div>
              <v-text-field label="Contract Address" v-model="contractAddress"
                name="intermediator"></v-text-field>
            </div>
            </div>

          </v-card-title>
          <v-card-actions>
            <v-btn block color="primary" @click="connectToContract()">Connect</v-btn>
          </v-card-actions>
        </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'deploy',
  data() {
    return {
      addrSeller: null,
      addrBuyer: null,
      addrIntermediator: null,
      contractAddress: null,
    };
  },
  methods: {
    deployContract() {
      console.log('Deploy called');
      this.$store.dispatch('deploy');
    },

    connectToContract() {
      const contractAddr = this.contractAddress;
      this.$store.dispatch('connectToContract', contractAddr);
    },
    initialize() {
      console.log('init called');
      const buyer = this.addrBuyer;
      const intermediator = this.addrIntermediator;
      const seller = this.addrSeller;
      this.$store.dispatch('initialize', { seller, buyer, intermediator });
    },
  },
  computed: {
    deployed() {
      console.log('Deployed contract?', this.$store.state.eosModule.deployedContract);
      return this.$store.state.eosModule.deployedContract;
    },
  },
};
</script>

<style scoped>

h1 {
  font-size: 24pt;
}


</style>
