<template>
  <div class="seller">
    <h1>Deploy Contract first:</h1>
    <table>
      <thead>
        <th>Deploy</th>
      </thead>
      <tbody>
        <td> Address Seller: <input v-model="addrSeller" type="text" name="ItemName"><br>
          Address Buyer: <input v-model="addrBuyer" type="text" name="ItemPrice"><br>
          Address Intermediator:
          <input v-model="addrIntermediator" type="text" name="ItemPrice"><br>
          <button class="button buttonBuyer" @click="deployContract()">Submit</button>
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
      addrSeller: 0,
      addrBuyer: 0,
      addrIntermediator: 0,
    };
  },
  methods: {
    deployContract() {
      const seller = this.addrSeller;
      const buyer = this.addrBuyer;
      const intermediator = this.addrIntermediator;
      console.log('Sending deploy data to store: ', seller, buyer, intermediator);
      this.$store.dispatch('deploy', { seller, buyer, intermediator });
    },
  },

};
</script>

<style>

</style>
