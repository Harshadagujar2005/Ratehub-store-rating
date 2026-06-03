const { Op } = require('sequelize');
const { Store, Rating, User } = require('../models');

exports.getAllStores = async (req, res) => {
  const { name, address, sortBy = 'name', order = 'ASC' } = req.query;
  const where = {};
  if (name) where.name = { [Op.iLike]: `%${name}%` };
  if (address) where.address = { [Op.iLike]: `%${address}%` };

  const validSort = ['name', 'address', 'createdAt'];
  const sortField = validSort.includes(sortBy) ? sortBy : 'name';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  try {
    const stores = await Store.findAll({
      where,
      include: [{ model: Rating, as: 'ratings', attributes: ['rating', 'user_id'] }],
      order: [[sortField, sortOrder]],
    });

    const userId = req.user.id;
    const result = stores.map((store) => {
      const ratings = store.ratings;
      const avg = ratings.length
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : null;
      const userRating = ratings.find((r) => r.user_id === userId);
      return {
        id: store.id,
        name: store.name,
        address: store.address,
        email: store.email,
        averageRating: avg,
        totalRatings: ratings.length,
        userRating: userRating ? userRating.rating : null,
      };
    });

    res.json({ stores: result });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.submitRating = async (req, res) => {
  const { store_id, rating } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const store = await Store.findByPk(store_id);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const [ratingRecord, created] = await Rating.findOrCreate({
      where: { user_id: req.user.id, store_id },
      defaults: { rating },
    });

    if (!created) {
      ratingRecord.rating = rating;
      await ratingRecord.save();
    }

    res.json({
      message: created ? 'Rating submitted' : 'Rating updated',
      rating: ratingRecord,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Store owner: get ratings for their store
exports.getMyStoreRatings = async (req, res) => {
  try {
    const store = await Store.findOne({
      where: { owner_id: req.user.id },
      include: [
        {
          model: Rating,
          as: 'ratings',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
    });

    if (!store) return res.status(404).json({ message: 'No store found for this owner' });

    const ratings = store.ratings;
    const avg = ratings.length
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : null;

    res.json({
      store: { id: store.id, name: store.name, address: store.address },
      averageRating: avg,
      totalRatings: ratings.length,
      ratings: ratings.map((r) => ({
        id: r.id,
        rating: r.rating,
        submittedAt: r.updatedAt,
        user: r.user,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
