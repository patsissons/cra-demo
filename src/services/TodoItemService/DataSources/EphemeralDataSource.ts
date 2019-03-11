import {TodoItem} from 'src/models';
import {TodoItemCreateInput, TodoItemDataSource} from './TodoItemDataSource';

export class EphemeralDataSource implements TodoItemDataSource {
  private nextId = 1;
  private readonly itemMap = new Map<string, TodoItem>();

  constructor(
    items: Partial<TodoItem>[] = [
      {isComplete: true, text: 'something'},
      {text: 'Another thing'},
    ],
  ) {
    items.forEach((item) => this.create(item));
  }

  create(input: TodoItemCreateInput = {}): Promise<TodoItem> {
    const item = {
      id: `${this.nextId++}`,
      isComplete: false,
      text: '',
      ...input,
    };

    this.itemMap.set(item.id, item);

    return Promise.resolve(item);
  }

  fetch() {
    return Promise.resolve(Array.from(this.itemMap.values()));
  }

  remove(item: TodoItem) {
    this.itemMap.delete(item.id);

    return Promise.resolve(item);
  }

  update(item: TodoItem) {
    if (this.itemMap.has(item.id)) {
      this.itemMap.set(item.id, item);

      return Promise.resolve(item);
    }

    return Promise.reject(new Error('Invalid item id'));
  }
}
