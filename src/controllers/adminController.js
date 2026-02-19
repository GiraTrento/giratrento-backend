const Activity = require('../models/Activity');
const User = require('../models/User');

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

// Ottieni tutti gli utenti (senza password)
exports.getAllUsers = async (req, res) => {
  try {
    // Usiamo .select('-password') per NON inviare mai le password
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cambia il ruolo di un utente
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'merchant', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Ruolo non valido. Scegli tra user, merchant o admin.' });
    }

    // Sicurezza aggiuntiva: evitiamo che l'admin si tolga i poteri da solo per sbaglio
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Non puoi modificare il tuo stesso ruolo.' });
    }

    // Trova l'utente e aggiorna il ruolo
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { role }, 
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    res.json({ message: `Ruolo aggiornato a ${role} con successo!`, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
