import React, { useEffect, useReducer } from 'react';
import Table, { reducer } from './Table';
import { ActionTypes, makeData } from './utils.js';
import { defaultTheme } from './theme';

function App(props) {
  const { data, theme = defaultTheme, onChange } = props;
  const [state, dispatch] = useReducer(reducer, data);
  useEffect(() => {
    dispatch({ type: ActionTypes.ENABLE_RESET });
    // eslint-disable-next-line no-unused-expressions
    onChange && onChange(state);
  }, [state.data, state.columns]);

  return (
    <Table
      columns={state.columns}
      data={state.data}
      theme={theme}
      dispatch={dispatch}
      skipReset={state.skipReset}
    />
  );
}

export { defaultTheme, makeData };
export default App;
