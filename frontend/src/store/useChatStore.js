import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
<<<<<<< HEAD
    const { authUser } = useAuthStore.getState();
    let res;
    try {
      if (selectedUser._id === "ai") {
        // Add user's message instantly
        const userMsg = {
          _id: Date.now().toString() + "-user",
          text: messageData.text,
          senderId: authUser._id,
          receiverId: "ai",
          createdAt: new Date(),
          image: messageData.image || null,
        };
        set({ messages: [...messages, userMsg] });
        // Get AI reply
        res = await axiosInstance.post(`/ai/send`, messageData);
        set({ messages: [...get().messages, res.data] });
      } else {
        // For real users, just send, let socket handle adding the message
        await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
      }
=======
    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
>>>>>>> c4f6599caf5f4ac015c5b4b34915cf535624d375
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
<<<<<<< HEAD
      const { authUser } = useAuthStore.getState();
      const isRelevant =
        (newMessage.senderId === selectedUser._id && newMessage.receiverId === authUser._id) ||
        (newMessage.senderId === authUser._id && newMessage.receiverId === selectedUser._id);
      if (!isRelevant) return;
=======
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;
>>>>>>> c4f6599caf5f4ac015c5b4b34915cf535624d375

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));