const noteRepository = require('../repositories/noteRepository');
const clientRepository = require('../repositories/clientRepository');

class NoteService {
  async getAllNotes(query, options) {
    return noteRepository.findAll(query, options);
  }
  
  async getNoteById(id) {
    return noteRepository.findById(id);
  }
  
  async getNotesByClient(clientId, options) {
    // Verify client exists
    const client = await clientRepository.findById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }
    
    return noteRepository.findByClient(clientId, options);
  }
  
  async createNote(noteData) {
    // Verify client exists
    const client = await clientRepository.findById(noteData.client);
    if (!client) {
      throw new Error('Client not found');
    }
    
    return noteRepository.create(noteData);
  }
  
  async updateNote(id, noteData) {
    // Verify note exists
    const note = await noteRepository.findById(id);
    if (!note) {
      throw new Error('Note not found');
    }
    
    // If client is being updated, verify it exists
    if (noteData.client) {
      const client = await clientRepository.findById(noteData.client);
      if (!client) {
        throw new Error('Client not found');
      }
    }
    
    return noteRepository.update(id, noteData);
  }
  
  async deleteNote(id) {
    return noteRepository.delete(id);
  }
  
  async searchNotes(searchTerm, options) {
    const query = {
      contenu: { $regex: searchTerm, $options: 'i' }
    };
    
    return noteRepository.findAll(query, options);
  }
}

module.exports = new NoteService(); 