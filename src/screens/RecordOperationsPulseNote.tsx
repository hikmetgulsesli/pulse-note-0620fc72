// AUTO-GENERATED from Stitch — DO NOT modify layout or CSS
// Screen: Record Operations - Pulse Note
// 
// AGENT INSTRUCTIONS:
// 1. DO NOT change className values or layout structure
// 2. Add useState for dynamic values (replace hardcoded text)
// 3. Wire interactive controls through the typed actions prop
// 4. Replace placeholder data with props/state

import { BadgeHelp, ChevronDown, CircleHelp, FilePenLine, Pencil, Search, Settings, Trash2, TriangleAlert, X } from "lucide-react";


export type RecordOperationsPulseNoteActionId = "new-record-1" | "settings-2" | "help-3" | "edit-4" | "edit-5" | "edit-6" | "retry-7" | "close-8" | "edit-details-9" | "share-record-10" | "archive-record-11" | "operations-1" | "insights-2";

export interface RecordOperationsPulseNoteProps {
  actions?: Partial<Record<RecordOperationsPulseNoteActionId, () => void>>;

}

export function RecordOperationsPulseNote({ actions }: RecordOperationsPulseNoteProps) {
  return (
    <>
      {/* TopNavBar */}
      <header className="bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center w-full px-margin-desktop h-16 shrink-0 z-50">
      <div className="flex items-center gap-xl">
      <h1 className="text-headline-md font-headline-md font-bold text-primary">Pulse Note</h1>
      <nav className="hidden md:flex items-center gap-lg h-full">
      <a className="h-16 flex items-center text-primary border-b-2 border-primary text-headline-sm font-headline-sm" href="#" data-action-id="operations-1" onClick={(event) => { event.preventDefault(); actions?.["operations-1"]?.(); }}>Operations</a>
      <a className="h-16 flex items-center text-secondary hover:bg-surface-container-high transition-colors px-md text-headline-sm font-headline-sm" href="#" data-action-id="insights-2" onClick={(event) => { event.preventDefault(); actions?.["insights-2"]?.(); }}>Insights</a>
      </nav>
      </div>
      <div className="flex items-center gap-md">
      <div className="relative hidden lg:block mr-md">
      <Search  style={{fontSize: "20px"}} className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant" aria-hidden={true} focusable="false" />
      <input className="pl-[36px] pr-sm py-sm border border-outline-variant rounded bg-surface-container-lowest text-body-sm font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none w-64 text-on-surface placeholder:text-on-surface-variant" placeholder="Search records..." type="text" />
      </div>
      <button className="bg-primary text-on-primary px-md py-sm rounded text-label-md font-label-md hover:opacity-90 active:scale-95 transition-transform" data-action="ACT_CREATE_RECORD" type="button" data-action-id="new-record-1" onClick={actions?.["new-record-1"]}>New Record</button>
      <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors" data-icon="settings" type="button" aria-label="Settings" data-action-id="settings-2" onClick={actions?.["settings-2"]}>
      <Settings aria-hidden={true} focusable="false" />
      </button>
      <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors" data-icon="help" type="button" aria-label="Help" data-action-id="help-3" onClick={actions?.["help-3"]}>
      <CircleHelp aria-hidden={true} focusable="false" />
      </button>
      <div className="w-8 h-8 rounded-full bg-surface-variant border border-outline overflow-hidden ml-sm shrink-0">
      <img alt="User Profile" className="w-full h-full object-cover" data-alt="A professional headshot of a corporate user, neutral lighting, minimalist background, high resolution, suitable for a light-mode enterprise web application dashboard profile picture." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEtyce-xjTdeZ6R9vdSCo1wnXrGFDBeYiJ9EvY0SfGIBqC3O6cqwUWMdN_fXLeiGkxFgvH0MpEs3tClAWV51sVhSv1rBkVhZJ5iQQutbZDDP4RcbheCqcOJHey77TZOBTkWacr5ARlSlhnTpJWofHH1q_maPgl5A4WBqBI5K5hi5__krzwPoezm0b48y1RXGSbpudLtOq5feA5IxuMdgYFmE_kPg2XpNiHkB2R7v1EgqvH1eZHA_9SFZsirLIbetMadP0zwYYg3StC" />
      </div>
      </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-surface p-margin-desktop flex flex-col gap-xl">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg flex flex-col gap-sm">
      <span className="text-label-md font-label-md text-on-surface-variant">Total Records</span>
      <div className="text-headline-lg font-headline-lg text-on-surface">1,248</div>
      </div>
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg flex flex-col gap-sm">
      <span className="text-label-md font-label-md text-on-surface-variant">Active Operations</span>
      <div className="text-headline-lg font-headline-lg text-primary">842</div>
      </div>
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg flex flex-col gap-sm">
      <span className="text-label-md font-label-md text-on-surface-variant">Pending Review</span>
      <div className="text-headline-lg font-headline-lg text-tertiary">15</div>
      </div>
      </div>
      {/* Filters & Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
      <div className="flex items-center gap-sm">
      <div className="relative">
      <select className="appearance-none bg-surface-container-lowest border border-outline-variant rounded px-md py-sm pr-xl text-body-sm font-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none">
      <option>All Statuses</option>
      <option>Active</option>
      <option>Pending</option>
      <option>Archived</option>
      </select>
      <ChevronDown  style={{fontSize: "18px"}} className="absolute right-sm top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" aria-hidden={true} focusable="false" />
      </div>
      <div className="relative">
      <select className="appearance-none bg-surface-container-lowest border border-outline-variant rounded px-md py-sm pr-xl text-body-sm font-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none">
      <option>Last 30 Days</option>
      <option>Last 7 Days</option>
      <option>This Year</option>
      </select>
      <ChevronDown  style={{fontSize: "18px"}} className="absolute right-sm top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" aria-hidden={true} focusable="false" />
      </div>
      </div>
      <div className="flex items-center gap-sm text-body-sm font-body-sm text-on-surface-variant">
                          Showing 1-10 of 1,248
                      </div>
      </div>
      {/* Data Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex-1 flex flex-col">
      <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
      <thead className="bg-[#F1F5F9] border-b border-outline-variant">
      <tr>
      <th className="p-sm text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold pl-lg w-12">
      <input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
      </th>
      <th className="p-sm text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Record Title</th>
      <th className="p-sm text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Date Created</th>
      <th className="p-sm text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Status</th>
      <th className="p-sm text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold text-right pr-lg">Actions</th>
      </tr>
      </thead>
      <tbody className="text-body-sm font-body-sm divide-y divide-outline-variant">
      {/* Row 1 */}
      <tr className="hover:bg-surface-container-low transition-colors cursor-pointer group">
      <td className="p-sm pl-lg">
      <input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
      </td>
      <td className="p-sm font-medium text-on-surface">Q3 Financial Review - APAC</td>
      <td className="p-sm text-on-surface-variant">Oct 12, 2023</td>
      <td className="p-sm">
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#e6f4ea] text-[#137333]">Active</span>
      </td>
      <td className="p-sm text-right pr-lg">
      <button className="text-on-surface-variant hover:text-primary transition-colors p-1" data-action="ACT_SELECT_RECORD" type="button" aria-label="Edit" data-action-id="edit-4" onClick={actions?.["edit-4"]}>
      <Pencil  style={{fontSize: "18px"}} aria-hidden={true} focusable="false" />
      </button>
      </td>
      </tr>
      {/* Row 2 */}
      <tr className="hover:bg-surface-container-low transition-colors cursor-pointer group">
      <td className="p-sm pl-lg">
      <input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
      </td>
      <td className="p-sm font-medium text-on-surface">Infrastructure Scaling Proposal</td>
      <td className="p-sm text-on-surface-variant">Oct 10, 2023</td>
      <td className="p-sm">
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#fff8e1] text-[#f57f17]">Pending</span>
      </td>
      <td className="p-sm text-right pr-lg">
      <button className="text-on-surface-variant hover:text-primary transition-colors p-1" data-action="ACT_SELECT_RECORD" type="button" aria-label="Edit" data-action-id="edit-5" onClick={actions?.["edit-5"]}>
      <Pencil  style={{fontSize: "18px"}} aria-hidden={true} focusable="false" />
      </button>
      </td>
      </tr>
      {/* Row 3 */}
      <tr className="hover:bg-surface-container-low transition-colors cursor-pointer group bg-surface-container-lowest">
      <td className="p-sm pl-lg">
      <input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
      </td>
      <td className="p-sm font-medium text-on-surface">Security Audit H2</td>
      <td className="p-sm text-on-surface-variant">Oct 08, 2023</td>
      <td className="p-sm">
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#e6f4ea] text-[#137333]">Active</span>
      </td>
      <td className="p-sm text-right pr-lg">
      <button className="text-on-surface-variant hover:text-primary transition-colors p-1" data-action="ACT_SELECT_RECORD" type="button" aria-label="Edit" data-action-id="edit-6" onClick={actions?.["edit-6"]}>
      <Pencil  style={{fontSize: "18px"}} aria-hidden={true} focusable="false" />
      </button>
      </td>
      </tr>
      </tbody>
      </table>
      </div>
      {/* Empty/Error State Placeholder (Hidden by default, shown for demonstration) */}
      {/* <div className="flex-1 flex flex-col items-center justify-center p-xl text-center">
                          <TriangleAlert className="text-outline text-[48px] mb-md" aria-hidden={true} focusable="false" />
                          <h3 className="text-headline-sm font-headline-sm text-on-surface mb-sm">Unable to load records</h3>
                          <p className="text-body-sm font-body-sm text-on-surface-variant max-w-md mb-lg">There was an issue connecting to the data source. Please try again or check your filters.</p>
                          <button className="border border-outline-variant text-secondary px-md py-sm rounded text-label-md font-label-md hover:bg-surface-container-low transition-colors" data-action="ACT_RETRY_LOAD" type="button" data-action-id="retry-7" onClick={actions?.["retry-7"]}>Retry</button>
                      </div> */}
      </div>
      </main>
      {/* Selected Item Preview Panel (Hidden by default) */}
      <aside className="hidden w-80 lg:w-96 border-l border-outline-variant bg-surface-container-lowest h-full overflow-y-auto shrink-0 flex flex-col shadow-[-4px_0_6px_-1px_rgb(0,0,0,0.05)] z-10 transition-colors duration-300 transform translate-x-0" id="preview-panel">
      <div className="p-md border-b border-outline-variant flex justify-between items-center sticky top-0 bg-surface-container-lowest z-10">
      <h2 className="text-headline-sm font-headline-sm text-on-surface">Record Details</h2>
      <button className="text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-surface-container-low transition-colors" type="button" aria-label="Close" data-action-id="close-8" onClick={actions?.["close-8"]}>
      <X aria-hidden={true} focusable="false" />
      </button>
      </div>
      <div className="p-lg flex flex-col gap-lg">
      <div>
      <div className="text-label-sm font-label-sm text-on-surface-variant mb-xs">Title</div>
      <div className="text-body-md font-body-md text-on-surface font-medium">Q3 Financial Review - APAC</div>
      </div>
      <div className="grid grid-cols-2 gap-md">
      <div>
      <div className="text-label-sm font-label-sm text-on-surface-variant mb-xs">Status</div>
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#e6f4ea] text-[#137333]">Active</span>
      </div>
      <div>
      <div className="text-label-sm font-label-sm text-on-surface-variant mb-xs">Date Created</div>
      <div className="text-body-sm font-body-sm text-on-surface">Oct 12, 2023</div>
      </div>
      </div>
      <div>
      <div className="text-label-sm font-label-sm text-on-surface-variant mb-xs">Description</div>
      <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                              Comprehensive review of Q3 financial performance across all APAC regions. Highlights include a 15% YoY growth in software licensing revenue and a slight reduction in operational overhead in the Tokyo office.
                          </p>
      </div>
      <div className="border-t border-outline-variant pt-lg mt-sm">
      <div className="text-label-sm font-label-sm text-on-surface-variant mb-md">Quick Actions</div>
      <div className="flex flex-col gap-sm">
      <button className="flex items-center gap-sm px-sm py-2 text-body-sm font-body-sm text-on-surface hover:bg-surface-container-low rounded transition-colors text-left w-full" type="button" data-action-id="edit-details-9" onClick={actions?.["edit-details-9"]}>
      <FilePenLine className="text-outline text-[18px]" aria-hidden={true} focusable="false" />
                                  Edit Details
                              </button>
      <button className="flex items-center gap-sm px-sm py-2 text-body-sm font-body-sm text-on-surface hover:bg-surface-container-low rounded transition-colors text-left w-full" type="button" data-action-id="share-record-10" onClick={actions?.["share-record-10"]}>
      <BadgeHelp className="text-outline text-[18px]" aria-hidden={true} focusable="false" />
                                  Share Record
                              </button>
      <button className="flex items-center gap-sm px-sm py-2 text-body-sm font-body-sm text-error hover:bg-error-container rounded transition-colors text-left w-full mt-md" type="button" data-action-id="archive-record-11" onClick={actions?.["archive-record-11"]}>
      <Trash2 className="text-[18px]" aria-hidden={true} focusable="false" />
                                  Archive Record
                              </button>
      </div>
      </div>
      </div>
      </aside>
      </div>
    </>
  );
}
