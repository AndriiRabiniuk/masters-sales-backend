const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Client = require('../models/Client');
const Contact = require('../models/Contact');
const Lead = require('../models/Lead');
const Interaction = require('../models/Interaction');
const Task = require('../models/Task');
const Note = require('../models/Note');
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
    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'Admin123!',
      role: 'admin',
    });
    
    // Create manager user
    const managerUser = new User({
      username: 'manager',
      email: 'manager@example.com',
      password: 'Manager123!',
      role: 'manager',
    });
    
    // Create regular user
    const regularUser = new User({
      username: 'user',
      email: 'user@example.com',
      password: 'User123!',
      role: 'user',
    });
    
    await User.insertMany([adminUser, managerUser, regularUser]);
    console.log('Users seeded successfully');
    
    return { adminUser, managerUser, regularUser };
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

const seedClients = async () => {
  try {
    const clients = [
      {
        SIREN: '123456789',
        SIRET: '12345678900001',
        nom: 'Tech Solutions Inc.',
        code_postal: '75001',
        code_NAF: '6201Z',
        chiffre_d_affaires: 1500000,
        EBIT: 350000,
        latitude: 48.8566,
        longitude: 2.3522,
        pdm: 0.15
      },
      {
        SIREN: '987654321',
        SIRET: '98765432100001',
        nom: 'Global Finance Group',
        code_postal: '69001',
        code_NAF: '6419Z',
        chiffre_d_affaires: 5000000,
        EBIT: 1200000,
        latitude: 45.7640,
        longitude: 4.8357,
        pdm: 0.25
      },
      {
        SIREN: '456789123',
        SIRET: '45678912300001',
        nom: 'Eco Solutions',
        code_postal: '33000',
        code_NAF: '7112B',
        chiffre_d_affaires: 800000,
        EBIT: 150000,
        latitude: 44.8378,
        longitude: -0.5792,
        pdm: 0.08
      },
      {
        SIREN: '789123456',
        SIRET: '78912345600001',
        nom: 'Medical Innovations',
        code_postal: '59000',
        code_NAF: '7211Z',
        chiffre_d_affaires: 2200000,
        EBIT: 480000,
        latitude: 50.6333,
        longitude: 3.0667,
        pdm: 0.12
      },
      {
        SIREN: '321654987',
        SIRET: '32165498700001',
        nom: 'Transport Express',
        code_postal: '13001',
        code_NAF: '4941A',
        chiffre_d_affaires: 1800000,
        EBIT: 320000,
        latitude: 43.2965,
        longitude: 5.3698,
        pdm: 0.10
      }
    ];
    
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
    
    for (const client of clients) {
      // Create 2 contacts per client
      contacts.push(
        {
          client: client._id,
          nom: 'Dupont',
          prenom: 'Jean',
          email: `jean.dupont@${client.nom.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          telephone: '06' + Math.floor(10000000 + Math.random() * 90000000),
          fonction: 'Directeur Commercial'
        },
        {
          client: client._id,
          nom: 'Martin',
          prenom: 'Sophie',
          email: `sophie.martin@${client.nom.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          telephone: '06' + Math.floor(10000000 + Math.random() * 90000000),
          fonction: 'Responsable Achats'
        }
      );
    }
    
    const createdContacts = await Contact.insertMany(contacts);
    console.log('Contacts seeded successfully');
    
    return createdContacts;
  } catch (error) {
    console.error('Error seeding contacts:', error);
    process.exit(1);
  }
};

const seedLeads = async (clients) => {
  try {
    const leads = [];
    const statuses = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
    const sources = ['website', 'referral', 'event', 'social', 'direct', 'other'];
    
    for (const client of clients) {
      // Create 1-3 leads per client
      const numLeads = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numLeads; i++) {
        leads.push({
          client: client._id,
          nom: `Projet ${['Expansion', 'Rénovation', 'Automatisation', 'Digitalisation', 'Innovation'][Math.floor(Math.random() * 5)]}`,
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
    const types = ['call', 'email', 'meeting', 'demo', 'presentation', 'other'];
    const descriptions = [
      'Premier contact pour présentation des services',
      'Suivi suite à la proposition commerciale',
      'Démonstration de la solution',
      'Point d\'avancement sur le projet',
      'Négociation des conditions financières'
    ];
    
    for (const lead of leads) {
      // Create 1-5 interactions per lead
      const numInteractions = Math.floor(Math.random() * 5) + 1;
      
      for (let i = 0; i < numInteractions; i++) {
        // Get contacts from the same client as the lead
        const leadContacts = contacts.filter(
          contact => contact.client.toString() === lead.client.toString()
        );
        
        // Select random contacts for this interaction (1 or 2)
        const numContactsToInclude = Math.min(Math.floor(Math.random() * 2) + 1, leadContacts.length);
        const selectedContacts = [];
        
        for (let j = 0; j < numContactsToInclude; j++) {
          const contactIndex = Math.floor(Math.random() * leadContacts.length);
          selectedContacts.push(leadContacts[contactIndex]._id);
          // Remove the contact to avoid duplicates
          leadContacts.splice(contactIndex, 1);
          if (leadContacts.length === 0) break;
        }
        
        interactions.push({
          lead: lead._id,
          date_interaction: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
          type_interaction: types[Math.floor(Math.random() * types.length)],
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          contacts: selectedContacts
        });
      }
    }
    
    const createdInteractions = await Interaction.insertMany(interactions);
    console.log('Interactions seeded successfully');
    
    return createdInteractions;
  } catch (error) {
    console.error('Error seeding interactions:', error);
    process.exit(1);
  }
};

const seedTasks = async (interactions) => {
  try {
    const tasks = [];
    const statuses = ['pending', 'in progress', 'completed', 'cancelled'];
    const titles = [
      'Envoyer proposition commerciale',
      'Préparer démonstration',
      'Relancer par téléphone',
      'Organiser réunion',
      'Envoyer documentation technique'
    ];
    const descriptions = [
      'Préparer et envoyer une proposition détaillée',
      'Configurer l\'environnement de démonstration',
      'Appeler le client pour suivre l\'avancement',
      'Planifier une réunion avec les parties prenantes',
      'Compiler et envoyer la documentation technique'
    ];
    const assignedTo = ['Jean Dupont', 'Sophie Martin', 'Pierre Leroy', 'Marie Lambert'];
    
    for (const interaction of interactions) {
      // 50% chance to create a task from an interaction
      if (Math.random() > 0.5) {
        tasks.push({
          interaction: interaction._id,
          titre: titles[Math.floor(Math.random() * titles.length)],
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          statut: statuses[Math.floor(Math.random() * statuses.length)],
          due_date: new Date(Date.now() + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000),
          assigned_to: assignedTo[Math.floor(Math.random() * assignedTo.length)]
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
      'Client potentiellement intéressé par notre nouvelle offre de services',
      'Attention particulière à accorder au délai de paiement',
      'Prévoir une présentation de la nouvelle version du produit',
      'Client stratégique pour notre expansion régionale',
      'Historique de collaboration complexe, nécessite un suivi attentif'
    ];
    
    for (const client of clients) {
      // 70% chance to create a note for a client
      if (Math.random() < 0.7) {
        notes.push({
          client: client._id,
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
    const clients = await seedClients();
    const contacts = await seedContacts(clients);
    const leads = await seedLeads(clients);
    const interactions = await seedInteractions(leads, contacts);
    const tasks = await seedTasks(interactions);
    const notes = await seedNotes(clients);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed(); 