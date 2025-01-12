const { Interaction, Lead, InteractionContact, Contact, Client } = require('../models');
const asyncHandler = require('express-async-handler');
const { paginateResults } = require('../utils/paginationUtils');

/**
 * Get all interactions
 * @route GET /api/interactions
 * @access Private
 */
exports.getInteractions = asyncHandler(async (req, res) => {
  const { page, limit, search, lead_id } = req.query;
  const company_id = req.user.company_id;
  const clients = await Client.find({ company_id });
  const clientIds = clients.map(client => client._id);
  
  // Step 2: Get leads for these clients
  const leads = await Lead.find({ client_id: { $in: clientIds } });
  const leadIds = leads.map(lead => lead._id);
  
  // Define which fields to search in if search parameter is provided
  const searchFields = search ? ['type_interaction', 'description'] : [];
  
  // Build query to filter by user's company and lead_id if provided
  let query = { lead_id: { $in: leadIds } };
  
  // If lead_id is provided, verify it belongs to the user's company
  if (lead_id) {
    const lead = await Lead.findById(lead_id);
    if (!lead) {
      res.status(404);
      throw new Error('Lead not found');
    }
    
    // Check if the lead belongs to the user's company
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
      const client = await Client.findById(lead.client_id);
      if (!client || client.company_id.toString() !== req.user.company_id.toString()) {
        res.status(403);
        throw new Error('Not authorized to access interactions for this lead');
      }
    }
    
    // Update query to filter by specific lead
    query = { lead_id };
  }
  
  // Get paginated results
  const results = await paginateResults(Interaction, query, {
    page,
    limit,
    search,
    searchFields,
    populate: [
      {
        path: 'lead_id',
        select: '_id name'
      }
    ],
    sort: { created_at: -1 } // Sort by most recent first
  });
  
  // Rename data to interactions to match desired response format
  const { data: interactions, ...rest } = results;
  
  res.json({ interactions, ...rest });
});

/**
 * Get interaction by ID
 * @route GET /api/interactions/:id
 * @access Private
 */
exports.getInteractionById = asyncHandler(async (req, res) => {
  const interaction = await Interaction.findById(req.params.id)
    .populate('lead_id', 'name');
  
  if (!interaction) {
    res.status(404);
    throw new Error('Interaction not found');
  }
  
  // Check if user has permission to view this interaction
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
    // Get the lead to check if it belongs to the user's company
    // const lead = await Lead.findById(interaction.lead_id);
    // if (!lead || lead.company_id?.toString() !== req.user.company_id.toString()) {
    //   res.status(403);
    //   throw new Error('Not authorized to access this interaction');
    // }
  }
  
  // Get contacts for this interaction
  const interactionContacts = await InteractionContact.find({ interaction_id: interaction._id })
    .populate('contact_id', 'name prenom email telephone');
  
  const contacts = interactionContacts.map(ic => ic.contact_id);
  
  const result = {
    ...interaction.toObject(),
    contacts
  };
  
  res.json(result);
});

/**
 * Create a new interaction
 * @route POST /api/interactions
 * @access Private
 */
exports.createInteraction = asyncHandler(async (req, res) => {
  const { lead_id, date_interaction, type_interaction, description, contact_ids } = req.body;
  
  // Check if user has permission to create an interaction for this lead
  // if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
  //   const lead = await Lead.findById(lead_id);
  //   if (!lead || lead.company_id?.toString() !== req.user.company_id.toString()) {
  //     res.status(403);
  //     throw new Error('Not authorized to create interactions for this lead');
  //   }
  // }
  
  // Create the interaction
  const interaction = await Interaction.create({
    lead_id,
    date_interaction,
    type_interaction,
    description
  });
  
  // If contact_ids are provided, create interaction-contact relationships
  if (contact_ids && contact_ids.length > 0) {
    // Make sure all contacts belong to the same company as the user
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
      const contacts = await Contact.find({ _id: { $in: contact_ids } });
      
      // for (const contact of contacts) {
      //   if (contact.company_id?.toString() !== req.user.company_id.toString()) {
      //     res.status(403);
      //     throw new Error('Not authorized to associate contacts from different companies');
      //   }
      // }
    }
    
    // Create the interaction-contact relationships
    const interactionContacts = await Promise.all(
      contact_ids.map(contact_id => 
        InteractionContact.create({
          interaction_id: interaction._id,
          contact_id
        })
      )
    );
  }
  
  // Get the created interaction with contacts
  const createdInteraction = await Interaction.findById(interaction._id)
    .populate('lead_id', 'name');
  
  const interactionContacts = await InteractionContact.find({ interaction_id: interaction._id })
    .populate('contact_id', 'name prenom email telephone');
  
  const contacts = interactionContacts.map(ic => ic.contact_id);
  
  const result = {
    ...createdInteraction.toObject(),
    contacts
  };
  
  res.status(201).json(result);
});

/**
 * Update an interaction
 * @route PUT /api/interactions/:id
 * @access Private
 */
exports.updateInteraction = asyncHandler(async (req, res) => {
  const { lead_id, date_interaction, type_interaction, description, contact_ids } = req.body;
  
  const interaction = await Interaction.findById(req.params.id);
  
  if (!interaction) {
    res.status(404);
    throw new Error('Interaction not found');
  }
  
  // Check if user has permission to update this interaction
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
    const lead = await Lead.findById(interaction.lead_id);
    if (!lead || lead.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this interaction');
    }
    
    // If lead_id is being changed, check if user has permission for the new lead
    if (lead_id && lead_id !== interaction.lead_id.toString()) {
      const newLead = await Lead.findById(lead_id);
      if (!newLead || newLead.company_id.toString() !== req.user.company_id.toString()) {
        res.status(403);
        throw new Error('Not authorized to change to this lead');
      }
    }
  }
  
  // Update the interaction
  interaction.lead_id = lead_id || interaction.lead_id;
  interaction.date_interaction = date_interaction || interaction.date_interaction;
  interaction.type_interaction = type_interaction || interaction.type_interaction;
  interaction.description = description || interaction.description;
  
  await interaction.save();
  
  // Update contacts if provided
  if (contact_ids) {
    // Make sure all contacts belong to the same company as the user
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
      const contacts = await Contact.find({ _id: { $in: contact_ids } });
      
      for (const contact of contacts) {
        if (contact.company_id.toString() !== req.user.company_id.toString()) {
          res.status(403);
          throw new Error('Not authorized to associate contacts from different companies');
        }
      }
    }
    
    // Remove existing interaction-contact relationships
    await InteractionContact.deleteMany({ interaction_id: interaction._id });
    
    // Create new interaction-contact relationships
    if (contact_ids.length > 0) {
      await Promise.all(
        contact_ids.map(contact_id => 
          InteractionContact.create({
            interaction_id: interaction._id,
            contact_id
          })
        )
      );
    }
  }
  
  // Get the updated interaction with contacts
  const updatedInteraction = await Interaction.findById(interaction._id)
    .populate('lead_id', 'name');
  
  const interactionContacts = await InteractionContact.find({ interaction_id: interaction._id })
    .populate('contact_id', 'name prenom email telephone');
  
  const contacts = interactionContacts.map(ic => ic.contact_id);
  
  const result = {
    ...updatedInteraction.toObject(),
    contacts
  };
  
  res.json(result);
});

/**
 * Delete an interaction
 * @route DELETE /api/interactions/:id
 * @access Private
 */
exports.deleteInteraction = asyncHandler(async (req, res) => {
  const interaction = await Interaction.findById(req.params.id);
  
  if (!interaction) {
    res.status(404);
    throw new Error('Interaction not found');
  }
  
  // Check if user has permission to delete this interaction
  if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.company_id) {
    const lead = await Lead.findById(interaction.lead_id);
    if (!lead || lead.company_id.toString() !== req.user.company_id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this interaction');
    }
  }
  
  // Delete all associated interaction-contact relationships
  await InteractionContact.deleteMany({ interaction_id: interaction._id });
  
  // Delete the interaction
  await interaction.deleteOne();
  
  res.json({ message: 'Interaction removed' });
});
