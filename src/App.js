import { useReducer } from "react";

import "./App.css";
import DigitButton from "./components/Button";
import OperationButton from "./components/OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  DEL_DIGIT: "del-digit",
  CHOOSE_OP: "choose",
  CLEAR: "clear",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      console.log("in");
      if (payload.digit === "0" && state.current === "0") return state;
      if (payload.digit === "." && state.current.includes(".")) return state;
      if (state.overwrite) {
        return {
          ...state,
          current: payload.digit,
          overwrite: false,
        };
      }
      return {
        ...state,
        current: `${state.current || ""}${payload.digit}`,
      };
    case ACTIONS.DEL_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          current: "0",
        };
      }
      if (state.current === null || state.current === "0"||state.current.length===1) return state;
      return {
        ...state,
        current: state.current.slice(0, -1),
      };
    case ACTIONS.CHOOSE_OP:
      console.log("here1", payload.operation, state.current);
      if (state.current === null && state.prev === null) return state;
      if (state.current === null) {
        console.log("here2", payload.operation, state.current);
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.prev === null) {
        console.log("here", payload.operation, state.current);
        return { ...state, operation: payload.operation, prev: state.current, current: null };
      }
      console.log("here3", payload.operation, state.current);
      return { ...state, prev: evaluate(state), current: null, operation: payload.operation };
    case ACTIONS.CLEAR:
      return { ...state, current: "0", prev: null, operation: null };

    case ACTIONS.EVALUATE:
      if (state.operation === null || state.current === null || state.prev === null) return state;
      return {
        ...state,
        overwrite: true,
        prev: null,
        operation: null,
        current: evaluate(state),
      };

    default:
      return { ...state, current: "0" };
  }
}

function evaluate({ current, prev, operation }) {
  const p = +prev;
  const c = +current;
  console.log({ p, c, operation });
  if (isNaN(p) || isNaN(c)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = p + c;
      break;
    case "-":
      computation = p - c;
      break;
    case "*":
      computation = p * c;
      break;
    case "/":
      computation = p / c;
      break;
    default:
      computation = "";
  }
  return computation.toString();
}

const buttons = ["/", "1", "2", "3", "*", "4", "5", "6", "+", "7", "8", "9", "-", ".", "0"];

const digitFormatter = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

const formatDigit = (digits) => {
  console.log(digits);
  if (digits === null) return;
  const [int, decimal] = digits && digits.split(".");
  console.log({ int, decimal });
  if (decimal === undefined || decimal === null) return digitFormatter.format(int);
  return `${digitFormatter.format(int)}.${decimal}`;
};

const equals = (e) => {
  console.log(e);
};

function App() {
  const [{ current, prev, operation }, dispatch] = useReducer(reducer, {
    prev: null,
    current: "0",
    operation: null,
  });
  // dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: 1 } });
  return (
    <div className="calculator-grid">
      <div className="output" onKeyUp={(e) => equals(e)}>
        <div className="previous-operand">
          {formatDigit(prev)} {operation}
        </div>
        <div className="current-operand">{formatDigit(current)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DEL_DIGIT })}>DEL</button>
      {buttons.map((btn) => {
        if ((btn >= "0" && btn <= "9") || btn === ".") {
          return <DigitButton key={btn} digit={btn} dispatch={dispatch} />;
        }
        return <OperationButton key={btn} operation={btn} dispatch={dispatch} />;
      })}
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>
        =
      </button>
    </div>
  );
}

export default App;
