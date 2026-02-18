const Order = require('../models/Order');

// Crea prenotazione
exports.createOrder = async (req, res) => {
  try {
    const { activityId, items, totalAmount, pickupDate } = req.body;
    const order = new Order({
      user: req.user.id,
      activity: activityId,
      items,
      totalAmount,
      pickupDate
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Vedi ordini
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('activity', 'name address');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
