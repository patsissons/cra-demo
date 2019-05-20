import * as React from 'react';

import {TodoItem} from 'models';
import {TodoItemDataSourceType, TodoListService} from 'services';
import {TodoItemCreateInput} from 'services/TodoItemService/DataSources';

export interface WithTodoListDataProps {
  items?: TodoItem[];
  create(): Promise<TodoItem>;
  remove(item: TodoItem): Promise<TodoItem>;
  update(item: TodoItem): Promise<TodoItem>;
}

export function withTodoListData(type?: TodoItemDataSourceType) {
  const todoListService = new TodoListService(type);

  return function addTodoListData<Props extends WithTodoListDataProps>(
    Component: React.ComponentType<Props>,
  ) {
    interface State {
      items?: TodoItem[];
    }

    class WithTodoListData extends React.PureComponent<{}, State> {
      state: State = {};

      create = async (item?: TodoItemCreateInput) => {
        const result = await todoListService.create(item);

        await this.refetch();

        return result;
      };

      remove = async (item: TodoItem) => {
        const result = await todoListService.remove(item);

        await this.refetch();

        return result;
      };

      update = async (item: TodoItem) => {
        const result = await todoListService.update(item);

        await this.refetch();

        return result;
      };

      async refetch() {
        const items = await todoListService.fetch();

        this.setState({items});
      }

      componentDidMount() {
        return this.refetch();
      }

      render() {
        const {items} = this.state;

        return (
          <Component
            create={this.create}
            items={items}
            remove={this.remove}
            update={this.update}
            {...this.props}
          />
        );
      }
    }

    return WithTodoListData;
  };
}
