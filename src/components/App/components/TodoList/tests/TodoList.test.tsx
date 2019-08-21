import React, {ComponentPropsWithoutRef} from 'react';
import {ResourceList} from '@shopify/polaris';
import {mountWithContext, noopPromise} from 'tests/utilities';
import {TodoListItem} from '../components';
import {TodoList} from '../TodoList';

describe('<TodoList />', () => {
  const defaultMockProps: ComponentPropsWithoutRef<typeof TodoList> = {
    items: [],
    remove: noopPromise,
    update: noopPromise,
  };

  it('renders a ResourceList', () => {
    const mockProps = {
      ...defaultMockProps,
    };
    const wrapper = mountWithContext(<TodoList {...mockProps} />);
    const {
      context: {i18n},
    } = wrapper;

    expect(wrapper).toContainReactComponent(ResourceList, {
      resourceName: {
        plural: i18n.translate('TodoList.resourceNames.plural'),
        singular: i18n.translate('TodoList.resourceNames.singular'),
      },
      items: mockProps.items,
    });
  });

  it('renders a <TodoListItem /> for each item', () => {
    const mockProps = {
      ...defaultMockProps,
      items: [
        {id: '1', isComplete: true, text: 'complete'},
        {id: '2', isComplete: false, text: 'incomplete'},
      ],
    };
    const wrapper = mountWithContext(<TodoList {...mockProps} />);

    expect(wrapper.findAll(TodoListItem)).toHaveLength(mockProps.items.length);
    expect(wrapper.findAll(TodoListItem)[0]).toHaveReactProps({
      item: mockProps.items[0],
    });
    expect(wrapper.findAll(TodoListItem)[1]).toHaveReactProps({
      item: mockProps.items[1],
    });
  });

  it('calls remove with the bound item when TodoListItem.removeItem is invoked', async () => {
    const mockProps = {
      ...defaultMockProps,
      items: [{id: '1', isComplete: true, text: 'complete'}],
      remove: jest.fn(noopPromise),
    };
    const wrapper = mountWithContext(<TodoList {...mockProps} />);
    await wrapper.find(TodoListItem)!.trigger('removeItem');

    expect(mockProps.remove).toHaveBeenCalledTimes(1);
    expect(mockProps.remove).toHaveBeenCalledWith(mockProps.items[0]);
  });

  it('calls update with the bound item having isComplete toggled when TodoListItem.toggleComplete is invoked', async () => {
    const mockProps = {
      ...defaultMockProps,
      items: [{id: '1', isComplete: true, text: 'complete'}],
      update: jest.fn(noopPromise),
    };
    const wrapper = mountWithContext(<TodoList {...mockProps} />);
    await wrapper.find(TodoListItem)!.trigger('toggleComplete');

    expect(mockProps.update).toHaveBeenCalledTimes(1);
    expect(mockProps.update).toHaveBeenCalledWith({
      ...mockProps.items[0],
      isComplete: !mockProps.items[0].isComplete,
    });
  });

  it('calls update with the bound item having the passed in updated text when TodoListItem.updateText is invoked', async () => {
    const mockProps = {
      ...defaultMockProps,
      items: [{id: '1', isComplete: true, text: 'complete'}],
      update: jest.fn(noopPromise),
    };
    const updatedText = 'updated';
    const wrapper = mountWithContext(<TodoList {...mockProps} />);
    await wrapper.find(TodoListItem)!.trigger('updateText', updatedText);

    expect(mockProps.update).toHaveBeenCalledTimes(1);
    expect(mockProps.update).toHaveBeenCalledWith({
      ...mockProps.items[0],
      text: updatedText,
    });
  });
});
