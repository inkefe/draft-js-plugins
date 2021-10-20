import React, { useEffect, useReducer } from 'react';
// import { isEqualWith, isEqual } from 'lodash';
import Table, { reducer } from './Table';
import { ActionTypes, makeData, UTIL_COL } from './utils.js';
import { defaultTheme } from './theme';

function App(props) {
  const { data, theme = defaultTheme, onChange, disabled } = props;
  if (!data) return;
  const index = data.columns.findIndex(item => item.id === UTIL_COL.id);
  if (index >= 0) data.columns.splice(index, 1);
  const [state, dispatch] = useReducer(reducer, data);
  useEffect(() => {
    dispatch({ type: ActionTypes.ENABLE_RESET });
    // console.log(state);
    // eslint-disable-next-line no-unused-expressions
    onChange && onChange(state);
  }, [state.data, state.columns]);

  useEffect(() => {
    dispatch({ type: ActionTypes.UPDATE, data });
  }, [data]);


  return (
    <Table
      columns={disabled ? state.columns : [...state.columns, UTIL_COL]}
      data={state.data}
      theme={theme}
      disabled={disabled}
      dispatch={dispatch}
      skipReset={state.skipReset}
    />
  );
}


export { defaultTheme, makeData };
export default App;
