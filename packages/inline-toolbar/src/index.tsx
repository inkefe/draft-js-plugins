import React, { ComponentType, FC, ReactElement } from 'react';
import { EditorPlugin } from '@draft-js-plugins/editor';
import { EditorState, SelectionState } from 'draft-js';
import { createStore, Store } from '@draft-js-plugins/utils';
import debounce from 'lodash/debounce';
import Toolbar, { ToolbarChildrenProps } from './components/Toolbar';
import Separator from './components/Separator';
import { defaultTheme, InlineToolbarPluginTheme } from './theme';

export interface InlineToolbarPluginConfig {
  theme?: InlineToolbarPluginTheme;
}

export interface ToolbarProps {
  children?: FC<ToolbarChildrenProps>;
  style?: React.CSSProperties;
  overrideContent?: ComponentType<ToolbarChildrenProps>;
}

export type InlineToolBarPlugin = EditorPlugin & {
  InlineToolbar: ComponentType<ToolbarProps>;
};

export interface StoreItemMap {
  selection?: SelectionState;
  getEditorState?(): EditorState;
  setEditorState?(state: EditorState): void;
  isVisible?: boolean;
  getEditorRef?(): {
    refs?: { editor: HTMLElement };
    editor: HTMLElement;
  };
}

export type InlineToolbarPluginStore = Store<StoreItemMap>;
export interface EventStoreItemMap {
  mousedown?: EventTarget | null;
}
export type InlineToolbarEventStore = Store<EventStoreItemMap>;
const _eventStore = createStore<EventStoreItemMap>({});
const onMouseDown = debounce(
  (e: MouseEvent): void => {
    const targert: EventTarget | null = e.target;
    if (window.getSelection()?.isCollapsed) return;
    _eventStore.updateItem('mousedown', targert);
  },
  400,
  { leading: true, trailing: false }
);
document.body.addEventListener('mousedown', onMouseDown);

export default (
  config: InlineToolbarPluginConfig = {}
): InlineToolBarPlugin => {
  const store = createStore<StoreItemMap>({
    isVisible: false,
  });

  let _getReadOnly: (() => boolean) | undefined;

  const { theme = defaultTheme } = config;

  const InlineToolbar = (props: ToolbarProps): ReactElement => (
    <Toolbar
      {...props}
      store={store}
      getReadOnly={_getReadOnly}
      theme={theme}
      eventStore={_eventStore}
    />
  );

  return {
    initialize: ({
      getEditorState,
      setEditorState,
      getEditorRef,
      getReadOnly,
    }) => {
      _getReadOnly = getReadOnly;
      store.updateItem('getEditorState', getEditorState);
      store.updateItem('setEditorState', setEditorState);
      store.updateItem('getEditorRef', getEditorRef);
    },
    willUnmount: () => {
      // document.body.removeEventListener('mousedown', onMouseDown);
    },
    // Re-Render the text-toolbar on selection change
    onChange: (editorState) => {
      store.updateItem('selection', editorState.getSelection());
      return editorState;
    },
    InlineToolbar,
  };
};

export { Separator, defaultTheme };
