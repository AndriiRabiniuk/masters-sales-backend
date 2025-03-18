const { Interaction } = require('../models');

/**
 * Get all interactions
 * @route GET /api/interactions
 * @access Private
 */
const getInteractions = async (req, res) => {
  try {
    const interactions = await Interaction.find()
      .populate('client', 'nom')
      .populate('lead', 'nom')
      .populate('user', 'username');
    res.status(200).json(interactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get interaction by ID
 * @route GET /api/interactions/:id
 * @access Private
 */
const getInteractionById = async (req, res) => {
  try {
    const interaction = await Interaction.findById(req.params.id)
      .populate('client', 'nom')
      .populate('lead', 'nom')
      .populate('user', 'username');
    if (!interaction) {
      return res.status(404).json({ message: 'Interaction not found' });
    }
    res.status(200).json(interaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create a new interaction
 * @route POST /api/interactions
 * @access Private
 */
const createInteraction = async (req, res) => {
  try {
    // Add the current user to the interaction
    const interactionData = {
      ...req.body,
      user: req.user.id
    };
    
    const newInteraction = await Interaction.create(interactionData);
    res.status(201).json(newInteraction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Update an interaction
 * @route PUT /api/interactions/:id
 * @access Private
 */
const updateInteraction = async (req, res) => {
  try {
    const updatedInteraction = await Interaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedInteraction) {
      return res.status(404).json({ message: 'Interaction not found' });
    }
    
    res.status(200).json(updatedInteraction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete an interaction
 * @route DELETE /api/interactions/:id
 * @access Private
 */
const deleteInteraction = async (req, res) => {
  try {
    const deletedInteraction = await Interaction.findByIdAndDelete(req.params.id);
    
    if (!deletedInteraction) {
      return res.status(404).json({ message: 'Interaction not found' });
    }
    
    res.status(200).json({ message: 'Interaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getInteractions,
  getInteractionById,
  createInteraction,
  updateInteraction,
  deleteInteraction
}; 