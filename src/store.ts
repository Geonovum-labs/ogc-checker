import { create } from 'zustand';
import { SpecLinter } from './types';

interface CheckerState {
  content: string;
  setContent: (content: string) => void;
  linters: SpecLinter[];
  setLinters: (linters: SpecLinter[]) => void;
  checking: boolean;
  setChecking: (checking: boolean) => void;
  error?: string;
  setError: (error?: string) => void;
}

export const useChecker = create<CheckerState>(set => ({
  content: '{}',
  setContent: content => set({ content }),
  linters: [],
  setLinters: linters => set({ linters }),
  checking: false,
  setChecking: checking => set({ checking }),
  setError: error => set({ error }),
}));
