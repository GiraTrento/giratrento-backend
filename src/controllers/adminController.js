const Activity = require('../models/Activity');

// Attivita in attesa approvazione
exports.getPendingActivities = async (req, res) => {
  try {
    // Supponiamo di aver aggiunto un campo 'isApproved' nel modello Activity (vedi punto 4 sotto)
    const pending = await Activity.find({ isApproved: false });
    res.json(pending);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approva attività
exports.approveActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id, 
      { isApproved: true }, 
      { new: true }
    );
    if (!activity) return res.status(404).json({ message: 'Attività non trovata' });
    res.json({ message: 'Attività approvata e visibile sulla mappa!', activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Rifiuta/Elimina un'attività
exports.deleteActivity = async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Attività eliminata/rifiutata.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
