import React, {useCallback} from 'react';
import {ResourceList} from '@shopify/polaris';
import {useI18n} from '@shopify/react-i18n';
import {TodoItem} from 'models';
import {TodoListItem} from './components';

export interface Props {
  items: TodoItem[];
  remove(item: TodoItem): Promise<any>;
  update(item: TodoItem): Promise<any>;
}

export default function TodoList({items, remove, update}: Props) {
  const [i18n] = useI18n();
  const renderItem = useCallback(
    (item: TodoItem) => {
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
    },
    [remove, update],
  );

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
}
