import { describe, test } from 'node:test';
import assert from 'node:assert';
import { getChangelog } from '../src/changelog/util.js';

describe('index', () => {
  test('works', async () => {
    const changes = await getChangelog(false);
    console.error(changes);
    assert.notEqual(changes, '');
  });
});
