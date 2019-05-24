import React from 'react'
import {
  Grid,
  Select,
  FormControlLabel,
  MenuItem,
  Checkbox,
  createStyles,
  withStyles,
  TextField,
} from '@material-ui/core'

const filterStyles = theme =>
  createStyles({
    orderBySelect: {
      marginLeft: theme.spacing.unit,
    },
    orderByText: {
      marginLeft: theme.spacing.unit,
    },
  })

const KudosFilter = ({
  classes,
  orderBy,
  onOrderBy,
  totalLeaders,
  onTotalLeaders
}) => (
  <Grid item>
    <Grid container direction="row">
      <FormControlLabel
        control={
          <Select
            className={classes.orderBySelect}
            value={orderBy}
            onChange={event => onOrderBy && onOrderBy(event.target.value)}
          >
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="totalFees">Fees</MenuItem>
            <MenuItem value="totalRevenue">Revenue</MenuItem>
          </Select>
        }
        label="Order By:"
        labelPlacement="start"
      />
      <FormControlLabel
        control={
            <Select
              className={classes.orderBySelect}
              value={totalLeaders}
              onChange={event => onTotalLeaders && onTotalLeaders(event.target.value)}
            >
              <MenuItem value="5">5</MenuItem>
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="20">20</MenuItem>
              <MenuItem value="30">30</MenuItem>
              <MenuItem value="40">40</MenuItem>
              <MenuItem value="50">50</MenuItem>
              <MenuItem value="100">100</MenuItem>
            </Select>
        }
        label="Records"
        labelPlacement="start"
      />
    </Grid>
  </Grid>
)

const StyledKudosFilter = withStyles(filterStyles)(KudosFilter)

export default StyledKudosFilter
