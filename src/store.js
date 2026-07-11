import { create } from 'zustand';

export const useStore = create((set) => ({
  rows: [], // Start empty so the user has to swipe to get their first match!
  activeRowIdx: 0,
  setActiveRow: (idx) => set({ activeRowIdx: idx }),
  updateRow: (idx, field, val) => set((state) => ({
    rows: state.rows.map((r, i) => (i === idx ? { ...r, [field]: val } : r))
  })),
  addRow: (doorStyle = 'shaker', labelName = 'Matched Door') => set((state) => {
    const newRow = { 
      id: Date.now(), 
      label: labelName, 
      width: 18, 
      height: 30, 
      style: doorStyle, 
      sanding: false 
    };
    return {
      rows: [...state.rows, newRow],
      activeRowIdx: state.rows.length // Automatically select the newly added row
    };
  })
}));
