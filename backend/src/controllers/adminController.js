const db = require('../db/db.connection');

const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, role, created_at FROM users');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  try {
    const [result] = await db.query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ msg: 'User role updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    // Before deleting a user, handle their associated tickets/comments
    // E.g., set reporter_id/assignee_id to NULL or a default user
    await db.query('DELETE FROM tickets WHERE reporter_id = ? OR assignee_id = ?', [userId, userId]);
    await db.query('DELETE FROM comments WHERE user_id = ?', [userId]);

    const [result] = await db.query('DELETE FROM users WHERE id = ?', [userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
};