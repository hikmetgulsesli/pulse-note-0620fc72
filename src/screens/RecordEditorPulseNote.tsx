// AUTO-GENERATED from Stitch — DO NOT modify layout or CSS
// Screen: Record Editor - Pulse Note
// 
// AGENT INSTRUCTIONS:
// 1. DO NOT change className values or layout structure
// 2. Add useState for dynamic values (replace hardcoded text)
// 3. Wire interactive controls through the typed actions prop
// 4. Replace placeholder data with props/state

import type { FormEvent } from "react";

import { CircleAlert, Info } from "lucide-react";


export type RecordEditorPulseNoteActionId = "cancel-1" | "save-record-2";

export interface RecordEditorPulseNoteProps {
  actions?: Partial<Record<RecordEditorPulseNoteActionId, () => void>>;

}

export function RecordEditorPulseNote({ actions }: RecordEditorPulseNoteProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    actions?.["save-record-2"]?.();
  };

  return (
    <>
      &#123;&#123;DATA:COMPONENTS:COMPONENTS_2&#125;&#125;
          <main className="flex-grow flex items-center justify-center p-md lg:p-xl">
      <div className="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-lg">
      <header className="flex justify-between items-center border-b border-outline-variant pb-md mb-lg">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Record Editor</h1>
      <div className="flex items-center text-secondary">
      <CircleAlert className="mr-xs text-sm" aria-hidden={true} focusable="false" />
      <span className="font-label-sm text-label-sm uppercase tracking-wider">Unsaved Changes</span>
      </div>
      </header>
      <form className="space-y-lg" onSubmit={handleSubmit}>
      <div className="space-y-xs">
      <label className="block font-label-md text-label-md text-on-surface" htmlFor="note-title">
                              Note Title <span className="text-error">*</span>
      </label>
      <input className="w-full bg-surface-bright border border-error rounded-DEFAULT px-md py-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body-md text-body-md text-on-surface placeholder-on-surface-variant transition-colors duration-200" id="note-title" name="note-title" placeholder="Enter title..." type="text" />
      <p className="font-body-sm text-body-sm text-error mt-xs flex items-center">
      <Info className="mr-xs text-[16px]" aria-hidden={true} focusable="false" />
                              Title is required.
                          </p>
      </div>
      <div className="space-y-xs">
      <label className="block font-label-md text-label-md text-on-surface" htmlFor="note-content">
                              Note Content
                          </label>
      <textarea className="w-full bg-surface-bright border border-outline-variant rounded-DEFAULT px-md py-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body-md text-body-md text-on-surface placeholder-on-surface-variant transition-colors duration-200 resize-y" id="note-content" name="note-content" placeholder="Start typing your note here..." rows={8}></textarea>
      </div>
      <div className="pt-lg flex justify-end items-center gap-md border-t border-outline-variant">
      <button className="font-label-md text-label-md px-md py-sm border border-outline-variant rounded-DEFAULT text-secondary hover:bg-surface-container-low transition-colors" data-action="ACT_CANCEL_EDIT" type="button" data-action-id="cancel-1" onClick={actions?.["cancel-1"]}>
                              Cancel
                          </button>
      <button className="font-label-md text-label-md px-md py-sm bg-primary text-on-primary rounded-DEFAULT hover:bg-surface-tint transition-colors shadow-sm" data-action="ACT_SAVE_RECORD" type="submit" data-action-id="save-record-2" onClick={actions?.["save-record-2"]}>
                              Save Record
                          </button>
      </div>
      </form>
      </div>
      </main>
    </>
  );
}
