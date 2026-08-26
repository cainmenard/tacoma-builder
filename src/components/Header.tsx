"use client";

import { useEffect, useState } from "react";

const NAV = [
  ["matcher", "Matcher"],
  ["table", "Compare"],
  ["cost", "Cost"],
  ["charts", "Charts"],
  ["gaps", "Gaps"],
];

export function Header() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("uca-theme");
    const initial = stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setDark(initial === "dark");
  }, []);

  function toggle() {
    const next = dark ? "light" : "dark";
    setDark(!dark);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("uca-theme", next);
    } catch {}
  }

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-[color-mix(in_srgb,var(--paper)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1180px] items-center gap-4 px-4 py-2.5 sm:px-6">
        <a href="#top" className="num shrink-0 text-[12px] font-bold tracking-[0.06em]">
          UCA<span style={{ color: "var(--accent)" }}>·</span>INDEX
        </a>
        <nav className="scroll-x flex flex-1 gap-1">
          {NAV.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="num whitespace-nowrap rounded-sm px-2 py-1 text-[11px] uppercase tracking-[0.09em] text-ink-2 hover:bg-surface-2 hover:text-ink"
            >
              {label}
            </a>
          ))}
        </nav>
        <button
          onClick={toggle}
          aria-label={dark ? "Switch to light" : "Switch to dark"}
          className="num shrink-0 rounded-sm border border-rule px-2 py-1 text-[11px] text-ink-2 hover:border-accent hover:text-accent"
        >
          {dark ? "☀" : "☾"}
        </button>
      </div>
    </header>
  );
}
