import type { AppView } from "../types/analysis";

interface HeaderProps {
  activeView: AppView;
  onSelectView: (view: AppView) => void;
  onLoadDefaultSample: () => void;
  historyCount: number;
  hasExtractedText: boolean;
}

export function Header({
  activeView,
  onSelectView,
  onLoadDefaultSample,
  historyCount,
  hasExtractedText,
}: HeaderProps) {
  const navItems: { id: AppView; label: string }[] = [
    { id: "analyzer", label: "Analyzer" },
    {
      id: "extracted",
      label: hasExtractedText ? "Extracted Text" : "Resume Text",
    },
    {
      id: "history",
      label: historyCount > 0 ? `History (${historyCount})` : "History",
    },
    { id: "methodology", label: "Methodology" },
  ];

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-8 px-6 py-4">
        <button
          type="button"
          onClick={() => onSelectView("analyzer")}
          className="text-left font-[var(--font-display)] text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
        >
          ResumeCheck
        </button>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6"
        >
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 ${
                  isActive
                    ? "text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[17px] h-0.5 bg-blue-700"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onLoadDefaultSample}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Load Sample
          </button>
        </div>
      </div>

      {/* Mobile navigation strip */}
      <nav
        aria-label="Mobile navigation"
        className="flex md:hidden items-center gap-4 overflow-x-auto border-t border-slate-100 px-6 py-2.5"
      >
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectView(item.id)}
              className={`text-xs font-medium whitespace-nowrap shrink-0 pb-0.5 ${
                isActive
                  ? "text-blue-700 border-b-2 border-blue-700"
                  : "text-slate-600"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
