import {useCallback, useDebugValue, useEffect, useState} from 'react';
import {
  FormError,
  notEmpty,
  notEmptyString,
  useForm,
  useField,
} from '@shopify/react-form';
import {I18n} from '@shopify/react-i18n';
import {TodoItem} from 'models';

export enum ErrorType {
  Remove = 'remove',
  Save = 'save',
  Toggle = 'toggle',
}

export function useTodoListItem(
  i18n: I18n,
  item: TodoItem,
  updateText: (text: string) => Promise<unknown>,
) {
  const [isEditing, setIsEditing] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState<ErrorType>();
  const [formErrors, setFormErrors] = useState<FormError[]>([]);
  const {dirty, fields, reset, submit, submitting, validate} = useForm({
    fields: {
      text: useField({
        validates: [
          notEmpty(i18n.translate('useTodoListItem.validation.empty')),
          notEmptyString(i18n.translate('useTodoListItem.validation.empty')),
          (value) => {
            if (value === 'error') {
              return i18n.translate('useTodoListItem.validation.error');
            }

            return undefined;
          },
        ],
        value: isEditing ? item.text : '',
      }),
    },
    async onSubmit({text}) {
      try {
        await updateText(text);
        setIsEditing(false);
        reset();
        return {status: 'success'};
      } catch {
        setError(ErrorType.Save);
        return {status: 'fail', errors: []};
      }
    },
  });
  /* istanbul ignore next */
  const status = useCallback(() => {
    if (isEditing) {
      return 'editing';
    }

    return item.isComplete ? 'done' : 'TBD';
  }, [isEditing, item.isComplete]);
  useEffect(() => {
    if (!item.text) {
      setIsEditing(true);
    }
  }, [item.text, isEditing]);
  useEffect(() => {
    if (dirty) {
      setFormErrors(validate());
    }
  }, [dirty, validate]);
  useDebugValue(`Item (${status()})`);

  return {
    error,
    dirty,
    fields,
    formErrors,
    isEditing,
    removing,
    reset,
    setError,
    setIsEditing,
    setRemoving,
    setToggling,
    submit,
    submitting,
    toggling,
  };
}
