#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
using namespace eosio;

class [[eosio::contract]] salescon : public eosio::contract {
  public:
    using contract::contract;

  salescon(name receiver, name code,  datastream<const char*> ds): contract(receiver, code, ds) {}

  [[eosio::action]]
  void setitem(name user, std::string itemName, uint64_t itemPrice,
    bool itemReceived, bool itemPaid) {
    print("Hi");
    itemstr item(_code, _code.value);
    auto iterator = item.find(0);
    eosio_assert(iterator == item.end(), "Item already set");
    item.emplace(user, [&]( auto& row ) {
     row.key = 0;
     row.itemName = itemName;
     row.itemPrice = itemPrice;
     row.itemReceived = itemReceived;
     row.itemPaid = itemPaid;
    });
  }

  struct [[eosio::table]] agreestruct {
    uint64_t key;
    bool sellerRetract;
    bool buyerRetract;
    bool intermediatorRetract;
    uint64_t primary_key() const { return key; }
  };

  struct [[eosio::table]] configstruct {
    uint64_t key;
    bool buyerIsPaidBack;
    bool contractRetracted = false;
    name seller;
    name buyer;
    name intermediator;
    bool contractIsClosed = false;
    bool itemIsSet = false;
    uint64_t primary_key() const { return key; }
  };
  struct [[eosio::table]] itemstruct {
    uint64_t key;
    std::string itemName;
    uint64_t itemPrice;
    bool itemReceived;
    bool itemPaid;
    uint64_t primary_key() const { return key; }
  };
  typedef eosio::multi_index<"config"_n, configstruct> configstr;
  typedef eosio::multi_index<"agreement"_n, agreestruct> agreementstr;
  typedef eosio::multi_index<"item"_n, itemstruct> itemstr;
};
EOSIO_DISPATCH(salescon, (setitem))
