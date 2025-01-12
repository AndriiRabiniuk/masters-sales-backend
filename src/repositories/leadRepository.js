const Lead = require('../models/Lead');

class LeadRepository {
  async findAll(query = {}, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;
    
    const leads = await Lead.find(query)
      .populate('client', 'nom SIREN SIRET')
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
    const total = await Lead.countDocuments(query);
    
    return {
      leads,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  async findById(id) {
    return Lead.findById(id).populate('client', 'nom SIREN SIRET');
  }
  
  async findByClient(clientId, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;
    
    const leads = await Lead.find({ client: clientId })
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
    const total = await Lead.countDocuments({ client: clientId });
    
    return {
      leads,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  async findByStatus(status, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;
    
    const leads = await Lead.find({ statut: status })
      .populate('client', 'nom SIREN SIRET')
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
    const total = await Lead.countDocuments({ statut: status });
    
    return {
      leads,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  async create(leadData) {
    const lead = new Lead(leadData);
    return lead.save();
  }
  
  async update(id, leadData) {
    return Lead.findByIdAndUpdate(id, leadData, { new: true, runValidators: true });
  }
  
  async delete(id) {
    return Lead.findByIdAndDelete(id);
  }
}

module.exports = new LeadRepository(); 