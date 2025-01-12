const leadRepository = require('../repositories/leadRepository');
const clientRepository = require('../repositories/clientRepository');

class LeadService {
  async getAllLeads(query, options) {
    return leadRepository.findAll(query, options);
  }
  
  async getLeadById(id) {
    return leadRepository.findById(id);
  }
  
  async getLeadsByClient(clientId, options) {
    // Verify client exists
    const client = await clientRepository.findById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }
    
    return leadRepository.findByClient(clientId, options);
  }
  
  async getLeadsByStatus(status, options) {
    return leadRepository.findByStatus(status, options);
  }
  
  async createLead(leadData) {
    // Verify client exists
    const client = await clientRepository.findById(leadData.client);
    if (!client) {
      throw new Error('Client not found');
    }
    
    return leadRepository.create(leadData);
  }
  
  async updateLead(id, leadData) {
    // If client is being updated, verify it exists
    if (leadData.client) {
      const client = await clientRepository.findById(leadData.client);
      if (!client) {
        throw new Error('Client not found');
      }
    }
    
    return leadRepository.update(id, leadData);
  }
  
  async updateLeadStatus(id, status) {
    // Verify lead exists
    const lead = await leadRepository.findById(id);
    if (!lead) {
      throw new Error('Lead not found');
    }
    
    // Validate status
    const validStatuses = ['Start-to-Call', 'Call-to-Connect', 'Connect-to-Contact', 'Contact-to-Demo', 'Demo-to-Close'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }
    
    return leadRepository.update(id, { statut: status });
  }
  
  async deleteLead(id) {
    return leadRepository.delete(id);
  }
  
  async searchLeads(searchTerm, options) {
    const query = {
      $or: [
        { nom: { $regex: searchTerm, $options: 'i' } },
        { source: { $regex: searchTerm, $options: 'i' } },
        { statut: { $regex: searchTerm, $options: 'i' } }
      ]
    };
    
    return leadRepository.findAll(query, options);
  }
}

module.exports = new LeadService(); 