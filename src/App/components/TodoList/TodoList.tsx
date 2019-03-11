import * as React from 'react';

import {ResourceList} from '@shopify/polaris';
import {withI18n, WithI18nProps} from '@shopify/react-i18n';
import {compose} from 'recompose';

import {TodoItem} from 'src/models';
import {TodoListItem} from './components';

export interface Props {
  items: TodoItem[];
  remove(item: TodoItem): Promise<any>;
  update(item: TodoItem): Promise<any>;
}

type ComposedProps = Props & WithI18nProps;

export class TodoList extends React.PureComponent<ComposedProps> {
  renderItem = (item: TodoItem) => {
    const {remove, update} = this.props;

    const toggleComplete = () => {
      return update({...item, isComplete: !item.isComplete});
    };

    const updateText = (text: string) => {
      return update({...item, text});
    };

    const removeItem = () => {
      return remove(item);
    };

    return (
      <TodoListItem
        removeItem={removeItem}
        item={item}
        toggleComplete={toggleComplete}
        updateText={updateText}
      />
    );
  };

  render() {
    const {i18n, items} = this.props;

    return (
      <ResourceList
        resourceName={{
          plural: i18n.translate('TodoList.resourceNames.plural'),
          singular: i18n.translate('TodoList.resourceNames.singular'),
        }}
        items={items}
        renderItem={this.renderItem}
      />
    );
  }
}

export default compose<ComposedProps, Props>(withI18n())(TodoList);
