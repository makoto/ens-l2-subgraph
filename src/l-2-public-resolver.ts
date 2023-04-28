import {
  AddrChanged as AddrChangedEvent,
  AddressChanged as AddressChangedEvent,
  TextChanged as TextChangedEvent
} from "../generated/L2PublicResolver/L2PublicResolver"
import {
  AddrChanged,
  AddressChanged,
  TextChanged,
  Resolver,
  Domain
} from "../generated/schema"
import { Address, Bytes, log } from '@graphprotocol/graph-ts'

export function handleAddrChanged(event: AddrChangedEvent): void {
  log.warning('*******handleAddrChanged', [])
  let node = event.params.node.toHexString()
  let entity = new AddrChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  let resolver = new Resolver(
    createResolverID(event.params.node, event.address)
  );
  resolver.address = event.address;
  resolver.ownedNode = event.params.ownedNode.toHexString();
  resolver.addr = event.params.a;
  resolver.owner = event.transaction.from;
  resolver.save();

  let  domain = new Domain(node);
  domain.resolvedAddress = event.params.a;
  domain.resolver = resolver.id;
  domain.save()

  entity.node = event.params.node
  // entity.ownedNode = event.params.ownedNode.toHexString();
  entity.a = event.params.a

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAddressChanged(event: AddressChangedEvent): void {
  log.warning('*******handleAddressChanged1', [])
  let entity = new AddressChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  log.warning('*******handleAddressChanged2', [])
  entity.node = event.params.node
  entity.ownedNode = event.params.ownedNode
  entity.coinType = event.params.coinType
  entity.newAddress = event.params.newAddress
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  log.warning('*******handleAddressChanged3', [])
  entity.save()
  log.warning('*******handleAddressChanged4', [])
}

export function handleTextChanged(event: TextChangedEvent): void {
  let entity = new TextChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.node = event.params.node
  entity.ownedNode = event.params.ownedNode
  // entity.indexedKey = event.params.indexedKey
  entity.key = event.params.key

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

function createResolverID(node: Bytes, resolver: Address): string {
  return resolver
    .toHexString()
    .concat("-")
    .concat(node.toHexString());
}
