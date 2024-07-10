import { StateCreator } from "zustand"

export interface OnlineUsersSliceProps {
    onlineUsers: { userId: string; socketId: string }[];
    setOnlineUsers: (onlineUsers: { userId: string; socketId: string }[]) => void
}

export const createOnlineUsersSlice: StateCreator<OnlineUsersSliceProps> = (set, get) => ({
    onlineUsers: [],
    setOnlineUsers: (onlineUsers) => set((state) => ({ onlineUsers: onlineUsers })),
})