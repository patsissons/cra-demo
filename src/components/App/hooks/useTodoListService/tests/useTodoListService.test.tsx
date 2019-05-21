import React from 'react';
import {
  asapPromise,
  HookPropsContainer,
  HookWrapper,
  mountWithContextAsync,
  noopPromise,
} from 'tests/utilities';
import {
  createDataSource,
  Type,
  useTodoListService,
} from '../useTodoListService';

jest.mock(
  'services/TodoItemService/EphemeralDataSource/EphemeralDataSource',
  () => ({
    ...require.requireActual(
      'services/TodoItemService/EphemeralDataSource/EphemeralDataSource',
    ),
    EphemeralDataSource: jest.fn(),
  }),
);

const EphemeralDataSourceMock: jest.Mock = require.requireMock(
  'services/TodoItemService/EphemeralDataSource/EphemeralDataSource',
).EphemeralDataSource;

function mockEphemeralDataSource() {
  return {
    create() {
      return Promise.resolve([]);
    },
    fetch() {
      return Promise.resolve([]);
    },
    remove() {
      return Promise.resolve([]);
    },
    update() {
      return Promise.resolve([]);
    },
  };
}

describe('useTodoListService()', () => {
  beforeEach(() => {
    EphemeralDataSourceMock.mockReset();
    EphemeralDataSourceMock.mockImplementation(mockEphemeralDataSource);
  });

  it('defaults to Type.Ephemeral', async () => {
    await mountWithContextAsync(<HookWrapper hook={useTodoListService} />);

    expect(EphemeralDataSourceMock).toHaveBeenCalledTimes(1);
  });

  it('is initialized with loading set to true and an empty items array', async () => {
    const wrapper = await mountWithContextAsync(
      <HookWrapper hook={useTodoListService} />,
    );

    expect(wrapper).toContainReactComponent(HookPropsContainer, {
      loading: true,
      items: [],
    });
  });

  it('calls fetch on the data source during initialization', async () => {
    const fetch = jest.fn(noopPromise);
    EphemeralDataSourceMock.mockImplementation(() => ({
      ...mockEphemeralDataSource(),
      fetch,
    }));

    await mountWithContextAsync(<HookWrapper hook={useTodoListService} />);

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('updates items with the results of the initial fetch', async () => {
    const items = [{id: '1', isComplete: false, text: 'test'}];
    const fetch = jest.fn(() => Promise.resolve(items));
    EphemeralDataSourceMock.mockImplementation(() => ({
      ...mockEphemeralDataSource(),
      fetch,
    }));

    const wrapper = await mountWithContextAsync(
      <HookWrapper hook={useTodoListService} />,
    );

    await wrapper.act(asapPromise);

    expect(wrapper).toContainReactComponent(HookPropsContainer, {
      items,
    });
  });

  it('resets loading to false once the initial fetch is complete', async () => {
    const wrapper = await mountWithContextAsync(
      <HookWrapper hook={useTodoListService} />,
    );

    await wrapper.act(asapPromise);

    expect(wrapper).toContainReactComponent(HookPropsContainer, {
      loading: false,
    });
  });

  it('calls create on the data source with provided args when create is invoked', async () => {
    const args = {text: 'testing'};
    const create = jest.fn(noopPromise);
    EphemeralDataSourceMock.mockImplementation(() => ({
      ...mockEphemeralDataSource(),
      create,
    }));

    const wrapper = await mountWithContextAsync(
      <HookWrapper hook={useTodoListService} />,
    );
    await wrapper.find(HookPropsContainer)!.trigger('create', args);

    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith(args);
  });

  it('calls remove on the data source with the provided item when remove is invoked', async () => {
    const item = {id: '1', isComplete: false, text: 'testing'};
    const remove = jest.fn(noopPromise);
    EphemeralDataSourceMock.mockImplementation(() => ({
      ...mockEphemeralDataSource(),
      remove,
    }));

    const wrapper = await mountWithContextAsync(
      <HookWrapper hook={useTodoListService} />,
    );
    await wrapper.find(HookPropsContainer)!.trigger('remove', item);

    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledWith(item);
  });

  it('calls update on the data source with the provided item when update is invoked', async () => {
    const item = {id: '1', isComplete: false, text: 'testing'};
    const update = jest.fn(noopPromise);
    EphemeralDataSourceMock.mockImplementation(() => ({
      ...mockEphemeralDataSource(),
      update,
    }));

    const wrapper = await mountWithContextAsync(
      <HookWrapper hook={useTodoListService} />,
    );
    await wrapper.find(HookPropsContainer)!.trigger('update', item);

    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith(item);
  });
});

describe('createDataSource()', () => {
  beforeEach(() => {
    EphemeralDataSourceMock.mockReset();
    EphemeralDataSourceMock.mockImplementation(mockEphemeralDataSource);
  });

  it('creates an EphemeralDataSource for Type.Ephemeral with the provided params', () => {
    const params = {};

    createDataSource(Type.Ephemeral, params);

    expect(EphemeralDataSourceMock).toHaveBeenCalledTimes(1);
    expect(EphemeralDataSourceMock).toHaveBeenCalledWith(params);
  });
});
