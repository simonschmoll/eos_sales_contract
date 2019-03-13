<template>
  <div>
    <h1>Deploy and initialize contract:</h1>
    <table>
      <thead>
        <th>Deploy</th>
        <th>Initialize</th>
        <th>Connect to existing Contract</th>
      </thead>
      <tbody>
        <td>
          Already deployed?
          <div class="deploy" style="background-color: green" v-if="deployed">Yes!</div>
          <div class="deploy" style="background-color: #F66666" v-else>No</div>
          <button class="button buttonBuyer" @click="deployContract()">Deploy</button>
        </td>
        <td> Address Seller: <input v-model="addrSeller" type="text"
          name="seller" class="input-con"><br>
          Address Buyer: <input v-model="addrBuyer" type="text"
            name="buyer" class="input-con"><br>
          Address Intermediator:
          <input v-model="addrIntermediator" type="text" name="intermediator" class="input-con"><br>
          <button class="button buttonBuyer" @click="initialize()">Initialize</button>
         </td>
         <td>
           <input v-model="contractAddress" type="text" name="ContractAddr" class="input-con"><br>
          <button class="button buttonBuyer" @click="connectToContract()">Connect</button>
         </td>
      </tbody>
    </table>
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
.input-con {
  width: 500px;
  font-size: 20pt;
  margin-bottom: 5px;
}

td, th {
  font-size: 20pt;
}

h1 {
  font-size: 24pt;
}

.deploy {
  margin: 5px;
  border-style: ridge;
}


</style>
