<script setup>
defineProps({ variant: String })
</script>

<template>
  <div class="visual" :class="`visual-${variant}`" aria-hidden="true">
    <span class="visual-grain"></span>
    <template v-if="variant === 'starclip'">
      <div class="clip-window">
        <div class="window-bar"><span class="window-dots">● ● ●</span><b>Starclip</b><span>⌘ ⇧ V</span></div>
        <div class="clip-body"><div class="clip-nav"><span class="selected">全部记录</span><span>☆ 星标</span><span>⌘ 代码</span></div><div class="clip-list"><div class="clip-search">⌕ 搜索你的灵感</div><div class="clip-row active"><b>让剪贴板，记住更多。</b><small>文字 · 刚刚</small></div><div class="clip-row"><code>const idea = 'hello world'</code><small>代码 · 常用片段</small></div><div class="clip-row"><span>今天也有值得收藏的灵感 ✦</span></div></div></div>
      </div>
      <span class="floating-label">✦ 复制过，就找得到</span>
    </template>
    <template v-else-if="variant === 'starshot'">
      <div class="capture-scene"><span class="scene-sun"></span><span class="scene-mountain back"></span><span class="scene-mountain"></span><span class="scene-caption">把灵感，定格成星。</span><div class="capture-selection"><i></i><i></i><i></i><i></i><svg viewBox="0 0 120 60"><path d="M10 50Q40 8 100 15m-15-9 15 9-15 10" /></svg></div></div>
      <div class="capture-toolbar"><span>↖</span><span>▭</span><span>↗</span><span>T</span><span>▦</span><span class="tool-save">✓</span></div>
      <span class="floating-label">截图 · 标注 · 美化</span>
    </template>
    <template v-else-if="variant === 'starvault'">
      <div class="vault-sources"><span>Codex</span><span>Claude</span><span>ChatGPT</span></div>
      <svg class="vault-lines" viewBox="0 0 300 68"><path d="M42 0v20q0 12 12 12h84q12 0 12 12v24M150 0v68M258 0v20q0 12-12 12h-84q-12 0-12 12v24" /></svg>
      <div class="vault-folder"><span class="folder-star">✦</span><div><b>我的 AI 记忆</b><span>对话 / 附件 / Skill</span></div><span class="folder-lock">▣</span></div>
      <span class="floating-label">你的记忆，始终属于你</span>
    </template>
    <template v-else-if="variant === 'bewild'">
      <span class="visual-title">你的账号，你的订阅。</span>
      <div class="subscription-pair"><div class="subscription"><span class="subscription-symbol">✳︎</span><b>ChatGPT</b><small>独立账号订阅</small></div><div class="subscription"><span class="subscription-symbol claude-symbol">✺</span><b>Claude</b><small>独立账号订阅</small></div></div>
    </template>
    <template v-else-if="variant === 'heyroute'">
      <span class="visual-title">一个入口，连接更多。</span>
      <div class="route-key"><span>⌘</span><code>API KEY</code><i>•••• ••••</i></div>
      <div class="route-line"></div><div class="route-clients"><span>Codex</span><span>Claude Code</span><span>API</span></div>
    </template>
    <template v-else>
      <span class="visual-title">{{ variant === 'xfast' ? '灵感继续，额度跟上。' : '为每次调用，找到合适渠道。' }}</span>
      <div class="terminal-window"><div class="terminal-title"><span class="window-dots">● ● ●</span><span>{{ variant === 'xfast' ? 'LET’S BUILD' : 'MODEL ROUTER' }}</span></div><div class="terminal-code"><span class="terminal-prompt">❯</span> {{ variant === 'xfast' ? 'codex' : 'request → model' }}<br><span class="terminal-comment">{{ variant === 'xfast' ? '// 把下一个想法，写成代码' : '// 选择渠道，开始调用' }}</span><br><span class="terminal-prompt">✦</span> <span class="terminal-ready">Ready to create</span><span class="terminal-cursor"></span></div></div>
    </template>
    <span class="visual-caption">{{ variant?.startsWith('star') ? '功能示意' : '服务示意' }}</span>
  </div>
</template>

<style scoped>
.visual { position: relative; isolation: isolate; height: 190px; overflow: hidden; border-bottom: 1px solid #00000006; background: #f3eee5; color: #494237; font-family: var(--vp-font-family-base); }
.visual-grain { position: absolute; inset: 0; z-index: -1; opacity: .32; background-image: radial-gradient(currentColor .6px, transparent .6px); background-size: 9px 9px; mask-image: linear-gradient(135deg, #0005, transparent 70%); }
.visual-title { position: absolute; top: 25px; left: 24px; font-size: 16px; font-weight: 650; letter-spacing: -.4px; }
.visual-caption { position: absolute; right: 10px; bottom: 7px; padding: 1px 4px; border-radius: 3px; background: #ffffffb3; color: #737077; font-size: 9px; line-height: 1.4; letter-spacing: .12em; }
.window-dots { font-size: 7px; letter-spacing: 2px; opacity: .45; }
.floating-label { position: absolute; bottom: 16px; right: 24px; z-index: 2; padding: 7px 11px; border: 1px solid #fff9; border-radius: 7px; background: #fffffff2; color: #3e5e50; font-size: 11px; box-shadow: 0 5px 15px #19372912; }
.visual-starclip { background: linear-gradient(135deg,#e4ede2,#f0f4e9); }
.clip-window { width: 80%; max-width: 310px; position: absolute; top: 23px; left: 9%; background: #fbfdfa; border: 1px solid #c4d4c0; border-radius: 9px; transform: rotate(-4deg); box-shadow: 0 12px 22px #49633b1c; overflow: hidden; }
.window-bar { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-bottom: 1px solid #e0e7db; font-size: 8px; color: #5b6a56; }
.window-bar b { font-size: 10px; }
.clip-body { display: flex; height: 130px; text-align: left; }
.clip-nav { display: grid; align-content: start; gap: 9px; width: 65px; flex-shrink: 0; padding: 13px 6px; border-right: 1px solid #e3eadd; font-size: 8px; color: #84907f; }
.clip-nav .selected { background: #e3ecd9; color: #45663a; border-radius: 3px; padding: 3px 4px; }
.clip-list { flex: 1; min-width: 0; padding: 8px; }
.clip-search { margin-bottom: 7px; padding: 4px 6px; border: 1px solid #e3e9dd; border-radius: 4px; color: #8c9886; font-size: 8px; }
.clip-row { padding: 6px; border-radius: 4px; font-size: 9px; line-height: 1.5; color: #506348; white-space: nowrap; }
.clip-row.active { background: #e9f0e1; }
.clip-row b { font-size: 10px; }
.clip-row small { display: block; font-size: 7px; opacity: .6; }
.clip-row code { padding: 0; color: #61764f; background: none; font-size: 8px; }
.visual-starshot { background: linear-gradient(140deg,#e8e8f5,#f2eef8); }
.capture-scene { position: absolute; width: 76%; max-width: 300px; height: 137px; left: 12%; top: 18px; overflow: hidden; border-radius: 8px; background: linear-gradient(135deg,#c7dbf3,#e8e9f8 65%); transform: rotate(3deg); box-shadow: 0 12px 20px #47417b18; }
.scene-sun { position: absolute; width: 34px; height: 34px; top: 22px; right: 43px; border-radius: 50%; background: #fff5d0; }
.scene-mountain { position: absolute; bottom: -10px; width: 110%; height: 95px; background: #828bb6; clip-path: polygon(0 80%, 27% 5%, 47% 60%, 66% 26%, 100% 70%, 100% 100%, 0 100%); }
.scene-mountain.back { bottom: 10px; background: #b0b8d3; transform: scaleX(-1); }
.scene-caption { position: absolute; z-index: 1; left: 20px; top: 20px; font-size: 10px; font-weight: 650; color: #344f78; }
.capture-selection { position: absolute; inset: 12px 22px; border: 1px solid #6981de; }
.capture-selection i { position: absolute; width: 5px; height: 5px; background: #fff; border: 1px solid #6981de; }
.capture-selection i:nth-child(1) { left: -3px; top: -3px; }.capture-selection i:nth-child(2) { right: -3px; top: -3px; }.capture-selection i:nth-child(3) { left: -3px; bottom: -3px; }.capture-selection i:nth-child(4) { right: -3px; bottom: -3px; }
.capture-selection svg { position: absolute; width: 90px; height: 45px; bottom: 8px; left: 35px; stroke: #fcf6e4; stroke-width: 3; stroke-linecap: round; fill: none; }
.capture-toolbar { display: flex; gap: 15px; align-items: center; position: absolute; top: 147px; left: 17%; padding: 5px 10px; border: 1px solid #d7d5e6; border-radius: 6px; background: #fff; color: #6a6783; font-size: 12px; box-shadow: 0 5px 15px #46456a15; transform: rotate(3deg); }
.tool-save { color: #5965b4; }
.visual-starshot .floating-label { right: 18px; bottom: 36px; color: #665488; }
.visual-starvault { background: radial-gradient(ellipse at 50% 115%,#3d5574,transparent 65%),#1b2d43; color: #e3ecf7; }
.vault-sources { display: flex; justify-content: center; gap: 13px; margin: 22px auto 0; }
.vault-sources span { padding: 5px 12px; background: #ffffff10; border: 1px solid #ffffff25; border-radius: 6px; font-size: 10px; }
.vault-lines { position: absolute; top: 49px; left: 50%; width: 270px; height: 50px; transform: translateX(-50%); fill: none; stroke: #98b6d66b; stroke-width: 1; }
.vault-folder { position: absolute; top: 85px; left: 50%; transform: translateX(-50%) rotate(-3deg); display: flex; align-items: center; gap: 12px; width: 220px; padding: 15px; border: 1px solid #b6c9e256; border-radius: 10px; background: linear-gradient(120deg,#425772,#31465f); box-shadow: 0 15px 25px #07121c50; }
.folder-star { font-size: 30px; color: #f5dc9e; line-height: 1; }
.vault-folder b { display: block; font-size: 13px; font-weight: 600; }
.vault-folder div > span { font-size: 8px; color: #becfe1; }
.folder-lock { margin-left: auto; color: #9eb7d2; }
.visual-starvault .floating-label { bottom: 9px; left: 24px; right: auto; border: 0; background: none; color: #b5c9de; box-shadow: none; font-size: 10px; }
.visual-starvault .visual-caption { background: #ffffff10; color: #b5c9de; }
.visual-bewild { background: linear-gradient(140deg,#ede6f6,#f6eef4); color: #6a4e86; }
.subscription-pair { position: absolute; display: flex; gap: 10px; left: 50%; top: 68px; transform: translateX(-50%) rotate(-4deg); }
.subscription { display: grid; justify-items: start; gap: 3px; width: 108px; padding: 12px 13px; border-radius: 10px; background: #ffffffdb; border: 1px solid #fff; box-shadow: 0 6px 14px #5f417710; color: #3e3c49; }
.subscription:nth-child(2) { transform: translateY(9px) rotate(9deg); }
.subscription-symbol { color: #497f6f; font-size: 24px; line-height: 1; }.claude-symbol { color: #bf8d73; }
.subscription b { font-size: 13px; }.subscription small { font-size: 8px; color: #85808c; }
.visual-heyroute { background: linear-gradient(140deg,#e5edf6,#edf2fa); color: #486589; }
.route-key { position: absolute; top: 69px; left: 50%; transform: translateX(-50%) rotate(-3deg); display: flex; align-items: center; gap: 9px; width: 215px; padding: 12px; border: 1px solid #fff; border-radius: 8px; background: #ffffffe6; box-shadow: 0 7px 14px #36598212; font-size: 14px; }
.route-key code { padding: 0; background: none; color: #5377a3; font-size: 11px; }.route-key i { margin-left: auto; color: #a5b7cd; font-size: 10px; font-style: normal; }
.route-line { position: absolute; top: 115px; left: 50%; height: 19px; width: 1px; background: #9db4ce; }
.route-clients { position: absolute; top: 136px; display: flex; justify-content: center; gap: 6px; width: 100%; }
.route-clients span { padding: 5px 9px; border-radius: 4px; border: 1px solid #cbd9ea; font-size: 9px; background: #ffffff70; }
.visual-xfast { background: linear-gradient(140deg,#f7e7cd,#fbf3e7); color: #89512c; }
.visual-fastai { background: linear-gradient(140deg,#dceee9,#edf5ed); color: #416e61; }
.terminal-window { position: absolute; top: 65px; left: 50%; transform: translateX(-50%) rotate(-3deg); width: 84%; max-width: 290px; border: 1px solid #fff7; border-radius: 8px; background: #283139; box-shadow: 0 12px 18px #31302523; overflow: hidden; }
.terminal-title { display: flex; justify-content: space-between; align-items: center; padding: 7px 10px; border-bottom: 1px solid #ffffff0c; font-size: 7px; letter-spacing: .1em; color: #b3b9ba; }
.terminal-code { padding: 10px 14px 13px; font: 10px/1.9 var(--vp-font-family-mono); color: #d6dddf; text-align: left; }
.terminal-prompt { color: #f3c68d; }.terminal-comment { color: #8d9b9a; font-size: 9px; }.terminal-ready { color: #b1cbb6; font-size: 9px; }.terminal-cursor { display: inline-block; width: 4px; height: 10px; margin-left: 6px; background: #c6d5bf; vertical-align: middle; }
</style>
