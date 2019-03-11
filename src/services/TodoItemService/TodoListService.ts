import {TodoItem} from 'src/models';
import {
  EphemeralDataSource,
  TodoItemCreateInput,
  TodoItemDataSource,
} from './DataSources';

export enum TodoItemDataSourceType {
  Ephemeral,
}

export class TodoListService {
  private readonly source: TodoItemDataSource;

  constructor(type = TodoItemDataSourceType.Ephemeral) {
    this.source = createDataSource(type);
  }

  create(item?: TodoItemCreateInput) {
    return this.source.create(item);
  }

  remove(item: TodoItem) {
    return this.source.remove(item);
  }

  fetch() {
    return this.source.fetch();
  }

  update(item: TodoItem) {
    return this.source.update(item);
  }
}

export function createDataSource(
  type?: TodoItemDataSourceType,
): TodoItemDataSource {
  switch (type) {
    default:
      return new EphemeralDataSource();
  }
}
