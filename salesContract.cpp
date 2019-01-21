#include <salesContract.hpp>

using namespace eosio;

class [[eosio::contract]] salesContract : public eosio::contract {
  public:
    using contract::contract;

  Item(name receiver, name code,  datastream<const char*> ds): contract(receiver, code, ds) {}


  struct Item {
    name key;
    std::string itemName;
    std::
  }
}