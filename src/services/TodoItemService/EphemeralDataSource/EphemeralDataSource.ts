import {TodoItem} from 'models';
import {CreateInput, DataSource} from '../DataSource';

interface Params {
  items?: Partial<TodoItem>[];
  simulatedLatency?: number;
}

export class EphemeralDataSource implements DataSource {
  private currentId = 1;
  private readonly itemMap = new Map<string, TodoItem>();
  private readonly simulatedLatency: number | undefined;

  constructor({items, simulatedLatency}: Params = {}) {
    this.simulatedLatency = simulatedLatency;
    (
      items || [{isComplete: true, text: 'something'}, {text: 'Another thing'}]
    ).forEach((item) => this.create(item));
  }

  create(input: CreateInput = {}): Promise<TodoItem[]> {
    const id = this.nextId();

    this.itemMap.set(id, {
      id: String(id),
      isComplete: false,
      text: '',
      ...input,
    });

    return this.fetch();
  }

  async fetch() {
    /* istanbul ignore if */
    if (this.simulatedLatency) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.simulatedLatency),
      );
    }

    return this.items;
  }

  remove(item: TodoItem) {
    this.itemMap.delete(item.id);

    return this.fetch();
  }

  update(item: TodoItem) {
    if (this.itemMap.has(item.id)) {
      this.itemMap.set(item.id, item);
    }

    return this.fetch();
  }

  private get items() {
    return Array.from(this.itemMap.values());
  }

  private nextId() {
    return String(this.currentId++);
  }
}
