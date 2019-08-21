import React from 'react';
import {useI18n} from '@shopify/react-i18n';
import {TodoItem} from 'models';
import {
  HookPropsContainer,
  HookWrapper,
  mountWithContext,
  noopPromise,
} from 'tests/utilities';
import {ErrorType, useTodoListItem} from '../useTodoListItem';

describe('useTodoListItem()', () => {
  interface Props {
    item: TodoItem;
    updateText(text: string): Promise<unknown>;
  }

  function TestWrapper({item, updateText}: Props) {
    const [i18n] = useI18n();

    return (
      <HookWrapper hook={useTodoListItem} args={[i18n, item, updateText]} />
    );
  }

  const defaultMockProps: Props = {
    item: {id: '1', isComplete: false, text: 'testing'},
    updateText: noopPromise,
  };

  it('defaults isEditing to false', () => {
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TestWrapper {...mockProps} />);

    expect(wrapper).toContainReactComponent(HookPropsContainer, {
      isEditing: false,
    });
  });

  it('defaults removing to false', () => {
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TestWrapper {...mockProps} />);

    expect(wrapper).toContainReactComponent(HookPropsContainer, {
      removing: false,
    });
  });

  it('defaults toggling to false', () => {
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TestWrapper {...mockProps} />);

    expect(wrapper).toContainReactComponent(HookPropsContainer, {
      toggling: false,
    });
  });

  it('defaults error to undefined', () => {
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TestWrapper {...mockProps} />);

    expect(wrapper).toContainReactComponent(HookPropsContainer, {
      error: undefined,
    });
  });

  it('defaults the text field to empty when not editing', () => {
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TestWrapper {...mockProps} />);

    expect(wrapper).toContainReactComponent(HookPropsContainer, {
      fields: {text: expect.objectContaining({value: ''})},
    });
  });

  it('produces an error when empty text is validated', () => {
    const mockProps = {
      ...defaultMockProps,
      item: {...defaultMockProps.item, text: ''},
    };
    const wrapper = mountWithContext(<TestWrapper {...mockProps} />);
    const {
      context: {i18n},
    } = wrapper;

    wrapper.act(() => {
      wrapper
        .find(HookPropsContainer)!
        .triggerKeypath('fields.text.onChange', '');
    });
    wrapper.act(() => {
      wrapper
        .find(HookPropsContainer)!
        .triggerKeypath('fields.text.runValidation');
    });

    expect(wrapper).toContainReactComponent(HookPropsContainer, {
      fields: {
        text: expect.objectContaining({
          error: i18n.translate('useTodoListItem.validation.empty'),
        }),
      },
    });
  });

  it('produces an error when whitespace only text is validated', () => {
    const mockProps = {
      ...defaultMockProps,
      item: {...defaultMockProps.item, text: ''},
    };
    const wrapper = mountWithContext(<TestWrapper {...mockProps} />);
    const {
      context: {i18n},
    } = wrapper;

    wrapper.act(() => {
      wrapper
        .find(HookPropsContainer)!
        .triggerKeypath('fields.text.onChange', '    ');
    });
    wrapper.act(() => {
      wrapper
        .find(HookPropsContainer)!
        .triggerKeypath('fields.text.runValidation');
    });

    expect(wrapper).toContainReactComponent(HookPropsContainer, {
      fields: {
        text: expect.objectContaining({
          error: i18n.translate('useTodoListItem.validation.empty'),
        }),
      },
    });
  });

  it('produces an error when "error" text is validated', () => {
    const mockProps = {
      ...defaultMockProps,
      item: {...defaultMockProps.item, text: ''},
    };
    const wrapper = mountWithContext(<TestWrapper {...mockProps} />);
    const {
      context: {i18n},
    } = wrapper;

    wrapper.act(() => {
      wrapper
        .find(HookPropsContainer)!
        .triggerKeypath('fields.text.onChange', 'error');
    });
    wrapper.act(() => {
      wrapper
        .find(HookPropsContainer)!
        .triggerKeypath('fields.text.runValidation');
    });

    expect(wrapper).toContainReactComponent(HookPropsContainer, {
      fields: {
        text: expect.objectContaining({
          error: i18n.translate('useTodoListItem.validation.error'),
        }),
      },
    });
  });

  it('invokes updateText when submit is called', async () => {
    const updatePromise = Promise.resolve();
    const updateText = jest.fn(() => updatePromise);
    const mockProps = {
      ...defaultMockProps,
      updateText,
    };
    const wrapper = mountWithContext(<TestWrapper {...mockProps} />);

    wrapper.act(() => {
      wrapper
        .find(HookPropsContainer)!
        .triggerKeypath('fields.text.onChange', 'updated');
    });
    await wrapper.find(HookPropsContainer)!.trigger('submit');
    await updatePromise;

    expect(updateText).toHaveBeenCalledTimes(1);
  });

  it('disables edit mode when submit is successful', async () => {
    const updatePromise = Promise.resolve();
    const updateText = jest.fn(() => updatePromise);
    const mockProps = {
      ...defaultMockProps,
      updateText,
    };
    const wrapper = mountWithContext(<TestWrapper {...mockProps} />);

    wrapper.act(() => {
      wrapper
        .find(HookPropsContainer)!
        .triggerKeypath('fields.text.onChange', 'updated');
    });
    await wrapper.find(HookPropsContainer)!.trigger('submit');
    await updatePromise;

    expect(wrapper).toContainReactComponent(HookPropsContainer, {
      isEditing: false,
    });
  });

  it('resets the text field when submit is successful', async () => {
    const updatePromise = Promise.resolve();
    const updateText = jest.fn(() => updatePromise);
    const mockProps = {
      ...defaultMockProps,
      updateText,
    };
    const wrapper = mountWithContext(<TestWrapper {...mockProps} />);

    wrapper.act(() => {
      wrapper
        .find(HookPropsContainer)!
        .triggerKeypath('fields.text.onChange', 'updated');
    });
    await wrapper.find(HookPropsContainer)!.trigger('submit');
    await updatePromise;

    expect(wrapper).toContainReactComponent(HookPropsContainer, {
      fields: {text: expect.objectContaining({value: ''})},
    });
  });

  it('sets a Save error when submit is not successful', async () => {
    const updateText = jest.fn(() => {
      throw new Error();
    });
    const mockProps = {
      ...defaultMockProps,
      updateText,
    };
    const wrapper = mountWithContext(<TestWrapper {...mockProps} />);

    wrapper.act(() => {
      wrapper
        .find(HookPropsContainer)!
        .triggerKeypath('fields.text.onChange', 'updated');
    });
    await wrapper.find(HookPropsContainer)!.trigger('submit');

    expect(wrapper).toContainReactComponent(HookPropsContainer, {
      error: ErrorType.Save,
    });
  });

  it('enables edit mode automatically if the text is empty', () => {
    const mockProps = {
      ...defaultMockProps,
      item: {...defaultMockProps.item, text: ''},
    };
    const wrapper = mountWithContext(<TestWrapper {...mockProps} />);

    expect(wrapper).toContainReactComponent(HookPropsContainer, {
      isEditing: true,
    });
  });
});
