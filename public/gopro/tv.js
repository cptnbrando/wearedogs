/* GoPro TV — strict ES5. Runs on TV browsers from the dark ages:
   no arrow functions, no let/const, no template literals, no fetch,
   no Promise assumptions. Data comes from catalog.js (window.WAD_TV). */
/* eslint-disable no-var */

(function () {
  "use strict";

  var DATA = window.WAD_TV || { catalog: {}, slugs: {} };
  var PASS_KEY = "gopro_password";
  // Production pages talk to data.wearedogs.net directly; anything else
  // (localhost, LAN IP) goes through the dev server's /vid proxy paths.
  var IS_PROD = window.location.hostname.indexOf("wearedogs.net") !== -1;
  var CHECK_URL = IS_PROD
    ? "https://data.wearedogs.net/vid/popcorn/check.txt"
    : "/vid/popcorn/check.txt";

  var gateEl = document.getElementById("gate");
  var gateInput = document.getElementById("gate-input");
  var gateBtn = document.getElementById("gate-btn");
  var gateMsg = document.getElementById("gate-msg");
  var tvEl = document.getElementById("tv");
  var playerEl = document.getElementById("player");
  var playerMsgEl = document.getElementById("player-msg");
  var nowPlayingEl = document.getElementById("now-playing");
  var showsEl = document.getElementById("shows");
  var episodesEl = document.getElementById("episodes");
  var errEl = document.getElementById("err");

  var password = "";
  var currentShow = null;
  var currentFile = null;
  var triedWithParam = false;

  // ── storage (TV privacy modes can throw on any access) ──
  function getStored() {
    try { return window.localStorage.getItem(PASS_KEY) || ""; } catch (e) { return ""; }
  }
  function setStored(v) {
    try { window.localStorage.setItem(PASS_KEY, v); } catch (e) { /* no-op */ }
  }

  // ── query string (no URLSearchParams on old engines) ──
  function queryParam(name) {
    var q = window.location.search.replace(/^\?/, "").split("&");
    for (var i = 0; i < q.length; i++) {
      var kv = q[i].split("=");
      if (kv[0] === name) return decodeURIComponent(kv[1] || "");
    }
    return "";
  }

  function showBase(show) {
    return IS_PROD ? show.baseUrl : show.path;
  }

  // ── password gate ──
  function checkCode(code, onResult) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", CHECK_URL, true);
    xhr.setRequestHeader("Authorization", "password=" + code);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) onResult(xhr.status === 200);
    };
    try { xhr.send(); } catch (e) { onResult(false); }
  }

  function openGate() {
    gateEl.className = "gate";
    tvEl.className = "tv hidden";
    gateInput.focus();
  }

  function openTv() {
    gateEl.className = "gate hidden";
    tvEl.className = "tv";
    buildShows();
    applyDeepLink();
  }

  function submitCode() {
    var code = gateInput.value;
    if (!code) return;
    gateMsg.innerHTML = "Checking…";
    checkCode(code, function (ok) {
      if (ok) {
        password = code;
        setStored(code);
        openTv();
      } else {
        gateMsg.innerHTML = "Wrong code. Try again.";
        gateInput.value = "";
        gateInput.focus();
      }
    });
  }

  gateBtn.onclick = submitCode;
  gateInput.onkeydown = function (e) {
    if ((e || window.event).keyCode === 13) submitCode();
  };

  // ── show / episode UI ──
  function showNames() {
    var names = [];
    for (var k in DATA.catalog) {
      if (DATA.catalog.hasOwnProperty(k)) names.push(k);
    }
    return names;
  }

  function buildShows() {
    var names = showNames();
    showsEl.innerHTML = "";
    for (var i = 0; i < names.length; i++) {
      (function (name) {
        var show = DATA.catalog[name];
        var btn = document.createElement("button");
        btn.appendChild(document.createTextNode(show.symbol + " " + name));
        btn.className = name === currentShow ? "active" : "";
        btn.onclick = function () { selectShow(name, null); };
        showsEl.appendChild(btn);
      })(names[i]);
    }
  }

  function selectShow(name, autoplayFile) {
    currentShow = name;
    buildShows();
    var show = DATA.catalog[name];
    episodesEl.innerHTML = "";
    for (var i = 0; i < show.episodes.length; i++) {
      (function (ep) {
        var btn = document.createElement("button");
        var label = ep.file.replace(/\.(mp4|mkv)$/i, "") + " — " + ep.title;
        btn.appendChild(document.createTextNode(label + " "));
        if (/\.mkv$/i.test(ep.file)) {
          var tag = document.createElement("span");
          tag.className = "mkv-tag";
          tag.appendChild(document.createTextNode("[MKV]"));
          btn.appendChild(tag);
        }
        btn.onclick = function () { playEpisode(name, ep, btn); };
        if (autoplayFile && ep.file === autoplayFile) {
          window.setTimeout(function () { playEpisode(name, ep, btn); }, 50);
        }
        episodesEl.appendChild(btn);
      })(show.episodes[i]);
    }
    if (episodesEl.firstChild && !autoplayFile) episodesEl.firstChild.focus();
  }

  function markPlaying(activeBtn) {
    var btns = episodesEl.getElementsByTagName("button");
    for (var i = 0; i < btns.length; i++) btns[i].className = "";
    if (activeBtn) activeBtn.className = "playing";
  }

  function playEpisode(showName, ep, btn) {
    var show = DATA.catalog[showName];
    currentFile = ep.file;
    triedWithParam = false;
    errEl.innerHTML = "";
    playerMsgEl.innerHTML = "";
    nowPlayingEl.innerHTML = "";
    nowPlayingEl.appendChild(
      document.createTextNode(show.symbol + " " + ep.title)
    );
    markPlaying(btn);
    playerEl.src = showBase(show) + ep.file;
    playerEl.load();
    playerEl.play();
    updateUrl(showName, ep);
  }

  // If the edge rejects the plain URL (auth rule), retry once with the
  // password as a query param — works whichever Cloudflare rule is active.
  playerEl.onerror = function () {
    if (!currentFile || !currentShow) return;
    if (!triedWithParam && password) {
      triedWithParam = true;
      var show = DATA.catalog[currentShow];
      playerEl.src =
        showBase(show) + currentFile + "?p=" + encodeURIComponent(password);
      playerEl.load();
      playerEl.play();
      return;
    }
    errEl.innerHTML =
      "Could not play " + currentFile + ". " +
      (/\.mkv$/i.test(currentFile)
        ? "This TV may not support MKV files."
        : "Check your connection and code.");
  };

  // ── deep links: /gopro/?show=batman&ep=s01e03 ──
  function applyDeepLink() {
    var slug = queryParam("show").toLowerCase();
    var epQ = queryParam("ep").toLowerCase();
    var name = DATA.slugs[slug] || null;
    if (!name || !DATA.catalog[name]) {
      // default to the first show
      var names = showNames();
      if (names.length) selectShow(names[0], null);
      return;
    }
    var autoplayFile = null;
    if (epQ) {
      var eps = DATA.catalog[name].episodes;
      for (var i = 0; i < eps.length; i++) {
        if (eps[i].file.toLowerCase().indexOf(epQ) !== -1) {
          autoplayFile = eps[i].file;
          break;
        }
      }
    }
    selectShow(name, autoplayFile);
  }

  function updateUrl(showName, ep) {
    if (!window.history || typeof window.history.replaceState !== "function") return;
    var slug = null;
    for (var s in DATA.slugs) {
      if (DATA.slugs.hasOwnProperty(s) && DATA.slugs[s] === showName) {
        slug = s;
        break;
      }
    }
    if (!slug) return;
    var epPart = ep.file.replace(/\.(mp4|mkv)$/i, "").toLowerCase();
    try {
      window.history.replaceState(
        null, "", "/gopro/?show=" + slug + "&ep=" + epPart
      );
    } catch (e) { /* no-op */ }
  }

  // ── D-pad: arrows move focus, Enter clicks (native on <button>) ──
  document.onkeydown = function (e) {
    e = e || window.event;
    var code = e.keyCode;
    if (code < 37 || code > 40) return;
    var active = document.activeElement;
    if (!active || active.tagName !== "BUTTON") return;

    var inEpisodes = active.parentNode === episodesEl;
    var inShows = active.parentNode === showsEl;
    var target = null;

    if (inEpisodes) {
      if (code === 38) target = active.previousSibling; // up
      if (code === 40) target = active.nextSibling; // down
      if (code === 37 || code === 39) target = showsEl.firstChild; // to shows
    } else if (inShows) {
      if (code === 37) target = active.previousSibling;
      if (code === 39) target = active.nextSibling;
      if (code === 40) target = episodesEl.firstChild; // to episodes
    }

    if (target && target.focus) {
      target.focus();
      if (e.preventDefault) e.preventDefault();
      else e.returnValue = false;
    }
  };

  // ── boot ──
  var stored = getStored();
  if (stored) {
    password = stored;
    // Trust the stored code for instant startup, but re-verify quietly;
    // an invalidated code sends the viewer back to the gate.
    openTv();
    checkCode(stored, function (ok) {
      if (!ok) {
        try { window.localStorage.removeItem(PASS_KEY); } catch (e) { /* no-op */ }
        password = "";
        openGate();
      }
    });
  } else {
    openGate();
  }
})();
