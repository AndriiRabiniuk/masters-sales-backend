const contactRepository = require('../repositories/contactRepository');
const clientRepository = require('../repositories/clientRepository');

class ContactService {
  async getAllContacts(query, options) {
    return contactRepository.findAll(query, options);
  }
  
  async getContactById(id) {
    return contactRepository.findById(id);
  }
  
  async getContactsByClient(clientId, options) {
    // Verify client exists
    const client = await clientRepository.findById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }
    
    return contactRepository.findByClient(clientId, options);
  }
  
  async createContact(contactData) {
    // Verify client exists
    const client = await clientRepository.findById(contactData.client);
    if (!client) {
      throw new Error('Client not found');
    }
    
    // Check if email already exists
    if (contactData.email) {
      const existingEmail = await contactRepository.findOne({ email: contactData.email });
      if (existingEmail) {
        throw new Error('Contact with this email already exists');
      }
    }
    
    return contactRepository.create(contactData);
  }
  
  async updateContact(id, contactData) {
    // If client is being updated, verify it exists
    if (contactData.client) {
      const client = await clientRepository.findById(contactData.client);
      if (!client) {
        throw new Error('Client not found');
      }
    }
    
    // Check if email is being updated and if it already exists
    if (contactData.email) {
      const existingEmail = await contactRepository.findOne({
        email: contactData.email,
        _id: { $ne: id } // Exclude current contact
      });
      
      if (existingEmail) {
        throw new Error('Another contact with this email already exists');
      }
    }
    
    return contactRepository.update(id, contactData);
  }
  
  async deleteContact(id) {
    return contactRepository.delete(id);
  }
  
  async searchContacts(searchTerm, options) {
    const query = {
      $or: [
        { nom: { $regex: searchTerm, $options: 'i' } },
        { prenom: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { telephone: { $regex: searchTerm, $options: 'i' } },
        { fonction: { $regex: searchTerm, $options: 'i' } }
      ]
    };
    
    return contactRepository.findAll(query, options);
  }
}

module.exports = new ContactService(); 