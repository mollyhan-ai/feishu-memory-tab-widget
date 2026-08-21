import test from 'node:test';
import assert from 'node:assert/strict';
import { getInitialTab, normalizeRecord, tabs } from '../src/tab-model.mjs';

test('exposes exactly five tabs', () => {
  assert.equal(tabs.length, 5);
  assert.deepEqual(tabs.map(tab => tab.label), ['完整闭环', '记忆分层', '写入规则', '业务案例', '性格趋势']);
});

test('normalizes invalid tab values to the last tab', () => {
  assert.equal(getInitialTab(undefined), 4);
  assert.equal(getInitialTab('nope'), 4);
  assert.equal(getInitialTab(99), 4);
  assert.equal(getInitialTab('2'), 2);
});

test('normalizes a persisted Feishu record', () => {
  assert.deepEqual(normalizeRecord({ activeTab: 1 }), { activeTab: 1 });
  assert.deepEqual(normalizeRecord({ activeTab: '3' }), { activeTab: 3 });
  assert.deepEqual(normalizeRecord(null), {});
});
