// Lite landing for browsers that cannot run the modern bundle.
// Strictly ES5 (checked by scripts/check-es5.js): no let/const, arrows,
// template strings, classes, spread, for-of, includes(), startsWith().
// Data comes from dogs.js (window.WAD_DOGS), generated at build time from
// src/lib/data/worldwidedogs.json by scripts/build-lite-data.js.
(function () {
  'use strict';

  var DATA = window.WAD_DOGS || {};
  var LANGS = Object.keys(DATA);
  if (!LANGS.length) return;

  // ── Constants ──────────────────────────────────────────────────────────
  var LIVE_ORIGIN = 'https://dogs.red';
  var ARCHIVE_HOST_RE = /(^|\.)wearedogs\.net$/;
  var STAY_KEY = 'wearedogs-stay-on-archive';
  var PROBE_TIMEOUT_MS = 4000;
  var CYCLE_MS = 1000;
  var IDLE_SWAP_MS = 15000;
  var FLASH_MS = 800;
  var DOUBLE_TAP_MS = 300;
  var SWIPE_PX = 40;
  var WORLD_PEOPLE = 8300000000;
  var WORLD_DOGS = 900000000;
  // Latin (incl. extended), Greek, Cyrillic: safe to split per letter.
  var SIMPLE_SCRIPT_RE = /^[\u0020-\u024F\u0370-\u03FF\u0400-\u052F\u02BB']+$/;
  var SYMBOLS = ['%', '#', '$', '@'];
  var SYMBOL_NAMES = { '%': 'percent', '#': 'hash', '$': 'dollar', '@': 'at' };
  var PHRASES = [
    { id: 'we-are-dogs', words: ['we', 'are', 'dogs'] },
    { id: 'dogs', words: ['dogs'] },
    { id: 'go-dogs', words: ['go', 'dogs'] },
    { id: 'dogs-run-this', words: ['dogs', 'run', 'this', 'symbols'] },
    { id: 'dogs-dogs-dogs', words: ['dogs', 'dogs', 'dogs'] }
  ];
  var FLASH_GLYPHS = {
    pause: '❚❚', play: '▶', forward: '›', backward: '‹',
    flag_on: '⚑', flag_off: '⚐'
  };

  // ── Elements ───────────────────────────────────────────────────────────
  var els = {
    root: document.documentElement,
    body: document.body,
    ambient: document.getElementById('ambient'),
    lang: document.getElementById('lang'),
    langName: document.getElementById('lang-name'),
    langMeta: document.getElementById('lang-meta'),
    flash: document.getElementById('flash'),
    corner: document.getElementById('corner'),
    wad: document.getElementById('wad'),
    wrapper: document.getElementById('words-wrapper'),
    words: document.getElementById('words'),
    pron: document.getElementById('pron')
  };

  // ── State ──────────────────────────────────────────────────────────────
  var browserLang = (navigator.language || navigator.userLanguage || 'en').split('-')[0];
  var initialLang = DATA[browserLang] ? browserLang : 'en';
  var state = {
    lang: initialLang,
    paused: false,
    hovering: false,
    colored: false,
    history: [initialLang],
    historyIndex: 0,
    phrase: null,
    symbols: shuffle(SYMBOLS),
    lastLetter: '',
    lastLetterIndex: -1,
    lastClick: 0,
    suppressClick: false,
    isTouch: false
  };
  var cycleTimer = null;
  var idleTimer = null;
  var flashTimer = null;
  var wheelTimer = null;
  var wheelActive = false;

  // ── Helpers ────────────────────────────────────────────────────────────
  function shuffle(list) {
    var out = list.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = out[i]; out[i] = out[j]; out[j] = tmp;
    }
    return out;
  }

  function pickPhrase(exclude) {
    var pool = [];
    for (var i = 0; i < PHRASES.length; i++) if (PHRASES[i] !== exclude) pool.push(PHRASES[i]);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function randLang() {
    var pool = [];
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i] !== state.lang) pool.push(LANGS[i]);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function parseCount(text) {
    if (!text || text === '—') return 0;
    var clean = String(text).replace(/,/g, '').toLowerCase();
    var mult = 1;
    if (clean.indexOf('billion') !== -1) mult = 1000000000;
    else if (clean.indexOf('million') !== -1) mult = 1000000;
    var val = parseFloat(clean);
    return isNaN(val) ? 0 : val * mult;
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function colorsFor(code) {
    var t = DATA[code];
    return (t && t.colors && t.colors.length) ? t.colors : ['#FFFFFF', '#FFFFFF', '#FFFFFF'];
  }

  function stored(key) {
    try { return localStorage.getItem(key) === '1' || sessionStorage.getItem(key) === '1'; } catch (e) { return false; }
  }

  // ── Render ─────────────────────────────────────────────────────────────
  function phraseWords() {
    var t = DATA[state.lang] || {};
    var out = [];
    for (var i = 0; i < state.phrase.words.length; i++) {
      var key = state.phrase.words[i];
      if (key === 'symbols') {
        var names = [];
        for (var s = 0; s < state.symbols.length; s++) names.push(SYMBOL_NAMES[state.symbols[s]]);
        out.push({ text: state.symbols.join(''), pron: names.join(' ') });
      } else {
        out.push({ text: t[key] || '', pron: t[key + '_p'] || '' });
      }
    }
    return out;
  }

  function letterStyle(i, color) {
    var delay = Math.round(i * 25 + Math.random() * 30);
    var css = 'animation-delay:' + delay + 'ms;-webkit-animation-delay:' + delay + 'ms;';
    if (color) css += 'color:' + color + ';';
    return css;
  }

  function render() {
    var words = phraseWords();
    var colors = colorsFor(state.lang);
    var html = '';
    var prons = [];
    for (var w = 0; w < words.length; w++) {
      var text = words[w].text.toUpperCase();
      var color = state.colored ? colors[w % colors.length] : '';
      html += '<h1 class="word">';
      if (SIMPLE_SCRIPT_RE.test(text)) {
        for (var i = 0; i < text.length; i++) {
          html += '<span class="letter" style="' + letterStyle(i, color) + '">' + escapeHtml(text.charAt(i)) + '</span>';
        }
      } else {
        html += '<span class="whole" style="' + letterStyle(0, color) + '">' + escapeHtml(text) + '</span>';
      }
      html += '</h1>';
      prons.push(words[w].pron);
    }
    els.words.innerHTML = html;
    els.words.className = 'words lines-' + words.length;
    els.pron.textContent = '(' + prons.join(' ') + ')';
    els.langName.textContent = (DATA[state.lang] && DATA[state.lang].fullname) || state.lang;
    els.ambient.style.background = 'radial-gradient(ellipse at center, ' + colors[0] + ' 0%, #000 70%)';
    els.ambient.style.opacity = state.colored ? '0.18' : '0';
    renderMeta();
  }

  function statBlock(icon, label, raw, total) {
    var n = parseCount(raw);
    var html = '<div class="stat">' + icon + ' <span class="stat-lbl">' + label + ':</span> <span class="stat-val">' + escapeHtml(raw || '—') + '</span></div>';
    if (n > 0) {
      var pct = (n / total) * 100;
      html += '<div class="stat-bar"><div class="stat-fill" style="width:' + Math.min(100, pct * 4) + '%"></div></div>';
      html += '<div class="stat-pct">[' + pct.toFixed(2) + '%] <span>of all ' + (label === 'Dogs' ? 'dogs' : 'people') + '</span></div>';
    }
    return html;
  }

  function renderMeta() {
    var t = DATA[state.lang] || {};
    if (!state.paused) { els.langMeta.innerHTML = ''; return; }
    els.langMeta.innerHTML =
      statBlock('🗣️', 'Speakers', t.speakers, WORLD_PEOPLE) +
      statBlock('🐕', 'Dogs', t.dogs_count, WORLD_DOGS) +
      '<div class="meta-label">🌐 Region</div><div class="meta-value">' + escapeHtml(t.country || '—') + '</div>' +
      '<div class="meta-label">💬 Dialect</div><div class="meta-value">' + escapeHtml(t.dialect || '—') + '</div>';
  }

  function setPaused(paused) {
    state.paused = paused;
    if (paused) els.body.className = els.body.className.replace(/\bpaused\b/, '') + ' paused';
    else els.body.className = els.body.className.replace(/\s*\bpaused\b/, '');
    renderMeta();
    armIdle();
  }

  function setColored(on) {
    if (state.colored === on) return;
    state.colored = on;
    if (on) els.root.className += ' colored';
    else els.root.className = els.root.className.replace(/\s*\bcolored\b/, '');
    flash(on ? 'flag_on' : 'flag_off');
    render();
  }

  function flash(type) {
    if (flashTimer) clearTimeout(flashTimer);
    els.flash.textContent = FLASH_GLYPHS[type] || type;
    els.flash.className = 'flash';
    // Restart the CSS animation: force a reflow between class changes.
    void els.flash.offsetWidth;
    els.flash.className = 'flash show';
    flashTimer = setTimeout(function () { els.flash.className = 'flash'; }, FLASH_MS);
  }

  // ── Language navigation ────────────────────────────────────────────────
  function setLang(code) {
    state.lang = code;
    state.symbols = shuffle(SYMBOLS);
    render();
    armIdle();
  }

  function goToIndex(idx) {
    if (idx < 0 || idx >= state.history.length) return;
    state.historyIndex = idx;
    setLang(state.history[idx]);
  }

  function pushLang(code) {
    state.history = state.history.slice(0, state.historyIndex + 1);
    state.history.push(code);
    goToIndex(state.history.length - 1);
  }

  function cycle() {
    state.lastLetter = '';
    state.lastLetterIndex = -1;
    pushLang(randLang());
  }

  function startCycling() {
    stopCycling();
    cycleTimer = setInterval(cycle, CYCLE_MS);
  }

  function stopCycling() {
    if (cycleTimer) clearInterval(cycleTimer);
    cycleTimer = null;
  }

  function resetToHome() {
    state.history = [initialLang];
    state.historyIndex = 0;
    state.lastLetter = '';
    state.lastLetterIndex = -1;
    setLang(initialLang);
  }

  function stepBack() {
    if (state.historyIndex <= 0) return;
    setPaused(true);
    stopCycling();
    flash('backward');
    state.lastLetter = '';
    goToIndex(state.historyIndex - 1);
  }

  function stepForward() {
    setPaused(true);
    stopCycling();
    flash('forward');
    state.lastLetter = '';
    if (state.historyIndex < state.history.length - 1) goToIndex(state.historyIndex + 1);
    else cycle();
  }

  function jumpToLetter(letter) {
    var matches = [];
    for (var i = 0; i < LANGS.length; i++) {
      var name = ((DATA[LANGS[i]] && DATA[LANGS[i]].fullname) || LANGS[i]).replace(/\([^)]*\)/g, '').toLowerCase();
      var parts = name.split(/[\s&,-]+/);
      for (var p = 0; p < parts.length; p++) {
        if (parts[p].indexOf(letter) === 0) { matches.push({ code: LANGS[i], name: name }); break; }
      }
    }
    matches.sort(function (a, b) { return a.name < b.name ? -1 : a.name > b.name ? 1 : 0; });
    flash(letter.toUpperCase());
    if (!matches.length) return;
    setPaused(true);
    stopCycling();
    var next = state.lastLetter === letter ? (state.lastLetterIndex + 1) % matches.length : 0;
    state.lastLetter = letter;
    state.lastLetterIndex = next;
    pushLang(matches[next].code);
  }

  // ── Pause / play ───────────────────────────────────────────────────────
  function togglePause() {
    if (!state.paused) {
      setPaused(true);
      stopCycling();
      flash('pause');
      return;
    }
    setPaused(false);
    flash('play');
    state.lastLetter = '';
    if (state.hovering || state.isTouch) startCycling();
    else resetToHome();
  }

  function toggleFullscreen() {
    var doc = document;
    var el = doc.documentElement;
    var isFull = doc.fullscreenElement || doc.webkitFullscreenElement;
    if (!isFull) {
      var req = el.requestFullscreen || el.webkitRequestFullscreen;
      if (req) try { req.call(el); } catch (e) { /* not allowed here */ }
    } else {
      var exit = doc.exitFullscreen || doc.webkitExitFullscreen;
      if (exit) try { exit.call(doc); } catch (e) { /* ignore */ }
    }
  }

  // ── Idle phrase rotation ───────────────────────────────────────────────
  function isResting() {
    return !state.paused && !state.hovering && state.lang === initialLang;
  }

  function armIdle() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = null;
    if (!isResting()) return;
    idleTimer = setTimeout(function () {
      state.phrase = pickPhrase(state.phrase);
      state.symbols = shuffle(SYMBOLS);
      render();
      armIdle();
    }, IDLE_SWAP_MS);
  }

  // ── Events ─────────────────────────────────────────────────────────────
  function onWordsEnter() {
    state.hovering = true;
    armIdle();
    if (!state.paused) startCycling();
  }

  function onWordsLeave() {
    state.hovering = false;
    stopCycling();
    if (!state.paused) resetToHome();
    armIdle();
  }

  function onWordsClick(e) {
    e.stopPropagation();
    if (state.suppressClick) { state.suppressClick = false; return; }
    var now = Date.now();
    if (now - state.lastClick < DOUBLE_TAP_MS) toggleFullscreen();
    else togglePause();
    state.lastClick = now;
  }

  function onBackgroundClick() {
    if (state.suppressClick) { state.suppressClick = false; return; }
    var now = Date.now();
    if (now - state.lastClick < DOUBLE_TAP_MS) { toggleFullscreen(); state.lastClick = now; return; }
    state.lastClick = now;
    // Reset to the original resting state — the idle countdown restarts.
    stopCycling();
    state.hovering = false;
    setPaused(false);
    resetToHome();
  }

  function onKeydown(e) {
    var key = e.key || '';
    if (key === 'ArrowLeft' || e.keyCode === 37) stepBack();
    else if (key === 'ArrowRight' || e.keyCode === 39) stepForward();
    else if (key === 'ArrowUp' || e.keyCode === 38) setColored(true);
    else if (key === 'ArrowDown' || e.keyCode === 40) setColored(false);
    else if (key === ' ' || e.keyCode === 32) { e.preventDefault(); togglePause(); }
    else if (key.length === 1 && /[a-zA-Z]/.test(key)) jumpToLetter(key.toLowerCase());
    else if (!key && e.keyCode >= 65 && e.keyCode <= 90) jumpToLetter(String.fromCharCode(e.keyCode).toLowerCase());
    armIdle();
  }

  function onWheel(e) {
    armIdle();
    if (e.deltaY >= 0) return;
    if (!wheelActive) { wheelActive = true; setColored(!state.colored); }
    if (wheelTimer) clearTimeout(wheelTimer);
    wheelTimer = setTimeout(function () { wheelActive = false; }, 400);
  }

  var touchStartX = 0, touchStartY = 0;
  function onTouchStart(e) {
    state.isTouch = true;
    armIdle();
    if (e.touches && e.touches.length) { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; }
    if (!state.paused && !cycleTimer && closest(e.target, els.wrapper)) startCycling();
  }

  function onTouchEnd(e) {
    if (!e.changedTouches || !e.changedTouches.length) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > SWIPE_PX) { state.suppressClick = true; if (dx < 0) stepForward(); else stepBack(); }
    } else if (dy > SWIPE_PX) {
      state.suppressClick = true;
      setColored(!state.colored);
    }
  }

  function closest(node, ancestor) {
    while (node) { if (node === ancestor) return true; node = node.parentNode; }
    return false;
  }

  // ── Archive forward (wearedogs.net → dogs.red/lite/) ───────────────────
  function forwardFromArchive() {
    if (!ARCHIVE_HOST_RE.test(location.hostname)) return;
    try { if (/[?&]stay(=|&|$)/.test(location.search)) sessionStorage.setItem(STAY_KEY, '1'); } catch (e) { /* ignore */ }
    if (stored(STAY_KEY)) return;
    var settled = false;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', LIVE_ORIGIN + '/health.json?t=' + Date.now(), true);
    xhr.timeout = PROBE_TIMEOUT_MS;
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4 || settled) return;
      settled = true;
      if (xhr.status === 200 && /"mode"\s*:\s*"live"/.test(xhr.responseText)) {
        location.replace(LIVE_ORIGIN + '/lite/' + location.search + location.hash);
      }
    };
    xhr.ontimeout = function () { settled = true; };
    xhr.onerror = function () { settled = true; };
    xhr.send();
  }

  // ── Boot ───────────────────────────────────────────────────────────────
  state.phrase = pickPhrase(null);
  render();
  armIdle();
  forwardFromArchive();

  els.wrapper.addEventListener('mouseenter', onWordsEnter);
  els.wrapper.addEventListener('mouseleave', onWordsLeave);
  els.wrapper.addEventListener('click', onWordsClick);
  els.wad.addEventListener('click', onBackgroundClick);
  els.lang.addEventListener('click', function (e) { e.stopPropagation(); if (!state.paused) togglePause(); });
  els.corner.addEventListener('click', function (e) { e.stopPropagation(); setColored(!state.colored); });
  window.addEventListener('keydown', onKeydown);
  window.addEventListener('wheel', onWheel);
  els.wad.addEventListener('touchstart', onTouchStart);
  els.wad.addEventListener('touchend', onTouchEnd);
}());
