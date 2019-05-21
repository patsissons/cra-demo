import {TodoItem} from 'models';

export interface CreateInput {
  text?: string;
}

export interface DataSource {
  create(item?: CreateInput): Promise<TodoItem[]>;
  fetch(): Promise<TodoItem[]>;
  remove(item: TodoItem): Promise<TodoItem[]>;
  update(item: TodoItem): Promise<TodoItem[]>;
}
