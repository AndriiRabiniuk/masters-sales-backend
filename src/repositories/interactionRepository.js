const Interaction = require('../models/Interaction');

class InteractionRepository {
  async findAll(query = {}, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;
    
    const interactions = await Interaction.find(query)
      .populate('lead', 'nom statut')
      .populate('contacts', 'nom prenom email')
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
    const total = await Interaction.countDocuments(query);
    
    return {
      interactions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  async findById(id) {
    return Interaction.findById(id)
      .populate('lead', 'nom statut')
      .populate('contacts', 'nom prenom email');
  }
  
  async findByLead(leadId, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;
    
    const interactions = await Interaction.find({ lead: leadId })
      .populate('contacts', 'nom prenom email')
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
    const total = await Interaction.countDocuments({ lead: leadId });
    
    return {
      interactions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  async findByContact(contactId, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;
    
    const interactions = await Interaction.find({ contacts: contactId })
      .populate('lead', 'nom statut')
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
    const total = await Interaction.countDocuments({ contacts: contactId });
    
    return {
      interactions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  async create(interactionData) {
    const interaction = new Interaction(interactionData);
    return interaction.save();
  }
  
  async update(id, interactionData) {
    return Interaction.findByIdAndUpdate(id, interactionData, { new: true, runValidators: true });
  }
  
  async delete(id) {
    return Interaction.findByIdAndDelete(id);
  }
  
  async addContact(id, contactId) {
    return Interaction.findByIdAndUpdate(
      id,
      { $addToSet: { contacts: contactId } },
      { new: true }
    );
  }
  
  async removeContact(id, contactId) {
    return Interaction.findByIdAndUpdate(
      id,
      { $pull: { contacts: contactId } },
      { new: true }
    );
  }
}

module.exports = new InteractionRepository(); 