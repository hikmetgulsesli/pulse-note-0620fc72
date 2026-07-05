// AUTO-GENERATED from Stitch — DO NOT modify layout or CSS
// Screen: Insights - Pulse Note
// 
// AGENT INSTRUCTIONS:
// 1. DO NOT change className values or layout structure
// 2. Add useState for dynamic values (replace hardcoded text)
// 3. Wire interactive controls through the typed actions prop
// 4. Replace placeholder data with props/state

import { ArrowUp, BadgeHelp, CheckCircle2, CircleHelp, ClipboardList, Download, EllipsisVertical, FilePenLine, FileText, ListFilter, PackageSearch, Settings, TrendingUp } from "lucide-react";


export type InsightsPulseNoteActionId = "settings-1" | "help-2" | "new-record-3" | "filter-4" | "export-summary-5" | "more-vert-6" | "view-all-7" | "review-8" | "analyze-9" | "operations-1" | "insights-2";

export interface InsightsPulseNoteProps {
  actions?: Partial<Record<InsightsPulseNoteActionId, () => void>>;

}

export function InsightsPulseNote({ actions }: InsightsPulseNoteProps) {
  return (
    <>
      {/* TopNavBar */}
      <header className="bg-surface-container-lowest dark:bg-inverse-surface border-b border-outline-variant dark:border-outline flex justify-between items-center w-full px-margin-desktop h-16 sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center gap-lg">
      <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">Pulse Note</span>
      <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-md">
      <a className="font-headline-sm text-headline-sm text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-high dark:hover:bg-surface-variant transition-colors px-sm py-xs rounded active:scale-95 transition-transform flex items-center gap-xs" href="#" data-action-id="operations-1" onClick={(event) => { event.preventDefault(); actions?.["operations-1"]?.(); }}>
                          Operations
                      </a>
      <a aria-current="page" className="font-headline-sm text-headline-sm text-primary dark:text-primary-fixed-dim border-b-2 border-primary dark:border-primary-fixed-dim pb-1 hover:bg-surface-container-high dark:hover:bg-surface-variant transition-colors px-sm rounded-t active:scale-95 transition-transform flex items-center gap-xs" href="#" data-action-id="insights-2" onClick={(event) => { event.preventDefault(); actions?.["insights-2"]?.(); }}>
                          Insights
                      </a>
      </nav>
      </div>
      <div className="flex items-center gap-md">
      <div className="hidden md:flex items-center gap-sm">
      <button aria-label="settings" className="w-10 h-10 rounded-full hover:bg-surface-container-high dark:hover:bg-surface-variant flex items-center justify-center text-primary dark:text-primary-fixed-dim transition-colors" type="button" data-action-id="settings-1" onClick={actions?.["settings-1"]}>
      <Settings  style={{fontVariationSettings: "'FILL' 0"}} aria-hidden={true} focusable="false" />
      </button>
      <button aria-label="help" className="w-10 h-10 rounded-full hover:bg-surface-container-high dark:hover:bg-surface-variant flex items-center justify-center text-primary dark:text-primary-fixed-dim transition-colors" type="button" data-action-id="help-2" onClick={actions?.["help-2"]}>
      <CircleHelp  style={{fontVariationSettings: "'FILL' 0"}} aria-hidden={true} focusable="false" />
      </button>
      </div>
      <button className="bg-primary hover:bg-surface-tint text-on-primary font-label-md text-label-md px-md py-sm rounded transition-colors active:scale-95 shadow-sm hidden md:block" type="button" data-action-id="new-record-3" onClick={actions?.["new-record-3"]}>
                      New Record
                  </button>
      <img alt="User Profile" className="w-8 h-8 rounded-full border border-outline-variant object-cover" data-alt="A professional headshot of a person looking confidently at the camera. The lighting is soft and natural, emphasizing a clean, corporate aesthetic. The background is a slightly blurred, light neutral gray office environment, perfectly complementing the minimalist corporate UI theme. The person is wearing a dark, well-tailored blazer." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrIn9UhtFsZgW-ixWnXpkV_mpDE6zBKTJKTXAWz4PH-1Ri-4vdW0HFEpP2QadD30SuY61Dyo__T5C2bCXiXH5fg5D1ex2SjpN7BlcvfiQPgN7NqxSq9iJ3Efxs4buoXI3Xanako2gq8aZaT18mb7Y738VwaCTDi3tzRo0GU_5izPWLYfT3LzPDbl_0QF8HhBsfUd1_YP3gxfQE_hh8CzQvm-aeUlNR-eAvW9aXlQf-a-x0ohAGJZKh3W2XH3FG_HsbQc5u5j-aTOsr" />
      </div>
      </header>
      {/* Main Content Layout */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row w-full max-w-[1440px] mx-auto">
      {/* Canvas */}
      <main className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop bg-surface flex flex-col gap-xl">
      {/* Page Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-md">
      <div>
      <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">Insights</h1>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Analyze daily records, track completion rates, and review recent activity.</p>
      </div>
      <div className="flex items-center gap-sm">
      <button className="h-10 px-md flex items-center gap-xs rounded border border-outline-variant bg-surface-container-lowest text-secondary font-label-md text-label-md hover:bg-surface-container-low transition-colors shadow-sm" id="ACT_FILTER_INSIGHTS" type="button" data-action-id="filter-4" onClick={actions?.["filter-4"]}>
      <ListFilter className="text-[18px]" aria-hidden={true} focusable="false" />
                              Filter
                          </button>
      <button className="h-10 px-md flex items-center gap-xs rounded border border-outline-variant bg-surface-container-lowest text-secondary font-label-md text-label-md hover:bg-surface-container-low transition-colors shadow-sm" id="ACT_EXPORT_SUMMARY" type="button" data-action-id="export-summary-5" onClick={actions?.["export-summary-5"]}>
      <Download className="text-[18px]" aria-hidden={true} focusable="false" />
                              Export Summary
                          </button>
      </div>
      </div>
      {/* Dashboard Grid (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
      {/* Metrics Column */}
      <div className="md:col-span-4 flex flex-col gap-gutter">
      {/* Daily Records Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg flex flex-col justify-between h-32 hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.05)] transition-shadow">
      <div className="flex items-center justify-between">
      <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">Daily Records</span>
      <FileText className="text-primary-container text-[20px]" aria-hidden={true} focusable="false" />
      </div>
      <div className="flex items-baseline gap-sm">
      <span className="font-headline-lg text-headline-lg text-on-surface font-bold">124</span>
      <span className="font-label-sm text-label-sm text-primary flex items-center"><ArrowUp className="text-[14px]" aria-hidden={true} focusable="false" /> 12%</span>
      </div>
      </div>
      {/* Completion Rate Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg flex flex-col justify-between h-32 hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.05)] transition-shadow">
      <div className="flex items-center justify-between">
      <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">Completion Rate</span>
      <CheckCircle2 className="text-primary-container text-[20px]" aria-hidden={true} focusable="false" />
      </div>
      <div className="flex items-baseline gap-sm">
      <span className="font-headline-lg text-headline-lg text-on-surface font-bold">98.2%</span>
      <span className="font-label-sm text-label-sm text-secondary flex items-center"><BadgeHelp className="text-[14px]" aria-hidden={true} focusable="false" /> 0%</span>
      </div>
      </div>
      </div>
      {/* Chart Area */}
      <div className="md:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-lg p-lg flex flex-col hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.05)] transition-shadow">
      <div className="flex items-center justify-between mb-lg">
      <h2 className="font-headline-sm text-headline-sm text-on-surface">Record States Distribution</h2>
      <button className="p-xs text-secondary hover:bg-surface-container-low rounded transition-colors" type="button" aria-label="More Vert" data-action-id="more-vert-6" onClick={actions?.["more-vert-6"]}><EllipsisVertical aria-hidden={true} focusable="false" /></button>
      </div>
      {/* Simplified Bar Chart Representation */}
      <div className="flex-1 flex flex-col justify-end gap-sm relative min-h-[200px] border-b border-l border-outline-variant pb-md pl-md">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-md flex flex-col justify-between text-[10px] text-secondary-fixed-dim -ml-6 w-5 text-right">
      <span>100</span>
      <span>50</span>
      <span>0</span>
      </div>
      {/* Grid lines */}
      <div className="absolute left-md right-0 top-0 h-px bg-surface-container-high"></div>
      <div className="absolute left-md right-0 top-1/2 h-px bg-surface-container-high"></div>
      {/* Bars */}
      <div className="flex items-end justify-around w-full h-full pt-lg relative z-10">
      <div className="flex flex-col items-center gap-xs group">
      <div className="w-12 bg-surface-container-highest rounded-t-sm h-[20%] group-hover:bg-primary-container transition-colors relative">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-inverse-surface text-on-primary font-label-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">12</div>
      </div>
      <span className="font-label-sm text-label-sm text-secondary">Draft</span>
      </div>
      <div className="flex flex-col items-center gap-xs group">
      <div className="w-12 bg-primary-container rounded-t-sm h-[85%] group-hover:bg-primary transition-colors relative shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)]">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-inverse-surface text-on-primary font-label-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">85</div>
      </div>
      <span className="font-label-sm text-label-sm text-on-surface">Active</span>
      </div>
      <div className="flex flex-col items-center gap-xs group">
      <div className="w-12 bg-tertiary-container rounded-t-sm h-[45%] group-hover:bg-tertiary transition-colors relative">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-inverse-surface text-on-primary font-label-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">45</div>
      </div>
      <span className="font-label-sm text-label-sm text-secondary">Pending</span>
      </div>
      <div className="flex flex-col items-center gap-xs group">
      <div className="w-12 bg-outline-variant rounded-t-sm h-[10%] group-hover:bg-outline transition-colors relative">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-inverse-surface text-on-primary font-label-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">5</div>
      </div>
      <span className="font-label-sm text-label-sm text-secondary">Archived</span>
      </div>
      </div>
      </div>
      </div>
      {/* Recent Activity & Actionable Hints */}
      <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-gutter">
      {/* Recent Activity Feed */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg flex flex-col hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.05)] transition-shadow overflow-hidden">
      <div className="p-lg border-b border-outline-variant bg-surface-bright flex justify-between items-center">
      <h3 className="font-headline-sm text-headline-sm text-on-surface">Recent Activity</h3>
      <button className="font-label-md text-label-md text-primary hover:underline" type="button" data-action-id="view-all-7" onClick={actions?.["view-all-7"]}>View All</button>
      </div>
      <div className="p-sm flex flex-col">
      {/* Log Event 1 */}
      <div className="flex items-start gap-md p-sm hover:bg-surface-container-low rounded transition-colors group">
      <div className="mt-1 w-8 h-8 rounded bg-primary-fixed-dim/20 flex items-center justify-center shrink-0">
      <FilePenLine className="text-[16px] text-primary-container" aria-hidden={true} focusable="false" />
      </div>
      <div className="flex-1 min-w-0 border-b border-outline-variant/30 pb-sm group-last:border-0">
      <p className="font-body-sm text-body-sm text-on-surface truncate">Record <span className="font-medium">#OP-204</span> updated by System Admin</p>
      <p className="font-label-sm text-label-sm text-secondary mt-1">2 mins ago</p>
      </div>
      </div>
      {/* Log Event 2 */}
      <div className="flex items-start gap-md p-sm hover:bg-surface-container-low rounded transition-colors group">
      <div className="mt-1 w-8 h-8 rounded bg-tertiary-fixed-dim/20 flex items-center justify-center shrink-0">
      <BadgeHelp className="text-[16px] text-tertiary-container" aria-hidden={true} focusable="false" />
      </div>
      <div className="flex-1 min-w-0 border-b border-outline-variant/30 pb-sm group-last:border-0">
      <p className="font-body-sm text-body-sm text-on-surface truncate">Batch approval requested for Q3 dataset</p>
      <p className="font-label-sm text-label-sm text-secondary mt-1">1 hour ago</p>
      </div>
      </div>
      {/* Log Event 3 */}
      <div className="flex items-start gap-md p-sm hover:bg-surface-container-low rounded transition-colors group">
      <div className="mt-1 w-8 h-8 rounded bg-surface-variant flex items-center justify-center shrink-0">
      <PackageSearch className="text-[16px] text-secondary" aria-hidden={true} focusable="false" />
      </div>
      <div className="flex-1 min-w-0 border-b border-outline-variant/30 pb-sm group-last:border-0">
      <p className="font-body-sm text-body-sm text-on-surface truncate">Automated archive routine completed (42 items)</p>
      <p className="font-label-sm text-label-sm text-secondary mt-1">Yesterday, 14:30</p>
      </div>
      </div>
      </div>
      </div>
      {/* Actionable Hints */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg flex flex-col hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.05)] transition-shadow overflow-hidden">
      <div className="p-lg border-b border-outline-variant bg-surface-bright">
      <h3 className="font-headline-sm text-headline-sm text-on-surface">Actionable Hints</h3>
      </div>
      <div className="p-md flex flex-col gap-sm">
      {/* Hint Card 1 */}
      <div className="border border-tertiary-container/30 bg-tertiary-fixed/10 p-md rounded flex items-center justify-between gap-md">
      <div className="flex items-center gap-md">
      <ClipboardList className="text-tertiary-container" aria-hidden={true} focusable="false" />
      <div>
      <p className="font-label-md text-label-md text-on-surface font-semibold">Review 3 pending notes</p>
      <p className="font-body-sm text-body-sm text-secondary mt-xs">Notes require manager sign-off before end of day.</p>
      </div>
      </div>
      <button className="font-label-sm text-label-sm bg-surface-container-lowest border border-outline-variant px-sm py-xs rounded text-secondary hover:bg-surface-container-high transition-colors whitespace-nowrap" type="button" data-action-id="review-8" onClick={actions?.["review-8"]}>Review</button>
      </div>
      {/* Hint Card 2 */}
      <div className="border border-primary-container/30 bg-primary-fixed/10 p-md rounded flex items-center justify-between gap-md">
      <div className="flex items-center gap-md">
      <TrendingUp className="text-primary-container" aria-hidden={true} focusable="false" />
      <div>
      <p className="font-label-md text-label-md text-on-surface font-semibold">Completion rate dropping</p>
      <p className="font-body-sm text-body-sm text-secondary mt-xs">Operations team X is lagging behind average.</p>
      </div>
      </div>
      <button className="font-label-sm text-label-sm bg-surface-container-lowest border border-outline-variant px-sm py-xs rounded text-secondary hover:bg-surface-container-high transition-colors whitespace-nowrap" type="button" data-action-id="analyze-9" onClick={actions?.["analyze-9"]}>Analyze</button>
      </div>
      </div>
      </div>
      </div>
      </div>
      {/* Empty / Error State Demonstration (Hidden by default, shown for structure completeness based on prompt) */}
      {/* <div className="flex-1 flex flex-col items-center justify-center p-xl border border-dashed border-outline-variant rounded-lg bg-surface-container-lowest text-center">
                      <BadgeHelp className="text-[48px] text-surface-dim mb-md" aria-hidden={true} focusable="false" />
                      <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">No Insights Available Yet</h3>
                      <p className="font-body-md text-body-md text-secondary max-w-md">We need a bit more data to generate meaningful insights. Continue logging records and check back soon.</p>
                  </div> */}
      </main>
      </div>
    </>
  );
}
