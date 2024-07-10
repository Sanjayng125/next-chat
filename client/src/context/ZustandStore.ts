import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createSelectedChatSlice, SelectedChatSliceProps } from "./slices/SelectedChatSlice";
import { createMyChatsSlice, MyChatsSliceProps } from "./slices/MyChatsSlice";
import { createMessagesSlice, MessagesSliceProps } from "./slices/MessagesSlice";
import { createOnlineUsersSlice, OnlineUsersSliceProps } from "./slices/OnlineUsersSlice";
import { createSocketSlice, SocketProps } from "./slices/SocketSlice";
import { createNotificationsSlice, NotificationsSliceProps } from "./slices/NotificationsSlice";

export const useMyStore = create<SelectedChatSliceProps & MyChatsSliceProps & MessagesSliceProps & OnlineUsersSliceProps & SocketProps & NotificationsSliceProps>()((...a) => ({
  ...createSelectedChatSlice(...a),
  ...createMyChatsSlice(...a),
  ...createMessagesSlice(...a),
  ...createOnlineUsersSlice(...a),
  ...createSocketSlice(...a),
  ...createNotificationsSlice(...a)
}));


// persisted store
// export const useMyStore = create<BearSliceProps & FishSliceProps>()(
//   persist(
//     (...a) => ({
//       ...createBearSlice(...a),
//       ...createFishSlice(...a)
//     }),
//     {
//       name: "first-zustand-store",
//       storage: createJSONStorage(() => localStorage)
//     }
//   )
// )