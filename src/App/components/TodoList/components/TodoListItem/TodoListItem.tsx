import * as React from 'react';

import {
  ResourceList,
  Stack,
  TextField,
  Button,
  Toast,
  Icon,
  Tooltip,
} from '@shopify/polaris';
import {withI18n, WithI18nProps} from '@shopify/react-i18n';
import {compose} from 'recompose';

import {TodoItem} from 'src/models';
import {CompleteIcon, EditIcon, IncompleteIcon} from './images';
import styles from './TodoListItem.module.scss';

export interface Props {
  editText?: string;
  item: TodoItem;
  toggleComplete(): Promise<any>;
  updateText(text: string): Promise<any>;
  removeItem(): Promise<any>;
}

type ComposedProps = Props & WithI18nProps;

interface State {
  editText?: string | null;
  error?: boolean | null;
}

export class TodoListItem extends React.PureComponent<ComposedProps> {
  state: State = {};

  handleClick = async () => {
    const {toggleComplete} = this.props;
    const {editText} = this.state;

    if (editText == null) {
      try {
        await toggleComplete();
      } catch {
        this.setState({error: true});
      }
    }
  };

  handleRemove = async () => {
    const {removeItem} = this.props;

    try {
      await removeItem();

      this.setState({editText: null});
    } catch {
      this.setState({error: true});
    }
  };

  handleDismissToast = () => {
    this.setState({error: null});
  };

  handleEdit = (event?: MouseEvent) => {
    const {
      item: {text},
    } = this.props;
    const {editText} = this.state;

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (editText == null) {
      this.setState({editText: text});
    } else {
      this.setState({editText: null});
    }
  };

  handleSave = async (event?: MouseEvent) => {
    const {updateText} = this.props;
    const {editText} = this.state;

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (editText != null) {
      try {
        await updateText(editText);

        this.setState({editText: null});
      } catch {
        this.setState({error: true});
      }
    }
  };

  updateText = (editText: string) => {
    this.setState({editText});
  };

  componentDidMount() {
    const {
      item: {text},
    } = this.props;

    if (!text) {
      this.setState({editText: ''});
    }
  }

  render() {
    const {
      i18n,
      item: {id, isComplete, text},
    } = this.props;
    const {editText, error} = this.state;

    const editMode = editText != null;

    return (
      <div className={isComplete ? styles.CompletedItem : undefined}>
        <ResourceList.Item
          id={id}
          accessibilityLabel={i18n.translate('TodoListItem.accessibilityLabel')}
          onClick={this.handleClick}
        >
          <Stack alignment="center">
            <Icon source="notes" />
            <Stack.Item fill>
              {editText == null ? (
                <p className={isComplete ? styles.CompletedText : undefined}>
                  {text}
                </p>
              ) : (
                <TextField
                  label=""
                  type="text"
                  value={editText}
                  onChange={this.updateText}
                  placeholder={i18n.translate('TodoListItem.placeholder')}
                  connectedRight={
                    <Button onClick={this.handleSave} primary>
                      {i18n.translate('TodoListItem.save')}
                    </Button>
                  }
                />
              )}
            </Stack.Item>
            <Tooltip
              content={i18n.translate(
                `TodoListItem.tooltip.${editMode ? 'cancel' : 'edit'}`,
              )}
            >
              <Button
                onClick={this.handleEdit}
                primary={!editMode}
                icon={
                  editMode ? 'cancel' : <EditIcon className={styles.Icon} />
                }
              />
            </Tooltip>
            <Tooltip content={i18n.translate('TodoListItem.tooltip.delete')}>
              <Button onClick={this.handleRemove} destructive icon="delete" />
            </Tooltip>
            <Tooltip
              content={i18n.translate(
                `TodoListItem.tooltip.${
                  isComplete ? 'complete' : 'incomplete'
                }`,
              )}
            >
              {isComplete ? (
                <CompleteIcon className={styles.Icon} />
              ) : (
                <IncompleteIcon className={styles.Icon} />
              )}
            </Tooltip>
          </Stack>
          {error && (
            <Toast
              content={i18n.translate('TodoListItem.error')}
              onDismiss={this.handleDismissToast}
              error
            />
          )}
        </ResourceList.Item>
      </div>
    );
  }
}

export default compose<ComposedProps, Props>(withI18n())(TodoListItem);
