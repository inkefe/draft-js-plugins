import React, {
  ReactElement,
  FC,
  ComponentType,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { EditorState } from 'draft-js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';
import _throttle from 'lodash/throttle';
import {
  HeadlineOneButton,
  HeadlineTwoButton,
  BlockquoteButton,
  CodeBlockButton,
  UnorderedListButton,
  OrderedListButton,
} from '@draft-js-plugins/buttons';
import BlockTypeSelect, {
  BlockTypeSelectChildProps,
  CreateBlockTypeSelectPopperOptionsFn,
} from '../BlockTypeSelect/BlockTypeSelect';
import { SideToolbarPluginTheme } from '../../theme';
import {
  PopperOptions,
  SideToolbarPluginStore,
  SideToolbarPosition,
  hoverChangeCallBack,
} from '../..';
import Popover from './Popover';
import { SideToolbarButtonProps } from '../BlockTypeSelect/SideToolbarButton';

export type SideToolbarChildrenProps = BlockTypeSelectChildProps;

interface ToolbarProps {
  children?: FC<SideToolbarChildrenProps>;
  store: SideToolbarPluginStore;
  position: SideToolbarPosition;
  theme: SideToolbarPluginTheme;
  popperOptions?: PopperOptions;
  onHoverChange?(fn: hoverChangeCallBack): void;
  createBlockTypeSelectPopperOptions?: CreateBlockTypeSelectPopperOptionsFn;
  sideToolbarButtonComponent: ComponentType<SideToolbarButtonProps>;
}

function DefaultChildren(
  externalProps: SideToolbarChildrenProps
): ReactElement {
  // may be use React.Fragment instead of div to improve perfomance after React 16
  return (
    <div>
      <HeadlineOneButton {...externalProps} />
      <HeadlineTwoButton {...externalProps} />
      <BlockquoteButton {...externalProps} />
      <CodeBlockButton {...externalProps} />
      <UnorderedListButton {...externalProps} />
      <OrderedListButton {...externalProps} />
    </div>
  );
}

export default function Toolbar({
  theme,
  position,
  popperOptions,
  store,
  createBlockTypeSelectPopperOptions,
  children = DefaultChildren,
  onHoverChange,
  sideToolbarButtonComponent: SideToolbarButton,
}: ToolbarProps): ReactElement | null {
  const [show, _setShow] = useState(false);
  const setShow = useCallback(_throttle(_setShow, 100), []);
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  const [targetKeys, setTargetKeys] = useState<Array<string | undefined>>([]);
  const [buttonReferenceElement, setButtonReferenceElement] =
    useState<HTMLElement | null>(null);

  if (onHoverChange) {
    useEffect(() => {
      const onChangeCallBack = (dom?: HTMLDivElement): void => {
        setReferenceElement(dom || null);
        if (dom?.tagName === 'UL' || dom?.tagName === 'OL') {
          setTargetKeys(
            Array.from(dom.querySelectorAll('li[data-offset-key]'))
              .map((li) => li.getAttribute('data-offset-key')?.split('-')[0])
              .filter(Boolean)
          );
        } else
          setTargetKeys(
            [dom?.getAttribute('data-offset-key')?.split('-')?.[0]].filter(
              Boolean
            )
          );
        if (!dom) setShow(false);
      };
      onHoverChange(onChangeCallBack);
    }, []);
  } else {
    const onEditorStateChange = useCallback((editorState?: EditorState) => {
      const selection = editorState!.getSelection();
      if (!selection.getHasFocus()) {
        setReferenceElement(null);
        setShow(false);
        setTargetKeys([]);
        return;
      }

      const currentContent = editorState!.getCurrentContent();
      const currentBlock = currentContent.getBlockForKey(
        selection.getStartKey()
      );
      const currentKey = currentBlock.getKey();
      // TODO verify that always a key-0-0 exists
      const offsetKey = DraftOffsetKey.encode(currentKey, 0, 0);
      // Note: need to wait on tick to make sure the DOM node has been create by Draft.js
      setTimeout(() => {
        const node = document.querySelectorAll<HTMLDivElement>(
          `[data-offset-key="${offsetKey}"]`
        )[0];
        setTargetKeys([currentKey]);
        setReferenceElement(node);
      }, 0);
    }, []);

    useEffect(() => {
      store.subscribeToItem('editorState', onEditorStateChange);
      return () => {
        store.unsubscribeFromItem('editorState', onEditorStateChange);
      };
    }, [store]);
  }

  const getTargetKeys = useCallback(
    (): Array<string | undefined> => targetKeys,
    [targetKeys]
  );

  // if (referenceElement === null) {
  //   //do not show popover if reference element is not there
  //   return null;
  // }

  return (
    <>
      <Popover
        className={theme.toolbarStyles?.wrapper}
        referenceElement={referenceElement}
        position={position}
        popperOptions={popperOptions}
      >
        <div
          ref={setButtonReferenceElement}
          data-reference-show={!!referenceElement}
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          <SideToolbarButton
            getEditorState={store.getItem('getEditorState')!}
            setEditorState={store.getItem('setEditorState')!}
            getTargetKeys={getTargetKeys}
            className={theme.blockTypeSelectStyles?.blockType}
          />
        </div>
      </Popover>
      <BlockTypeSelect
        getEditorState={store.getItem('getEditorState')!}
        setEditorState={store.getItem('setEditorState')!}
        getTargetKeys={getTargetKeys}
        theme={theme}
        childNodes={children}
        referenceElement={buttonReferenceElement}
        show={show}
        rootReferenceElement={referenceElement}
        createBlockTypeSelectPopperOptions={createBlockTypeSelectPopperOptions}
      />
    </>
  );
}
