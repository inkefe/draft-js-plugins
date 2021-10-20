import React from 'react';
import ReactDOM from 'react-dom';

import App from './index';

const data = {
  columns: [
    {
      id: 'wqq8gi',
      label: '',
      accessor: ' ',
      minWidth: 100,
      dataType: 'text',
      options: [],
      created: false,
    },
    {
      id: 'yhhj73',
      label: '',
      accessor: ' ',
      minWidth: 100,
      dataType: 'text',
      options: [],
      created: false,
    },
    {
      id: '9mx5dg',
      label: '哇',
      accessor: ' ',
      minWidth: 100,
      dataType: 'text',
      options: [],
      created: false,
    },
    {
      id: '1xj6zh',
      label: '是',
      accessor: ' ',
      minWidth: 100,
      dataType: 'text',
      options: [],
      created: false,
    },
    {
      id: 'xi4ik3',
      label: '',
      accessor: ' ',
      minWidth: 100,
      dataType: 'text',
      options: [],
      created: false,
    },
  ],
  data: [
    {
      id: 'mcfg1y',
      yhhj73: '试试',
      '9mx5dg': '哇',
      wqq8gi: '我问问',
      '1xj6zh': '请求',
    },
    {
      id: 'cbk2ck',
      yhhj73: '阿瓦达',
    },
    {
      id: 'xye9us',
      '9mx5dg': 'a',
      wqq8gi: ' 问问',
      '1xj6zh': '请求',
    },
    {
      id: 'h9sy2w',
    },
  ],
  skipReset: true,
};
ReactDOM.render(
  <React.StrictMode>
    <div style={{ width: '700px' }}>
      <App data={data} />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);
