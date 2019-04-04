<template>
  <v-app style="background: #E3F2FD">
  <div id="app">
     <v-toolbar color="blue darken-3" dark fixed app>
      <span><h2>Sales Contract</h2></span>
      <v-spacer></v-spacer>
      <div class="subheading" v-if="contractInstance">
        Contract Balance: {{getBalance}}
      </div>
    </v-toolbar>
    <v-content>
      <v-alert
      :value="errorFlag"
      type="error"
      transition="scale-transition"
      >
      {{errorMessage}}
      </v-alert>
      <main>
        <router-view v-if="contractInstance" name="default"/>
        <router-view v-else name="deploy"/>
      </main>
    </v-content>
    <v-footer app class="pa-3">
      <div>&copy; {{ new Date().getFullYear() }}</div>
    </v-footer>
  </div>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'app',
  data() {
    return {
      polling: null,
    };
  },
  created() {
    this.$store.dispatch('loadData');
    this.poll();
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    poll() {
      this.polling = setInterval(() => {
        this.$store.dispatch('pollContract');
      }, 1000);
    },
  },
  computed: {
    contractInstance() {
      console.log('Returning contractInstance', this.$store.state.eosModule.contractName);
      return this.$store.state.eosModule.contractName;
    },
    ...mapGetters({
      getBalance: 'getBalance',
    }),
    errorMessage() {
      return this.$store.state.eosModule.errorMessage;
    },
    errorFlag() {
      return this.$store.state.eosModule.errorFlag;
    },
  },
  watch: {
    errorFlag() {
      setTimeout(() => {
        this.$store.commit('changeErrorFlagAndMessage');
      }, 4000);
    },
  },
};
</script>

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
  background-color: #bdc3c7;
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
