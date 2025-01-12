const Client = require('../models/Client');

class ClientRepository {
  async findAll(query = {}, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;
    
    const clients = await Client.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
    const total = await Client.countDocuments(query);
    
    return {
      clients,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  async findById(id) {
    return Client.findById(id);
  }
  
  async findOne(query) {
    return Client.findOne(query);
  }
  
  async create(clientData) {
    const client = new Client(clientData);
    return client.save();
  }
  
  async update(id, clientData) {
    return Client.findByIdAndUpdate(id, clientData, { new: true, runValidators: true });
  }
  
  async delete(id) {
    return Client.findByIdAndDelete(id);
  }
}

module.exports = new ClientRepository(); 