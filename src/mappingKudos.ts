import { 
  Kudo as Kudos,
} from "../generated/schema"

import {
  Kudos as KudosContract,
  MintCall,
  CloneCall,
  Transfer as TransferEvent,
} from '../generated/Kudos/Kudos'

import { log, ipfs, json, TypedMap, JSONValue, Bytes, Value, BigDecimal, BigInt } from '@graphprotocol/graph-ts'

export function handleKudosTransfer(event: TransferEvent):void {
  log.info('handleKudosTransfer', [])
  let contract = KudosContract.bind(event.address)
  let from = event.params._from
  let to = event.params._to
  let tokenId = event.params._tokenId
  log.warning('new Kudos transfer {} {} {}', [from.toHexString(), to.toHexString(), tokenId.toString()])
  let record = contract.getKudosById(tokenId)
  let tokenURI = contract.tokenURI(tokenId)
  if (record.value3 != BigInt.fromI32(0)) { // No Gen0 Kudos
    let kudos = Kudos.load(tokenId.toHexString())
    if (kudos == null) {
      kudos = new Kudos(tokenId.toHexString())
      kudos.owner = to
      kudos.clonesAllowed = BigInt.fromI32(0)
      kudos.price = record.value0
      kudos.tokenURI = contract.tokenURI(record.value3)
      kudos.totalFees = BigInt.fromI32(0)
      kudos.totalRevenue = BigInt.fromI32(0)
      kudos.gen0 = false
      kudos.parent = record.value3
    } else { // Already owned
      kudos.owner = to
    }
    let parent = Kudos.load(record.value3.toHexString())
    if (parent != null) {
      log.debug('Fee', [record.value0.toString()])
      let fee = record.value0.gt(BigInt.fromI32(0)) ? record.value0.div(BigInt.fromI32(10)) : BigInt.fromI32(0) // TODO: replace fixed 10% fee
      parent.totalFees = parent.totalFees.plus(fee)
      parent.totalRevenue = parent.totalRevenue.plus(record.value0.gt(BigInt.fromI32(0)) ? record.value0.minus(fee) : BigInt.fromI32(0))
      parent.save() // Update parent total fees and revenue
    }
    kudos.save() // save cloned kudos
    log.info('Saved No Gen0', [])
  } else { // Update Gen0 kudos
    let kudos = Kudos.load(tokenId.toHexString())
    if (kudos == null) { // Gen0 not yet created
      kudos = new Kudos(tokenId.toHexString())
      kudos.tokenURI = tokenURI // Temporary value
      kudos.totalFees = BigInt.fromI32(0)
      kudos.totalRevenue = BigInt.fromI32(0)
      kudos.gen0 = true
      kudos.parent = BigInt.fromI32(0)
    } else { // Updated owner e.g. by burning token
      kudos.owner = to
      kudos.clonesAllowed = record.value1
      kudos.price = record.value0
    }
    kudos.save()
    log.info('Saved Gen0', [])
  }
  
}

export function handleMint(call: MintCall): void {
  log.info('handleMint', [])
  let to = call.inputs._to
  let price = call.inputs._priceFinney
  let numClonesAllowed = call.inputs._numClonesAllowed
  let tokenURI = call.inputs._tokenURI
  let tokenId = call.outputs.tokenId
  log.warning('new Kudos minted {} {}', [to.toHexString(), tokenURI])
  let kudos = Kudos.load(tokenId.toHexString())
  if (kudos == null) {
    kudos = new Kudos(tokenId.toHexString())
    kudos.owner = to
    kudos.clonesAllowed = numClonesAllowed
    kudos.price = price
    kudos.tokenURI = tokenURI
    kudos.totalFees = BigInt.fromI32(0)
    kudos.totalRevenue = BigInt.fromI32(0)
    kudos.gen0 = true
    kudos.parent = BigInt.fromI32(0)
  } else {
    kudos.tokenURI = tokenURI
  }
  kudos.save()
  log.info('Saved mint', [])
}
