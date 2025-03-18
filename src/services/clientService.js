const clientRepository = require('../repositories/clientRepository');

class ClientService {
  async getAllClients(query, options) {
    return clientRepository.findAll(query, options);
  }
  
  async getClientById(id) {
    return clientRepository.findById(id);
  }
  
  async createClient(clientData) {
    // Check if client with SIREN or SIRET already exists
    if (clientData.SIREN) {
      const existingSIREN = await clientRepository.findOne({ SIREN: clientData.SIREN });
      if (existingSIREN) {
        throw new Error('Client with this SIREN already exists');
      }
    }
    
    if (clientData.SIRET) {
      const existingSIRET = await clientRepository.findOne({ SIRET: clientData.SIRET });
      if (existingSIRET) {
        throw new Error('Client with this SIRET already exists');
      }
    }
    
    return clientRepository.create(clientData);
  }
  
  async updateClient(id, clientData) {
    // Check if SIREN is being updated and if it already exists
    if (clientData.SIREN) {
      const existingSIREN = await clientRepository.findOne({ 
        SIREN: clientData.SIREN,
        _id: { $ne: id } // Exclude current client
      });
      
      if (existingSIREN) {
        throw new Error('Another client with this SIREN already exists');
      }
    }
    
    // Check if SIRET is being updated and if it already exists
    if (clientData.SIRET) {
      const existingSIRET = await clientRepository.findOne({
        SIRET: clientData.SIRET,
        _id: { $ne: id } // Exclude current client
      });
      
      if (existingSIRET) {
        throw new Error('Another client with this SIRET already exists');
      }
    }
    
    return clientRepository.update(id, clientData);
  }
  
  async deleteClient(id) {
    return clientRepository.delete(id);
  }
  
  async searchClients(searchTerm, options) {
    const query = {
      $or: [
        { nom: { $regex: searchTerm, $options: 'i' } },
        { SIREN: { $regex: searchTerm, $options: 'i' } },
        { SIRET: { $regex: searchTerm, $options: 'i' } },
        { code_postal: { $regex: searchTerm, $options: 'i' } },
        { code_NAF: { $regex: searchTerm, $options: 'i' } }
      ]
    };
    
    return clientRepository.findAll(query, options);
  }
}

module.exports = new ClientService(); 