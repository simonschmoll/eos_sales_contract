<template>
  <div id="app">
    <header>
      <nav>
        <ul>
          <li class="nav-item">
              Sales Contract
          </li>
        </ul>
      </nav>
    </header>
    <main>
      <router-view v-if="contractInstance" name="default"/>
      <router-view v-else name="deploy"/>
    </main>
  </div>
</template>

<script>
export default {
  name: 'app',
  created() {
    console.log('Create web3 instance from SalesContract app');
    this.$store.dispatch('loadInitialData');
  },
  computed: {
    contractInstance() {
      console.log('Returning contractInstance', this.$store.state.contractInstance);
      return this.$store.state.eosModule.contractInstance;
    },
  },
};
</script>

<style>
body {
  background: linear-gradient(to bottom, rgb(121, 121, 121), #1000);
  background-attachment: fixed;
}
</style>


<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  color: black;
}
main {
  width: auto;
  min-height: 300px;
  margin: 0 auto;
  top: 20px;
}
header {
  background-color: #999;
  width: auto;
  margin: 0 auto;
}
ul {
  padding: 3px;
  display: flex;
}
.nav-item {
  display: inline-block;
  padding: 5px 10px;
  font-size: 24px;
  border-right: 2px solid #fff;
}


</style>
