import React from 'react'
import Avatar from 'react-avatar'
import {
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Typography,
  createStyles,
  withStyles,
} from '@material-ui/core'

const bountyStyles = theme =>
  createStyles({
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

const Bounty = ({ classes, id, issuer, fulfiller, bountyData, fulfillmentAmount }) => (
  <Grid item xs={12}>
    <Card>
      <CardActionArea>
        <Grid container>
            <Grid item xs={3}>
                {bountyData.issuerGithubUsername ? (<Avatar className={classes.image} githubHandle={bountyData.issuerGithubUsername} size="125" />) : (<Avatar className={classes.image} name={bountyData.issuerName} size="125" />)}
            </Grid>
            <Grid item xs={9}>
                <CardContent className={classes.info}>
                  <Typography color="textSecondary">ID</Typography>
                  <Typography component="p" className={classes.id}>
                    {issuer && (issuer)}
                    {fulfiller && (fulfiller)}
                  </Typography>
                  <Typography color="textSecondary">Amount</Typography>
                  <Typography component="p" className={classes.owner}>
                    {fulfillmentAmount}
                  </Typography>
                </CardContent>
            </Grid>
        </Grid>
      </CardActionArea>
    </Card>
  </Grid>
)

const StyledBounty = withStyles(bountyStyles)(Bounty)

const bountiesStyles = theme =>
  createStyles({
    title: {
      marginTop: theme.spacing.unit * 2,
    },
  })

const Bounties = ({ classes, bounties }) => (
  <Grid container direction="column" spacing={16}>
    <Grid item>
      <Typography variant="title" className={classes.title}>
        {bounties.length} Bounties
      </Typography>
    </Grid>
    <Grid item>
      <Grid container direction="row" spacing={16}>
        {bounties.map(bounty => (
          <StyledBounty key={bounty.id} {...bounty} />
        ))}
      </Grid>
    </Grid>
  </Grid>
)

export default withStyles(bountiesStyles)(Bounties)
