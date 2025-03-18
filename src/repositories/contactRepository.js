const Contact = require('../models/Contact');

class ContactRepository {
  async findAll(query = {}, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;
    
    const contacts = await Contact.find(query)
      .populate('client', 'nom SIREN SIRET')
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
    const total = await Contact.countDocuments(query);
    
    return {
      contacts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  async findById(id) {
    return Contact.findById(id).populate('client', 'nom SIREN SIRET');
  }
  
  async findByClient(clientId, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;
    
    const contacts = await Contact.find({ client: clientId })
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
    const total = await Contact.countDocuments({ client: clientId });
    
    return {
      contacts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  async create(contactData) {
    const contact = new Contact(contactData);
    return contact.save();
  }
  
  async update(id, contactData) {
    return Contact.findByIdAndUpdate(id, contactData, { new: true, runValidators: true });
  }
  
  async delete(id) {
    return Contact.findByIdAndDelete(id);
  }
}

module.exports = new ContactRepository(); 