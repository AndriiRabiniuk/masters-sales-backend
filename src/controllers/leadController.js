const { Lead } = require('../models');

/**
 * Get all leads
 * @route GET /api/leads
 * @access Private
 */
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find();
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get lead by ID
 * @route GET /api/leads/:id
 * @access Private
 */
const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create a new lead
 * @route POST /api/leads
 * @access Private
 */
const createLead = async (req, res) => {
  try {
    const newLead = await Lead.create(req.body);
    res.status(201).json(newLead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Update a lead
 * @route PUT /api/leads/:id
 * @access Private
 */
const updateLead = async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedLead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    res.status(200).json(updatedLead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete a lead
 * @route DELETE /api/leads/:id
 * @access Private
 */
const deleteLead = async (req, res) => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);
    
    if (!deletedLead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    res.status(200).json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead
}; 