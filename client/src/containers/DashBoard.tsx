import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import Maps from '../components/Final/Maps';
import GraphByDay from '../components/Final/GraphByDay';
import GraphByHour from '../components/Final/GraphByHour';
import RetentionCohort from '../components/Final/Retention';
import AllFiltered from '../components/Final/AllFiltered';
import Chart from '../components/Final/PieChart';
import ErrorBoundary from '../components/Final/ErrorBoundary';
import { Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  grid: {
    width: '100%',
    margin: '0px'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
  }
}));


export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}


const DashBoard: React.FC = () => {
  const classes = useStyles();


  return (
    <Grid container spacing={2} className={classes.grid}>

      <Grid item xs={12} md={12} >
        <ErrorBoundary>
          <Paper className={classes.paper}>
            <Maps />
          </Paper>
        </ErrorBoundary>
      </Grid>

      <Grid item xs={12} md={6}>
        <ErrorBoundary>
          <Paper className={classes.paper}>
            <GraphByDay />
          </Paper>
        </ErrorBoundary>
      </Grid>

      <Grid item xs={12} md={6}>
        <ErrorBoundary>
          <Paper className={classes.paper}>
            <GraphByHour />
          </Paper>
        </ErrorBoundary>
      </Grid>

      <Grid item xs={12} md={12}>
        <ErrorBoundary>
          <Paper className={classes.paper}>
            <RetentionCohort />
          </Paper>
        </ErrorBoundary>
      </Grid>

      <Grid item xs={2} md={2}>
      </Grid>

      <Grid item xs={8} md={8}>
        <ErrorBoundary>
          <Paper className={classes.paper}>
            <AllFiltered />
          </Paper>
        </ErrorBoundary>
      </Grid>

      <Grid item xs={2} md={2}>
      </Grid>


      <Grid item xs={2} md={2}>
      </Grid>
      <Grid item xs={8} md={8}>
        <ErrorBoundary>
          <Paper className={classes.paper}>
            <Chart />
          </Paper>
        </ErrorBoundary>
      </Grid>
      <Grid item xs={2} md={2}>
      </Grid>
    </Grid>
  );
};

export default DashBoard;

