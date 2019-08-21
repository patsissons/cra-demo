import React, {
  Dispatch,
  KeyboardEvent,
  MutableRefObject,
  SetStateAction,
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
  DeleteMinor,
  EditMajorTwotone,
  NotesMinor,
  MobileCancelMajorMonotone,
} from '@shopify/polaris-icons';
import {useMountedRef} from '@shopify/react-hooks';
import {useI18n} from '@shopify/react-i18n';
import {TodoItem} from 'models';
import {ErrorType, useTodoListItem} from './hooks';
import styles from './TodoListItem.module.scss';

interface Props {
  item: TodoItem;
  toggleComplete(): Promise<unknown>;
  updateText(text: string): Promise<unknown>;
  removeItem(): Promise<unknown>;
}

export function TodoListItem({
  item,
  removeItem,
  toggleComplete,
  updateText,
}: Props) {
  const isMounted = useMountedRef();
  const [i18n] = useI18n();
  const {
    error,
    dirty,
    fields,
    formErrors,
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
  const {id, isComplete, text} = item;

  return (
    <div
      className={isComplete ? styles.CompletedItem : undefined}
      onKeyDown={handleKeyDown}
    >
      <ResourceList.Item
        id={id}
        accessibilityLabel={i18n.translate('TodoListItem.accessibilityLabel')}
        onClick={toggle}
      >
        <Stack alignment="center">
          <Icon source={NotesMinor} />
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
                    onClick={save}
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
            {(!isEditing || item.text) && (
              <Button
                onClick={edit}
                primary={!isEditing}
                icon={
                  isEditing ? (
                    MobileCancelMajorMonotone
                  ) : (
                    <Icon color="white" source={EditMajorTwotone} />
                  )
                }
              />
            )}
          </Tooltip>
          <Tooltip content={i18n.translate('TodoListItem.tooltip.delete')}>
            <Button
              loading={removing}
              onClick={remove}
              destructive
              icon={DeleteMinor}
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
            onDismiss={dismissToast}
            error
          />
        )}
      </ResourceList.Item>
    </div>
  );

  function dismissToast() {
    setError(undefined);
  }

  function edit(event?: MouseEvent) {
    preventToggleEvent(event);
    setIsEditing(!isEditing);
  }

  function handleKeyDown({key}: KeyboardEvent) {
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
            remove();
          }
          break;
      }
    }
  }

  function remove(event?: MouseEvent) {
    preventToggleEvent(event);
    errorableAction(
      isMounted,
      ErrorType.Remove,
      setError,
      setRemoving,
      removeItem,
    );
  }

  function save(event?: MouseEvent) {
    preventToggleEvent(event);
    submit();
  }

  function toggle() {
    if (!isEditing) {
      errorableAction(
        isMounted,
        ErrorType.Toggle,
        setError,
        setToggling,
        toggleComplete,
      );
    }
  }
}

export async function errorableAction(
  isMounted: MutableRefObject<boolean>,
  errorType: ErrorType,
  setError: Dispatch<SetStateAction<ErrorType | undefined>>,
  setInvoking: Dispatch<SetStateAction<boolean>>,
  action: () => Promise<unknown>,
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
