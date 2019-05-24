import React from 'react'
import Avatar from 'react-avatar'
import * as fetch from 'fetch'
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

console.log('fetch', fetch)

// const getKudosImage = (url) => {
//     return new Promise((resolve, reject) => {
//         url = url.replace('ipfs.', 'ipfs-2.')
//
//         fetch.fetchUrl(url, (error, meta, body)  => {
//             if(error){
//                 resolve("")
//             }
//             metadata = body.json()
//             resolve(metadata.image)
//         })
//     })
// }

const kudoStyles = theme =>
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


const KudoData = ({ classes, owner, price, tokenURI, totalFees, totalRevenue  }) => (
        <Grid container>
            <Grid item xs={1}>
                <img src="kudo.svg" width="125"/>
            </Grid>
            <Grid item xs={11}>
            <CardContent>
              <Typography color="textSecondary">Owner: {"https://etherscan.io/address/" + owner}</Typography>
              <Typography component="p">
                Price: {(price / Math.pow(10, 3) )}
              </Typography>
              <Typography component="p">
                Fees: {(totalFees / Math.pow(10, 3) )}
              </Typography>
              <Typography component="p">
                Revenue: {(totalRevenue / Math.pow(10, 3) )}
              </Typography>
              <Typography component="p">
                <a href={tokenURI} target="_blank">Metadata</a>
              </Typography>
            </CardContent>
            </Grid>
        </Grid>
)

const StyledKudoData = withStyles(kudoStyles)(KudoData)

const kudosStyles = theme =>
  createStyles({
    title: {
      marginTop: theme.spacing.unit * 2,
    },
  })

const KudosData = ({ classes, kudos }) => (
  <Grid container direction="column" spacing={16}>
    <Grid item>
      <Typography variant="title" className={classes.title}>
        {kudos.length} Kudos
      </Typography>
    </Grid>
    <Grid item>
      <Grid container direction="row" spacing={16}>
        {kudos.map(kudo => (
          <StyledKudoData key={kudo.owner} {...kudo} />
        ))}
      </Grid>
    </Grid>
  </Grid>
)

export default withStyles(kudosStyles)(KudosData)
