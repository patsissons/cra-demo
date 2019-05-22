import React from 'react';
import {
  Button,
  Icon,
  ResourceList,
  Spinner,
  TextField,
  Toast,
} from '@shopify/polaris';
import {
  CircleDotsMajorTwotone,
  CircleTickMajorTwotone,
  EditMajorTwotone,
} from '@shopify/polaris-icons';
import {mountWithContext, noopPromise} from 'tests/utilities';
import {ErrorType} from '../hooks/useTodoListItem/useTodoListItem';
import TodoListItem, {
  errorableAction,
  preventToggleEvent,
  Props,
} from '../TodoListItem';

jest.mock('../hooks/useTodoListItem/useTodoListItem', () => ({
  ...require.requireActual('../hooks/useTodoListItem/useTodoListItem'),
  useTodoListItem: jest.fn(),
}));

const useTodoListItemMock: jest.Mock = require.requireMock(
  '../hooks/useTodoListItem/useTodoListItem',
).useTodoListItem;

function mockUseTodoListItem() {
  return {
    error: null,
    dirty: false,
    fields: {
      text: {
        defaultValue: 'testing',
        dirty: false,
        error: undefined,
        newDefaultValue() {},
        onBlur() {},
        onChange() {},
        reset() {},
        runValidation() {
          return undefined;
        },
        setError() {},
        touched: false,
        value: 'testing',
      },
    },
    isEditing: false,
    removing: false,
    reset() {},
    setError() {},
    setIsEditing() {},
    setRemoving() {},
    setToggling() {},
    submit() {},
    submitting: false,
    toggling: false,
  };
}

describe('<TodoListItem />', () => {
  const defaultMockProps: Props = {
    item: {
      id: '1',
      isComplete: false,
      text: 'testing',
    },
    removeItem: noopPromise,
    toggleComplete: noopPromise,
    updateText: noopPromise,
  };

  beforeEach(() => {
    useTodoListItemMock.mockReset();
    useTodoListItemMock.mockImplementation(mockUseTodoListItem);
  });

  it('invokes submit when the Enter key is pressed in edit mode and the text field is diry and valid', async () => {
    const submit = jest.fn();
    useTodoListItemMock.mockImplementation(() => ({
      ...mockUseTodoListItem(),
      dirty: true,
      isEditing: true,
      submit,
    }));
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    await wrapper.find('div')!.trigger('onKeyDown', {key: 'Enter'});

    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('ignores the Enter key press when not in edit mode', async () => {
    const submit = jest.fn();
    useTodoListItemMock.mockImplementation(() => ({
      ...mockUseTodoListItem(),
      dirty: true,
      isEditing: false,
      submit,
    }));
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    await wrapper.find('div')!.trigger('onKeyDown', {key: 'Enter'});

    expect(submit).not.toHaveBeenCalled();
  });

  it('ignores the Enter key press in edit mode when the text field is not dirty', async () => {
    const submit = jest.fn();
    useTodoListItemMock.mockImplementation(() => ({
      ...mockUseTodoListItem(),
      dirty: false,
      isEditing: true,
      submit,
    }));
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    await wrapper.find('div')!.trigger('onKeyDown', {key: 'Enter'});

    expect(submit).not.toHaveBeenCalled();
  });

  it('ignores the Enter key press in edit mode when the text field is not valid', async () => {
    const submit = jest.fn();
    const hook = mockUseTodoListItem();
    useTodoListItemMock.mockImplementation(() => ({
      ...hook,
      dirty: true,
      fields: {text: {...hook.fields.text, error: 'error'}},
      isEditing: true,
      submit,
    }));
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    await wrapper.find('div')!.trigger('onKeyDown', {key: 'Enter'});

    expect(submit).not.toHaveBeenCalled();
  });

  it('disables edit mode for an existing item when the Escape key is pressed', async () => {
    const setIsEditing = jest.fn();
    useTodoListItemMock.mockImplementation(() => ({
      ...mockUseTodoListItem(),
      isEditing: true,
      setIsEditing,
    }));
    const mockProps = {
      ...defaultMockProps,
      item: {...defaultMockProps.item, text: 'existing'},
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    await wrapper.find('div')!.trigger('onKeyDown', {key: 'Escape'});

    expect(setIsEditing).toHaveBeenCalledTimes(1);
    expect(setIsEditing).toHaveBeenCalledWith(false);
  });

  it('removes a newly created item when the Escape key is pressed in edit mode', async () => {
    const setRemoving = jest.fn();
    const removePromise = Promise.resolve();
    const removeItem = jest.fn(() => removePromise);
    useTodoListItemMock.mockImplementation(() => ({
      ...mockUseTodoListItem(),
      isEditing: true,
      setRemoving,
    }));
    const mockProps = {
      ...defaultMockProps,
      item: {...defaultMockProps.item, text: ''},
      removeItem,
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    await wrapper.find('div')!.trigger('onKeyDown', {key: 'Escape'});
    await removePromise;

    expect(setRemoving).toHaveBeenCalledTimes(2);
    expect(setRemoving).toHaveBeenLastCalledWith(false);
    expect(removeItem).toHaveBeenCalledTimes(1);
  });

  it('ignores the Escape key press when not in edit mode', async () => {
    const setIsEditing = jest.fn();
    const setRemoving = jest.fn();
    useTodoListItemMock.mockImplementation(() => ({
      ...mockUseTodoListItem(),
      isEditing: false,
      setIsEditing,
      setRemoving,
    }));
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    await wrapper.find('div')!.trigger('onKeyDown', {key: 'Escape'});

    expect(setIsEditing).not.toHaveBeenCalled();
    expect(setRemoving).not.toHaveBeenCalled();
  });

  it('renders a <ResourceList.Item />', () => {
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);
    const {
      context: {i18n},
    } = wrapper;

    expect(wrapper).toContainReactComponent(ResourceList.Item, {
      id: mockProps.item.id,
      accessibilityLabel: i18n.translate('TodoListItem.accessibilityLabel'),
    });
  });

  it('toggles isCompleted when the <ResourceList.Item /> is clicked while not in edit mode', async () => {
    const togglePromise = Promise.resolve();
    const toggleComplete = jest.fn(() => togglePromise);
    const setToggling = jest.fn();
    useTodoListItemMock.mockImplementation(() => ({
      ...mockUseTodoListItem(),
      isEditing: false,
      setToggling,
    }));
    const mockProps = {
      ...defaultMockProps,
      toggleComplete,
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    await wrapper.find(ResourceList.Item)!.trigger('onClick');
    await togglePromise;

    expect(setToggling).toHaveBeenCalledTimes(2);
    expect(setToggling).toHaveBeenLastCalledWith(false);
    expect(toggleComplete).toHaveBeenCalledTimes(1);
  });

  it('sets a Toggle error for a thrown error when the <ResourceList.Item /> is clicked', async () => {
    const setError = jest.fn();
    useTodoListItemMock.mockImplementation(() => ({
      ...mockUseTodoListItem(),
      setError,
    }));
    const mockProps = {
      ...defaultMockProps,
      toggleComplete() {
        throw new Error();
      },
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    await wrapper.find(ResourceList.Item)!.trigger('onClick');

    expect(setError).toHaveBeenCalledTimes(1);
    expect(setError).toHaveBeenLastCalledWith(ErrorType.Toggle);
  });

  it('ignores <ResourceList.Item /> clicks while in edit mode', async () => {
    const togglePromise = Promise.resolve();
    const toggleComplete = jest.fn(() => togglePromise);
    const setToggling = jest.fn();
    useTodoListItemMock.mockImplementation(() => ({
      ...mockUseTodoListItem(),
      isEditing: true,
      setToggling,
    }));
    const mockProps = {
      ...defaultMockProps,
      toggleComplete,
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    await wrapper.find(ResourceList.Item)!.trigger('onClick');
    await togglePromise;

    expect(setToggling).not.toHaveBeenCalled();
    expect(toggleComplete).not.toHaveBeenCalled();
  });

  it('renders a <TextField /> in edit mode', () => {
    const hook = mockUseTodoListItem();
    useTodoListItemMock.mockImplementation(() => ({
      ...hook,
      isEditing: true,
    }));
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);
    const {
      context: {i18n},
    } = wrapper;

    expect(wrapper).toContainReactComponent(TextField, {
      autoFocus: true,
      disabled: false,
      label: '',
      placeholder: i18n.translate('TodoListItem.placeholder'),
      ...hook.fields.text,
    });
    expect(wrapper.find(TextField)).toContainReactComponent(Button, {
      disabled: true,
      loading: false,
      primary: true,
    });
    expect(wrapper.find(TextField)!.find(Button)).toContainReactText(
      i18n.translate('TodoListItem.save'),
    );
  });

  it('enables the save button when the text field is dirty', () => {
    useTodoListItemMock.mockImplementation(() => ({
      ...mockUseTodoListItem(),
      dirty: true,
      isEditing: true,
    }));
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    expect(wrapper.find(TextField)).toContainReactComponent(Button, {
      disabled: false,
    });
  });

  it('disables the save button if there are validation errors', () => {
    const hook = mockUseTodoListItem();
    useTodoListItemMock.mockImplementation(() => ({
      ...hook,
      dirty: true,
      fields: {
        text: {
          ...hook.fields.text,
          error: 'error',
        },
      },
      isEditing: true,
    }));
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    expect(wrapper.find(TextField)).toContainReactComponent(Button, {
      disabled: true,
    });
  });

  it('invokes submit when the save button is clicked', async () => {
    const submit = jest.fn();
    useTodoListItemMock.mockImplementation(() => ({
      ...mockUseTodoListItem(),
      dirty: true,
      isEditing: true,
      submit,
    }));
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    await wrapper
      .find(TextField)!
      .find(Button)!
      .trigger('onClick');

    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('renders an edit button while not in edit mode', () => {
    useTodoListItemMock.mockImplementation(() => ({
      ...mockUseTodoListItem(),
      isEditing: false,
    }));
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    expect(wrapper).toContainReactComponent(Button, {
      primary: true,
    });
    expect(wrapper.find(Button, {primary: true})).toContainReactComponent(
      Icon,
      {
        color: 'white',
        source: EditMajorTwotone,
      },
    );
  });

  it('renders a cancel button while in edit mode', () => {
    useTodoListItemMock.mockImplementation(() => ({
      ...mockUseTodoListItem(),
      isEditing: true,
    }));
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    expect(wrapper).toContainReactComponent(Button, {
      primary: false,
      icon: 'cancel',
    });
  });

  it('enables edit mode when the edit button is clicked', () => {
    const setIsEditing = jest.fn();
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    };
    useTodoListItemMock.mockImplementation(() => ({
      ...mockUseTodoListItem(),
      isEditing: false,
      setIsEditing,
    }));
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    wrapper.find(Button, {primary: true})!.trigger<any>('onClick', event);

    expect(setIsEditing).toHaveBeenCalledTimes(1);
    expect(setIsEditing).toHaveBeenCalledWith(true);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(event.stopPropagation).toHaveBeenCalledTimes(1);
  });

  it('disables edit mode when the cancel button is clicked for an existing item', () => {
    const setIsEditing = jest.fn();
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    };
    useTodoListItemMock.mockImplementation(() => ({
      ...mockUseTodoListItem(),
      isEditing: true,
      setIsEditing,
    }));
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    wrapper
      .find(Button, {primary: false, icon: 'cancel'})!
      .trigger<any>('onClick', event);

    expect(setIsEditing).toHaveBeenCalledTimes(1);
    expect(setIsEditing).toHaveBeenCalledWith(false);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(event.stopPropagation).toHaveBeenCalledTimes(1);
  });

  it('removes a new item when the cancel button is clicked', async () => {
    const removePromise = Promise.resolve();
    const removeItem = jest.fn(() => removePromise);
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    };
    const mock = mockUseTodoListItem();
    useTodoListItemMock.mockImplementation(() => ({
      ...mock,
      fields: {
        text: {
          ...mock.fields.text,
          defaultValue: '',
          value: '',
        },
      },
      isEditing: true,
    }));
    const mockProps = {
      ...defaultMockProps,
      item: {
        id: '1',
        isComplete: false,
        text: '',
      },
      removeItem,
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    await wrapper
      .find(Button, {primary: false, icon: 'cancel'})!
      .trigger<any>('onClick', event);
    await removePromise;

    expect(removeItem).toHaveBeenCalledTimes(1);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(event.stopPropagation).toHaveBeenCalledTimes(1);
  });

  it('renders a remove button', () => {
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    expect(wrapper).toContainReactComponent(Button, {
      loading: false,
      destructive: true,
      icon: 'delete',
    });
  });

  it('invokes removeItem when the remove button is clicked', async () => {
    const removePromise = Promise.resolve();
    const removeItem = jest.fn(() => removePromise);
    const setRemoving = jest.fn();
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    };
    useTodoListItemMock.mockImplementation(() => ({
      ...mockUseTodoListItem(),
      setRemoving,
    }));
    const mockProps = {
      ...defaultMockProps,
      removeItem,
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    await wrapper
      .find(Button, {destructive: true, icon: 'delete'})!
      .trigger<any>('onClick', event);
    await removePromise;

    expect(setRemoving).toHaveBeenCalledTimes(2);
    expect(setRemoving).toHaveBeenLastCalledWith(false);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(event.stopPropagation).toHaveBeenCalledTimes(1);
    expect(removeItem).toHaveBeenCalledTimes(1);
  });

  it('sets a Remove error for a thrown error when the remove button is clicked', async () => {
    const setError = jest.fn();
    useTodoListItemMock.mockImplementation(() => ({
      ...mockUseTodoListItem(),
      setError,
    }));
    const mockProps = {
      ...defaultMockProps,
      removeItem() {
        throw new Error();
      },
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    await wrapper
      .find(Button, {destructive: true, icon: 'delete'})!
      .trigger<any>('onClick');

    expect(setError).toHaveBeenCalledTimes(1);
    expect(setError).toHaveBeenLastCalledWith(ErrorType.Remove);
  });

  it('renders a <Spinner /> while toggling', () => {
    useTodoListItemMock.mockImplementation(() => ({
      ...mockUseTodoListItem(),
      toggling: true,
    }));
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    expect(wrapper).toContainReactComponent(Spinner, {
      size: 'small',
    });
  });

  it('renders a green CircleTick icon when completed', () => {
    const mockProps = {
      ...defaultMockProps,
      item: {
        ...defaultMockProps.item,
        isComplete: true,
      },
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    expect(
      wrapper.findAll(Icon, {color: 'green', source: CircleTickMajorTwotone}),
    ).toHaveLength(1);
  });

  it('renders a black CircleDots icon when not completed', () => {
    const mockProps = {
      ...defaultMockProps,
      item: {
        ...defaultMockProps.item,
        isComplete: false,
      },
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);

    expect(
      wrapper.findAll(Icon, {color: 'black', source: CircleDotsMajorTwotone}),
    ).toHaveLength(1);
  });

  it('renders a <Toast /> when there is an error', () => {
    const error = ErrorType.Toggle;
    useTodoListItemMock.mockImplementation(() => ({
      ...mockUseTodoListItem(),
      error,
    }));
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);
    const {
      context: {i18n},
    } = wrapper;

    expect(wrapper).toContainReactComponent(Toast, {
      content: i18n.translate(`TodoListItem.error.${error}`),
      error: true,
    });
  });

  it('clears the error when the <Toast /> is dismissed', () => {
    const setError = jest.fn();
    useTodoListItemMock.mockImplementation(() => ({
      ...mockUseTodoListItem(),
      error: ErrorType.Toggle,
      setError,
    }));
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TodoListItem {...mockProps} />);
    wrapper.find(Toast)!.trigger('onDismiss');

    expect(setError).toHaveBeenCalledTimes(1);
    expect(setError).toHaveBeenCalledWith(null);
  });
});

describe('errorableAction()', () => {
  it('calls setInvoking with true before calling the action', () => {
    const setInvoking = jest.fn();

    errorableAction(
      {current: true},
      ErrorType.Toggle,
      () => {},
      setInvoking,
      noopPromise,
    );

    expect(setInvoking).toHaveBeenCalledTimes(1);
    expect(setInvoking).toHaveBeenCalledWith(true);
  });

  it('invokes the action', () => {
    const action = jest.fn(noopPromise);

    errorableAction(
      {current: true},
      ErrorType.Toggle,
      () => {},
      () => {},
      action,
    );

    expect(action).toHaveBeenCalledTimes(1);
  });

  it('calls setInvoking with false after calling the action when isMounted is true', async () => {
    const setInvoking = jest.fn();

    await errorableAction(
      {current: true},
      ErrorType.Toggle,
      () => {},
      setInvoking,
      noopPromise,
    );

    expect(setInvoking).toHaveBeenCalledTimes(2);
    expect(setInvoking).toHaveBeenLastCalledWith(false);
  });

  it('calls setError when the action throws', async () => {
    const errorType = ErrorType.Toggle;
    const setError = jest.fn();

    await errorableAction(
      {current: true},
      errorType,
      setError,
      () => {},
      () => {
        throw new Error();
      },
    );

    expect(setError).toHaveBeenCalledTimes(1);
    expect(setError).toHaveBeenLastCalledWith(errorType);
  });

  it('omits calling setInvoking with false after callign the action when isMounted is false', async () => {
    const setInvoking = jest.fn();

    await errorableAction(
      {current: false},
      ErrorType.Toggle,
      () => {},
      setInvoking,
      noopPromise,
    );

    expect(setInvoking).toHaveBeenCalledTimes(1);
  });
});

describe('preventToggleEvent()', () => {
  it('prevents a toggle by calling preventDefault and stopPropagation on the event', () => {
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    };

    preventToggleEvent(event as any);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(event.stopPropagation).toHaveBeenCalledTimes(1);
  });
});
