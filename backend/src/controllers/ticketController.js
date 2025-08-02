const db = require('../db/db.connection');

const createTicket = async (req, res) => {
  const { subject, description, category_id } = req.body;
  const reporter_id = req.user.id;
  try {
    const [result] = await db.query(
      'INSERT INTO tickets (subject, description, category_id, reporter_id) VALUES (?, ?, ?, ?)',
      [subject, description, category_id, reporter_id]
    );
    [cite_start]// TODO: Add email notification logic here [cite: 27]
    res.status(201).json({ msg: 'Ticket created successfully', ticket_id: result.insertId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getMyTickets = async (req, res) => {
  const reporter_id = req.user.id;
  try {
    const [tickets] = await db.query('SELECT * FROM tickets WHERE reporter_id = ?', [reporter_id]);
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getAllTickets = async (req, res) => {
  try {
    const [tickets] = await db.query('SELECT * FROM tickets');
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const updateTicketStatus = async (req, res) => {
  const { ticket_id } = req.params;
  const { status } = req.body;
  const assignee_id = req.user.id;
  try {
    await db.query('UPDATE tickets SET status = ?, assignee_id = ? WHERE id = ?', [status, assignee_id, ticket_id]);
    [cite_start]// TODO: Add email notification logic here [cite: 27]
    res.json({ msg: 'Ticket status updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { createTicket, getMyTickets, getAllTickets, updateTicketStatus };