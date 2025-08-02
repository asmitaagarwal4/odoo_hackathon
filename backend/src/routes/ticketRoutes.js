const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const { authMiddleware, isAgent } = require('../middleware/authMiddleware');
const {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicketStatus,
  getTicketById,
  assignTicket,
  addComment,
  voteTicket,
} = require('../controllers/ticketController');

// Ticket creation and viewing
router.post('/', authMiddleware, upload.single('attachment'), createTicket);
router.get('/my', authMiddleware, getMyTickets);
router.get('/', authMiddleware, isAgent, getAllTickets);
router.get('/:ticket_id', authMiddleware, getTicketById);

// Ticket actions
router.put('/:ticket_id/status', authMiddleware, isAgent, updateTicketStatus);
router.put('/:ticket_id/assign', authMiddleware, isAgent, assignTicket);
router.post('/:ticket_id/comments', authMiddleware, addComment);
router.post('/:ticket_id/vote', authMiddleware, voteTicket);

module.exports = router;