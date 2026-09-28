import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StaffMember, User } from "@/types";

export type SessionRole = "consumer" | "staff" | null;

interface SessionState {
  role: SessionRole;
  consumer: User | null;
  staff: StaffMember | null;
  loginAsConsumer: (user: User) => void;
  loginAsStaff: (user: StaffMember) => void;
  logout: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      role: null,
      consumer: null,
      staff: null,
      loginAsConsumer: (user) => set({ role: "consumer", consumer: user, staff: null }),
      loginAsStaff: (user) => set({ role: "staff", staff: user, consumer: null }),
      logout: () => set({ role: null, consumer: null, staff: null }),
    }),
    { name: "qbite.session.v1" },
  ),
);
