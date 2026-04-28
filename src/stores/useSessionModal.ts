import { create } from 'zustand';

type Modal =
  | {
      type: 'soon';
      onExtend: () => void;
    }
  | {
      type: 'expired';
      redirectTo: string;
    };

type State = {
  modal: Modal | null;
  openSoon: (onExtend: () => void) => void;
  openExpired: (redirectTo: string) => void;
  close: () => void;
};

export const useSessionModal = create<State>((set, get) => ({
  modal: null,
  openSoon: (onExtend) => {
    const current = get().modal;
    if (current?.type === 'expired') return;
    set({
      modal: {
        type: 'soon',
        onExtend,
      },
    });
  },
  openExpired: (redirectTo) =>
    set({
      modal: {
        type: 'expired',
        redirectTo,
      },
    }),

  close: () => set({ modal: null }),
}));
