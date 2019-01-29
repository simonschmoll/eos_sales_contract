#include <eosiolib/eosio.hpp>
#include "./salescon.hpp"

using namespace eosio;
using namespace std;

void salescon::init(name seller, name buyer, name intermediator)
{
  auto iterator = _config.find(0);
  eosio_assert(iterator == _config.end(), "Contract already initialized");
  _config.emplace(seller, [&](auto &row) {
    row.seller = seller;
    row.buyer = buyer;
    row.intermediator = intermediator;
  });
}

void salescon::setitem(std::string itemName, uint64_t itemPrice)
{
  require_auth(getSeller());
  assertInitialized();
  auto quantity = asset(itemPrice, EOS_SYMBOL);
  auto iterator = _item.find(0);
  eosio_assert(iterator == _item.end(), "Item already set");
  _item.emplace(getSeller(), [&](auto &row) {
    row.key = 0;
    row.itemName = itemName;
    row.itemPrice = quantity;
    row.itemReceived = false;
    row.itemPaid = false;
  });
}

void salescon::itemreceived()
{
  name buyer = getBuyer();
  require_auth(buyer);
  assertInitialized();
  auto iterator = _item.find(0);
  eosio_assert(iterator != _item.end(), "Item must be set");
  _item.modify(iterator, buyer, [&](auto &row) {
    row.itemReceived = true;
  });
}

void salescon::transfer(name from, name to, asset quantity, string memo)
{
  if (from == _self)
  {
    return;
  }
  name buyer = getBuyer();

  // Necessary asserts
  assertItemReceived();
  assertPriceEqualsValue(quantity.amount);
  eosio_assert(from == buyer, "Amount must come from buyer");
  eosio_assert(to == _self, "Contract was not the recipient");
  eosio_assert(quantity.symbol.is_valid(), "invalid quantity");
  eosio_assert(quantity.amount > 0, "only positive quantities can be transferred");
  eosio_assert(quantity.symbol == EOS_SYMBOL, "only transfer from EOS tokens possible");

  // If everything is valid set item to paid
  itempaid();
}

void salescon::itempaid()
{
  assertInitialized();
  assertItemReceived();
  auto iterator = _item.find(0);
  eosio_assert(iterator != _item.end(), "Item must be set");
  _item.modify(iterator, getBuyer(), [&](auto &row) {
    row.itemPaid = true;
  });
  print("Item is paid");
}

void salescon::assertInitialized()
{
  auto iterator = _config.find(0);
  eosio_assert(iterator != _config.end(), "Contract must be initialized!");
}

void salescon::assertItemReceived()
{
  auto iterator = _item.find(0);
  eosio_assert((*iterator).itemReceived == true, "Item was not marked as received");
}

void salescon::assertItemPaid()
{
  auto iterator = _item.find(0);
  eosio_assert((*iterator).itemPaid == true, "Item was not paid");
}

void salescon::assertPriceEqualsValue(uint64_t value)
{
  auto iterator = _item.find(0);
  eosio_assert((*iterator).itemPrice.amount == value, "Transfer value must be equal to price");
}

name salescon::getSeller()
{
  auto iterator = _config.find(0);
  eosio_assert(iterator != _config.end(), "Contract not initialized");
  return (*iterator).seller;
}

name salescon::getBuyer()
{
  auto iterator = _config.find(0);
  eosio_assert(iterator != _config.end(), "Contract not initialized");
  return (*iterator).buyer;
}

extern "C" void apply(uint64_t receiver, uint64_t code, uint64_t action)
{
  if (code == name("eosio.token").value && action == name("transfer").value)
  {
    execute_action(
        name(receiver), name(name("salescon").value), &salescon::transfer);
  }
  else if (code == receiver)
  {
    switch (action)
    {
      EOSIO_DISPATCH_HELPER(salescon, (setitem)(init)(itemreceived))
    }
  }
}
// EOSIO_DISPATCH(salescon, (setitem)(init)(notify))
