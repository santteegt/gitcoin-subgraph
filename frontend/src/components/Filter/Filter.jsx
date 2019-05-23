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
  })

const Filter = ({
  classes,
  search,
  onToggleSearch,
  orderBy,
  onOrderBy,
}) => (
  <Grid item>
    <Grid container direction="row">
      <FormControlLabel
        control={
          <TextField
            value={search}
            onChange={event => onToggleSearch && onToggleSearch(event.target.value)}
          />
        }
        label="Search"
        labelPlacement="start"
      />
      <FormControlLabel
        control={
          <Select
            className={classes.orderBySelect}
            value={orderBy}
            onChange={event => onOrderBy && onOrderBy(event.target.value)}
          >
            <MenuItem value="bountyData.title">Title</MenuItem>
            <MenuItem value="bountyData.description">Description</MenuItem>
            <MenuItem value="fulfillmentAmount">Amount</MenuItem>
            <MenuItem value="bountyData.tokenName">Token</MenuItem>
            <MenuItem value="bountyData.experienceLevel">Experience</MenuItem>
          </Select>
        }
        label="Order By:"
        labelPlacement="start"
      />
    </Grid>
  </Grid>
)

const StyledFilter = withStyles(filterStyles)(Filter)

export default StyledFilter
