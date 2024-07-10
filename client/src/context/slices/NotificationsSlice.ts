import { StateCreator } from "zustand";

interface NotificationsProps {
    chatId: string;
    messages: number;
}

export interface NotificationsSliceProps {
    notifications: NotificationsProps[];
    setNotifications: (notifications: NotificationsProps[]) => void;
    addNotification: (chatId: string) => void;
    removeNotifications: (chatId: string) => void;
}

export const createNotificationsSlice: StateCreator<NotificationsSliceProps> = (set) => ({
    notifications: [],
    addNotification: (chatId) =>
        set((state) => {
            const existingNotification = state.notifications.find((noti) => noti.chatId === chatId);

            if (existingNotification) {
                return {
                    notifications: state.notifications.map((noti) =>
                        noti.chatId === chatId
                            ? { ...noti, messages: noti.messages + 1 }
                            : noti
                    ),
                };
            } else {
                return {
                    notifications: [...state.notifications, { chatId, messages: 1 }],
                };
            }
        }),
    setNotifications: (notifications) => set({ notifications }),
    removeNotifications: (chatId) =>
        set((state) => ({
            notifications: state.notifications.filter((noti) => noti.chatId !== chatId),
        })),
});
