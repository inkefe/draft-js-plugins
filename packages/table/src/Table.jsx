/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-key */
/* eslint-disable no-case-declarations */
import React, { useMemo } from 'react';
import clsx from 'clsx';
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
  useSortBy,
} from 'react-table';
import update from 'immutability-helper';
import Cell from './Cell';
import Header from './Header';
import PlusIcon from './img/Plus';
import { randomColor, shortId, ActionTypes, DataTypes } from './utils';
// import './style.css';
// import { FixedSizeList } from 'react-window';
// import scrollbarWidth from './scrollbarWidth';

const defaultColumn = {
  minWidth: 50,
  width: 150,
  maxWidth: 400,
  Cell,
  Header,
  sortType: 'alphanumericFalsyLast',
};
export default function Table({
  columns,
  data,
  dispatch: dataDispatch,
  skipReset,
  theme,
}) {
  const sortTypes = useMemo(
    () => ({
      alphanumericFalsyLast(rowA, rowB, columnId, desc) {
        if (!rowA.values[columnId] && !rowB.values[columnId]) {
          return 0;
        }

        if (!rowA.values[columnId]) {
          return desc ? -1 : 1;
        }

        if (!rowB.values[columnId]) {
          return desc ? 1 : -1;
        }

        return isNaN(rowA.values[columnId])
          ? rowA.values[columnId].localeCompare(rowB.values[columnId])
          : rowA.values[columnId] - rowB.values[columnId];
      },
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    totalColumnsWidth,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      dataDispatch,
      autoResetSortBy: !skipReset,
      autoResetFilters: !skipReset,
      autoResetRowState: !skipReset,
      sortTypes,
    },
    useBlockLayout,
    useResizeColumns,
    useSortBy
  );

  const RenderRow = React.useCallback(
    row => {
      prepareRow(row);
      return (
        <div {...row.getRowProps()} key={row.original.id} className={theme.tr}>
          {row.cells.map((cell) => {
            const props = cell.getCellProps();
            return (
              <div {...props} className={theme.tableCell}>
                {cell.render('Cell', { theme })}
              </div>
            );
          })}
        </div>
      );
    },
    [prepareRow, rows]
  );

  function isTableResizing() {
    for (const headerGroup of headerGroups) {
      for (const column of headerGroup.headers) {
        if (column.isResizing) {
          return true;
        }
      }
    }

    return false;
  }
  const tableProps = getTableProps();
  const tablebodyProps = getTableBodyProps();

  return (
    <>
      <div
        {...tableProps}
        className={clsx(theme.table, isTableResizing() && 'noselect')}
      >
        <div className={theme.tableHeader}>
          {headerGroups.map((headerGroup, index) => (
            <div
              key={index}
              {...headerGroup.getHeaderGroupProps()}
              className={theme.tr}
            >
              {headerGroup.headers.map(column => (
                <React.Fragment key={column.id}>
                  {column.render('Header', { theme })}
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
        <div className={theme.tableBody} {...tablebodyProps}>
          {rows.map(RenderRow)}
          {/* <FixedSizeList
            height={window.innerHeight - 100}
            itemCount={rows.length}
            itemSize={40}
            width={totalColumnsWidth + scrollbarWidth}
          >
            {RenderRow}
          </FixedSizeList> */}
          <div
            className={`tr ${theme.addRow}`}
            style={{ width: `${totalColumnsWidth}px` }}
            onClick={() => dataDispatch({ type: ActionTypes.ADD_ROW })}
          >
            <div style={{ position: 'sticky', left: '4px' }}>
              <span className="svg-icon svg-gray icon-margin">
                <PlusIcon />
              </span>
              添加行
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.ADD_OPTION_TO_COLUMN:
      const optionIndex = state.columns.findIndex(
        column => column.id === action.columnId
      );
      return update(state, {
        skipReset: { $set: true },
        columns: {
          [optionIndex]: {
            options: {
              $push: [
                {
                  label: action.option,
                  backgroundColor: action.backgroundColor,
                },
              ],
            },
          },
        },
      });
    case ActionTypes.ADD_ROW:
      return update(state, {
        skipReset: { $set: true },
        data: { $push: [{ ID: shortId() }] },
      });
    case ActionTypes.DELETE_ROW:
      return update(state, {
        skipReset: { $set: true },
        data: { $splice: [[action.deleteIndex, 1]] },
      });
    case ActionTypes.UPDATE_COLUMN_TYPE:
      const typeIndex = state.columns.findIndex(
        column => column.id === action.columnId
      );
      switch (action.dataType) {
        case DataTypes.NUMBER:
          if (state.columns[typeIndex].dataType === DataTypes.NUMBER) {
            return state;
          }
            return update(state, {
              skipReset: { $set: true },
              columns: { [typeIndex]: { dataType: { $set: action.dataType } } },
              data: {
                $apply: data =>
                  data.map(row => ({
                    ...row,
                    [action.columnId]: isNaN(row[action.columnId])
                      ? ''
                      : Number.parseInt(row[action.columnId], 10),
                  })),
              },
            });

        case DataTypes.SELECT:
          if (state.columns[typeIndex].dataType === DataTypes.SELECT) {
            return state;
          }
            const options = [];
            state.data.forEach(row => {
              if (row[action.columnId]) {
                options.push({
                  label: row[action.columnId],
                  backgroundColor: randomColor(),
                });
              }
            });
            return update(state, {
              skipReset: { $set: true },
              columns: {
                [typeIndex]: {
                  dataType: { $set: action.dataType },
                  options: { $push: options },
                },
              },
            });

        case DataTypes.TEXT:
          if (state.columns[typeIndex].dataType === DataTypes.TEXT) {
            return state;
          } else if (state.columns[typeIndex].dataType === DataTypes.SELECT) {
            return update(state, {
              skipReset: { $set: true },
              columns: { [typeIndex]: { dataType: { $set: action.dataType } } },
            });
          }
            return update(state, {
              skipReset: { $set: true },
              columns: { [typeIndex]: { dataType: { $set: action.dataType } } },
              data: {
                $apply: data =>
                  data.map(row => ({
                    ...row,
                    [action.columnId]: `${row[action.columnId]}`,
                  })),
              },
            });

        default:
          return state;
      }
    case ActionTypes.UPDATE_COLUMN_HEADER:
      const index = state.columns.findIndex(
        column => column.id === action.columnId
      );
      return update(state, {
        skipReset: { $set: true },
        columns: { [index]: { label: { $set: action.label } } },
      });
    case ActionTypes.UPDATE_CELL:
      return update(state, {
        skipReset: { $set: true },
        data: {
          [action.rowIndex]: { [action.columnId]: { $set: action.value } },
        },
      });
    case ActionTypes.ADD_COLUMN_TO_LEFT:
      const leftIndex = state.columns.findIndex(
        column => column.id === action.columnId
      );
      const leftId = shortId();
      return update(state, {
        skipReset: { $set: true },
        columns: {
          $splice: [
            [
              leftIndex,
              0,
              {
                id: leftId,
                label: 'Column',
                accessor: leftId,
                dataType: DataTypes.TEXT,
                created: action.focus && true,
                options: [],
              },
            ],
          ],
        },
      });
    case ActionTypes.ADD_COLUMN_TO_RIGHT:
      const rightIndex = state.columns.findIndex(
        column => column.id === action.columnId
      );
      const rightId = shortId();
      return update(state, {
        skipReset: { $set: true },
        columns: {
          $splice: [
            [
              rightIndex + 1,
              0,
              {
                id: rightId,
                label: 'Column',
                accessor: rightId,
                dataType: DataTypes.TEXT,
                created: action.focus && true,
                options: [],
              },
            ],
          ],
        },
      });
    case ActionTypes.DELETE_COLUMN:
      const deleteIndex = state.columns.findIndex(
        column => column.id === action.columnId
      );
      return update(state, {
        skipReset: { $set: true },
        columns: { $splice: [[deleteIndex, 1]] },
      });
    case ActionTypes.ENABLE_RESET:
      return update(state, { skipReset: { $set: true } });
    default:
      return state;
  }
}
