export const tabs = [
  {
    id: 'loop',
    label: '完整闭环',
    kicker: '1 · 从输入到帮助',
    title: '记忆不是存档，而是一条持续变好的闭环',
    lead: '把用户表达、行为反馈、记忆更新和下一次帮助连起来，系统才会越用越懂场景。',
    tone: 'blue',
    cards: [
      { title: '捕捉', text: '记录用户明确表达、关键选择和当下任务，不把所有对话一股脑保存。' },
      { title: '整理', text: '把原始事件提炼成可复用的事实、偏好、约束与情境。' },
      { title: '调用', text: '在真正相关的任务中召回，减少重复确认，让帮助更贴近目标。' },
      { title: '修正', text: '允许用户确认、修改和删除，让记忆随着新证据变化。' }
    ],
    note: '设计重点：每一条记忆都应该能解释“来自哪里、为什么被保留、何时会被使用”。'
  },
  {
    id: 'layers',
    label: '记忆分层',
    kicker: '2 · 不同信息不同寿命',
    title: '先区分信息的生命周期，再决定存不存',
    lead: '短期任务上下文、稳定用户偏好和长期行为趋势，应该采用不同的保存、召回和过期策略。',
    tone: 'lavender',
    cards: [
      { title: '工作记忆', text: '服务当前任务，随着会话或任务结束自然淡出。' },
      { title: '情境记忆', text: '保存近期项目、旅行、购买等具体经历，强调时间与来源。' },
      { title: '语义记忆', text: '保存经确认的长期事实与偏好，例如语言、格式和明确禁忌。' },
      { title: '趋势记忆', text: '只记录跨周期的行为变化，不直接把趋势写成固定人格标签。' }
    ],
    note: '设计重点：信息越稳定、越敏感，越需要更清楚的用户知情、确认和删除机制。'
  },
  {
    id: 'write',
    label: '写入规则',
    kicker: '3 · 什么时候值得记住',
    title: '写入前先问：它是否会在未来帮助用户？',
    lead: '把“可记录”与“值得记录”分开，优先保存用户明确表达和具有重复使用价值的信息。',
    tone: 'peach',
    cards: [
      { title: '明确表达', text: '用户主动说“请记住”“以后都这样做”，优先进入候选记忆。' },
      { title: '重复出现', text: '同一偏好在多个场景中稳定出现，才考虑提升置信度。' },
      { title: '可验证', text: '记录来源、时间和证据，避免把推测当作事实。' },
      { title: '可撤回', text: '每条长期记忆都应支持查看、修改、删除和停止使用。' }
    ],
    note: '不建议：仅凭一次情绪化表达或一次行为，就给用户贴上固定标签。'
  },
  {
    id: 'cases',
    label: '业务案例',
    kicker: '4 · 让抽象原则落地',
    title: '业务案例要展示“记忆如何改变下一次体验”',
    lead: '好的案例不是罗列功能，而是展示从证据到决策、再到用户收益的完整链路。',
    tone: 'green',
    cards: [
      { title: '旅行规划', text: '记住用户偏好的社交强度与预算，在下一次规划中减少无效推荐。' },
      { title: '学习辅导', text: '记录掌握情况和易错点，动态调整复习节奏，而不是重复讲已经会的内容。' },
      { title: '内容创作', text: '保存用户确认过的语气、结构和禁用表达，帮助后续产出更稳定。' },
      { title: '客户服务', text: '保留问题历史与已确认方案，让用户不必每次重新描述背景。' }
    ],
    note: '设计重点：案例必须同时说明收益、风险边界和用户如何掌控自己的信息。'
  },
  {
    id: 'trends',
    label: '性格趋势',
    kicker: '5 · 从记住信息到持续帮助用户',
    title: '一个月后，记录“行为趋势”，不要宣判“真人格”',
    lead: '把用户的自述与行为证据分开保存，再经过周期性聚合，形成可被用户确认的帮助假设。',
    tone: 'purple',
    quoteCards: [
      { title: '用户自述', text: '“我是 INFP”“我不喜欢人多的地方”——保存为自述，并记录来源和时间。', variant: 'blue' },
      { title: '行为观察', text: 'Query、选择、反馈和吐槽——先形成事件证据，不直接写成性格标签。', variant: 'peach' }
    ],
    steps: ['每日交互\n有日期与场景', '事件证据\n选择、反馈、频次', '月度聚合\n主题与变化趋势', '行为假设\n范围 + 置信度', '用户确认\n再进入长期档案'],
    warning: '“用户性格内向。”',
    recommendation: '“过去 30 天在旅行规划场景中，用户更常选择低社交压力活动；置信度 0.65，尚未确认。”',
    note: '当前要点：系统可以总结特定场景的行为趋势，但不应把推断直接写成确定的人格事实。'
  }
];

export function getInitialTab(rawValue) {
  const index = Number(rawValue);
  return Number.isInteger(index) && index >= 0 && index < tabs.length ? index : tabs.length - 1;
}

export function normalizeRecord(record) {
  if (!record || typeof record !== 'object') return {};
  return { activeTab: getInitialTab(record.activeTab) };
}
