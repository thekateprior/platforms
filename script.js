/* ============================================================
   Reading the Interface — interactions + reveal-the-discourse
   Vanilla JS, no dependencies.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Annotation content: affordance -> norm -> source ---------- */
  const ANNOTATIONS = {
    reddit: {
      "reddit-vote": {
        title: "Up / downvote + karma",
        norm: "The first control on every post is an evaluation. Ranking contribution is the path of least resistance, so the interface produces a competitive, deliberative public where speech is sorted by crowd approval.",
        src: "Stanfill 2014",
      },
      "reddit-thread": {
        title: "Nested threading",
        norm: "Replies indent into branching arguments rather than a flat feed. The layout scripts debate and rebuttal as the normal mode of talk.",
        src: "Stanfill 2014 · Baym & boyd 2012",
      },
      "reddit-report": {
        title: "The Report flag",
        norm: "A single click reduces a complex objection to a governance signal. The flag is both content moderation at scale and a 'vocabulary of complaint' that hands judgment to the platform.",
        src: "Crawford & Gillespie 2016",
      },
      "reddit-rules": {
        title: "Subreddit rules sidebar",
        norm: "Norms are made explicit and local: each community codifies its own 'correct' use, disciplining posts before a moderator ever acts.",
        src: "Stanfill 2014",
      },
      "reddit-join": {
        title: "Pseudonymous membership",
        norm: "You 'join' a community as a u/ handle, not a real name. Persistence + searchability build a networked public detached from offline identity.",
        src: "Baym & boyd 2012",
      },
    },
    pinsta: {
      "pinsta-search": {
        title: "Search-for-ideas box",
        norm: "The platform frames itself around finding and collecting 'ideas' — you arrive to gather, not to broadcast. Discovery is scripted as curation.",
        src: "Friz & Gehl 2016",
      },
      "pinsta-chips": {
        title: "Feminized interest categories",
        norm: "Home decor, recipes, weddings, fashion: the sign-up and category scaffolding inscribe a gender script, encouraging users to cooperate and curate rather than compete or create.",
        src: "Friz & Gehl 2016",
      },
      "pinsta-save": {
        title: "Save / Pin",
        norm: "The dominant verb is save — re-collecting others' images onto your boards. Curating, not creating, is the easiest and most rewarded act.",
        src: "Friz & Gehl 2016",
      },
      "pinsta-like": {
        title: "The Like button + counter",
        norm: "A tap converts affect into a public number. Each like is instantly datafied, feeding a 'like economy' that metrifies feeling across the web.",
        src: "Gerlitz & Helmond 2013",
      },
      "pinsta-tags": {
        title: "Aspirational hashtags",
        norm: "Tags cluster images into aesthetics and aspirations (#slowliving, #inspo), organizing the feed around affect and taste rather than argument.",
        src: "Gerlitz & Helmond 2013",
      },
    },
    tumblr: {
      "tumblr-types": {
        title: "Post-type toolbar",
        norm: "Text, Photo, Quote, Link, Chat, Audio, Video — creation is offered as remixable media formats, priming a culture of repurposing over original authorship.",
        src: "Highfield, Harrington & Bruns 2013",
      },
      "tumblr-reblog": {
        title: "Reblog",
        norm: "There is no clean 'original' view and no vote. The easy gesture copies a post onto your own blog, making circulation — not ranking — the core act of participation.",
        src: "Highfield, Harrington & Bruns 2013",
      },
      "tumblr-tags": {
        title: "Tags as commentary",
        norm: "Tags function less as search terms than as whispered, sideways commentary — an affective, in-group annotation practice native to fandom.",
        src: "Highfield, Harrington & Bruns 2013",
      },
      "tumblr-chain": {
        title: "The note / reblog chain",
        norm: "Every reblog appends a new author to a visible chain, so a post accretes commentary as it spreads. Value is spreadability, and authorship is collective and transformative.",
        src: "Highfield, Harrington & Bruns 2013 · Baym & boyd 2012",
      },
    },
  };

  /* ---------- Interaction callouts ---------- */
  const CALLOUTS = {
    reddit: "You just <b>ranked a contribution</b>. On Reddit the easy gesture is evaluation — productive power that scripts a competitive, deliberative public (Stanfill 2014).",
    "reddit-report": "You <b>flagged</b> content: one click that collapses a complex objection into a governance signal — the vocabulary of complaint (Crawford & Gillespie 2016).",
    pinsta: "You <b>curated and metrified affect</b>. Saving re-collects rather than creates; the like turns feeling into data — the like economy (Friz & Gehl 2016; Gerlitz & Helmond 2013).",
    tumblr: "You <b>reblogged</b>: the post spread to your blog and grew its note chain. Value is circulation, authorship is collective — transformative audiencing (Highfield et al. 2013).",
  };

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fmt = (n) => n.toLocaleString("en-US");

  /* ---------- Callout helper ---------- */
  const calloutTimers = {};
  function showCallout(platform, key) {
    const el = document.querySelector('[data-callout="' + platform + '"]');
    if (!el) return;
    el.innerHTML = CALLOUTS[key] || CALLOUTS[platform];
    el.hidden = false;
    clearTimeout(calloutTimers[platform]);
    calloutTimers[platform] = setTimeout(() => { el.hidden = true; }, 9000);
  }

  /* ============================================================
     REVEAL THE DISCOURSE
     ============================================================ */
  document.querySelectorAll(".reveal-toggle").forEach((btn) => {
    const platform = btn.dataset.reveal;
    const stage = document.querySelector('[data-stage="' + platform + '"]');
    const panel = document.querySelector('[data-annos="' + platform + '"]');
    const hotspots = stage.querySelectorAll(".hotspot");

    function renderAnnotations(activeKey) {
      const data = ANNOTATIONS[platform];
      panel.innerHTML = "";
      hotspots.forEach((hs) => {
        const key = hs.dataset.hs;
        const info = data[key];
        if (!info) return;
        const card = document.createElement("div");
        card.className = "anno";
        card.dataset.for = key;
        if (key === activeKey) card.style.borderLeftColor = "var(--accent-2)";
        card.innerHTML =
          '<h5><span class="anno-n">' + hs.textContent + "</span>" + info.title + "</h5>" +
          "<p>" + info.norm + "</p>" +
          '<p class="anno-src">→ ' + info.src + "</p>";
        panel.appendChild(card);
      });
    }

    btn.addEventListener("click", () => {
      const on = btn.getAttribute("aria-pressed") === "true";
      const next = !on;
      btn.setAttribute("aria-pressed", String(next));
      stage.classList.toggle("is-revealed", next);
      hotspots.forEach((hs) => { hs.hidden = !next; });
      if (next) renderAnnotations();
      else panel.innerHTML = "";
    });

    // clicking a hotspot highlights its annotation card
    hotspots.forEach((hs) => {
      hs.setAttribute("role", "button");
      hs.setAttribute("tabindex", "0");
      const key = hs.dataset.hs;
      const label = (ANNOTATIONS[platform][key] || {}).title || "annotation";
      hs.setAttribute("aria-label", "Annotation " + hs.textContent + ": " + label);
      function activate() {
        hotspots.forEach((h) => h.classList.remove("is-active"));
        hs.classList.add("is-active");
        renderAnnotations(key);
        const card = panel.querySelector('[data-for="' + key + '"]');
        if (card && !prefersReduced) card.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      hs.addEventListener("click", activate);
      hs.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
      });
    });
  });

  /* ============================================================
     REDDIT interactions
     ============================================================ */
  document.querySelectorAll(".ui-reddit .rd-vote").forEach((group) => {
    const scoreEl = group.querySelector(".rd-score");
    const up = group.querySelector(".rd-up");
    const down = group.querySelector(".rd-down");
    const base = parseInt(scoreEl.dataset.score, 10);
    let state = 0; // -1, 0, 1

    function paint() {
      scoreEl.textContent = fmt(base + state);
      up.classList.toggle("is-on", state === 1);
      down.classList.toggle("is-on", state === -1);
    }
    up.addEventListener("click", () => {
      state = state === 1 ? 0 : 1;
      paint();
      showCallout("reddit", "reddit");
    });
    down.addEventListener("click", () => {
      state = state === -1 ? 0 : -1;
      paint();
      showCallout("reddit", "reddit");
    });
  });

  const joinBtn = document.querySelector(".rd-join");
  if (joinBtn) {
    joinBtn.addEventListener("click", () => {
      const joined = joinBtn.classList.toggle("is-joined");
      joinBtn.textContent = joined ? "Joined" : "Join";
    });
  }

  const commentsBtn = document.querySelector("[data-comments]");
  const thread = document.querySelector("[data-thread]");
  if (commentsBtn && thread) {
    commentsBtn.addEventListener("click", () => {
      thread.hidden = !thread.hidden;
    });
  }

  const reportBtn = document.querySelector(".rd-report");
  if (reportBtn) {
    reportBtn.addEventListener("click", () => {
      reportBtn.textContent = "⚑ Reported";
      reportBtn.disabled = true;
      showCallout("reddit", "reddit-report");
    });
  }

  /* ============================================================
     PINTEREST / INSTAGRAM interactions
     ============================================================ */
  document.querySelectorAll(".pin-like").forEach((btn) => {
    const countEl = btn.querySelector(".pin-likes");
    const base = parseInt(countEl.dataset.likes, 10);
    let liked = false;
    btn.addEventListener("click", () => {
      liked = !liked;
      btn.classList.toggle("is-liked", liked);
      btn.querySelector(".heart").textContent = liked ? "♥" : "♡";
      countEl.textContent = fmt(base + (liked ? 1 : 0));
      showCallout("pinsta", "pinsta");
    });
  });

  document.querySelectorAll(".pin-save").forEach((btn) => {
    btn.addEventListener("click", () => {
      const saved = btn.classList.toggle("is-saved");
      btn.textContent = saved ? "Saved" : "Save";
      showCallout("pinsta", "pinsta");
    });
  });

  document.querySelectorAll(".pn-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".pn-chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
    });
  });

  /* ============================================================
     TUMBLR interactions
     ============================================================ */
  const reblogBtn = document.querySelector(".tm-reblog");
  const chain = document.querySelector("[data-chain]");
  const notesEl = document.querySelector("[data-notes]");
  if (reblogBtn && chain && notesEl) {
    let reblogged = false;
    const base = parseInt(notesEl.dataset.notes, 10);
    reblogBtn.addEventListener("click", () => {
      reblogged = !reblogged;
      reblogBtn.classList.toggle("is-on", reblogged);
      const existing = chain.querySelector(".is-you");
      if (reblogged && !existing) {
        const li = document.createElement("li");
        li.className = "is-you is-new";
        li.innerHTML = '<a href="#tumblr">you</a> <span>reblogged this and added: &ldquo;this!! ❤️&rdquo;</span>';
        chain.appendChild(li);
        notesEl.textContent = fmt(base + 1);
        showCallout("tumblr", "tumblr");
      } else if (!reblogged && existing) {
        existing.remove();
        notesEl.textContent = fmt(base);
      }
    });
  }

  const likeBtn = document.querySelector(".tm-like");
  if (likeBtn) {
    likeBtn.addEventListener("click", () => {
      const on = likeBtn.classList.toggle("is-on");
      likeBtn.textContent = on ? "♥" : "♡";
    });
  }
})();
