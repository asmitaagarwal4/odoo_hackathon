const db = require('../db/db.connection');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// const createTicket = async (req, res) => {
//   const { subject, description, category_id } = req.body;
//   const reporter_id = req.user.id;
//   try {
//     const [result] = await db.query(
//       'INSERT INTO tickets (subject, description, category_id, reporter_id) VALUES (?, ?, ?, ?)',
//       [subject, description, category_id, reporter_id]
//     );
//     // [cite_start]// TODO: Add email notification logic here [cite: 27]
//     res.status(201).json({ msg: 'Ticket created successfully', ticket_id: result.insertId });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// };

const createTicket = async (req, res) => {
  const { subject, description, category_id } = req.body;
  const reporter_id = req.user.id;

  try {
    const [result] = await db.query(
      'INSERT INTO tickets (subject, description, category_id, reporter_id) VALUES (?, ?, ?, ?)',
      [subject, description, category_id, reporter_id]
    );

    const ticket_id = result.insertId;

    if (req.file) {
      // Upload file to Cloudinary
      const file = req.file;
      const fileBuffer = file.buffer;

      // Use a Promise to handle the asynchronous upload
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'quickdesk-attachments' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });

      const uploadResult = await uploadPromise;

      // Store the attachment details in the database
      await db.query(
        'INSERT INTO attachments (ticket_id, file_url) VALUES (?, ?)',
        [ticket_id, uploadResult.secure_url]
      );
    }

    res.status(201).json({ msg: 'Ticket created successfully', ticket_id });
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
    // [cite_start]// TODO: Add email notification logic here [cite: 27]
    res.json({ msg: 'Ticket status updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getTicketById = async (req, res) => {
  const { ticket_id } = req.params;
  try {
    const [ticket] = await db.query(
      `SELECT t.*, c.name AS category_name, r.name AS reporter_name, a.name AS assignee_name 
       FROM tickets t
       JOIN users r ON t.reporter_id = r.id
       LEFT JOIN users a ON t.assignee_id = a.id
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.id = ?`,
      [ticket_id]
    );
    if (ticket.length === 0) {
      return res.status(404).json({ msg: 'Ticket not found' });
    }
    // Check if the user is the reporter, an agent, or admin before showing details
    if (req.user.id !== ticket[0].reporter_id && req.user.role === 'End User') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const [comments] = await db.query('SELECT * FROM comments WHERE ticket_id = ? ORDER BY created_at ASC', [ticket_id]);
    res.json({ ...ticket[0], comments });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const assignTicket = async (req, res) => {
  const { ticket_id } = req.params;
  const { assignee_id } = req.body;
  try {
    const [result] = await db.query('UPDATE tickets SET assignee_id = ? WHERE id = ?', [assignee_id, ticket_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Ticket not found' });
    }
    res.json({ msg: 'Ticket assigned successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const addComment = async (req, res) => {
  const { ticket_id } = req.params;
  const { comment_text } = req.body;
  const user_id = req.user.id;
  try {
    // Verify user has access to comment on this ticket
    const [ticket] = await db.query('SELECT reporter_id, assignee_id FROM tickets WHERE id = ?', [ticket_id]);
    if (ticket.length === 0) {
      return res.status(404).json({ msg: 'Ticket not found' });
    }
    if (req.user.role === 'End User' && req.user.id !== ticket[0].reporter_id) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const [result] = await db.query('INSERT INTO comments (ticket_id, user_id, comment_text) VALUES (?, ?, ?)', [ticket_id, user_id, comment_text]);
    res.status(201).json({ msg: 'Comment added successfully', commentId: result.insertId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const voteTicket = async (req, res) => {
  const { ticket_id } = req.params;
  const { vote_type } = req.body; // 'upvote' or 'downvote'
  try {
    if (vote_type === 'upvote') {
      await db.query('UPDATE tickets SET upvotes = upvotes + 1 WHERE id = ?', [ticket_id]);
    } else if (vote_type === 'downvote') {
      await db.query('UPDATE tickets SET downvotes = downvotes + 1 WHERE id = ?', [ticket_id]);
    } else {
      return res.status(400).json({ msg: 'Invalid vote_type' });
    }
    res.json({ msg: 'Vote recorded' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { 
  createTicket, 
  getMyTickets, 
  getAllTickets, 
  updateTicketStatus, 
  getTicketById, 
  assignTicket, 
  addComment, 
  voteTicket 
};