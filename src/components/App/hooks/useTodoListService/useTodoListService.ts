import {useDebugValue, useEffect, useMemo, useState} from 'react';

import {TodoItem} from 'models';
import {
  CreateInput,
  DataSource,
  EphemeralDataSource,
} from 'services/TodoItemService';

export enum Type {
  Ephemeral,
}

export interface Options {
  type?: Type;
  params?: {};
}

export function useTodoListService({
  type = Type.Ephemeral,
  params,
}: Options = {}) {
  const dataSource = useMemo(() => createDataSource(type, params), [
    type,
    params,
  ]);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<TodoItem[]>([]);
  useDebugValue(`Todo Items (${items.length})`);

  useEffect(() => {
    const fetchItems = async () => {
      setItems(await dataSource.fetch());
      setLoading(false);
    };

    fetchItems();
  }, [dataSource]);

  return {
    items,
    loading,
    create: async (itemInput?: CreateInput) => {
      setItems(await dataSource.create(itemInput));
    },
    remove: async (item: TodoItem) => {
      setItems(await dataSource.remove(item));
    },
    update: async (item: TodoItem) => {
      setItems(await dataSource.update(item));
    },
  };
}

export function createDataSource(type: Type, params?: {}): DataSource {
  switch (type) {
    default:
      return new EphemeralDataSource(params);
  }
}
