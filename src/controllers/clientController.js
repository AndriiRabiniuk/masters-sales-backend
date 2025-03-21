const { Client } = require('../models');
const asyncHandler = require('express-async-handler');

// @desc    Create a new client
// @route   POST /api/clients
// @access  Private/Admin
exports.createClient = asyncHandler(async (req, res) => {
  const { 
    company_id, 
    name, 
    SIREN, 
    SIRET, 
    code_postal, 
    code_NAF, 
    chiffre_d_affaires, 
    EBIT, 
    latitude, 
    longitude, 
    pdm 
  } = req.body;

  // If not super_admin, can only create clients for their own company
  if (req.user.role !== 'super_admin' && req.user.company_id) {
    if (!company_id || company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('You can only create clients for your own company');
    }
  }

  const client = await Client.create({
    company_id,
    name,
    SIREN,
    SIRET,
    code_postal,
    code_NAF,
    chiffre_d_affaires,
    EBIT,
    latitude,
    longitude,
    pdm
  });

  if (client) {
    res.status(201).json(client);
  } else {
    res.status(400);
    throw new Error('Invalid client data');
  }
});

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
exports.getClients = asyncHandler(async (req, res) => {
  let query = {};
  
  // If not super_admin, only show clients from their company
  if (req.user.role !== 'super_admin' && req.user.company_id) {
    query.company_id = req.user.company_id;
  }
  
  const clients = await Client.find(query);
  res.json(clients);
});

// @desc    Get client by ID
// @route   GET /api/clients/:id
// @access  Private
exports.getClientById = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  
  if (!client) {
    res.status(404);
    throw new Error('Client not found');
  }
  
  // Check if user has permission to view this client
  if (req.user.role !== 'super_admin' && req.user.company_id) {
    if (client.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this client');
    }
  }
  
  res.json(client);
});

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
exports.updateClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  
  if (!client) {
    res.status(404);
    throw new Error('Client not found');
  }

  // Check if user has permission to update this client
  if (req.user.role !== 'super_admin' && req.user.company_id) {
    if (client.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this client');
    }
  }

  // Don't allow changing company_id unless super_admin
  if (req.body.company_id && req.user.role !== 'super_admin') {
    if (req.body.company_id.toString() !== client.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to change company_id');
    }
  }
  
  const updatedClient = await Client.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.json(updatedClient);
});

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private/Admin
exports.deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  
  if (!client) {
    res.status(404);
    throw new Error('Client not found');
  }

  // Check if user has permission to delete this client
  if (req.user.role !== 'super_admin' && req.user.company_id) {
    if (client.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this client');
    }
  }
  
  await client.deleteOne();
  res.json({ message: 'Client removed' });
}); 