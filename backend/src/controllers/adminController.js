const { Op, fn, col, literal } = require('sequelize');
const { User, Store, Rating } = require('../models');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count({ where: { role: { [Op.ne]: 'admin' } } }),
      Store.count(),
      Rating.count(),
    ]);
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;
  const where = {};
  if (name) where.name = { [Op.iLike]: `%${name}%` };
  if (email) where.email = { [Op.iLike]: `%${email}%` };
  if (address) where.address = { [Op.iLike]: `%${address}%` };
  if (role) where.role = role;

  const validSort = ['name', 'email', 'address', 'role', 'createdAt'];
  const sortField = validSort.includes(sortBy) ? sortBy : 'name';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  try {
    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [[sortField, sortOrder]],
    });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Store,
          as: 'stores',
          include: [{ model: Rating, as: 'ratings', attributes: ['rating'] }],
        },
      ],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    let averageRating = null;
    if (user.role === 'store_owner' && user.stores.length > 0) {
      const allRatings = user.stores.flatMap((s) => s.ratings.map((r) => r.rating));
      averageRating = allRatings.length
        ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1)
        : null;
    }

    res.json({ user, averageRating });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already exists' });

    const allowedRoles = ['admin', 'user', 'store_owner'];
    const userRole = allowedRoles.includes(role) ? role : 'user';

    const user = await User.create({ name, email, password, address, role: userRole });
    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getStores = async (req, res) => {
  const { name, email, address, sortBy = 'name', order = 'ASC' } = req.query;
  const where = {};
  if (name) where.name = { [Op.iLike]: `%${name}%` };
  if (email) where.email = { [Op.iLike]: `%${email}%` };
  if (address) where.address = { [Op.iLike]: `%${address}%` };

  const validSort = ['name', 'email', 'address', 'createdAt'];
  const sortField = validSort.includes(sortBy) ? sortBy : 'name';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  try {
    const stores = await Store.findAll({
      where,
      include: [{ model: Rating, as: 'ratings', attributes: ['rating'] }],
      order: [[sortField, sortOrder]],
    });

    const result = stores.map((store) => {
      const ratings = store.ratings.map((r) => r.rating);
      const avg = ratings.length
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : null;
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: avg,
        totalRatings: ratings.length,
      };
    });

    res.json({ stores: result });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;
  try {
    const existing = await Store.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Store email already exists' });

    const store = await Store.create({ name, email, address, owner_id: owner_id || null });
    res.status(201).json({ store });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
