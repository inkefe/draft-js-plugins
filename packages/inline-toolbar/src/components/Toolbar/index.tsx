/* eslint-disable react/no-array-index-key */
import React, { ComponentType, CSSProperties, FC, ReactElement } from 'react';
import { EditorState, getVisibleSelectionRect } from 'draft-js';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  DraftJsButtonTheme,
} from '@draft-js-plugins/buttons';
import { InlineToolbarPluginStore, InlineToolbarEventStore } from '../../';
import { InlineToolbarPluginTheme } from '../../theme';

interface OverrideContentProps {
  getEditorState: () => EditorState;
  setEditorState: (editorState: EditorState) => void;
  onOverrideContent: (content: ComponentType<unknown> | undefined) => void;
}

export interface ToolbarChildrenProps {
  theme: DraftJsButtonTheme;
  closeToolBar: () => void;
  getEditorState: () => EditorState;
  setEditorState: (editorState: EditorState) => void;
  onOverrideContent: (
    content: ComponentType<OverrideContentProps> | undefined
  ) => void;
}

interface ToolbarProps {
  store: InlineToolbarPluginStore;
  eventStore: InlineToolbarEventStore;
  children?: FC<ToolbarChildrenProps>;
  // isVisible?: boolean;
  style?: React.CSSProperties;
  getReadOnly?(): boolean;
  editorRoot?: HTMLElement | null;
  overrideContent?: ComponentType<ToolbarChildrenProps>;
  theme: InlineToolbarPluginTheme;
}

export default class Toolbar extends React.Component<ToolbarProps> {
  static defaultProps = {
    children: (externalProps: ToolbarChildrenProps): ReactElement => (
      // may be use React.Fragment instead of div to improve perfomance after React 16
      <div>
        <ItalicButton {...externalProps} />
        <BoldButton {...externalProps} />
        <UnderlineButton {...externalProps} />
        <CodeButton {...externalProps} />
      </div>
    ),
  };

  editorRoot: HTMLElement | null = null;

  state: ToolbarProps = {
    style: {
      transform: 'translate(-50%) scale(0)',
      opacity: 0.5,
      pointerEvents: 'none',
    },
    /**
     * If this is set, the toolbar will render this instead of the children
     * prop and will also be shown when the editor loses focus.
     * @type {Component}
     */
    overrideContent: undefined,
  } as ToolbarProps;

  toolbar: HTMLDivElement | null = null;

  isVisible = false;
  position?: { top: number; left: number } = undefined;

  componentDidMount(): void {
    this.props.store.subscribeToItem('selection', this.onSelectionChanged);
    this.props.eventStore.subscribeToItem('mousedown', this.clearSelect);
  }

  componentWillUnmount(): void {
    this.props.store.unsubscribeFromItem('selection', this.onSelectionChanged);
    this.props.eventStore.unsubscribeFromItem('mousedown', this.clearSelect);
  }

  clearSelect = (target: EventTarget | null | undefined): void => {
    const toolbar = this.toolbar;
    // const editorRoot = this.editorRoot
    if (!target || !this.isVisible || !toolbar) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _target: any = target;
    if (!toolbar.contains(_target)) {
      this.closeToolBar();
    }
  };

  closeToolBar = (): void => {
    this.setState({
      style: {
        ...this.position,
        transform: 'translate(-50%) scale(0)',
        opacity: 0.5,
        pointerEvents: 'none',
      },
    });
    this.isVisible = false;
  };

  /**
   * This can be called by a child in order to render custom content instead
   * of the children prop. It's the responsibility of the callee to call
   * this function again with `undefined` in order to reset `overrideContent`.
   * @param {Component} overrideContent
   */
  onOverrideContent = (
    overrideContent: ComponentType<OverrideContentProps> | undefined
  ): void => {
    this.setState({ overrideContent });
  };

  onSelectionChanged = (): void => {
    // need to wait a tick for window.getSelection() to be accurate
    // when focusing editor with already present selection
    setTimeout(() => {
      if (!this.toolbar) return;

      // The editor root should be two levels above the node from
      // `getEditorRef`. In case this changes in the future, we
      // attempt to find the node dynamically by traversing upwards.
      const editorRef = this.props.store.getItem('getEditorRef')!();
      if (!editorRef) return;

      // This keeps backwards compatibility with React 15
      let editorRoot =
        editorRef.refs && editorRef.refs.editor
          ? editorRef.refs.editor
          : editorRef.editor;
      while (editorRoot.className.indexOf('DraftEditor-root') === -1) {
        editorRoot = editorRoot.parentNode as HTMLElement;
      }
      this.editorRoot = editorRoot;
      const editorRootRect = editorRoot.getBoundingClientRect();

      const parentWindow =
        editorRoot.ownerDocument && editorRoot.ownerDocument.defaultView;
      const selectionRect = getVisibleSelectionRect(parentWindow || window);
      if (!selectionRect) return;

      // The toolbar shouldn't be positioned directly on top of the selected text,
      // but rather with a small offset so the caret doesn't overlap with the text.
      const extraTopOffset = -8;

      const position = {
        top:
          editorRoot.offsetTop -
          this.toolbar.offsetHeight +
          (selectionRect.top - editorRootRect.top) +
          extraTopOffset,
        left:
          editorRoot.offsetLeft +
          (selectionRect.left - editorRootRect.left) +
          selectionRect.width / 2,
      };
      this.position = position;
      this.setState({ style: this.getStyle() });
    });
  };

  getStyle(): CSSProperties {
    const { store, getReadOnly } = this.props;
    const { overrideContent } = this.state;
    const selection = store.getItem('getEditorState')!().getSelection();
    const windowSelection = window.getSelection();
    // overrideContent could for example contain a text input, hence we always show overrideContent
    // TODO: Test readonly mode and possibly set isVisible to false if the editor is readonly
    const isVisible =
      (!selection.isCollapsed() &&
        !windowSelection?.isCollapsed &&
        !getReadOnly?.() &&
        windowSelection?.focusNode &&
        this.editorRoot?.contains(windowSelection?.focusNode)) ||
      overrideContent;
    const style: CSSProperties = { ...this.position! };
    if (isVisible) {
      style.opacity = 1;
      style.transform = 'translate(-50%) scale(1)';
      style.pointerEvents = 'auto';
    } else {
      style.transform = 'translate(-50%) scale(0)';
      style.opacity = 0.5;
      style.pointerEvents = 'none';
    }
    this.isVisible = !!isVisible;
    this.setState({ style });
    return style;
  }

  render(): ReactElement {
    const { theme, store } = this.props;
    const { overrideContent: OverrideContent, style } = this.state;
    const childrenProps: ToolbarChildrenProps = {
      theme: theme.buttonStyles,
      closeToolBar: this.closeToolBar,
      getEditorState: store.getItem('getEditorState')!,
      setEditorState: store.getItem('setEditorState')!,
      onOverrideContent: this.onOverrideContent,
    };

    return (
      <div
        className={theme.toolbarStyles.toolbar}
        style={style}
        ref={(element) => {
          this.toolbar = element;
        }}
      >
        {OverrideContent ? (
          <OverrideContent {...childrenProps} />
        ) : (
          this.props.children!(childrenProps)
        )}
      </div>
    );
  }
}
