import Ticket from "../models/Ticket.js";
import Page from "../models/Page.js";
import mongoose from "mongoose";

const getTickets = async () => {
  return await Ticket.find({ _destroy: null });
};

const getTicketById = async (id) => {
  return await Ticket.findOne({ _id: id, _destroy: null });
};

const createTicket = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { pageId, ...ticketData } = data;
    if (!pageId) throw new Error("pageId is required");

    const newTicket = await Ticket.create([ticketData], { session });
    const ticketId = newTicket[0]._id;

    const updatedPage = await Page.findByIdAndUpdate(
      pageId,
      { $push: { listTicket: ticketId } },
      { new: true, session }
    ).populate("listTicket");

    if (!updatedPage) throw new Error("Page not found");

    await session.commitTransaction();
    return { ticket: newTicket[0], updatedPage };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
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
