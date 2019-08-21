import React from 'react';
import {
  Button,
  Card,
  FooterHelp,
  Link,
  Page,
  SkeletonPage,
  Toast,
} from '@shopify/polaris';
import {mountWithContext, noopPromise} from 'tests/utilities';
import {App} from '../App';
import {TodoList} from '../components';

jest.mock('../hooks/useTodoListService/useTodoListService', () => ({
  ...require.requireActual('../hooks/useTodoListService/useTodoListService'),
  useTodoListService: jest.fn(),
}));

const useTodoListServiceMock: jest.Mock = require.requireMock(
  '../hooks/useTodoListService/useTodoListService',
).useTodoListService;

function mockUseTodoListService() {
  return {
    items: [],
    loading: false,
    create: noopPromise,
    remove: noopPromise,
    update: noopPromise,
  };
}

describe('<App />', () => {
  const mockItems = [
    {id: '1', isComplete: true, text: 'first'},
    {id: '2', isComplete: false, text: 'second'},
  ];

  beforeEach(() => {
    useTodoListServiceMock.mockReset();
    useTodoListServiceMock.mockImplementation(mockUseTodoListService);
  });

  it('renders a SkeletonPage while loading', () => {
    useTodoListServiceMock.mockImplementation(() => ({
      ...mockUseTodoListService(),
      loading: true,
    }));
    const wrapper = mountWithContext(<App />);
    const {
      context: {i18n},
    } = wrapper;

    expect(wrapper).toContainReactComponent(SkeletonPage, {
      primaryAction: true,
      title: i18n.translate('App.title'),
    });
  });

  it('renders the todo list in a card on a page', () => {
    const items = mockItems;
    const remove = noopPromise;
    const update = noopPromise;
    useTodoListServiceMock.mockImplementation(() => ({
      ...mockUseTodoListService(),
      items,
      loading: false,
      remove,
      update,
    }));
    const wrapper = mountWithContext(<App />);
    const {
      context: {i18n},
    } = wrapper;

    expect(wrapper).toContainReactComponent(Page, {
      primaryAction: expect.objectContaining({
        content: i18n.translate('App.create'),
        loading: false,
      }),
      title: i18n.translate('App.title'),
    });
    expect(wrapper.findAll(Page)).toHaveLength(1);
    expect(wrapper.find(Page)).toContainReactComponent(Card);
    expect(wrapper.findAll(Card)).toHaveLength(1);
    expect(wrapper.find(Card)).toContainReactComponent(TodoList, {
      items,
      remove,
      update,
    });
    expect(wrapper.findAll(TodoList)).toHaveLength(1);
    expect(wrapper.find(Page)).toContainReactComponent(FooterHelp);
    expect(wrapper.findAll(FooterHelp)).toHaveLength(1);
    expect(wrapper.find(FooterHelp)).toContainReactComponent(Link, {
      url: 'https://polaris.shopify.com',
    });
    expect(wrapper.find(FooterHelp)).toContainReactText(
      i18n.translate('App.footer', {
        polarisLink: i18n.translate('App.polarisLink'),
      }),
    );
  });

  it('invokes the service create function when the primary action is clicked', async () => {
    const create = jest.fn(noopPromise);
    useTodoListServiceMock.mockImplementation(() => ({
      ...mockUseTodoListService(),
      create,
      loading: false,
    }));
    const wrapper = mountWithContext(<App />);

    await wrapper
      .find(Page)!
      .find(Button)!
      .trigger('onClick');

    expect(create).toHaveBeenCalledTimes(1);
  });

  it('renders a <Toast /> when create throws', async () => {
    useTodoListServiceMock.mockImplementation(() => ({
      ...mockUseTodoListService(),
      create() {
        throw new Error();
      },
      loading: false,
    }));
    const wrapper = mountWithContext(<App />);
    const {
      context: {i18n},
    } = wrapper;

    await wrapper
      .find(Page)!
      .find(Button)!
      .trigger('onClick');

    expect(wrapper).toContainReactComponent(Toast, {
      content: i18n.translate(`App.error`),
      error: true,
    });
  });

  it('removes <Toast /> when dismissed', async () => {
    useTodoListServiceMock.mockImplementation(() => ({
      ...mockUseTodoListService(),
      create() {
        throw new Error();
      },
      loading: false,
    }));
    const wrapper = mountWithContext(<App />);

    await wrapper
      .find(Page)!
      .find(Button)!
      .trigger('onClick');
    wrapper.find(Toast)!.trigger('onDismiss');

    expect(wrapper).not.toContainReactComponent(Toast);
  });
});
