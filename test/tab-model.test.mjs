import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { getInitialCard, normalizeDeck, normalizeRecord } from '../src/tab-model.mjs';

test('accepts any positive number of cards and preserves title/content', async () => {
  const content = JSON.parse(await readFile(new URL('../content.json', import.meta.url)));
  const deck = normalizeDeck(content);
  assert.ok(deck.cards.length >= 2);
  assert.equal(deck.cards[0].title, content.cards[0].title);
  assert.match(deck.cards[0].content, /身体变化：/);
  assert.match(deck.cards[0].content, /认知变化：/);
  assert.match(deck.cards[0].content, /能力变化：/);
});

test('normalizes invalid card values to the first card', () => {
  assert.equal(getInitialCard(undefined, 3), 0);
  assert.equal(getInitialCard('nope', 3), 0);
  assert.equal(getInitialCard(99, 3), 0);
  assert.equal(getInitialCard('2', 3), 2);
});

test('normalizes a persisted Feishu record', () => {
  assert.deepEqual(normalizeRecord({ activeCard: 1 }, 3), { activeCard: 1 });
  assert.deepEqual(normalizeRecord({ activeCard: '3' }, 3), { activeCard: 0 });
  assert.deepEqual(normalizeRecord(null, 3), {});
});
