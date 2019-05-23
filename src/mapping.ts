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
  PayoutIncreased as PayoutIncreasedEvent,
  Contract as StandardBountiesContract
} from "../generated/Contract/Contract"
import {
  Bounty,
  BountyData,
  FulfillmentData,
  Leaderboard,
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
import { 
  log, 
  ipfs, 
  json,
  TypedMap, 
  JSONValue, 
  Bytes, 
  Value, 
  BigDecimal, 
  BigInt } from '@graphprotocol/graph-ts'

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

function getIpfsData(hash: string): TypedMap<string, JSONValue> | null {
  let data: TypedMap<string, JSONValue>
  if (hash != null && hash.length > 0) {
    let dataBytes = (ipfs.cat(hash)) as Bytes
    if (dataBytes != null && dataBytes.toString().length > 0) {
      log.warning('DEBUG IPFS {}', [dataBytes.toString()])
      let json = json.fromBytes(dataBytes)
      // log.warning('DEBUG IPFS RS {}', [json.toString()])
      data = json.toObject()
    } else {
      log.warning('DEBUG IPFS SKIPPING {}', [hash])
    }
  }
  return data;
}

export function handleFulfillmentAccepted(
  event: FulfillmentAcceptedEvent
): void {
  // log.warning('DEBUG1', [])
  let contract = StandardBountiesContract.bind(event.address)
  let bountyDataHash = contract.getBountyData(event.params.bountyId)
  let bountyCoreData = contract.getBounty(event.params.bountyId)
  let fulfillment = contract.getFulfillment(event.params.bountyId, event.params._fulfillmentId)
  // log.warning('DEBUG2 {}', [bountyDataHash])
  // geting Data from IPFS
  let bountyIPFS = getIpfsData(bountyDataHash)
  // ipfs.mapJSON(bountyDataHash, 'processItem', Value.fromString(event.params.bountyId.toString()))
  // log.warning('DEBUG3', [])
  let meta: JSONValue | null = (bountyIPFS != null && bountyIPFS.get('meta') !=null) ? bountyIPFS.get('meta'):null
  // log.warning('DEBUG4', [])
  if (meta != null) {
    let schema = meta.toObject()
    log.warning('META {} {}', [schema.get('schemaName').toString(), (schema.get('schemaName').toString() == 'gitcoinBounty')?'yes':'no'])
    if (schema != null && schema.get('schemaName').toString() == 'gitcoinBounty') {
      // log.warning('DEBUG5 {}', [schema.get('schemaName').toString()])
      let entity = new Bounty(event.params.bountyId.toHexString())
      entity.issuer = bountyCoreData.value0
      entity.fulfiller = event.params.fulfiller
      entity.deadline = bountyCoreData.value1
      entity.fulfillmentAmount = bountyCoreData.value2
      entity.paysTokens = bountyCoreData.value3
      // entity.bountyStage = bountyCoreData.value4
      entity.bountyStage = "ACTIVE"
      entity.balance = bountyCoreData.value5
      entity.bountyDataHash = bountyDataHash
      entity.fulfillmentDataHash = fulfillment.value2

      // Getting bounty payload
      log.debug('Bounty IPFS {}', [bountyDataHash])
      let payload = bountyIPFS.get('payload').toObject()
      let bountyData = new BountyData(event.params.bountyId.toHexString())
      bountyData.bountyId = event.params.bountyId
      bountyData.title = payload.get('title').toString()
      bountyData.description = payload.get('description').toString()
      if (payload.get('issuer') != null) {
        let issuer = payload.get('issuer').toObject()
        bountyData.issuerName = issuer.get('name') != null ? issuer.get('name').toString() : ""
        bountyData.issuerEmail = issuer.get('email') != null ? issuer.get('email').toString() : null
        bountyData.issuerGithubUsername = issuer.get('githubUsername') != null ? issuer.get('githubUsername').toString() : ""
        bountyData.issuerAddress = issuer.get('address') != null ? issuer.get('address').toString() : null
      }
      if (payload.get('schemes') != null) {
        let schemes = payload.get('schemes').toObject()
        bountyData.projectType = schemes.get('project_type') != null ? schemes.get('project_type').toString() : null
        bountyData.permissionType = schemes.get('permission_type') != null ? schemes.get('permission_type').toString() : null
        bountyData.autoApproveWorkers = Value.fromBoolean(schemes.get('auto_approve_workers') != null && schemes.get('auto_approve_workers').toBool()).toBoolean()
      }
      if (payload.get('hiring') != null) {
        let hiring = payload.get('hiring').toObject()
        // bountyData.hiringRightNow = hiring.get('hiringRightNow') != null ? hiring.get('hiringRightNow').toString() : null
        bountyData.jobDescription = hiring.get('jobDescription') != null ? hiring.get('jobDescription').toString() : null
      }
      bountyData.fundingOrganisation = payload.get('funding_organisation') != null ? payload.get('funding_organisation').toString() : null
      // bountyData.isFeatured = Value.fromBoolean(payload.get('is_featured') != null && payload.get('is_featured').toBool()).toBoolean()
      bountyData.repoType = payload.get('repo_type') != null ? payload.get('repo_type').toString() : null
      bountyData.featuringDate = payload.get('featuring_date') != null ? payload.get('featuring_date').toBigInt() : null
      bountyData.created = payload.get('created') != null ? payload.get('created').toBigInt() : null
      bountyData.webReferenceURL = payload.get('webReferenceURL') != null ? payload.get('webReferenceURL').toString() : null
      // bountyData.feeAmount = payload.get('fee_amount') != null ? BigDecimal.fromString(payload.get('fee_amount').toString()) : null
      bountyData.feeTxId = payload.get('fee_tx_id') != null ? payload.get('fee_tx_id').toString() : null

      if (payload.get('metadata') != null) {
        let metadata = payload.get('metadata').toObject()
        bountyData.issueKeywords = payload.get('issueKeywords') != null ? payload.get('issueKeywords').toString() : null
        bountyData.experienceLevel = payload.get('experienceLevel') != null ? payload.get('experienceLevel').toString() : null
        bountyData.projectLength = payload.get('projectLength') != null ? payload.get('projectLength').toString() : null
        bountyData.bountyType = payload.get('bountyType') != null ? payload.get('bountyType').toString() : null
        bountyData.estimatedHours = payload.get('estimatedHours') != null ? payload.get('estimatedHours').toString() : null
        bountyData.reservedFor = payload.get('reservedFor') != null ? payload.get('reservedFor').toString() : null
      }
      bountyData.tokenName = payload.get('tokenName') != null ? payload.get('tokenName').toString() : "ETH"
      bountyData.tokenAddress = payload.get('tokenAddress') != null ? payload.get('tokenAddress').toString() : null
      bountyData.expireDate = payload.get('expire_date') != null ? payload.get('expire_date').toBigInt() : null
      bountyData.save()

      // Get bounty fulfillment payload
      log.debug('Fulfillment IPFS {}', [fulfillment.value2])
      let fulfillmentIPFS = getIpfsData(fulfillment.value2)
      if(fulfillmentIPFS != null) {
        payload = fulfillmentIPFS.get('payload').toObject()
        let fulfillmentData = new FulfillmentData(event.params._fulfillmentId.toHexString())
        fulfillmentData.bountyId = event.params.bountyId
        fulfillmentData.accepted = fulfillment.value0
        fulfillmentData.description = payload.get('description') != null ? payload.get('description').toString() : null
        fulfillmentData.sourceFileName = payload.get('sourceFileName') != null ? payload.get('sourceFileName').toString() : null
        fulfillmentData.sourceFileHash = payload.get('sourceFileHash') != null ? payload.get('sourceFileHash').toString() : null
        fulfillmentData.sourceDirectoryHash = payload.get('sourceDirectoryHash') != null ? payload.get('sourceDirectoryHash').toString() : null
        if (payload.get('fulfiller') != null) {
          let fulfiller = payload.get('fulfiller').toObject()
          fulfillmentData.githubPRLink = fulfiller.get('githubPRLink') != null ? fulfiller.get('githubPRLink').toString() : null
          fulfillmentData.hoursWorked = fulfiller.get('hoursWorked') != null ? fulfiller.get('hoursWorked').toString() : null
          fulfillmentData.email = fulfiller.get('email') != null ? fulfiller.get('email').toString() : null
          fulfillmentData.githubUsername = fulfiller.get('githubUsername') != null ? fulfiller.get('githubUsername').toString() : ""
          fulfillmentData.address = fulfiller.get('address') != null ? fulfiller.get('address').toString() : null
        }
        fulfillmentData.save()
        entity.fulfillmentData = fulfillmentData.id

        log.debug('PRE LEADERBOARD', [])
        // update issuer position on leaderboard
        updateLeaderboard(entity, bountyData, fulfillmentData, "FUNDER")
        log.warning('DEBUG STORED FUNDER', [])
        // update fulfiller position on leaderboard
        updateLeaderboard(entity, bountyData, fulfillmentData, "HUNTER")
        log.warning('DEBUG STORED HUNTER', [])
      } 
      entity.bountyData = bountyData.id
      entity.save()
      log.warning('DEBUG6 STORED {}', [event.params.bountyId.toString()])

    } else {
      log.warning('Skipping bounty with schema', [])
    }
  } else {
    log.warning('Skipping bounty with NO schema', [])
  }

  // let entity = new FulfillmentAccepted(
  //   event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  // )
  // entity.bountyId = event.params.bountyId
  // entity.fulfiller = event.params.fulfiller
  // entity._fulfillmentId = event.params._fulfillmentId
  // entity.save()
}

function updateLeaderboard(bounty: Bounty, bountyData: BountyData, fulfillmentData: FulfillmentData, userType: String): void {
  let address = userType == "FUNDER" ? bountyData.issuerAddress : fulfillmentData.address
  let githubUsername = userType == "FUNDER" ? bountyData.issuerGithubUsername : fulfillmentData.githubUsername
  let name = userType == "FUNDER" ? bountyData.issuerName : ""
  let tokenName = bountyData.tokenName
  let leaderboard = Leaderboard.load(address + tokenName)
  if (leaderboard == null) {
    leaderboard = new Leaderboard(address + tokenName)
    leaderboard.address = address
    leaderboard.githubUsername = githubUsername
    leaderboard.name = name
    leaderboard.userType = userType
    leaderboard.tokenName = tokenName
    leaderboard.totalBounties = BigInt.fromI32(1)
    leaderboard.totalAmount = (bounty.fulfillmentAmount != null ? bounty.fulfillmentAmount : BigInt.fromI32(0)) as BigInt
  }
  leaderboard.totalBounties = leaderboard.totalBounties.plus(BigInt.fromI32(1))
  if (bounty.fulfillmentAmount != null) {
    leaderboard.totalAmount = leaderboard.totalAmount.plus(bounty.fulfillmentAmount as BigInt)
  }
  leaderboard.save()
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
