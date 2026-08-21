# Content schema

## Deck

字段 title 是整体标题，subtitle 是整体说明，displayMode 可选 pills、bar 或 side，cards 是任意数量的卡片数组。

## Card

每张卡片包含：

- id：可选的唯一标识
- title：必填，作为切换按钮和当前卡片标题
- content：必填，可用换行分段
- tone：可选，blue、lavender、peach、green 或 purple

## 示例

整体资料标题为“产品访谈摘要”，展现形式为 side，cards 可以包含“核心问题”和“用户证据”两张卡片。不要为了匹配固定模板添加没有依据的卡片。
