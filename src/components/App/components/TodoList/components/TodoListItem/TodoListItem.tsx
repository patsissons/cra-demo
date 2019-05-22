import React, {
  Dispatch,
  KeyboardEvent,
  MutableRefObject,
  SetStateAction,
  useCallback,
} from 'react';
import {
  Button,
  Icon,
  ResourceList,
  Spinner,
  Stack,
  TextField,
  Toast,
  Tooltip,
} from '@shopify/polaris';
import {
  CircleDotsMajorTwotone,
  CircleTickMajorTwotone,
  EditMajorTwotone,
} from '@shopify/polaris-icons';
import {useMountedRef} from '@shopify/react-hooks';
import {useI18n} from '@shopify/react-i18n';
import {TodoItem} from 'models';
import {ErrorType, useTodoListItem} from './hooks';
import styles from './TodoListItem.module.scss';

export interface Props {
  item: TodoItem;
  toggleComplete(): Promise<any>;
  updateText(text: string): Promise<any>;
  removeItem(): Promise<any>;
}

export default function TodoListItem({
  item,
  removeItem,
  toggleComplete,
  updateText,
}: Props) {
  const {id, isComplete, text} = item;
  const isMounted = useMountedRef();
  const [i18n] = useI18n();
  const {
    error,
    dirty,
    fields,
    isEditing,
    removing,
    setError,
    setIsEditing,
    setRemoving,
    setToggling,
    submit,
    submitting,
    toggling,
  } = useTodoListItem(i18n, item, updateText);
  // validate() is causing an infinite loop
  // const formErrors = validate();
  const formErrors = fields.text.error
    ? [{field: 'text', message: fields.text.error}]
    : [];
  const handleClick = useCallback(() => {
    if (!isEditing) {
      errorableAction(
        isMounted,
        ErrorType.Toggle,
        setError,
        setToggling,
        toggleComplete,
      );
    }
  }, [isEditing, isMounted, setError, setToggling, toggleComplete]);
  const handleDismissToast = useCallback(() => {
    setError(null);
  }, [setError]);
  const handleRemove = useCallback(
    (event?: MouseEvent) => {
      preventToggleEvent(event);
      errorableAction(
        isMounted,
        ErrorType.Remove,
        setError,
        setRemoving,
        removeItem,
      );
    },
    [isMounted, removeItem, setError, setRemoving],
  );
  const handleEdit = useCallback(
    (event?: MouseEvent) => {
      preventToggleEvent(event);
      if (isEditing && !item.text) {
        handleRemove();
      } else {
        setIsEditing(!isEditing);
      }
    },
    [isEditing, item.text, handleRemove, setIsEditing],
  );
  const handleKeyDown = useCallback(
    ({key}: KeyboardEvent) => {
      if (isEditing) {
        switch (key) {
          case 'Enter':
            if (dirty && formErrors.length === 0) {
              submit();
            }
            break;
          case 'Escape':
            if (item.text) {
              setIsEditing(false);
            } else {
              handleRemove();
            }
            break;
        }
      }
    },
    [
      dirty,
      formErrors.length,
      handleRemove,
      isEditing,
      item.text,
      setIsEditing,
      submit,
    ],
  );
  const handleSave = useCallback(
    (event?: MouseEvent) => {
      preventToggleEvent(event);
      submit();
    },
    [submit],
  );

  return (
    <div
      className={isComplete ? styles.CompletedItem : undefined}
      onKeyDown={handleKeyDown}
    >
      <ResourceList.Item
        id={id}
        accessibilityLabel={i18n.translate('TodoListItem.accessibilityLabel')}
        onClick={handleClick}
      >
        <Stack alignment="center">
          <Icon source="notes" />
          <Stack.Item fill>
            {isEditing ? (
              <TextField
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                disabled={submitting}
                label=""
                placeholder={i18n.translate('TodoListItem.placeholder')}
                connectedRight={
                  <Button
                    disabled={!dirty || formErrors.length > 0}
                    loading={submitting}
                    onClick={handleSave}
                    primary
                  >
                    {i18n.translate('TodoListItem.save')}
                  </Button>
                }
                {...fields.text}
                // this will remove the error text and only render the outline effect
                // error={Boolean(fields.text.error)}
              />
            ) : (
              <p className={isComplete ? styles.CompletedText : undefined}>
                {text}
              </p>
            )}
          </Stack.Item>
          <Tooltip
            content={i18n.translate(
              `TodoListItem.tooltip.${isEditing ? 'cancel' : 'edit'}`,
            )}
          >
            <Button
              onClick={handleEdit}
              primary={!isEditing}
              icon={
                isEditing ? (
                  'cancel'
                ) : (
                  <Icon color="white" source={EditMajorTwotone} />
                )
              }
            />
          </Tooltip>
          <Tooltip content={i18n.translate('TodoListItem.tooltip.delete')}>
            <Button
              loading={removing}
              onClick={handleRemove}
              destructive
              icon="delete"
            />
          </Tooltip>
          {toggling ? (
            <Spinner size="small" />
          ) : (
            <Tooltip
              content={i18n.translate(
                `TodoListItem.tooltip.${
                  isComplete ? 'complete' : 'incomplete'
                }`,
              )}
            >
              {isComplete ? (
                <Icon color="green" source={CircleTickMajorTwotone} />
              ) : (
                <Icon color="black" source={CircleDotsMajorTwotone} />
              )}
            </Tooltip>
          )}
        </Stack>
        {error && (
          <Toast
            content={i18n.translate(`TodoListItem.error.${error}`)}
            onDismiss={handleDismissToast}
            error
          />
        )}
      </ResourceList.Item>
    </div>
  );
}

export async function errorableAction(
  isMounted: MutableRefObject<boolean>,
  errorType: ErrorType,
  setError: Dispatch<SetStateAction<ErrorType | null>>,
  setInvoking: Dispatch<SetStateAction<boolean>>,
  action: () => Promise<any>,
) {
  try {
    setInvoking(true);
    await action();
  } catch {
    setError(errorType);
  }

  if (isMounted.current) {
    setInvoking(false);
  }
}

export function preventToggleEvent(event?: MouseEvent) {
  /* istanbul ignore else */
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
