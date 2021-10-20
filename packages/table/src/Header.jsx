/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';
import { grey } from './colors';
// import ArrowUpIcon from './img/ArrowUp';
// import ArrowDownIcon from './img/ArrowDown';
import ArrowLeftIcon from './img/ArrowLeft';
import ArrowRightIcon from './img/ArrowRight';
import TrashIcon from './img/Trash';
import TextIcon from './img/Text';
import MultiIcon from './img/Multi';
import HashIcon from './img/Hash';
import PlusIcon from './img/Plus';
import { ActionTypes, DataTypes, shortId, UTIL_COL } from './utils';

// function getPropertyIcon(dataType) {
//   switch (dataType) {
//     case DataTypes.NUMBER:
//       return <HashIcon />;
//     case DataTypes.TEXT:
//       return <TextIcon />;
//     case DataTypes.SELECT:
//       return <MultiIcon />;
//     default:
//       return null;
//   }
// }

export default function Header({
  column: { id, created, label, getResizerProps, getHeaderProps },
  theme,
  dataDispatch,
  disabled
}) {
  const [expanded, setExpanded] = useState(created || false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [inputRef, setInputRef] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom',
    strategy: 'fixed',
  });
  const [header, setHeader] = useState(label);
  // eslint-disable-next-line no-unused-vars
  const [typeReferenceElement, setTypeReferenceElement] = useState(null);
  const [typePopperElement, setTypePopperElement] = useState(null);
  const typePopper = usePopper(typeReferenceElement, typePopperElement, {
    placement: 'right',
    strategy: 'fixed',
  });
  const [showType, setShowType] = useState(false);
  const buttons = [
    // {
    //   onClick: e => {
    //     dataDispatch({
    //       type: ActionTypes.UPDATE_COLUMN_HEADER,
    //       columnId: id,
    //       label: header,
    //     });
    //     setSortBy([{ id: id, desc: false }]);
    //     setExpanded(false);
    //   },
    //   icon: <ArrowUpIcon />,
    //   label: '升序',
    // },
    // {
    //   onClick: e => {
    //     dataDispatch({
    //       type: ActionTypes.UPDATE_COLUMN_HEADER,
    //       columnId: id,
    //       label: header,
    //     });
    //     setSortBy([{ id: id, desc: true }]);
    //     setExpanded(false);
    //   },
    //   icon: <ArrowDownIcon />,
    //   label: '降序',
    // },
    {
      onClick: () => {
        dataDispatch({
          type: ActionTypes.UPDATE_COLUMN_HEADER,
          columnId: id,
          label: header,
        });
        dataDispatch({
          type: ActionTypes.ADD_COLUMN_TO_LEFT,
          columnId: id,
          focus: false,
        });
        setExpanded(false);
      },
      icon: <ArrowLeftIcon />,
      label: '左边插入',
    },
    {
      onClick: () => {
        dataDispatch({
          type: ActionTypes.UPDATE_COLUMN_HEADER,
          columnId: id,
          label: header,
        });
        dataDispatch({
          type: ActionTypes.ADD_COLUMN_TO_RIGHT,
          columnId: id,
          focus: false,
        });
        setExpanded(false);
      },
      icon: <ArrowRightIcon />,
      label: '右边插入',
    },
    {
      onClick: () => {
        dataDispatch({
          type: ActionTypes.UPDATE_COLUMN_HEADER,
          columnId: id,
          label: header,
        });
        dataDispatch({ type: ActionTypes.DELETE_COLUMN, columnId: id });
        setExpanded(false);
      },
      icon: <TrashIcon />,
      label: '删除',
    },
  ];

  const types = [
    {
      onClick: () => {
        dataDispatch({
          type: 'update_column_type',
          columnId: id,
          dataType: DataTypes.SELECT,
        });
        setShowType(false);
        setExpanded(false);
      },
      icon: <MultiIcon />,
      label: '标签',
    },
    {
      onClick: () => {
        dataDispatch({
          type: 'update_column_type',
          columnId: id,
          dataType: DataTypes.TEXT,
        });
        setShowType(false);
        setExpanded(false);
      },
      icon: <TextIcon />,
      label: '文本',
    },
    {
      onClick: () => {
        dataDispatch({
          type: 'update_column_type',
          columnId: id,
          dataType: DataTypes.NUMBER,
        });
        setShowType(false);
        setExpanded(false);
      },
      icon: <HashIcon />,
      label: '数字',
    },
  ];

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      dataDispatch({
        type: 'update_column_header',
        columnId: id,
        label: header,
      });
      setExpanded(false);
    }
  }

  function handleChange(e) {
    setHeader(e.target.value);
  }

  function handleBlur(e) {
    e.preventDefault();
    dataDispatch({ type: 'update_column_header', columnId: id, label: header });
  }

  function getHeader() {
    if (id !== UTIL_COL.id) {
      return (
        <>
          <div
            {...getHeaderProps()}
            className={`${theme.th} noselect d-inline-block`}
          >
            <div
              className={theme.thContent}
              onClick={() => setExpanded(!disabled)}
              ref={setReferenceElement}
            >
              {/* <span className="svg-icon svg-gray icon-margin">
                {propertyIcon}
              </span> */}
              {label}
            </div>
            <div {...getResizerProps()} className={theme.resizer} />
          </div>
          {expanded && !disabled && (
            <div className={theme.overlay} onClick={() => setExpanded(false)} />
          )}
          {expanded && !disabled && createPortal((
            <div
              ref={setPopperElement}
              className={theme.popper}
              style={{ ...styles.popper }}
              {...attributes.popper}
            >
              <div
                className="shadow-5 border-radius-sm"
                style={{
                  width: 240,
                  backgroundColor: '#fff',
                }}
              >
                <div
                  style={{
                    paddingTop: '0.75rem',
                    paddingLeft: '0.75rem',
                    paddingRight: '0.75rem',
                  }}
                >
                  <div className="is-fullwidth" style={{ marginBottom: 12 }}>
                    <input
                      className={theme.formInput}
                      ref={setInputRef}
                      type="text"
                      value={header}
                      style={{ width: '100%' }}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  {/* <span className="font-weight-600 font-size-75 color-grey-500 text-transform-uppercase">
                    属性类型
                  </span> */}
                </div>
                <div className="list-padding">
                  {/* <button
                    className={theme.sortButton}
                    type="button"
                    onMouseEnter={() => setShowType(true)}
                    onMouseLeave={() => setShowType(false)}
                    ref={setTypeReferenceElement}
                  >
                    <span className="svg-icon svg-text icon-margin">
                      {propertyIcon}
                    </span>
                    <span className="text-transform-capitalize">
                      {TypeLabel[dataType]}
                    </span>
                  </button> */}
                  {showType && (
                    <div
                      className="shadow-5 border-radius-sm list-padding"
                      ref={setTypePopperElement}
                      onMouseEnter={() => setShowType(true)}
                      onMouseLeave={() => setShowType(false)}
                      {...typePopper.attributes.popper}
                      style={{
                        ...typePopper.styles.popper,
                        width: 200,
                        backgroundColor: 'white',
                        zIndex: 4,
                      }}
                    >
                      {types.map((type, index) => (
                        <button
                          key={index}
                          className={theme.sortButton}
                          onClick={type.onClick}
                        >
                          <span className="svg-icon svg-text icon-margin">
                            {type.icon}
                          </span>
                          {type.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div
                  className="list-padding"
                  key={shortId()}
                  style={{
                    borderTop: `1px solid ${grey(200)}`,
                  }}
                >
                  {buttons.map((button, index) => (
                    <button
                      key={index}
                      type="button"
                      className={theme.sortButton}
                      onMouseDown={button.onClick}
                    >
                      <span className="svg-icon svg-text icon-margin">
                        {button.icon}
                      </span>
                      {button.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ), document.body)}
        </>
      );
    }
    if (disabled) return null;
    return (
      // 添加列
      <div
        {...getHeaderProps()}
        className={`${theme.th} noselect d-inline-block`}
      >
        <div
          className={theme.thContent}
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
          onClick={() =>
            dataDispatch({
              type: ActionTypes.ADD_COLUMN_TO_LEFT,
              columnId: UTIL_COL.id,
              focus: true,
            })
          }
        >
          <span className="svg-icon-sm svg-gray">
            <PlusIcon />
          </span>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (created) {
      setExpanded(true);
    }
  }, [created]);

  useEffect(() => {
    setHeader(label);
  }, [label]);

  useEffect(() => {
    if (inputRef) {
      inputRef.focus();
      inputRef.select();
    }
  }, [inputRef]);

  return getHeader();
}
