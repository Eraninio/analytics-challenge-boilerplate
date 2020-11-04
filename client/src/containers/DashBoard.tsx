import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import Maps from '../components/Final/Maps';
import GraphByDay from '../components/Final/GraphByDay';
import GraphByHour from '../components/Final/GraphByHour';
import RetentionCohort from '../components/Final/Retention';




export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC = () => {
  return (
    <>
      <div >
        <Maps />
        <GraphByDay />
        <GraphByHour />
        <RetentionCohort />
      </div>
    </>
  );
};

export default DashBoard;
