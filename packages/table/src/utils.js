// import faker from 'faker';

export const DataTypes = Object.freeze({
  NUMBER: 'number',
  TEXT: 'text',
  SELECT: 'select',
  UTIL: 'util',
});
export const TypeLabel = Object.freeze({
  number: '数字',
  text: '文本',
  select: '标签',
});

export function shortId() {
  return Math.random().toString(36).substr(2, 6);
}

export function randomColor() {
  return `hsl(${Math.floor(Math.random() * 360)}, 95%, 90%)`;
}

export function makeData(count = 5, columns_counts = 4) {
  const data = [];
  // let options = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < count; i++) {
    const row = {
      id: shortId(),
      // firstName: faker.name.firstName(),
      // lastName: faker.name.lastName(),
      // email: faker.internet.email(),
      // age: Math.floor(20 + Math.random() * 20),
      // music: faker.music.genre(),
    };
    // options.push({ label: row.music, backgroundColor: randomColor() });

    data.push(row);
  }
  const columns = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < columns_counts; i++) {
    columns.push({
      id: shortId(),
      label: '',
      accessor: ' ',
      minWidth: 100,
      dataType: DataTypes.TEXT,
      options: [],
    });
  }

  // let columns = [
  //   {
  //     id: 'firstName',
  //     label: 'First Name',
  //     accessor: 'firstName',
  //     minWidth: 100,
  //     dataType: DataTypes.TEXT,
  //     options: [],
  //   },
  //   {
  //     id: 'lastName',
  //     label: 'Last Name',
  //     accessor: 'lastName',
  //     minWidth: 100,
  //     dataType: DataTypes.TEXT,
  //     options: [],
  //   },
  //   {
  //     id: 'age',
  //     label: 'Age',
  //     accessor: 'age',
  //     width: 80,
  //     dataType: DataTypes.NUMBER,
  //     options: [],
  //   },
  //   {
  //     id: 'email',
  //     label: 'E-Mail',
  //     accessor: 'email',
  //     width: 300,
  //     dataType: DataTypes.TEXT,
  //     options: [],
  //   },
  //   {
  //     id: 'music',
  //     label: 'Music Preference',
  //     accessor: 'music',
  //     dataType: DataTypes.SELECT,
  //     width: 200,
  //     options: options,
  //   },
  // ];
  return { columns, data, skipReset: false };
}
export const UTIL_COL = Object.freeze({
  id: 999999,
  width: 20,
  label: '+',
  disableResizing: true,
  dataType: DataTypes.UTIL,
});

export const ActionTypes = Object.freeze({
  ADD_OPTION_TO_COLUMN: 'add_option_to_column',
  ADD_ROW: 'add_row',
  DELETE_ROW: 'delete_row',
  UPDATE_COLUMN_TYPE: 'update_column_type',
  UPDATE_COLUMN_HEADER: 'update_column_header',
  UPDATE_CELL: 'update_cell',
  ADD_COLUMN_TO_LEFT: 'add_column_to_left',
  ADD_COLUMN_TO_RIGHT: 'add_column_to_right',
  DELETE_COLUMN: 'delete_column',
  ENABLE_RESET: 'enable_reset',
  UPDATE: 'update_all_data',
});
