import Ticket from "../../../../../db/models/Ticket";

export const GET = async (request) => {
  const allTicket = await Ticket.getAllTicket();

  return Response.json(allTicket);
};
