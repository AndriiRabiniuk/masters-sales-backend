const interactionRepository = require('../repositories/interactionRepository');
const leadRepository = require('../repositories/leadRepository');
const contactRepository = require('../repositories/contactRepository');

class InteractionService {
  async getAllInteractions(query, options) {
    return interactionRepository.findAll(query, options);
  }
  
  async getInteractionById(id) {
    return interactionRepository.findById(id);
  }
  
  async getInteractionsByLead(leadId, options) {
    // Verify lead exists
    const lead = await leadRepository.findById(leadId);
    if (!lead) {
      throw new Error('Lead not found');
    }
    
    return interactionRepository.findByLead(leadId, options);
  }
  
  async getInteractionsByContact(contactId, options) {
    // Verify contact exists
    const contact = await contactRepository.findById(contactId);
    if (!contact) {
      throw new Error('Contact not found');
    }
    
    return interactionRepository.findByContact(contactId, options);
  }
  
  async createInteraction(interactionData) {
    // Verify lead exists
    const lead = await leadRepository.findById(interactionData.lead);
    if (!lead) {
      throw new Error('Lead not found');
    }
    
    // Verify contacts exist if provided
    if (interactionData.contacts && interactionData.contacts.length > 0) {
      for (const contactId of interactionData.contacts) {
        const contact = await contactRepository.findById(contactId);
        if (!contact) {
          throw new Error(`Contact with ID ${contactId} not found`);
        }
      }
    }
    
    return interactionRepository.create(interactionData);
  }
  
  async updateInteraction(id, interactionData) {
    // If lead is being updated, verify it exists
    if (interactionData.lead) {
      const lead = await leadRepository.findById(interactionData.lead);
      if (!lead) {
        throw new Error('Lead not found');
      }
    }
    
    // If contacts are being updated, verify they exist
    if (interactionData.contacts && interactionData.contacts.length > 0) {
      for (const contactId of interactionData.contacts) {
        const contact = await contactRepository.findById(contactId);
        if (!contact) {
          throw new Error(`Contact with ID ${contactId} not found`);
        }
      }
    }
    
    return interactionRepository.update(id, interactionData);
  }
  
  async addContactToInteraction(interactionId, contactId) {
    // Verify interaction exists
    const interaction = await interactionRepository.findById(interactionId);
    if (!interaction) {
      throw new Error('Interaction not found');
    }
    
    // Verify contact exists
    const contact = await contactRepository.findById(contactId);
    if (!contact) {
      throw new Error('Contact not found');
    }
    
    return interactionRepository.addContact(interactionId, contactId);
  }
  
  async removeContactFromInteraction(interactionId, contactId) {
    // Verify interaction exists
    const interaction = await interactionRepository.findById(interactionId);
    if (!interaction) {
      throw new Error('Interaction not found');
    }
    
    // Check if contact is associated with the interaction
    if (!interaction.contacts.includes(contactId)) {
      throw new Error('Contact is not associated with this interaction');
    }
    
    return interactionRepository.removeContact(interactionId, contactId);
  }
  
  async deleteInteraction(id) {
    return interactionRepository.delete(id);
  }
}

module.exports = new InteractionService(); 