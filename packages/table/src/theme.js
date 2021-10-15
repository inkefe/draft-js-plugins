import { css } from 'linaria';

export const defaultTheme = {
  formInput: css`
    box-sizing: border-box;
    padding: 0.425rem 0.375rem;
    background-color: #eeeeee;
    border: none;
    border-radius: 2px;
    font-size: 0.875rem;
    color: #424242;
    &:focus {
      outline: none;
      box-shadow: 0 0 2px 2px #8ecae6;
    }
  `,
  table: css`
    display: inline-block;
    border-spacing: 0;
    width: 100%;
    background-color: white;
  `,
  tableHeader: css`
    position: sticky;
    top: 0;
    z-index: 8;
    > div {
      background: #f5f5f5;
    }
  `,
  dataInput: css`
    white-space: pre-wrap;
    border: none;
    padding: 0.5rem;
    color: #424242;
    font-size: 1rem;
    border-radius: 4px;
    resize: none;
    height: 100%;
    box-sizing: border-box;
    flex: 1 1 auto;
    &:focus {
      outline: none;
    }
  `,
  thContent: css`
    overflow-x: hidden;
    word-break: break-all;
    white-space: break-spaces;
    text-overflow: ellipsis;
    padding: 6px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    min-height: 42px;
  `,
  tableCell: css`
    overflow: hidden;
    color: #424242;
    align-items: stretch;
    padding: 0;
    display: flex;
    flex-direction: column;
    white-space: nowrap;
    margin: 0;
    border-bottom: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    position: relative;
    &:last-child {
      border-right: 0;
    }
  `,
  popover: css`
    border-radius: 2px;
    box-shadow: 0px 4px 30px 0px rgb(0 0 0 / 16%);
  `,
  overlay: css`
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    z-index: 2;
    overflow: hidden;
  `,
  addRow: css`
    color: #9e9e9e;
    padding: 4px 0;
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    box-sizing: border-box;
    cursor: pointer;
    height: 42px;
    position: relative;
    &:hover {
      background-color: rgb(243, 248, 253);
    }
  `,
  resizer: css`
    display: inline-block;
    background: transparent;
    width: 8px;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    transform: translateX(50%);
    z-index: 1;
    cursor: col-resize;
    touch-action: none;
    &:hover {
      background-color: #8ecae6;
    }
  `,
  tableBody: css`
    .${this.tr}:hover {
      background-color: rgb(243, 248, 253);
    }
  `,
  tr: css`
    &:last-child .${this.tableCell} {
      border-bottom: 0;
    }
  `,
  th: css`
    color: #9e9e9e;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    white-space: nowrap;
    margin: 0;
    border-right: 1px solid #e0e0e0;
    position: relative;
    &:hover {
      background-color: rgb(243, 248, 253);
    }
    &:last-child {
      border-right: 0;
    }
  `,
  sortButton: css`
    padding: 8px 12px;
    width: 100%;
    transition: all 0.2s;
    background-color: transparent;
    border: 0;
    font-size: 0.875rem;
    color: #757575;
    cursor: pointer;
    text-align: left;
    display: flex;
    align-items: center;
    &:hover {
      background-color: #eeeeee;
    }
  `,
  delete: css`
    cursor: pointer;
    width: 100%;
    margin-top: 8px;
    font-size: 14px;
    text-align: center;
    &:hover svg {
      stroke: #e58e8e;
    }
  `,
};
