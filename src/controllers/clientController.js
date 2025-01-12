const { Client } = require('../models');
const asyncHandler = require('express-async-handler');
const { paginateResults } = require('../utils/paginationUtils');

// @desc    Create a new client
// @route   POST /api/clients
// @access  Private/Admin
exports.createClient = asyncHandler(async (req, res) => {
  let { 
    company_id, 
    name, 
    description,
    marketSegment,
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
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
    if (!company_id || company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('You can only create clients for your own company');
    }
  }
  if(req.user.role === 'super_admin' || req.user.role === 'admin'){
    company_id = req.user.company_id;
  }
  const client = await Client.create({
    company_id,
    name,
    description,
    marketSegment,
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
  const { page, limit, search } = req.query;
  
  // Define which fields to search in if search parameter is provided
  const searchFields = search ? ['name', 'description', 'marketSegment', 'SIREN', 'SIRET', 'code_postal'] : [];
  
  // Get company_id from authenticated user (assuming this is how you filter by company)
  const company_id = req.user.company_id;
  
  // Prepare the base query
  const query = company_id ? { company_id } : {};
  
  // Get paginated results
  const results = await paginateResults(Client, query, {
    page,
    limit,
    search,
    searchFields,
    populate: 'company_id', // Populate related fields if needed
    sort: { createdAt: -1 } // Sort by most recent first
  });
  
  // Rename data to clients to match desired response format
  const { data: clients, ...rest } = results;
  
  res.json({ clients, ...rest });
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
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
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
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
    if (client.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this client');
    }
  }
  if (req.user.role === 'admin'){
    req.body.company_id = req.user.company_id;
  }

  // Don't allow changing company_id unless super_admin
  
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
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
    if (client.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this client');
    }
  }
  
  await client.deleteOne();
  res.json({ message: 'Client removed' });
}); 