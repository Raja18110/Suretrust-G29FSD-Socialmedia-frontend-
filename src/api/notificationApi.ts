import axios from "axios";
import {baseUrl} from "../baseUrl"
const API = axios.create({
  baseURL: baseUrl, 
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getAllNotifications = async () => {
  return await API.get("/notification/getNotifications");
};

export const getUnreadNotificationCount = async () => {
  return await API.get("/notification/unreadCount");
};

export const markAsChecked = async (id: string) => {
  return await API.put(`/notification/mark/${id}`, {});
};

export const markAllAsChecked = async () => {
  return await API.put(`/notification/markAll`, {});
};
