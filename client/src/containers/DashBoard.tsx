import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import Map from './Final/maps';

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC = () => {
  return (
    <>
      <div style={{ display: 'flex' }}>
        <Map />
      </div>
    </>
  );
};

export default DashBoard;
