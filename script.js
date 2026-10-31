/* 柴犬手帖 · 互動邏輯 */

(function () {
  "use strict";

  /* ── 1. 頂欄：滾動後變色 ───────────────────────────────── */
  const topbar = document.getElementById("topbar");
  const onScroll = () => {
    if (window.scrollY > 40) topbar.classList.add("is-stuck");
    else topbar.classList.remove("is-stuck");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ── 2. 手機選單 ───────────────────────────────────────── */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");

  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ── 3. 進場動畫 ───────────────────────────────────────── */
  const reveals = document.querySelectorAll(".reveal");

  /* 先確認 JS 正常執行，才啟用「先隱藏、再進場」嘅效果，
     避免 JS 失效時整頁內容變空白 */
  if (reveals.length && "IntersectionObserver" in window) {
    document.documentElement.classList.add("reveal-ready");
  }

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* ── 4. 導覽列 scrollspy ───────────────────────────────── */
  const links = Array.from(nav.querySelectorAll("a"));
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) =>
            a.classList.toggle(
              "is-active",
              a.getAttribute("href") === "#" + entry.target.id
            )
          );
        });
      },
      { rootMargin: "-45% 0px -48% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ── 5. 照顧清單（localStorage）────────────────────────── */
  const KEY = "shiba-care-checklist-v1";
  const boxes = Array.from(document.querySelectorAll("#checkList input"));
  let saved = {};

  try {
    saved = JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch (err) {
    saved = {};
  }

  boxes.forEach((box) => {
    if (saved[box.dataset.key]) box.checked = true;
    box.addEventListener("change", () => {
      const state = {};
      boxes.forEach((b) => {
        if (b.checked) state[b.dataset.key] = true;
      });
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
      } catch (err) {
        /* 無痕模式下寫入失敗，忽略即可 */
      }
    });
  });

  const resetBtn = document.getElementById("resetList");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      boxes.forEach((b) => (b.checked = false));
      try {
        localStorage.removeItem(KEY);
      } catch (err) {
        /* ignore */
      }
    });
  }

  /* ── 6. 年份 ───────────────────────────────────────────── */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
