import React from 'react';
import {ResourceList} from '@shopify/polaris';
import {useI18n} from '@shopify/react-i18n';
import {TodoItem} from 'models';
import {TodoListItem} from './components';

interface Props {
  items: TodoItem[];
  remove(item: TodoItem): Promise<unknown>;
  update(item: TodoItem): Promise<unknown>;
}

export function TodoList({items, remove, update}: Props) {
  const [i18n] = useI18n();

  return (
    <ResourceList
      resourceName={{
        plural: i18n.translate('TodoList.resourceNames.plural'),
        singular: i18n.translate('TodoList.resourceNames.singular'),
      }}
      items={items}
      renderItem={renderItem}
    />
  );

  function renderItem(item: TodoItem) {
    function toggleComplete() {
      return update({...item, isComplete: !item.isComplete});
    }

    function updateText(text: string) {
      return update({...item, text});
    }

    function removeItem() {
      return remove(item);
    }

    return (
      <TodoListItem
        item={item}
        removeItem={removeItem}
        toggleComplete={toggleComplete}
        updateText={updateText}
      />
    );
  }
}
