import React from 'react'
import Avatar from 'react-avatar'
import {
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Grid,
  Typography,
  createStyles,
  withStyles,
} from '@material-ui/core'

const bountyStyles = theme =>
  createStyles({
    actionArea: {
      maxWidth: 300,
    },
    image: {
      width: 125,
    },
    id: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
    info: {
      width: 300,
    },
  })

// title, description, tokenName, experienceLevel

const BountyData = ({ classes, bountyData, fulfillmentAmount }) => (
        <Grid container>
            <Grid item xs={2}>
                {bountyData.issuerGithubUsername ? (<Avatar className={classes.image} githubHandle={bountyData.issuerGithubUsername} size="125" />) : (<Avatar className={classes.image} name={bountyData.issuerName} size="125" />)}
            </Grid>
            <Grid item xs={10}>
            <CardContent>
              <Typography color="textSecondary"><h3>Title:</h3> {bountyData.title}</Typography>
              <Typography component="p">
                <h3>Description:</h3> {bountyData.description}
              </Typography>
              <Typography component="p">
                <strong>Amount:</strong> {(fulfillmentAmount / Math.pow(10, 18))} {bountyData.tokenName}
              </Typography>
              <Typography component="p">
              <strong>Address:</strong> <a target="_blank" href={"https://etherscan.io/address/" + bountyData.issuerAddress}>{bountyData.issuerAddress}</a>
              </Typography>
              {bountyData.issuerName &&
              (<Typography component="p">
                <strong>Founder</strong>: {bountyData.issuerName}
              </Typography>)}
              {bountyData.issuerGithubUsername &&
              (<Typography component="p">
                <a href={'https://github.com/' +bountyData.issuerGithubUsername}
                ><img src="github-logo.png" width="25"/></a>
              </Typography>)}
              <Typography component="p">
                <a target="_blank" href={bountyData.webReferenceURL}>View Issue</a>
              </Typography>
            </CardContent>
            </Grid>
        </Grid>
)

const StyledBountyData = withStyles(bountyStyles)(BountyData)

const bountiesStyles = theme =>
  createStyles({
    title: {
      marginTop: theme.spacing.unit * 2,
    },
  })

const BountiesData = ({ classes, bounties }) => (
  <Grid container direction="column" spacing={16}>
    <Grid item>
      <Typography variant="title" className={classes.title}>
        {bounties.length} Bounties
      </Typography>
    </Grid>
    <Grid item>
      <Grid container direction="row" spacing={16}>
        {bounties.map(bounty => (
          <StyledBountyData key={bounty.id} {...bounty} />
        ))}
      </Grid>
    </Grid>
  </Grid>
)

export default withStyles(bountiesStyles)(BountiesData)
