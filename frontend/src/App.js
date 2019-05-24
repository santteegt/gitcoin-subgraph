import React, { Component } from 'react'
import ApolloClient, { gql, InMemoryCache } from 'apollo-boost'
import { ApolloProvider, Query } from 'react-apollo'
import {
  AppBar,
  Grid,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Tabs,
  Tab,
  Typography
} from '@material-ui/core'
import './App.css'
import Header from './components/Header'
import Error from './components/Error'
import Leaderboards from './components/Leaderboard'
import BountiesData from './components/BountiesData'
import KudosData from './components/KudosData'
import Filter from './components/Filter'
import LeadersFilter from './components/LeadersFilter'
import KudosFilter from './components/KudosFilter'
import PropTypes from 'prop-types';

if (!process.env.REACT_APP_GRAPHQL_ENDPOINT) {
  throw new Error('REACT_APP_GRAPHQL_ENDPOINT environment variable not defined')
}

function TabContainer(props) {
  return (
    <Typography component="div">
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
})

const LEADERBOARDS_QUERY = gql`
    query leaderboards($where: Leaderboard_filter! , $orderBy: Leaderboard_orderBy!, $limit: Int){
        leaderboards(first: $limit, where: $where, orderBy: $orderBy, orderDirection: desc) {
            id
            address
            githubUsername
            name
            userType
            tokenName
            totalBounties
            totalAmount
        }
    }
`

const BOUNTIES_QUERY = gql`
    query bounties($where: Bounty_filter! , $orderBy: Bounty_orderBy!, $limit: Int){
        bounties(first:$limit, orderBy: $orderBy, where: $where, orderDirection: desc) {
          id
          fulfillmentAmount
          bountyData {
              title
              description
              tokenName
              experienceLevel
              issuerName
              issuerAddress
              issuerGithubUsername
          }
        }
    }
`

const KUDOS_QUERY = gql`
    query kudos($where: Kudo_filter! , $orderBy: Kudo_orderBy!, $limit: Int){
        kudos(first:$limit, orderBy: $orderBy, where: $where, orderDirection: desc) {
          owner
          price
          tokenURI
          totalFees
          totalRevenue
        }
    }
`

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0,
      leadersOrder: 'totalAmount',
      tokenFilter: 'ETH',
      addressFilter: '',
      totalLeaders: 10,
      orderBy: 'fulfillmentAmount',
      kudoOrderBy: 'price',
      search: '',
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  gotoQuickStartGuide = () => {
    window.location.href = 'https://thegraph.com/docs/quick-start'
  }

  render() {
    const { value, leadersOrder, tokenFilter, addressFilter, totalLeaders, orderBy, kudoOrderBy, search } = this.state

    return (
      <ApolloProvider client={client}>
        <div className="App">
          <Grid container direction="column">
              <AppBar position="static">
                <Tabs value={value} onChange={this.handleChange}>
                  <Tab label="Leaderboard" />
                  <Tab label="Bounties" />
                  <Tab label="Kudos" />
                </Tabs>
              </AppBar>
              {value === 0 &&
                  <TabContainer>
                      <Grid container>
                        <Grid item xs={12}>
                        <LeadersFilter
                        token={tokenFilter}
                        onToken={field => this.setState(state => ({ ...state, tokenFilter: field }))}
                        address={addressFilter}
                        onAddress={field => this.setState(state => ({ ...state, addressFilter: field }))}
                        orderBy={leadersOrder}
                        onOrderBy={field => this.setState(state => ({ ...state, leadersOrder: field }))}
                        totalLeaders={totalLeaders}
                        onTotalLeaders={field => this.setState(state => ({ ...state, totalLeaders: parseInt(field) }))}
                        />
                        </Grid>
                        <Grid item xs={6}>
                          <Query
                            query={LEADERBOARDS_QUERY}
                            variables={{
                              where: {
                                   ...(tokenFilter ? { tokenName: tokenFilter } : { }),
                                   ...(addressFilter ? { address: addressFilter } : { }),
                                  ...{ userType: "FUNDER" }
                              },
                              orderBy: leadersOrder,
                              limit: totalLeaders
                            }}
                          >
                            {({ data, error, loading }) => {
                              return loading ? (
                                <LinearProgress variant="query" style={{ width: '100%' }} />
                              ) : error ? (
                                <Error error={error} />
                              ) : (
                                <Leaderboards leaderboards={data.leaderboards} userType="Founders" />
                              )
                            }}
                          </Query>
                        </Grid>
                        <Grid item xs={6}>
                          <Query
                            query={LEADERBOARDS_QUERY}
                            variables={{
                              where: {
                                   ...(tokenFilter ? { tokenName: tokenFilter } : { }),
                                   ...(addressFilter ? { address: addressFilter } : { }),
                                  ...{ userType: "HUNTER" }
                              },
                              orderBy: leadersOrder,
                              limit: totalLeaders
                            }}
                          >
                            {({ data, error, loading }) => {
                              return loading ? (
                                <LinearProgress variant="query" style={{ width: '100%' }} />
                              ) : error ? (
                                <Error error={error} />
                              ) : (
                                <Leaderboards leaderboards={data.leaderboards} userType="Hunters"/>
                              )
                            }}
                          </Query>
                        </Grid>
                      </Grid>
                  </TabContainer>}
                  {value === 1 &&
                      <TabContainer>
                          <Grid container>
                          <Grid item xs={12}>
                            <Filter
                            totalLeaders={totalLeaders}
                            onTotalLeaders={field => this.setState(state => ({ ...state, totalLeaders: parseInt(field) }))}
                            />
                            <Query
                              query={BOUNTIES_QUERY}
                              variables={{
                                where: {
                                    ...(addressFilter ? { issuerAddress: addressFilter } : {}),
                                },
                                orderBy: orderBy,
                                limit: totalLeaders,
                              }}
                            >
                                  {({ data, error, loading }) => {
                                    return loading ? (
                                      <LinearProgress variant="query" style={{ width: '100%' }} />
                                    ) : error ? (
                                      <Error error={error} />
                                    ) : (
                                      <BountiesData bounties={data.bounties} />
                                    )
                                  }}
                                </Query>
                            </Grid>
                            </Grid>
                      </TabContainer>}
                  {value === 2 &&
                      <TabContainer>
                          <Grid container>
                          <Grid item xs={12}>
                            <KudosFilter
                          orderBy={kudoOrderBy}
                          onOrderBy={field => this.setState(state => ({ ...state, kudoOrderBy: field }))}
                          totalLeaders={totalLeaders}
                          onTotalLeaders={field => this.setState(state => ({ ...state, totalLeaders: parseInt(field) }))}
                          />
                            <Query
                              query={KUDOS_QUERY}
                              variables={{
                                where: {
                                },
                                orderBy: kudoOrderBy,
                                limit: totalLeaders,
                              }}
                            >
                                  {({ data, error, loading }) => {
                                    return loading ? (
                                      <LinearProgress variant="query" style={{ width: '100%' }} />
                                    ) : error ? (
                                      <Error error={error} />
                                    ) : (
                                      <KudosData kudos={data.kudos} />
                                    )
                                  }}
                                </Query>
                            </Grid>
                            </Grid>
                      </TabContainer>}
          </Grid>
        </div>
      </ApolloProvider>
    )
  }
}

export default App
