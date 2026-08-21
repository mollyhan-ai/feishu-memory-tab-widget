import { getInitialTab, normalizeRecord, tabs } from './tab-model.mjs';

const STORAGE_KEY = 'feishu-memory-tab-widget:active-tab';
const tabsEl = document.querySelector('#tabs');
const panelEl = document.querySelector('#panel');
const statusEl = document.querySelector('#host-status');
const resetButton = document.querySelector('#reset-button');
const queryTab = new URLSearchParams(window.location.search).get('tab');

let activeIndex = getInitialTab(queryTab);
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
  tabsEl.innerHTML = tabs.map((tab, index) => `
    <button
      class="tab-button ${index === activeIndex ? 'is-active' : ''}"
      id="tab-${tab.id}"
      type="button"
      role="tab"
      aria-selected="${index === activeIndex}"
      aria-controls="panel"
      tabindex="${index === activeIndex ? '0' : '-1'}"
      data-index="${index}"
    >${index + 1}. ${escapeHtml(tab.label)}</button>
  `).join('');
}

function renderStandardPanel(tab) {
  return `
    <div class="panel-heading">
      <p class="kicker">${escapeHtml(tab.kicker)}</p>
      <h2>${escapeHtml(tab.title)}</h2>
      <p class="lead">${escapeHtml(tab.lead)}</p>
    </div>
    <div class="card-grid">
      ${tab.cards.map((card, index) => `
        <article class="info-card card-${index + 1}">
          <span class="card-number">0${index + 1}</span>
          <h3>${escapeHtml(card.title)}</h3>
          <p>${escapeHtml(card.text)}</p>
        </article>
      `).join('')}
    </div>
    <div class="note-box"><strong>设计提醒</strong><span>${escapeHtml(tab.note)}</span></div>
  `;
}

function renderTrendPanel(tab) {
  return `
    <div class="panel-heading trend-heading">
      <p class="kicker">${escapeHtml(tab.kicker)}</p>
      <h2>${escapeHtml(tab.title)}</h2>
    </div>
    <div class="quote-grid">
      ${tab.quoteCards.map(card => `
        <article class="quote-card ${card.variant}">
          <h3>${escapeHtml(card.title)}</h3>
          <p>${escapeHtml(card.text)}</p>
        </article>
      `).join('')}
    </div>
    <div class="step-flow" aria-label="从每日交互到用户确认的五步流程">
      ${tab.steps.map((step, index) => `
        <div class="step-wrap">
          <div class="step-card"><span>${index + 1}</span><strong>${lineBreaks(step)}</strong></div>
          ${index < tab.steps.length - 1 ? '<span class="flow-arrow" aria-hidden="true">→</span>' : ''}
        </div>
      `).join('')}
    </div>
    <div class="decision-grid">
      <article class="decision-card avoid"><h3>不建议</h3><p>“${escapeHtml(tab.warning)}”</p></article>
      <article class="decision-card recommend"><h3>建议</h3><p>${escapeHtml(tab.recommendation)}</p></article>
    </div>
    <div class="note-box"><strong>当前要点</strong><span>${escapeHtml(tab.note.replace('当前要点：', ''))}</span></div>
  `;
}

function renderPanel() {
  const tab = tabs[activeIndex];
  panelEl.setAttribute('aria-labelledby', `tab-${tab.id}`);
  panelEl.innerHTML = tab.id === 'trends' ? renderTrendPanel(tab) : renderStandardPanel(tab);
}

function updateUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set('tab', String(activeIndex));
  window.history.replaceState({}, '', url);
}

async function persistActiveTab() {
  localStorage.setItem(STORAGE_KEY, String(activeIndex));
  if (!feishuHost?.Record?.setRecord) return;
  try {
    await feishuHost.Record.setRecord({ activeTab: activeIndex });
  } catch (error) {
    console.warn('Feishu record persistence is unavailable.', error);
  }
}

async function setActiveTab(nextIndex, { persist = true } = {}) {
  activeIndex = getInitialTab(nextIndex);
  renderTabs();
  renderPanel();
  updateUrl();
  if (persist) await persistActiveTab();
  document.querySelector(`#tab-${tabs[activeIndex].id}`)?.focus({ preventScroll: true });
}

function handleTabKeydown(event) {
  if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const current = Number(event.target.dataset.index);
  const next = event.key === 'ArrowRight'
    ? (current + 1) % tabs.length
    : event.key === 'ArrowLeft'
      ? (current - 1 + tabs.length) % tabs.length
      : event.key === 'Home' ? 0 : tabs.length - 1;
  setActiveTab(next);
}

async function initFeishuHost() {
  feishuHost = window.tt ?? window.feishu ?? null;
  if (!feishuHost) return;
  statusEl.textContent = '飞书云文档小组件';
  try {
    if (feishuHost.Record?.getRecord) {
      const record = normalizeRecord(await feishuHost.Record.getRecord());
      if (queryTab === null && Number.isInteger(record.activeTab)) activeIndex = record.activeTab;
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (queryTab === null && stored !== null) activeIndex = getInitialTab(stored);
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
  if (button) setActiveTab(button.dataset.index);
});
tabsEl.addEventListener('keydown', handleTabKeydown);
resetButton.addEventListener('click', () => setActiveTab(tabs.length - 1));

renderTabs();
renderPanel();
initFeishuHost();
