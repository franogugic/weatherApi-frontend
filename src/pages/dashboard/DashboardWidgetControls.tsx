import { useDashboardLayoutStore } from "@/features/dashboard-layout/dashboard-layout-store"
import { Check, Pencil, RotateCcw, X } from "lucide-react"

export function DashboardWidgetControls() {
  const isEditingDashboard = useDashboardLayoutStore((state) => state.isEditingDashboard)
  const hasUnsavedChanges = useDashboardLayoutStore((state) => state.hasUnsavedChanges)
  const startDashboardEditing = useDashboardLayoutStore((state) => state.startDashboardEditing)
  const saveDraftBlocks = useDashboardLayoutStore((state) => state.saveDraftBlocks)
  const discardDraftBlocks = useDashboardLayoutStore((state) => state.discardDraftBlocks)
  const resetBlocks = useDashboardLayoutStore((state) => state.resetDraftBlocks)

  if (!isEditingDashboard) {
    return (
      <button
        type="button"
        onClick={startDashboardEditing}
        className="fixed right-6 bottom-6 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-[#20252c]/90 px-4 py-3 text-[13px] font-semibold text-white/80 shadow-[0_14px_32px_rgba(0,0,0,0.32)] backdrop-blur-xl transition hover:text-white"
        aria-label="Edit dashboard layout"
      >
        <Pencil size={16} />
        Edit layout
      </button>
    )
  }

  return (
    <div className="fixed right-6 bottom-6 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-[#20252c]/90 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <button
        type="button"
        onClick={resetBlocks}
        className="rounded-full bg-white/7 p-3 text-white/70 transition hover:bg-white/12 hover:text-white"
        aria-label="Reset dashboard draft"
      >
        <RotateCcw size={16} />
      </button>
      <button
        type="button"
        onClick={discardDraftBlocks}
        className="flex items-center gap-2 rounded-full bg-white/7 px-4 py-3 text-[12px] font-medium text-white/70 transition hover:bg-white/12 hover:text-white"
      >
        <X size={15} />
        Cancel
      </button>
      <button
        type="button"
        onClick={saveDraftBlocks}
        disabled={!hasUnsavedChanges}
        className="flex items-center gap-2 rounded-full bg-linear-to-br from-accent-secondary to-accent-primary px-4 py-3 text-[12px] font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.24)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
      >
        <Check size={15} />
        Save
      </button>
    </div>
  )
}
