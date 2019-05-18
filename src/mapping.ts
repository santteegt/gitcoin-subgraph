import {
  BountyIssued as BountyIssuedEvent,
  BountyActivated as BountyActivatedEvent,
  BountyFulfilled as BountyFulfilledEvent,
  FulfillmentUpdated as FulfillmentUpdatedEvent,
  FulfillmentAccepted as FulfillmentAcceptedEvent,
  BountyKilled as BountyKilledEvent,
  ContributionAdded as ContributionAddedEvent,
  DeadlineExtended as DeadlineExtendedEvent,
  BountyChanged as BountyChangedEvent,
  IssuerTransferred as IssuerTransferredEvent,
  PayoutIncreased as PayoutIncreasedEvent
} from "../generated/Contract/Contract"
import {
  BountyIssued,
  BountyActivated,
  BountyFulfilled,
  FulfillmentUpdated,
  FulfillmentAccepted,
  BountyKilled,
  ContributionAdded,
  DeadlineExtended,
  BountyChanged,
  IssuerTransferred,
  PayoutIncreased
} from "../generated/schema"

export function handleBountyIssued(event: BountyIssuedEvent): void {
  let entity = new BountyIssued(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.bountyId = event.params.bountyId
  entity.save()
}

export function handleBountyActivated(event: BountyActivatedEvent): void {
  let entity = new BountyActivated(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.bountyId = event.params.bountyId
  entity.issuer = event.params.issuer
  entity.save()
}

export function handleBountyFulfilled(event: BountyFulfilledEvent): void {
  let entity = new BountyFulfilled(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.bountyId = event.params.bountyId
  entity.fulfiller = event.params.fulfiller
  entity._fulfillmentId = event.params._fulfillmentId
  entity.save()
}

export function handleFulfillmentUpdated(event: FulfillmentUpdatedEvent): void {
  let entity = new FulfillmentUpdated(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._bountyId = event.params._bountyId
  entity._fulfillmentId = event.params._fulfillmentId
  entity.save()
}

export function handleFulfillmentAccepted(
  event: FulfillmentAcceptedEvent
): void {
  let entity = new FulfillmentAccepted(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.bountyId = event.params.bountyId
  entity.fulfiller = event.params.fulfiller
  entity._fulfillmentId = event.params._fulfillmentId
  entity.save()
}

export function handleBountyKilled(event: BountyKilledEvent): void {
  let entity = new BountyKilled(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.bountyId = event.params.bountyId
  entity.issuer = event.params.issuer
  entity.save()
}

export function handleContributionAdded(event: ContributionAddedEvent): void {
  let entity = new ContributionAdded(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.bountyId = event.params.bountyId
  entity.contributor = event.params.contributor
  entity.value = event.params.value
  entity.save()
}

export function handleDeadlineExtended(event: DeadlineExtendedEvent): void {
  let entity = new DeadlineExtended(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.bountyId = event.params.bountyId
  entity.newDeadline = event.params.newDeadline
  entity.save()
}

export function handleBountyChanged(event: BountyChangedEvent): void {
  let entity = new BountyChanged(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.bountyId = event.params.bountyId
  entity.save()
}

export function handleIssuerTransferred(event: IssuerTransferredEvent): void {
  let entity = new IssuerTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._bountyId = event.params._bountyId
  entity._newIssuer = event.params._newIssuer
  entity.save()
}

export function handlePayoutIncreased(event: PayoutIncreasedEvent): void {
  let entity = new PayoutIncreased(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity._bountyId = event.params._bountyId
  entity._newFulfillmentAmount = event.params._newFulfillmentAmount
  entity.save()
}
