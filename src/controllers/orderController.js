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

// Ottieni tutti gli ordini ricevuti da una specifica attività (Solo Proprietario o Admin)
exports.getActivityOrders = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: 'Attività non trovata' });
        }

        if (activity.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Non sei autorizzato a vedere questi ordini' });
        }

        const orders = await Order.find({ activity: req.params.id })
            .populate('user', 'name email') // Così il negoziante vede il NOME e l'EMAIL di chi ha ordinato!
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

