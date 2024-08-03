import { create } from "zustand";

export type AuthState = {
  socketDisconnected: boolean;
};

export type AuthAction = {
  setSocketDisconnected: (v: boolean) => void;
  reset: () => void;
};

const initialState = {
  socketDisconnected: false,
};

const useDisconnectionStore = create<AuthState & AuthAction>((set) => ({
  ...initialState,
  setSocketDisconnected: (v) => set(() => ({ socketDisconnected: v })),
  reset: () => {
    set(initialState);
  },
}));

export default useDisconnectionStore;
