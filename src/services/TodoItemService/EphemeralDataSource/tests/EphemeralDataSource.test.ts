import {EphemeralDataSource} from '../EphemeralDataSource';

describe('EphemeralDataSource', () => {
  it('initializes the data source with items', async () => {
    const items = [{}];
    const dataSource = new EphemeralDataSource({items});

    expect(await dataSource.fetch()).toHaveLength(items.length);
  });

  it('initializes the data source with sample items if none are supplied', async () => {
    const dataSource = new EphemeralDataSource();
    const items = await dataSource.fetch();

    expect(items.length).toBeGreaterThan(0);
  });

  it('can create an item', async () => {
    const dataSource = new EphemeralDataSource({items: []});

    expect(await dataSource.create()).toHaveLength(1);
  });

  it('can create a new item with custom text', async () => {
    const text = 'testing';
    const dataSource = new EphemeralDataSource({items: []});

    expect(await dataSource.create({text})).toMatchObject([{text}]);
  });

  it('returns existing items after creating a new item', async () => {
    const items = [{text: 'testing 1'}];
    const newItem = {text: 'testing 2'};
    const dataSource = new EphemeralDataSource({items});

    expect(await dataSource.create(newItem)).toMatchObject(
      items.concat(newItem),
    );
  });

  it('starts with id 1', async () => {
    const dataSource = new EphemeralDataSource({items: []});

    expect(await dataSource.create()).toMatchObject([{id: '1'}]);
  });

  it('creates new items with successive ids', async () => {
    const dataSource = new EphemeralDataSource({items: []});

    await dataSource.create();
    await dataSource.create();

    expect(await dataSource.fetch()).toMatchObject([{id: '1'}, {id: '2'}]);
  });

  it('creates items with isComplete set to false by default', async () => {
    const dataSource = new EphemeralDataSource({items: []});

    expect(await dataSource.create()).toMatchObject([{isComplete: false}]);
  });

  it('can fetch existing items', async () => {
    const items = [{text: 'a'}, {text: 'b'}];
    const dataSource = new EphemeralDataSource({items});

    expect(await dataSource.fetch()).toMatchObject(items);
  });

  it('can remove an existing item', async () => {
    const items = [{text: 'remove'}];
    const dataSource = new EphemeralDataSource({items});

    const [remove] = await dataSource.fetch();

    expect(await dataSource.remove(remove)).toHaveLength(0);
  });

  it('will ignore an attempt to remove a non-existent item', async () => {
    const items = [{text: 'remain'}];
    const nonExistentItem = {id: 'fake', text: 'remove', isComplete: false};
    const dataSource = new EphemeralDataSource({items});

    expect(await dataSource.remove(nonExistentItem)).toMatchObject(items);
  });

  it('returns existing items after removing an item', async () => {
    const items = [{text: 'remove'}, {text: 'remain'}];
    const dataSource = new EphemeralDataSource({items});

    const [remove, ...remain] = await dataSource.fetch();

    expect(await dataSource.remove(remove)).toMatchObject(remain);
  });

  it('can update an existing item', async () => {
    const items = [{text: 'update'}];
    const dataSource = new EphemeralDataSource({items});

    const [update] = await dataSource.fetch();
    const updated = {...update, text: 'updated'};

    expect(await dataSource.update(updated)).toMatchObject([updated]);
  });

  it('will ignore an attempt to update a non-existent item', async () => {
    const items = [{text: 'remain'}];
    const nonExistentItem = {id: 'fake', text: 'update', isComplete: false};
    const dataSource = new EphemeralDataSource({items});

    expect(await dataSource.update(nonExistentItem)).toMatchObject(items);
  });

  it('returns existing items after updating an item', async () => {
    const items = [{text: 'update'}, {text: 'remain'}];
    const dataSource = new EphemeralDataSource({items});

    const [update, ...remain] = await dataSource.fetch();
    const updated = {...update, text: 'updated'};

    expect(await dataSource.update(updated)).toMatchObject([
      updated,
      ...remain,
    ]);
  });
});
