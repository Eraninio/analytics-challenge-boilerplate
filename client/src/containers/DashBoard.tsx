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
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(() => ({
  MyDashBoard: {
    display: "flex",
    flexWrap: 'wrap',
    padding: '0',
    width: '100%',
  },
}));


export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}


const DashBoard: React.FC = () => {
  const classes = useStyles();


  return (
    <div className={classes.MyDashBoard}>

      <ErrorBoundary>
        <Maps />
      </ErrorBoundary>
      <ErrorBoundary>
        <GraphByDay />
      </ErrorBoundary>
      <ErrorBoundary>
        <GraphByHour />
      </ErrorBoundary>
      <ErrorBoundary>
        <RetentionCohort />
      </ErrorBoundary>
      <ErrorBoundary>
        <AllFiltered />
      </ErrorBoundary>
      <ErrorBoundary>
        <Chart />
      </ErrorBoundary>

      {/* <ErrorBoundary>
            <Maps />
          </ErrorBoundary>
          <ErrorBoundary>
            <GraphByDay />
          </ErrorBoundary>
          <ErrorBoundary>
            <GraphByHour />
          </ErrorBoundary>
          <ErrorBoundary>
            <RetentionCohort />
          </ErrorBoundary>
          <ErrorBoundary>
            <AllFiltered />
          </ErrorBoundary> */}
    </div>
  );
};

export default DashBoard;
