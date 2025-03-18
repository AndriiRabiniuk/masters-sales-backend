const { Contact } = require('../models');

/**
 * Get all contacts
 * @route GET /api/contacts
 * @access Private
 */
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().populate('client', 'nom');
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get contact by ID
 * @route GET /api/contacts/:id
 * @access Private
 */
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).populate('client', 'nom');
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create a new contact
 * @route POST /api/contacts
 * @access Private
 */
const createContact = async (req, res) => {
  try {
    const newContact = await Contact.create(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Update a contact
 * @route PUT /api/contacts/:id
 * @access Private
 */
const updateContact = async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete a contact
 * @route DELETE /api/contacts/:id
 * @access Private
 */
const deleteContact = async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
}; 