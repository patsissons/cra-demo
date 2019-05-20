import {TodoItem} from 'models';

export interface TodoItemCreateInput {
  text?: string;
}

export interface TodoItemDataSource {
  create(item?: TodoItemCreateInput): Promise<TodoItem>;
  fetch(): Promise<TodoItem[]>;
  remove(item: TodoItem): Promise<TodoItem>;
  update(item: TodoItem): Promise<TodoItem>;
}
