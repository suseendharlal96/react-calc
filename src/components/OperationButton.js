import React from "react";

import { ACTIONS } from "../App";

const OperationButton = ({ dispatch, operation }) => {
    // console.log('op',operation);
  return (
    <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OP, payload: { operation } })}>
      {operation}
    </button>
  );
};

export default OperationButton;
