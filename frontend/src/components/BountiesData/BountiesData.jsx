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
            <Grid item xs={1}>
                {bountyData.issuerGithubUsername ? (<Avatar className={classes.image} githubHandle={bountyData.issuerGithubUsername} size="125" />) : (<Avatar className={classes.image} name={bountyData.issuerName} size="125" />)}
            </Grid>
            <Grid item xs={11}>
              <Typography color="textSecondary">{bountyData.title}</Typography>
              <Typography component="p">
                {bountyData.description}
              </Typography>
              <Typography component="p">
                {fulfillmentAmount} {bountyData.tokenName}
              </Typography>
              <Typography component="p">
                {bountyData.experienceLevel}
              </Typography>
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
