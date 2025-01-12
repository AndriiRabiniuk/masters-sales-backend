const Note = require('../models/Note');

class NoteRepository {
  async findAll(query = {}, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;
    
    const notes = await Note.find(query)
      .populate('client', 'nom SIREN SIRET')
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
    const total = await Note.countDocuments(query);
    
    return {
      notes,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  async findById(id) {
    return Note.findById(id).populate('client', 'nom SIREN SIRET');
  }
  
  async findByClient(clientId, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;
    
    const notes = await Note.find({ client: clientId })
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
    const total = await Note.countDocuments({ client: clientId });
    
    return {
      notes,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  async create(noteData) {
    const note = new Note(noteData);
    return note.save();
  }
  
  async update(id, noteData) {
    return Note.findByIdAndUpdate(id, noteData, { new: true, runValidators: true });
  }
  
  async delete(id) {
    return Note.findByIdAndDelete(id);
  }
}

module.exports = new NoteRepository(); 