const Activity = require('../models/Activity');

// Ottieni attività (opzionale: filtro vicinanza)
exports.getActivities = async (req, res) => {
  try {
    const { lat, lng, dist, category } = req.query;
    let query = { isApproved: true };

    if (category) query.category = category;

    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(dist) || 5000 
        }
      };
    }
    const activities = await Activity.find(query).populate('reviews.user', 'name');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crea attività (Solo Admin o Merchant)
exports.createActivity = async (req, res) => {
  try {
    // Nota: coordinates deve essere [longitudine, latitudine]
    const newActivity = new Activity(req.body);
    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Suggerisci attivita (Default: non approvata)
exports.suggestActivity = async (req, res) => {
  try {
    const newActivity = new Activity({
      ...req.body,
      owner: req.user.id,
      isApproved: false
    });
    await newActivity.save();
    res.status(201).json({ message: 'Attività inviata. In attesa di approvazione admin.', activity: newActivity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Aggiungi Prodotto a Vetrina (Solo proprietario)
exports.addProduct = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (activity.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non sei il proprietario di questa attività' });
    }

    activity.products.push(req.body);
    await activity.save();
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Aggiungi Recensione (Qualsiasi utente loggato)
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const activity = await Activity.findById(req.params.id);
    
    const review = {
      user: req.user.id,
      rating,
      comment,
      date: new Date()
    };
    
    activity.reviews = activity.reviews || []; 
    activity.reviews.push(review);
    
    await activity.save();
    res.json({ message: 'Recensione aggiunta' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
