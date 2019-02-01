#include <eosiolib/eosio.hpp>
#include "./salescon.hpp"
// #include <typeinfo>

using namespace eosio;
using namespace std;

void salescon::init(name seller, name buyer, name intermediator)
{
  auto iterator = _config.find(0);
  eosio_assert(iterator == _config.end(), "Contract already initialized");
  _config.emplace(seller, [&](auto &row) {
    row.key = 0;
    row.seller = seller;
    row.buyer = buyer;
    row.intermediator = intermediator;
    row.balance = asset(0, EOS_SYMBOL);
    row.contractIsClosed = false;
    row.itemSet = false;
    row.buyerIsPaidBack = false;
    row.contractRetracted = false;
    row.itemReceived = false;
    row.itemPaid = false;
  });
  auto agreeIt = _agreement.find(0);
  eosio_assert(agreeIt == _agreement.end(), "Contract already initialized");
  _agreement.emplace(seller, [&](auto &row) {
    row.key = 0;
    row.sellerRetract = false;
    row.buyerRetract = false;
    row.intermediatorRetract = false;
  });
  setBalance(asset(0, EOS_SYMBOL), seller);
}

void salescon::setitem(std::string itemName, uint64_t itemPrice)
{
  name seller = getSeller();
  require_auth(seller);
  assertInitialized();
  auto quantity = asset(itemPrice, EOS_SYMBOL);
  auto iterator = _item.find(0);
  eosio_assert(iterator == _item.end(), "Item already set");
  _item.emplace(seller, [&](auto &row) {
    row.key = 0;
    row.itemName = itemName;
    row.itemPrice = quantity;
  });
  setItemIsSetFlag(true, seller);
}

void salescon::itemreceived()
{
  assertItemPaid();
  name buyer = getBuyer();
  require_auth(buyer);
  setItemReceivedFlag(true, buyer);
}

void salescon::transfer(name from, name to, asset quantity, string memo)
{
  if (from == _self)
  {
    return;
  }
  name buyer = getBuyer();

  // Necessary asserts
  // assertItemSet();
  assertPriceEqualsValue(quantity.amount);
  eosio_assert(from == buyer, "Amount must come from buyer");
  eosio_assert(to == _self, "Contract was not the recipient");
  eosio_assert(quantity.symbol.is_valid(), "invalid quantity");
  eosio_assert(quantity.amount > 0, "only positive quantities can be transferred");
  eosio_assert(quantity.symbol == EOS_SYMBOL, "only transfer from EOS tokens possible");

  // If everything is valid set item to paid
  itempaid(_self);
}

void salescon::withdraw(name to)
{
  assertItemReceived();
  assertItemPaid();
  auto config = getConfig();
  if (config.buyerIsPaidBack)
  {
    require_auth(getBuyer());
  }
  else
  {
    require_auth(getSeller());
  }
  require_auth(to);
  auto price = getPrice();
  sendTokens(to, price);
}

void salescon::retract(name retractor)
{
  name seller = getSeller();
  name buyer = getBuyer();
  name intermediator = getIntermediator();
  assertContractClosedStatus(false);
  assertRetractStatus(false);

  auto agreement = getAgreement();
  if (retractor == buyer)
  {
    eosio_assert(!agreement.sellerRetract, "can not retract, because seller already retracted");
  }
  else if (retractor == seller){
      eosio_assert(!agreement.buyerRetract, "can not retract, because buyer already retracted");
  } 
  require_auth(retractor);
  eosio_assert(retractor == buyer || retractor == seller || retractor == intermediator, "Caller does not have the permission to call this method");
  if (retractor == buyer)
  {
    buyerRetract(buyer);
  }
  else if (retractor == seller)
  {
    sellerRetract(seller);
  }
  else if (retractor == intermediator)
  {
    intermediatorRetract(intermediator);
  }
  configureRetractedState(retractor);
}

void salescon::itempaid(name payer)
{
  setItemIsPaidFlag(true, payer);
  asset price = getPrice();
  setBalance(price, payer);
  print("Item is paid");
}

void salescon::setItemIsSetFlag(bool value, name payer)
{
  auto iterator = _config.find(0);
  if (iterator != _config.end())
  {
    _config.modify(iterator, payer, [&](auto &row) {
      row.itemSet = value;
    });
  }
}

void salescon::setItemIsPaidFlag(bool value, name payer)
{
  auto iterator = _config.find(0);
  if (iterator != _config.end())
  {
    _config.modify(iterator, payer, [&](auto &row) {
      row.itemPaid = value;
    });
  }
}

void salescon::setItemReceivedFlag(bool value, name payer)
{
  auto iterator = _config.find(0);
  if (iterator != _config.end())
  {
    _config.modify(iterator, payer, [&](auto &row) {
      row.itemReceived = value;
    });
  }
}

void salescon::setContractClosedStatus(bool value, name payer)
{
  auto iterator = _config.find(0);
  if (iterator != _config.end())
  {
    _config.modify(iterator, payer, [&](auto &row) {
      row.contractIsClosed = value;
    });
  }
}

void salescon::setRetractStatus(bool value, name payer)
{
  auto iterator = _config.find(0);
  if (iterator != _config.end())
  {
    _config.modify(iterator, payer, [&](auto &row) {
      row.contractRetracted = value;
    });
  }
}

void salescon::setBuyerPaidBack(bool value, name payer)
{
  auto iterator = _config.find(0);
  if (iterator != _config.end())
  {
    _config.modify(iterator, payer, [&](auto &row) {
      row.buyerIsPaidBack = value;
    });
  }
}

void salescon::setBalance(asset value, name payer)
{
  auto iterator = _config.find(0);
  if (iterator != _config.end())
  {
    _config.modify(iterator, payer, [&](auto &row) {
      row.balance = value;
    });
  }
}

void salescon::configureRetractedState(name retractor)
{
  auto iterator = _agreement.find(0);
  const auto &str = *iterator;
  if ((str.sellerRetract && str.buyerRetract) ||
      (str.sellerRetract && str.intermediatorRetract) ||
      (str.buyerRetract && str.intermediatorRetract))
  {
    auto config = getConfig();
    if (config.balance.amount == 0)
    {
      setContractClosedStatus(true, retractor);
    }
    else
    {
      setBuyerPaidBack((!(str.sellerRetract && str.intermediatorRetract)), retractor);
    }
    setRetractStatus(true, retractor);
  }
}

void salescon::buyerRetract(name buyer)
{
  auto iterator = _agreement.find(0);
  _agreement.modify(iterator, buyer, [&](auto &row) {
    row.buyerRetract = true;
  });
}

void salescon::sellerRetract(name seller)
{
  auto iterator = _agreement.find(0);
  _agreement.modify(iterator, seller, [&](auto &row) {
    row.sellerRetract = true;
  });
}

void salescon::intermediatorRetract(name intermediator)
{
  auto iterator = _agreement.find(0);
  _agreement.modify(iterator, intermediator, [&](auto &row) {
    row.intermediatorRetract = true;
  });
}

void salescon::sendTokens(name to, asset price)
{
  action(
      permission_level{get_self(), "active"_n},
      name("eosio.token"),
      "transfer"_n,
      std::make_tuple(get_self(), to, price, std::string("")))
      .send();
  setBalance(asset(0, EOS_SYMBOL), to);
}

void salescon::assertInitialized()
{
  auto iterator = _config.find(0);
  eosio_assert(iterator != _config.end(), "assert initialized: Contract must be initialized!");
}

void salescon::assertItemSet()
{
  auto config = getConfig();
  eosio_assert(config.itemSet == true, "assertItemSet: Item was not marked as received");
}

void salescon::assertItemReceived()
{
  auto config = getConfig();
  eosio_assert(config.itemReceived == true, "assertItemReceived: Item was not marked as received");
}

void salescon::assertItemPaid()
{
  auto config = getConfig();
  eosio_assert(config.itemPaid == true, "assertItemPaid: Item was not paid");
}

void salescon::assertPriceEqualsValue(uint64_t value)
{
  auto iterator = _item.find(0);
  eosio_assert((*iterator).itemPrice.amount == value, "assertPriceEqualsValue: Transfer value must be equal to price");
}

void salescon::assertRetractStatus(bool status)
{
  auto config = getConfig();
  status ? eosio_assert(config.contractRetracted == status, "assertRetractStatus: contract must be retracted") : eosio_assert(config.contractRetracted == status, "contract must not be retracted");
}

void salescon::assertContractClosedStatus(bool status)
{
  auto config = getConfig();
  status ? eosio_assert(config.contractRetracted == status, "assertContractClosedStatus: contract should be closed") : eosio_assert(config.contractRetracted == status, "contract is closed");
}

name salescon::getSeller()
{
  auto iterator = _config.find(0);
  eosio_assert(iterator != _config.end(), "Tried to call getSeller(), but contract is not initialized");
  return (*iterator).seller;
}

name salescon::getBuyer()
{
  auto iterator = _config.find(0);
  eosio_assert(iterator != _config.end(), "Tried to call getBuyer(), but contract is not initialized");
  return (*iterator).buyer;
}

name salescon::getIntermediator()
{
  auto iterator = _config.find(0);
  eosio_assert(iterator != _config.end(), "Tried to call getIntermediator(), but contract is not initialized");
  return (*iterator).intermediator;
}

asset salescon::getPrice()
{
  auto iterator = _item.find(0);
  eosio_assert(iterator != _item.end(), "Tried to call getPrice(), but item is not set");
  return (*iterator).itemPrice;
}

eosio::salescon::agreestruct salescon::getAgreement()
{
  auto agreeIt = _agreement.find(0);
  eosio_assert(agreeIt != _agreement.end(), "getAgreement(): Contract must be initialized");
  return (*agreeIt);
}

eosio::salescon::configstruct salescon::getConfig()
{
  auto configIt = _config.find(0);
  eosio_assert(configIt != _config.end(), "getConfig(): Contract must be initialized");
  return (*configIt);
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
      EOSIO_DISPATCH_HELPER(salescon, (setitem)(init)(itemreceived)(withdraw)(retract))
    }
  }
}
