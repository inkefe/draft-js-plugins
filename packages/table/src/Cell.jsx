/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ContentEditable from 'react-contenteditable';
import { usePopper } from 'react-popper';
import { grey } from './colors';
import PlusIcon from './img/Plus';
import TrashIcon from './img/Trash';
import Badge from './Badge';
import { ActionTypes, DataTypes, randomColor } from './utils';

const ELEMENT_ID = 'popper-portal';
const initWraper = id => {
  const wraper = document.getElementById(id);
  if (wraper) return wraper;
  const wrap = document.createElement('div');
  wrap.setAttribute('id', id);
  document.body.appendChild(wrap);
  return wrap;
};
const popperWrapper = initWraper(ELEMENT_ID);
const filterStyleReg = /(style|class)="[^"]*"/g;
export default function Cell({
  value: initialValue,
  theme,
  row: { index },
  column: { id, dataType, options },
  dataDispatch,
  disabled,
}) {
  const [value, setValue] = useState({ value: initialValue, update: false });
  const [selectRef, setSelectRef] = useState(null);
  const [selectPop, setSelectPop] = useState(null);
  const [showSelect, setShowSelect] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addSelectRef, setAddSelectRef] = useState(null);
  const { styles, attributes } = usePopper(selectRef, selectPop, {
    placement: 'bottom-start',
    strategy: 'fixed',
  });

  function handleOptionKeyDown(e) {
    if (e.key !== 'Enter') return;
    if (e.target.value !== '') {
      dataDispatch({
        type: ActionTypes.ADD_OPTION_TO_COLUMN,
        option: e.target.value,
        backgroundColor: randomColor(),
        columnId: id,
      });
    }
    setShowAdd(false);
  }

  function handleAddOption() {
    setShowAdd(true);
  }

  function handleOptionBlur(e) {
    if (e.target.value !== '') {
      dataDispatch({
        type: ActionTypes.ADD_OPTION_TO_COLUMN,
        option: e.target.value,
        backgroundColor: randomColor(),
        columnId: id,
      });
    }
    setShowAdd(false);
  }

  function getColor() {
    const match = options.find(option => option.label === value.value);
    return (match && match.backgroundColor) || grey(200);
  }

  function onChange(e) {
    setValue({
      value: e.target.value.replace(filterStyleReg, ''),
      update: false,
    });
  }

  function handleOptionClick(option) {
    setValue({ value: option.label, update: true });
    setShowSelect(false);
  }

  const onDelete = deleteIndex => {
    dataDispatch({
      type: ActionTypes.DELETE_ROW,
      deleteIndex,
    });
  };
  // const [_value, setOldValue] = useState('');

  const onBlur = () => setValue(old => ({ value: old.value, update: true }));

  function getCellElement() {
    switch (dataType) {
      case DataTypes.TEXT:
        return (
          <ContentEditable
            disabled={disabled}
            html={(value.value && value.value.toString()) || ''}
            onChange={onChange}
            onBlur={onBlur}
            className={theme.dataInput}
          />
        );
      case DataTypes.NUMBER:
        return (
          <ContentEditable
            html={(value.value && value.value.toString()) || ''}
            onChange={onChange}
            onBlur={onBlur}
            className="data-input text-align-right"
          />
        );
      case DataTypes.SELECT:
        return (
          <>
            <div
              ref={setSelectRef}
              className="cell-padding d-flex cursor-default align-items-center flex-1"
              onClick={() => setShowSelect(true)}
            >
              {value.value && (
                <Badge value={value.value} backgroundColor={getColor()} />
              )}
            </div>
            {showSelect && (
              <div
                className={theme.overlay}
                onClick={() => setShowSelect(false)}
              />
            )}
            {showSelect &&
              createPortal(
                <div
                  className={theme.popover}
                  ref={setSelectPop}
                  {...attributes.popper}
                  style={{
                    ...styles.popper,
                    zIndex: 4,
                    minWidth: 200,
                    maxWidth: 320,
                    maxHeight: 400,
                    padding: '0.75rem',
                    overflow: 'auto',
                  }}
                >
                  <div
                    className="d-flex flex-wrap-wrap"
                    style={{ marginTop: '-0.5rem' }}
                  >
                    {options.map((option, i) => (
                      <div
                        key={i}
                        className="cursor-pointer mr-5 mt-5"
                        onClick={() => handleOptionClick(option)}
                      >
                        <Badge
                          value={option.label}
                          backgroundColor={option.backgroundColor}
                        />
                      </div>
                    ))}
                    {showAdd && (
                      <div
                        className="mr-5 mt-5 bg-grey-200 border-radius-sm"
                        style={{
                          width: 120,
                          padding: '2px 4px',
                        }}
                      >
                        <input
                          type="text"
                          className="option-input"
                          onBlur={handleOptionBlur}
                          ref={setAddSelectRef}
                          onKeyDown={handleOptionKeyDown}
                        />
                      </div>
                    )}
                    <div
                      className="cursor-pointer mr-5 mt-5"
                      onClick={handleAddOption}
                    >
                      <Badge
                        value={
                          <span className="svg-icon-sm svg-text">
                            <PlusIcon />
                          </span>
                        }
                        backgroundColor={grey(200)}
                      />
                    </div>
                  </div>
                </div>,
                popperWrapper
              )}
          </>
        );
      case DataTypes.UTIL:
        return (
          <div
            title={'删除本行'}
            className={`${theme.delete} svg-icon svg-gray`}
            onClick={() => onDelete(index)}
          >
            <TrashIcon />
          </div>
        );
      default:
        return <span />;
    }
  }

  useEffect(() => {
    if (addSelectRef && showAdd) {
      addSelectRef.focus();
    }
  }, [addSelectRef, showAdd]);

  useEffect(() => {
    setValue({ value: initialValue, update: false });
  }, [initialValue]);

  useEffect(() => {
    if (value.update) {
      dataDispatch({
        type: ActionTypes.UPDATE_CELL,
        columnId: id,
        rowIndex: index,
        value: value.value,
      });
    }
  }, [value, dataDispatch, id, index]);

  return getCellElement();
}
