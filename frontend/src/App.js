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
import Bounties from './components/Bounties'
import BountiesData from './components/BountiesData'
import Filter from './components/Filter'
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

const BOUNTIES_QUERY = gql`
    {
        bounties(first: 10, orderBy: $orderBy, orderDirection: desc) {
          id
          issuer
          fulfillmentAmount
          bountyData {
              issuerName
              issuerGithubUsername
          }
        }
    }
`
const BOUNTIES_QUERY_2 = gql`
    {
        bounties(first: 10, orderBy: $orderBy, orderDirection: desc) {
          id
          fulfiller
          fulfillmentAmount
          bountyData {
              issuerName
              issuerGithubUsername
          }
        }
    }
`
const BOUNTIES_QUERY_3 = gql`
    {
        bounties(first:100, orderBy: $orderBy, where: $where, orderDirection: desc) {
          id
          fulfillmentAmount
          bountyData {
              title
              description
              tokenName
              experienceLevel
              issuerName
              issuerGithubUsername
          }
        }
    }
`

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0,
      orderBy: 'fulfillmentAmount',
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
    const { value, orderBy, search } = this.state

    return (
      <ApolloProvider client={client}>
        <div className="App">
          <Grid container direction="column">
              <AppBar position="static">
                <Tabs value={value} onChange={this.handleChange}>
                  <Tab label="Top 10" />
                  <Tab label="Bounties" />
                </Tabs>
              </AppBar>
              {value === 0 &&
                  <TabContainer>
                      <Grid container>
                        <Grid item xs={6}>
                          <Query
                            query={BOUNTIES_QUERY}
                            variables={{
                              where: {
                              },
                              orderBy: orderBy,
                            }}
                          >
                            {({ data, error, loading }) => {
                              return loading ? (
                                <LinearProgress variant="query" style={{ width: '100%' }} />
                              ) : error ? (
                                <Error error={error} />
                              ) : (
                                <Bounties bounties={data.bounties} />
                              )
                            }}
                          </Query>
                        </Grid>
                        <Grid item xs={6}>
                          <Query
                            query={BOUNTIES_QUERY_2}
                            variables={{
                              where: {
                              },
                              orderBy: orderBy,
                            }}
                          >
                            {({ data, error, loading }) => {
                              return loading ? (
                                <LinearProgress variant="query" style={{ width: '100%' }} />
                              ) : error ? (
                                <Error error={error} />
                              ) : (
                                <Bounties bounties={data.bounties} />
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
                            orderBy={orderBy}
                            search={search}
                            onOrderBy={field => this.setState(state => ({ ...state, orderBy: field }))}
                            onToggleSearch={field => this.setState(state => ({ ...state, search: field }))}
                            />
                            <Query
                              query={BOUNTIES_QUERY_3}
                              variables={{
                                where: {
                                    title_contains: search,
                                    description_contains: search
                                },
                                orderBy: orderBy,
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
          </Grid>
        </div>
      </ApolloProvider>
    )
  }
}

export default App
