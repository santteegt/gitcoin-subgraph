# Gitcoin Subgraph

Scalable bounty index to support and grow OpenSource. It can improve current Gitcoin features while enabling the creation of derivative products such as decentralized hiring/talent registry mechanisms

Gitcoin has become one of the best dApps on Ethereum by enabling a double-sided market that connects project/funders with coders. Powered by the BountiesNetwork smart contract, it has already become one of the main sources for sustaining blockchain development and Open Source in general and still has pretty ambitious goals to enable/provide further decentralized products such as hiring mechanisms in the era of the gig economy. Nevertheless, the platform still requires of centralized data storage infrastructure with tedious off-chain data indexing processes that difficult the system maintenance and introduces some bugs to their UI. Thanks to The Graph Protocol, now it is possible to provide scalable queries for a decentralized future that not only allows improving the current Gitcoin products and services but also enables the creation of new ones, such as a support for talent registry mechanisms (TCRs) for blockchain developers in the XPO Network

This implementation was submitted to the [The Graph + CoinList Hackathon](https://coinlist.co/build/the-graph/projects/577155a8-2fe7-482c-88dd-ca35a6f4c9e2)

## Features:

This PoC aims to demonstrate how easy and scalable bounty data can be indexed in comparison custom backend solution. The subgraph includes indexed bounty data from the Bounties Network smart contract deployed on the Ethereum mainnet and IPFS, as well as from the Kudos product. Among the main features that can be exploited through the graph we have:

* **Up-to-date Bounties leaderboard**: [current leaderboard](https://gitcoin.co/leaderboard) is generated through scripts running via scheduled cron jobs and does not allow you to query positions below top-20 rank. GraphQL is better than RESt: Now, it is easier to find proficient and experienced coders for your project.
* **No more (UI) bugs on aggregated data**: current [Gitcoiners directory](https://gitcoin.co/users) sometimes presents repeated users on its list. Our subgraph aggregates user’s contributions on real-time and does not require to maintain custom python scripts
* **Tracking kudos revenue**: now it is easy to track kudos revenue for both the service provider and the artists.

## Schema

The Gitcoin subgraph was indexed using the following entities:

* *Bounty*: includes bounty data from the smart contract and references to `BountyData` and `FulfillmentData` captured through IPFS
* *BountyData*: includes bounty metadata stored on IPFS
* *FulfillmentData*: includes bounty completion metadata stored on IPFS
* *Leaderboard*: includes aggregated bounty data by user (funder or hunter) and token
* *Kudo*: includes Kudos NFT metadata and aggregated revenue information for both Gitcoin and artists

## Demo

You can visit [http://gitcoin.decentraminds.ai/](http://gitcoin.decentraminds.ai/) and test subgraph features related to bounties and kudos.

## Example Queries

The following queries can be tested through the [subgraph playground](https://thegraph.com/explorer/subgraph/santteegt/gitcoin?selected=playground)

* Leaderboard for Bounty Funders/Hunters

Filter by address and DAI token

```
leaderboard(id: "0x224aba5d489675a7bd3ce07786fada466b46fa0fDAI") {
    id
    address
    githubUsername
    name
    userType
    tokenName
    totalBounties
    totalAmount
  }
```

* Bounties

```
bounties() {
    id
    issuer
    fulfiller
    deadline
    fulfillmentAmount
    paysTokens
    bountyStage
    balance
    bountyData {
      title
      description
      issuerName
      issuerEmail
      issuerGithubUsername
      issuerAddress
      projectType
      autoApproveWorkers
      repoType
      created
      webReferenceURL
      feeAmount
      feeTxId
      issueKeywords
      experienceLevel
      projectLength
      bountyType
      estimatedHours
      reservedFor
      tokenName
    }
    fulfillmentData {
      description
      githubPRLink
      hoursWorked
      email
      githubUsername
      address
    }
  }
```

* Kudos

```
 kudos() {
    id
    gen0
    parent
    owner
    clonesAllowed
    price
    tokenURI
    totalFees
    totalRevenue
  }
```

## Hackathon Team Members

* Santiago Gonzalez Toral ([Github](https://github.com/santteegt))
* Oscar Malgiaritta ([Github](https://github.com/malgia))

## Contributing

If you want to contribute to the indexing of Gitcoin bounty data, feel free to fork the project and open a PR.

### Current issues

* Handle parsing error on certain fields within the bounty data stored on IPFS
* Include categories and tags fields on indexed bounty data to expand subgraph querying capabilities
* Revise Kudos indexing, specially those considered as Gen0 NFTs
* Extract Kudos metadata stored on IPFS (At the time of submission, Gitcoin IPFS node was down so it couldn't be extracted).
* Index bounties with StandardBounties `schemaType` on a different Entity
* Index other on-chain data from Gitcoin products and services such as `Gitcoin grants`

### Setup for development

#### System requirements

* Node v10.5.0+
* Yarn
* @graphprotocol/graph-cli@0.12.0

#### Set Subgraph API URL

* Please replace the `REACT_APP_GRAPHQL_ENDPOINT` variable under `frontend/.env` with one of the following APIs:

* Latest release: [https://api.thegraph.com/subgraphs/name/santteegt/gitcoin](https://api.thegraph.com/subgraphs/name/santteegt/gitcoin)
* Pendind relaase (**PLEASE SELECT THIS IN CASE PROCESSING IS STILL PENDING DUE TO CALLHANDLER**): [https://api.thegraph.com/subgraphs/id/QmNhcbWDoPpWtXn2Dx7KWEetVoWq4BNCgRCEUPe5e88Afo](https://api.thegraph.com/subgraphs/id/QmNhcbWDoPpWtXn2Dx7KWEetVoWq4BNCgRCEUPe5e88Afo)

#### Subgraph deployment

```sh
yarn && yarn codegen
yarn build
yarn deploy
```

#### Deploy frontend demo

```sh
cd frontend
yarn && yarn build
yarn global add serve
yarn serve -s build
```

## Liceance

[MIT](LICENSE)
