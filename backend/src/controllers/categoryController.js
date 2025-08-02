const db = require('../db/db.connection');

const getAllCategories = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories');
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
    res.status(201).json({ msg: 'Category created successfully', categoryId: result.insertId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;
  try {
    const [result] = await db.query('UPDATE categories SET name = ? WHERE id = ?', [name, categoryId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.json({ msg: 'Category updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    // Before deleting a category, handle tickets assigned to it (e.g., set category_id to NULL)
    await db.query('UPDATE tickets SET category_id = NULL WHERE category_id = ?', [categoryId]);
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [categoryId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.json({ msg: 'Category deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};