const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User, Company, Client, Lead, Contact, Note, Interaction, InteractionContact, Task } = require('../models');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  try {
    await mongoose.connection.db.dropDatabase();
    console.log('Database cleared');
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    // Create super admin user
    const superAdminUser = new User({
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: await bcrypt.hash('SuperAdmin123!', 10),
      role: 'super_admin',
    });
    
    // Create admin users for each company
    const companyAdmins = [];
    for (let i = 1; i <= 3; i++) {
      companyAdmins.push(new User({
        name: `Company Admin ${i}`,
        email: `admin${i}@example.com`,
        password: await bcrypt.hash('Admin123!', 10),
        role: 'admin',
        // Company will be assigned after company creation
      }));
    }
    
    // Create regular users
    const regularUsers = [];
    for (let i = 1; i <= 5; i++) {
      regularUsers.push(new User({
        name: `Sales User ${i}`,
        email: `user${i}@example.com`,
        password: await bcrypt.hash('User123!', 10),
        role: 'sales',
        // Company will be assigned after company creation
      }));
    }
    
    await User.create(superAdminUser);
    const createdAdmins = await User.insertMany(companyAdmins);
    const createdUsers = await User.insertMany(regularUsers);
    console.log('Users seeded successfully');
    
    return { superAdminUser, companyAdmins: createdAdmins, regularUsers: createdUsers };
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

const seedCompanies = async () => {
  try {
    const companies = [
      {
        name: 'Tech Solutions Inc.',
        SIREN: '123456789',
        SIRET: '12345678900001',
        code_postal: '75001',
        code_NAF: '6201Z',
        chiffre_d_affaires: 1500000,
        EBIT: 350000,
        latitude: 48.8566,
        longitude: 2.3522,
        pdm: 0.15
      },
      {
        name: 'Global Finance Group',
        SIREN: '987654321',
        SIRET: '98765432100001',
        code_postal: '69001',
        code_NAF: '6419Z',
        chiffre_d_affaires: 5000000,
        EBIT: 1200000,
        latitude: 45.7640,
        longitude: 4.8357,
        pdm: 0.25
      },
      {
        name: 'Eco Solutions',
        SIREN: '456789123',
        SIRET: '45678912300001',
        code_postal: '33000',
        code_NAF: '7112B',
        chiffre_d_affaires: 800000,
        EBIT: 150000,
        latitude: 44.8378,
        longitude: -0.5792,
        pdm: 0.08
      }
    ];
    
    const createdCompanies = await Company.insertMany(companies);
    console.log('Companies seeded successfully');
    
    return createdCompanies;
  } catch (error) {
    console.error('Error seeding companies:', error);
    process.exit(1);
  }
};

const assignUsersToCompanies = async (users, companies) => {
  try {
    // Assign each admin to a company
    for (let i = 0; i < users.companyAdmins.length && i < companies.length; i++) {
      users.companyAdmins[i].company_id = companies[i]._id;
      await users.companyAdmins[i].save();
    }
    
    // Distribute regular users among companies
    for (let i = 0; i < users.regularUsers.length; i++) {
      const companyIndex = i % companies.length;
      users.regularUsers[i].company_id = companies[companyIndex]._id;
      await users.regularUsers[i].save();
    }
    
    console.log('Users assigned to companies successfully');
  } catch (error) {
    console.error('Error assigning users to companies:', error);
    process.exit(1);
  }
};

const seedClients = async (companies) => {
  try {
    const clients = [];
    
    // Create 2-4 clients for each company
    for (const company of companies) {
      const numClients = Math.floor(Math.random() * 3) + 2; // 2-4 clients
      
      for (let i = 1; i <= numClients; i++) {
        clients.push({
          company_id: company._id,
          name: `Client ${i} of ${company.name}`,
          SIREN: `${Math.floor(100000000 + Math.random() * 900000000)}`,
          SIRET: `${Math.floor(10000000000000 + Math.random() * 90000000000000)}`,
          code_postal: ['75001', '69001', '33000', '59000', '13001'][Math.floor(Math.random() * 5)],
          code_NAF: ['6201Z', '6419Z', '7112B', '7211Z', '4941A'][Math.floor(Math.random() * 5)],
          chiffre_d_affaires: Math.floor(500000 + Math.random() * 4500000),
          EBIT: Math.floor(100000 + Math.random() * 900000),
          latitude: 45 + Math.random() * 5,
          longitude: 0 + Math.random() * 5,
          pdm: Math.random() * 0.25
        });
      }
    }
    
    const createdClients = await Client.insertMany(clients);
    console.log('Clients seeded successfully');
    
    return createdClients;
  } catch (error) {
    console.error('Error seeding clients:', error);
    process.exit(1);
  }
};

const seedContacts = async (clients) => {
  try {
    const contacts = [];
    let emailCounter = 1;
    
    // Create contacts for clients only (not for companies)
    for (const client of clients) {
      // Create 2-4 contacts per client
      const numContacts = Math.floor(Math.random() * 3) + 2;
      
      const firstNames = ['Jean', 'Sophie', 'Pierre', 'Marie', 'Thomas', 'Claire', 'Lucas', 'Emma'];
      const lastNames = ['Dupont', 'Martin', 'Dubois', 'Bernard', 'Petit', 'Robert', 'Moreau', 'Laurent'];
      const roles = ['CEO', 'CTO', 'CFO', 'Sales Director', 'Marketing Manager', 'HR Manager', 'Operations Director'];
      
      for (let i = 0; i < numContacts; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        contacts.push({
          client_id: client._id, // Link to the client
          name: lastName,
          prenom: firstName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${emailCounter}@client${client._id.toString().substring(0, 4)}.com`,
          telephone: '06' + Math.floor(10000000 + Math.random() * 90000000),
          fonction: roles[Math.floor(Math.random() * roles.length)]
        });
        
        emailCounter++;
      }
    }
    
    const createdContacts = await Contact.insertMany(contacts);
    console.log('Contacts seeded successfully');
    
    return createdContacts;
  } catch (error) {
    console.error('Error seeding contacts:', error);
    process.exit(1);
  }
};

const seedLeads = async (clients, users) => {
  try {
    const leads = [];
    const statuses = ['Start-to-Call', 'Call-to-Connect', 'Connect-to-Contact', 'Contact-to-Demo', 'Demo-to-Close'];
    const sources = ['website', 'referral', 'event'];
    const projectTypes = ['Expansion', 'Renovation', 'Automation', 'Digitalization', 'Innovation', 'Optimization'];
    
    // Group users by company
    const usersByCompany = {};
    for (const admin of users.companyAdmins) {
      if (admin.company_id) {
        const companyId = admin.company_id.toString();
        if (!usersByCompany[companyId]) {
          usersByCompany[companyId] = [];
        }
        usersByCompany[companyId].push(admin);
      }
    }
    
    for (const user of users.regularUsers) {
      if (user.company_id) {
        const companyId = user.company_id.toString();
        if (!usersByCompany[companyId]) {
          usersByCompany[companyId] = [];
        }
        usersByCompany[companyId].push(user);
      }
    }
    
    for (const client of clients) {
      const companyId = client.company_id.toString();
      const companyUsers = usersByCompany[companyId] || [];
      
      if (companyUsers.length === 0) {
        console.log(`No users found for company of client ${client.name}, skipping lead creation`);
        continue;
      }
      
      // Create 1-3 leads per client
      const numLeads = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numLeads; i++) {
        // Assign lead to a random user in the same company
        const randomUser = companyUsers[Math.floor(Math.random() * companyUsers.length)];
        
        leads.push({
          user_id: randomUser._id,
          client_id: client._id,
          name: `${projectTypes[Math.floor(Math.random() * projectTypes.length)]} Project`,
          source: sources[Math.floor(Math.random() * sources.length)],
          statut: statuses[Math.floor(Math.random() * statuses.length)],
          valeur_estimee: Math.floor(10000 + Math.random() * 990000)
        });
      }
    }
    
    const createdLeads = await Lead.insertMany(leads);
    console.log('Leads seeded successfully');
    
    return createdLeads;
  } catch (error) {
    console.error('Error seeding leads:', error);
    process.exit(1);
  }
};

const seedInteractions = async (leads, contacts) => {
  try {
    const interactions = [];
    const types = ['call', 'email', 'meeting'];
    const descriptions = [
      'Initial contact to present our services',
      'Follow-up on commercial proposal',
      'Product demo session',
      'Project progress meeting',
      'Financial terms negotiation'
    ];
    
    // Group contacts by client
    const contactsByClient = {};
    for (const contact of contacts) {
      if (contact.client_id) {
        const clientId = contact.client_id.toString();
        if (!contactsByClient[clientId]) {
          contactsByClient[clientId] = [];
        }
        contactsByClient[clientId].push(contact);
      }
    }
    
    for (const lead of leads) {
      // Create 1-3 interactions per lead
      const numInteractions = Math.floor(Math.random() * 3) + 1;
      const clientId = lead.client_id.toString();
      const clientContacts = contactsByClient[clientId] || [];
      
      if (clientContacts.length === 0) {
        console.log(`No contacts found for client of lead ${lead.name}, skipping interaction creation`);
        continue;
      }
      
      for (let i = 0; i < numInteractions; i++) {
        const interaction = {
          lead_id: lead._id,
          date_interaction: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
          type_interaction: types[Math.floor(Math.random() * types.length)],
          description: descriptions[Math.floor(Math.random() * descriptions.length)]
        };
        
        const createdInteraction = await Interaction.create(interaction);
        interactions.push(createdInteraction);
        
        // Create InteractionContact relationships
        // Select 1-2 random contacts from the client
        const numContactsToInclude = Math.min(Math.floor(Math.random() * 2) + 1, clientContacts.length);
        const selectedContacts = [];
        const tempContacts = [...clientContacts];
        
        for (let j = 0; j < numContactsToInclude; j++) {
          if (tempContacts.length === 0) break;
          
          const contactIndex = Math.floor(Math.random() * tempContacts.length);
          selectedContacts.push(tempContacts[contactIndex]);
          tempContacts.splice(contactIndex, 1);
        }
        
        // Create interaction contact relationships
        for (const contact of selectedContacts) {
          await InteractionContact.create({
            interaction_id: createdInteraction._id,
            contact_id: contact._id
          });
        }
      }
    }
    
    console.log('Interactions and InteractionContacts seeded successfully');
    return interactions;
  } catch (error) {
    console.error('Error seeding interactions:', error);
    process.exit(1);
  }
};

const seedTasks = async (interactions, users) => {
  try {
    const tasks = [];
    const statuses = ['pending', 'in progress', 'completed'];
    const titles = [
      'Send commercial proposal',
      'Prepare demo',
      'Follow up by phone',
      'Organize meeting',
      'Send technical documentation'
    ];
    const descriptions = [
      'Prepare and send a detailed proposal',
      'Set up demonstration environment',
      'Call the client to follow up on progress',
      'Schedule a meeting with stakeholders',
      'Compile and send technical documentation'
    ];
    
    // Create a lookup of leads by ID for quick access
    const leadsLookup = new Map();
    const leadsWithClients = await Lead.find().populate('client_id', 'company_id');
    for (const lead of leadsWithClients) {
      leadsLookup.set(lead._id.toString(), lead);
    }
    
    // Group users by company
    const usersByCompany = {};
    for (const user of [...users.companyAdmins, ...users.regularUsers]) {
      if (user.company_id) {
        const companyId = user.company_id.toString();
        if (!usersByCompany[companyId]) {
          usersByCompany[companyId] = [];
        }
        usersByCompany[companyId].push(user);
      }
    }
    
    for (const interaction of interactions) {
      // 50% chance to create a task from an interaction
      if (Math.random() > 0.5) {
        // Find the lead associated with this interaction
        const lead = leadsLookup.get(interaction.lead_id.toString());
        if (!lead || !lead.client_id) continue;
        
        // Find users from the same company as the lead
        const companyId = lead.client_id.company_id.toString();
        const companyUsers = usersByCompany[companyId] || [];
        
        if (companyUsers.length === 0) continue;
        
        // Assign to a random user in the same company
        const assignedUser = companyUsers[Math.floor(Math.random() * companyUsers.length)];
        
        tasks.push({
          interaction_id: interaction._id,
          titre: titles[Math.floor(Math.random() * titles.length)],
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          statut: statuses[Math.floor(Math.random() * statuses.length)],
          due_date: new Date(Date.now() + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000),
          assigned_to: assignedUser._id
        });
      }
    }
    
    if (tasks.length > 0) {
      const createdTasks = await Task.insertMany(tasks);
      console.log('Tasks seeded successfully');
      return createdTasks;
    } else {
      console.log('No tasks created');
      return [];
    }
  } catch (error) {
    console.error('Error seeding tasks:', error);
    process.exit(1);
  }
};

const seedNotes = async (clients) => {
  try {
    const notes = [];
    const contents = [
      'Potential interest in our new service offering',
      'Special attention needed for payment terms',
      'Schedule a presentation of the new product version',
      'Strategic client for our regional expansion',
      'Complex collaboration history, requires careful monitoring'
    ];
    
    // Notes for clients only
    for (const client of clients) {
      // 70% chance to create a note for a client
      if (Math.random() < 0.7) {
        notes.push({
          client_id: client._id,
          contenu: contents[Math.floor(Math.random() * contents.length)]
        });
      }
    }
    
    if (notes.length > 0) {
      const createdNotes = await Note.insertMany(notes);
      console.log('Notes seeded successfully');
      return createdNotes;
    } else {
      console.log('No notes created');
      return [];
    }
  } catch (error) {
    console.error('Error seeding notes:', error);
    process.exit(1);
  }
};

const seed = async () => {
  try {
    await connectDB();
    await clearDatabase();
    
    const users = await seedUsers();
    const companies = await seedCompanies();
    await assignUsersToCompanies(users, companies);
    const clients = await seedClients(companies);
    const contacts = await seedContacts(clients);
    const leads = await seedLeads(clients, users);
    const interactions = await seedInteractions(leads, contacts);
    const tasks = await seedTasks(interactions, users);
    const notes = await seedNotes(clients);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed(); 