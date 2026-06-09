import API from "./axios";

// GET ALL EVENTS
export const getAllEvents = async () => {
  const res = await API.get("/events");
  return res.data;
};