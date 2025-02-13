import Ticket from "../models/Ticket.js";

const getTickets = async () => {
  return await Ticket.find({ _destroy: null });
};

const getTicketById = async (id) => {
  return await Ticket.findOne({ _id: id, _destroy: null });
};

const createTicket = async (data) => {
  return await Ticket.create(data);
};

const updateTicketById = async (id, data) => {
  return await Ticket.findByIdAndUpdate(id, data, { new: true });
};

const updateAllTickets = async (data) => {
  return await Ticket.updateMany({}, data, { new: true });
};

const deleteTicketById = async (id) => {
  return await Ticket.findByIdAndUpdate(id, { _destroy: Date.now() }, { new: true });
};

export const ticketService = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicketById,
  updateAllTickets,
  deleteTicketById,
};
