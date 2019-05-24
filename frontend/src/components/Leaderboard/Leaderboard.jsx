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

const Leaderboard = ({ classes, id, address, githubUsername, name, userType, tokenName, totalBounties, totalAmount }) => (
  <Grid item xs={12}>
    <Card>
      <CardActionArea>
        <Grid container>
            <Grid item xs={3}>
                {githubUsername ? (<Avatar className={classes.image} githubHandle={githubUsername} size="125" />) : (<Avatar className={classes.image} name={name} size="125" />)}
            </Grid>
            <Grid item xs={9}>
                <CardContent className={classes.info}>
                  <Typography color="textSecondary">ID</Typography>
                  <Typography component="p" className={classes.id}>
                    <a target="_blank" href={"https://etherscan.io/address/" + address}>{address}</a>
                  </Typography>
                  <Typography color="textSecondary">Total</Typography>
                  <Typography component="p" className={classes.owner}>
                    Amount: {(totalAmount / Math.pow(10, 18))} {tokenName}
                  </Typography>
                  <Typography component="p" className={classes.owner}>
                    Bounties: {totalBounties}
                  </Typography>
                </CardContent>
            </Grid>
        </Grid>
      </CardActionArea>
    </Card>
  </Grid>
)

const StyledLeaderboard = withStyles(bountyStyles)(Leaderboard)

const bountiesStyles = theme =>
  createStyles({
    title: {
      marginTop: theme.spacing.unit * 2,
    },
  })

const Leaderboards = ({ classes, leaderboards, userType }) => (
  <Grid container direction="column" spacing={16}>
    <Grid item>
      <Typography variant="title" className={classes.title}>
        {leaderboards.length} {userType}
      </Typography>
    </Grid>
    <Grid item>
      <Grid container direction="row" spacing={16}>
        {leaderboards.map(leaderboard => (
          <StyledLeaderboard key={leaderboard.id} {...leaderboard} />
        ))}
      </Grid>
    </Grid>
  </Grid>
)

export default withStyles(bountiesStyles)(Leaderboards)
