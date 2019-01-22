#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
using namespace eosio;

class [[eosio::contract]] salescon : public eosio::contract {
  public:
    using contract::contract;

  salescon(name receiver, name code,  datastream<const char*> ds): contract(receiver, code, ds), _item(_code, _code.value),
    _config(_code, _code.value), _agree(_code, _code.value) {}

  [[eosio::action]]
  void init(name seller, name buyer, name intermediator) {
    auto iterator = _config.find(0);
    eosio_assert(iterator == _config.end(), "Contract already initialized");
    _config.emplace(seller, [&] ( auto& row ) {
      row.seller = seller;
      row.buyer = buyer; 
      row.intermediator = intermediator;
    });
  }

  [[eosio::action]]
  void setitem(std::string itemName, uint64_t itemPrice,
    bool itemReceived, bool itemPaid) {
    require_auth(getSeller());
    assertInitialized();
    auto iterator = _item.find(0);
    eosio_assert(iterator == _item.end(), "Item already set");
    _item.emplace(getSeller(), [&]( auto& row ) {
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

  configstr _config;
  agreementstr _agree;
  itemstr _item;
private: 
  void assertInitialized() {
    // configstr _config(_code, _code.value);
    auto iterator = _config.find(0);
    eosio_assert(iterator != _config.end(), "Contract must be initialized!");
  }

  name getSeller() {
    // configstr config(_code, _code.value);
    auto iterator = _config.find(0);
    eosio_assert(iterator != _config.end(), "Contract not initialized");
    return (*iterator).seller;
  }

};
EOSIO_DISPATCH(salescon, (setitem)(init))
