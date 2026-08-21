import { getInitialCard, normalizeDeck, normalizeRecord } from './tab-model.mjs';

const STORAGE_KEY = 'switchable-content-cards:active-card';
const tabsEl = document.querySelector('#tabs');
const panelEl = document.querySelector('#panel');
const statusEl = document.querySelector('#host-status');
const resetButton = document.querySelector('#reset-button');
const queryCard = new URLSearchParams(window.location.search).get('card');
const EMBEDDED_DECK = null;

let deck = normalizeDeck(EMBEDDED_DECK);
let activeIndex = 0;
let feishuHost = null;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function lineBreaks(value) {
  return escapeHtml(value).replaceAll('\n', '<br />');
}

function renderTabs() {
  tabsEl.innerHTML = deck.cards.map((card, index) => (
    '<button class="tab-button ' + (index === activeIndex ? 'is-active' : '') + '"' +
    ' id="tab-' + escapeHtml(card.id) + '"' +
    ' type="button" role="tab"' +
    ' aria-selected="' + (index === activeIndex) + '"' +
    ' aria-controls="panel"' +
    ' tabindex="' + (index === activeIndex ? '0' : '-1') + '"' +
    ' data-index="' + index + '">' +
    escapeHtml(card.title) +
    '</button>'
  )).join('');
}

function renderPanel() {
  const card = deck.cards[activeIndex];
  if (!card) {
    panelEl.innerHTML = '<div class="empty-state">还没有可展示的卡片。</div>';
    return;
  }

  panelEl.setAttribute('aria-labelledby', 'tab-' + card.id);
  panelEl.innerHTML =
    '<article class="content-card tone-' + escapeHtml(card.tone) + '">' +
      '<div class="card-meta"><span>卡片 ' + String(activeIndex + 1).padStart(2, '0') +
        '</span><span>' + deck.cards.length + ' 张</span></div>' +
      '<h2>' + escapeHtml(card.title) + '</h2>' +
      '<div class="card-content">' + lineBreaks(card.content) + '</div>' +
    '</article>';
}

function updateUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set('card', String(activeIndex));
  window.history.replaceState({}, '', url);
}

async function persistActiveCard() {
  localStorage.setItem(STORAGE_KEY, String(activeIndex));
  if (!feishuHost?.Record?.setRecord) return;
  try {
    await feishuHost.Record.setRecord({ activeCard: activeIndex });
  } catch (error) {
    console.warn('Feishu record persistence is unavailable.', error);
  }
}

async function setActiveCard(nextIndex, { persist = true } = {}) {
  activeIndex = getInitialCard(nextIndex, deck.cards.length);
  renderTabs();
  renderPanel();
  updateUrl();
  if (persist) await persistActiveCard();
  document.querySelector('#tab-' + deck.cards[activeIndex]?.id)?.focus({ preventScroll: true });
}

function handleTabKeydown(event) {
  if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const current = Number(event.target.dataset.index);
  const next = event.key === 'ArrowRight'
    ? (current + 1) % deck.cards.length
    : event.key === 'ArrowLeft'
      ? (current - 1 + deck.cards.length) % deck.cards.length
      : event.key === 'Home' ? 0 : deck.cards.length - 1;
  setActiveCard(next);
}

async function loadDeck() {
  if (EMBEDDED_DECK) return normalizeDeck(EMBEDDED_DECK);
  try {
    const response = await fetch('content.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('content.json returned ' + response.status);
    return normalizeDeck(await response.json());
  } catch (error) {
    console.warn('Card content could not be loaded.', error);
    return normalizeDeck({ title: '可切换卡片', cards: [] });
  }
}

async function initFeishuHost() {
  feishuHost = window.tt ?? window.feishu ?? null;
  if (!feishuHost) return;
  statusEl.textContent = '飞书云文档小组件';
  try {
    if (feishuHost.Record?.getRecord) {
      const record = normalizeRecord(await feishuHost.Record.getRecord(), deck.cards.length);
      if (queryCard === null && Number.isInteger(record.activeCard)) activeIndex = record.activeCard;
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (queryCard === null && stored !== null) activeIndex = getInitialCard(stored, deck.cards.length);
    }
    renderTabs();
    renderPanel();
    if (feishuHost.Bridge?.updateHeight) await feishuHost.Bridge.updateHeight(document.body.scrollHeight);
    if (feishuHost.LifeCycle?.notifyAppReady) await feishuHost.LifeCycle.notifyAppReady();
  } catch (error) {
    console.warn('Feishu host initialization failed; using local preview.', error);
  }
}

tabsEl.addEventListener('click', event => {
  const button = event.target.closest('[role="tab"]');
  if (button) setActiveCard(button.dataset.index);
});
tabsEl.addEventListener('keydown', handleTabKeydown);
resetButton.addEventListener('click', () => setActiveCard(0));

deck = await loadDeck();
document.querySelector('.widget-shell').dataset.displayMode = deck.displayMode;
document.querySelector('#widget-title').textContent = deck.title;
document.querySelector('#widget-subtitle').textContent = deck.subtitle;
activeIndex = getInitialCard(queryCard, deck.cards.length);
renderTabs();
renderPanel();
initFeishuHost();
