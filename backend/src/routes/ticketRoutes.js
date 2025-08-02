const express = require('express');
const router = express.Router();
const { authMiddleware, isAgent } = require('../middleware/authMiddleware');
const { createTicket, getMyTickets, getAllTickets, updateTicketStatus } = require('../controllers/ticketController');

// End User and Agent can create tickets [cite: 15, 46]
router.post('/', authMiddleware, createTicket);

// End User can view their own tickets [cite: 19]
router.get('/my', authMiddleware, getMyTickets);

// Agent can view all tickets [cite: 22, 43]
router.get('/', authMiddleware, isAgent, getAllTickets);

// Agent can update ticket status [cite: 23]
router.put('/:ticket_id/status', authMiddleware, isAgent, updateTicketStatus);

module.exports = router;