#include <eosiolib/eosio.hpp>
#include <eosiolib/asset.hpp>
#define EOS_SYMBOL symbol("SYS", 4)

namespace eosio {
  using std::string;
  class [[eosio::contract]] salescon : public eosio::contract {
    
    public:
      salescon(name receiver, name code,  datastream<const char*> ds): contract(receiver, code, ds), _item(_code, _code.value),
      _config(_code, _code.value), _agree(_code, _code.value) {}

      [[eosio::action]]
      void init(name seller, name buyer, name intermediator);

      [[eosio::action]]
      void setitem(std::string itemName, uint64_t itemPrice);

      [[eosio::action]]
      void itemreceived();

      [[eosio::action]]
      void transfer(name from, name to, asset quantity, string memo);

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
        asset itemPrice;
        bool itemReceived;
        bool itemPaid;
        uint64_t primary_key() const { return key; }
      };

    private: 
      typedef eosio::multi_index<"config"_n, configstruct> configstr;
      typedef eosio::multi_index<"agreement"_n, agreestruct> agreementstr;
      typedef eosio::multi_index<"item"_n, itemstruct> itemstr;

      configstr _config;
      agreementstr _agree;
      itemstr _item;

      void itempaid();
      void assertInitialized();
      void assertItemReceived();
      void assertItemPaid();
      void assertPriceEqualsValue(uint64_t value);
      name getSeller();
      name getBuyer();
    };
}