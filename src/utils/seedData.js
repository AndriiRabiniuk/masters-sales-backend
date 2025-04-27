const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { 
  // CRM models
  User, 
  Company, 
  Client, 
  Lead, 
  Contact, 
  Note, 
  Interaction, 
  InteractionContact, 
  Task,
  // CMS models 
  Content,
  Category,
  Media,
  Tag,
  ContentTag,
  Template
} = require('../models');
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

// Seed Media
const seedMedia = async (companies, users) => {
  try {
    const media = [];
    
    // Group users by company
    const usersByCompany = {};
    for (const company of companies) {
      const companyId = company._id.toString();
      usersByCompany[companyId] = users.filter(user => 
        user.company_id && user.company_id.toString() === companyId
      );
    }
    
    const mediaTypes = ['image', 'document', 'video', 'audio'];
    const imageDimensions = [
      { width: 800, height: 600 },
      { width: 1200, height: 800 },
      { width: 1920, height: 1080 },
      { width: 400, height: 400 },
      { width: 300, height: 200 }
    ];
    
    for (const company of companies) {
      const companyUsers = usersByCompany[company._id.toString()] || [];
      if (companyUsers.length === 0) continue;
      
      // Create 5-10 media items per company
      const numMedia = Math.floor(Math.random() * 6) + 5;
      
      for (let i = 1; i <= numMedia; i++) {
        const mediaType = mediaTypes[Math.floor(Math.random() * mediaTypes.length)];
        const randomUser = companyUsers[Math.floor(Math.random() * companyUsers.length)];
        
        let fileUrl, mimeType, dimensions;
        
        switch (mediaType) {
          case 'image':
            fileUrl = `https://placekitten.com/${200 + i * 10}/${200 + i * 5}`;
            mimeType = ['image/jpeg', 'image/png', 'image/gif'][Math.floor(Math.random() * 3)];
            dimensions = imageDimensions[Math.floor(Math.random() * imageDimensions.length)];
            break;
          case 'document':
            fileUrl = `https://example.com/documents/doc${i}.pdf`;
            mimeType = ['application/pdf', 'application/msword', 'text/plain'][Math.floor(Math.random() * 3)];
            dimensions = null;
            break;
          case 'video':
            fileUrl = `https://example.com/videos/video${i}.mp4`;
            mimeType = ['video/mp4', 'video/webm'][Math.floor(Math.random() * 2)];
            dimensions = { width: 1280, height: 720 };
            break;
          case 'audio':
            fileUrl = `https://example.com/audio/audio${i}.mp3`;
            mimeType = ['audio/mpeg', 'audio/wav'][Math.floor(Math.random() * 2)];
            dimensions = null;
            break;
        }
        
        media.push({
          company_id: company._id,
          title: `${company.name} Media ${i}`,
          file_url: fileUrl,
          mime_type: mimeType,
          file_size: Math.floor(Math.random() * 10000000) + 1000, // 1KB to 10MB
          alt_text: `${company.name} media item ${i}`,
          caption: `Caption for ${company.name} media ${i}`,
          description: `Description for ${company.name} media item ${i}`,
          upload_by: randomUser._id,
          dimensions: dimensions,
          media_type: mediaType,
          tags: ['sample', `company-${company.name.toLowerCase().replace(/\s+/g, '-')}`, mediaType]
        });
      }
    }
    
    const createdMedia = await Media.insertMany(media);
    console.log('Media seeded successfully');
    
    return createdMedia;
  } catch (error) {
    console.error('Error seeding media:', error);
    process.exit(1);
  }
};

// Seed Categories
const seedCategories = async (companies, media) => {
  try {
    const categories = [];
    const rootCategoryNames = [
      'News', 'Blog', 'Products', 'Services', 'Resources', 
      'Case Studies', 'Testimonials', 'About', 'FAQ'
    ];
    
    // Create media lookup by company
    const mediaByCompany = {};
    for (const mediaItem of media) {
      const companyId = mediaItem.company_id.toString();
      if (!mediaByCompany[companyId]) {
        mediaByCompany[companyId] = [];
      }
      mediaByCompany[companyId].push(mediaItem);
    }
    
    // Process one company at a time to avoid duplicate slug issues
    for (const company of companies) {
      const companyId = company._id.toString();
      const companyMedia = mediaByCompany[companyId] || [];
      const companyShortId = company._id.toString().substring(0, 6);
      
      // Create 3-5 root categories per company
      const numRootCategories = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < numRootCategories; i++) {
        const categoryName = rootCategoryNames[i % rootCategoryNames.length];
        const featuredImage = companyMedia.length > 0 
          ? companyMedia[Math.floor(Math.random() * companyMedia.length)]._id 
          : null;
        
        // Create unique slug with company prefix
        const slug = `${companyShortId}-${categoryName.toLowerCase().replace(/\s+/g, '-')}`;
        
        // Create and save one root category
        const rootCategory = await Category.create({
          company_id: company._id,
          name: categoryName,
          slug: slug,
          description: `${categoryName} for ${company.name}`,
          parent_id: null,
          featured_image: featuredImage,
          order: i,
          meta_title: `${categoryName} | ${company.name}`,
          meta_description: `Browse ${company.name}'s ${categoryName.toLowerCase()}`
        });
        
        categories.push(rootCategory);
        
        // Create 1-3 subcategories for this root category
        const numSubCategories = Math.floor(Math.random() * 3) + 1;
        
        for (let j = 0; j < numSubCategories; j++) {
          const subCategoryName = `${categoryName} Subcategory ${j + 1}`;
          const featuredImage = companyMedia.length > 0 
            ? companyMedia[Math.floor(Math.random() * companyMedia.length)]._id 
            : null;
          
          // Create unique slug for subcategory
          const subSlug = `${companyShortId}-${categoryName.toLowerCase().replace(/\s+/g, '-')}-sub-${j + 1}`;
          
          const subCategory = await Category.create({
            company_id: company._id,
            name: subCategoryName,
            slug: subSlug,
            description: `Subcategory of ${categoryName} for ${company.name}`,
            parent_id: rootCategory._id,
            featured_image: featuredImage,
            order: j,
            meta_title: `${subCategoryName} | ${company.name}`,
            meta_description: `Browse ${company.name}'s ${subCategoryName.toLowerCase()}`
          });
          
          categories.push(subCategory);
        }
      }
    }
    
    console.log('Categories seeded successfully');
    return categories;
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

// Seed Templates
const seedTemplates = async (companies, users, media) => {
  try {
    const templates = [];
    
    // Group users and media by company
    const usersByCompany = {};
    const mediaByCompany = {};
    
    for (const company of companies) {
      const companyId = company._id.toString();
      usersByCompany[companyId] = users.filter(user => 
        user.company_id && user.company_id.toString() === companyId
      );
      mediaByCompany[companyId] = media.filter(m => 
        m.company_id && m.company_id.toString() === companyId
      );
    }
    
    const templateTypes = ['page', 'post', 'product', 'landing_page', 'custom'];
    
    // Blog post template HTML
    const blogPostHTML = `
      <article class="blog-post">
        <header>
          <h1>{{title}}</h1>
          <div class="meta">
            <span class="date">{{publish_date}}</span>
            <span class="author">By {{author}}</span>
          </div>
          <img src="{{featured_image}}" alt="{{title}}" class="featured-image">
        </header>
        <div class="content">
          {{content}}
        </div>
        <footer>
          <div class="tags">{{tags}}</div>
          <div class="share">{{share_buttons}}</div>
        </footer>
      </article>
    `;
    
    // Blog post template CSS
    const blogPostCSS = `
      article.blog-post {
        max-width: 800px;
        margin: 0 auto;
        font-family: 'Georgia', serif;
        line-height: 1.6;
      }
      
      article.blog-post h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
      }
      
      .meta {
        color: #666;
        margin-bottom: 1.5rem;
        font-size: 0.9rem;
      }
      
      .featured-image {
        width: 100%;
        height: auto;
        margin-bottom: 2rem;
      }
      
      .content {
        font-size: 1.1rem;
      }
      
      footer {
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid #eee;
      }
    `;
    
    // Simple JS for blog post
    const blogPostJS = `
      document.addEventListener('DOMContentLoaded', function() {
        console.log('Blog post template loaded');
        
        // Format dates
        const dates = document.querySelectorAll('.date');
        dates.forEach(date => {
          const d = new Date(date.textContent);
          date.textContent = d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        });
      });
    `;
    
    // Page template HTML
    const pageHTML = `
      <div class="page">
        <header class="page-header">
          <h1>{{title}}</h1>
        </header>
        <div class="page-content">
          {{content}}
        </div>
      </div>
    `;
    
    // Page template CSS
    const pageCSS = `
      .page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        font-family: 'Arial', sans-serif;
      }
      
      .page-header {
        margin-bottom: 2rem;
        border-bottom: 1px solid #eee;
        padding-bottom: 1rem;
      }
      
      .page-header h1 {
        font-size: 2.8rem;
        color: #333;
      }
      
      .page-content {
        line-height: 1.6;
        font-size: 1.1rem;
      }
    `;
    
    // Landing page template HTML
    const landingPageHTML = `
      <div class="landing-page">
        <section class="hero">
          <div class="container">
            <h1>{{headline}}</h1>
            <p class="subheading">{{subheadline}}</p>
            <div class="cta-button">{{cta_button}}</div>
          </div>
        </section>
        
        <section class="features">
          <div class="container">
            <h2>Features</h2>
            <div class="feature-grid">
              {{features}}
            </div>
          </div>
        </section>
        
        <section class="testimonials">
          <div class="container">
            <h2>What People Say</h2>
            <div class="testimonial-slider">
              {{testimonials}}
            </div>
          </div>
        </section>
        
        <section class="contact">
          <div class="container">
            <h2>Get In Touch</h2>
            <div class="contact-form">
              {{contact_form}}
            </div>
          </div>
        </section>
      </div>
    `;
    
    // Landing page CSS
    const landingPageCSS = `
      .landing-page {
        font-family: 'Arial', sans-serif;
        color: #333;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }
      
      .hero {
        background-color: #f5f5f5;
        padding: 4rem 0;
        text-align: center;
      }
      
      .hero h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
      }
      
      .subheading {
        font-size: 1.5rem;
        margin-bottom: 2rem;
        color: #666;
      }
      
      .cta-button {
        display: inline-block;
        background-color: #0066cc;
        color: white;
        padding: 0.8rem 2rem;
        border-radius: 4px;
        font-weight: bold;
        text-decoration: none;
      }
      
      section {
        padding: 4rem 0;
      }
      
      h2 {
        text-align: center;
        margin-bottom: 2rem;
      }
      
      .feature-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }
      
      .testimonials {
        background-color: #f9f9f9;
      }
    `;
    
    for (const company of companies) {
      const companyId = company._id.toString();
      const companyUsers = usersByCompany[companyId] || [];
      const companyMedia = mediaByCompany[companyId] || [];
      
      if (companyUsers.length === 0) continue;
      
      // For each company, create templates for common page types
      for (const templateType of templateTypes) {
        const randomUser = companyUsers[Math.floor(Math.random() * companyUsers.length)];
        const featuredImage = companyMedia.length > 0 
          ? companyMedia[Math.floor(Math.random() * companyMedia.length)]._id 
          : null;
        
        let name, html, css, js, isDefault;
        
        switch (templateType) {
          case 'post':
            name = 'Blog Post Template';
            html = blogPostHTML;
            css = blogPostCSS;
            js = blogPostJS;
            isDefault = true;
            break;
          case 'page':
            name = 'Standard Page Template';
            html = pageHTML;
            css = pageCSS;
            js = '';
            isDefault = true;
            break;
          case 'landing_page':
            name = 'Marketing Landing Page';
            html = landingPageHTML;
            css = landingPageCSS;
            js = '';
            isDefault = true;
            break;
          case 'product':
            name = 'Product Display Template';
            html = `<div class="product"><h1>{{product_name}}</h1><div class="price">{{price}}</div><div class="description">{{description}}</div></div>`;
            css = `.product { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; max-width: 1200px; margin: 0 auto; }`;
            js = '';
            isDefault = false;
            break;
          default:
            name = 'Custom Template';
            html = `<div class="custom-content">{{content}}</div>`;
            css = `.custom-content { padding: 2rem; }`;
            js = '';
            isDefault = false;
            break;
        }
        
        templates.push({
          company_id: company._id,
          name: `${company.name} ${name}`,
          slug: `${company.name.toLowerCase().replace(/\s+/g, '-')}-${name.toLowerCase().replace(/\s+/g, '-')}`,
          description: `Default ${templateType} template for ${company.name}`,
          html_structure: html,
          css_styles: css,
          js_scripts: js,
          template_type: templateType,
          is_default: isDefault,
          preview_image: featuredImage,
          created_by: randomUser._id
        });
      }
    }
    
    const createdTemplates = await Template.insertMany(templates);
    console.log('Templates seeded successfully');
    
    return createdTemplates;
  } catch (error) {
    console.error('Error seeding templates:', error);
    process.exit(1);
  }
};

// Seed Tags
const seedTags = async (companies) => {
  try {
    const tags = [];
    
    const commonTags = [
      'Featured', 'Popular', 'Trending', 'New', 'Important', 'Must Read',
      'Technology', 'Business', 'Marketing', 'Finance', 'Sales', 'Development',
      'Tutorial', 'Guide', 'How-to', 'Tips', 'Best Practices', 'Case Study',
      'Industry News', 'Product Update', 'Resources', 'Events', 'Webinar'
    ];
    
    for (const company of companies) {
      // Create 10-15 tags for each company
      const numTags = Math.floor(Math.random() * 6) + 10;
      
      for (let i = 0; i < numTags; i++) {
        const tagName = i < commonTags.length ? commonTags[i] : `Tag ${i - commonTags.length + 1}`;
        const count = Math.floor(Math.random() * 15); // Random usage count between 0-15
        
        tags.push({
          company_id: company._id,
          name: tagName,
          slug: tagName.toLowerCase().replace(/\s+/g, '-'),
          description: `${tagName} related content for ${company.name}`,
          count: count
        });
      }
    }
    
    const createdTags = await Tag.insertMany(tags);
    console.log('Tags seeded successfully');
    
    return createdTags;
  } catch (error) {
    console.error('Error seeding tags:', error);
    process.exit(1);
  }
};

// Seed Content
const seedContent = async (companies, users, categories, templates, media) => {
  try {
    const content = [];
    
    // Group by company for easier access
    const usersByCompany = {};
    const categoriesByCompany = {};
    const templatesByCompany = {};
    const mediaByCompany = {};
    
    for (const company of companies) {
      const companyId = company._id.toString();
      
      usersByCompany[companyId] = users.filter(user => 
        user.company_id && user.company_id.toString() === companyId
      );
      
      categoriesByCompany[companyId] = categories.filter(category => 
        category.company_id && category.company_id.toString() === companyId
      );
      
      templatesByCompany[companyId] = templates.filter(template => 
        template.company_id && template.company_id.toString() === companyId
      );
      
      mediaByCompany[companyId] = media.filter(mediaItem => 
        mediaItem.company_id && mediaItem.company_id.toString() === companyId
      );
    }
    
    const statuses = ['draft', 'published', 'archived'];
    const visibilities = ['public', 'private', 'password_protected'];
    
    // Sample content for blog posts
    const blogTitles = [
      "10 Ways to Improve Your Business Strategy",
      "The Ultimate Guide to Digital Transformation",
      "How to Increase Sales in a Competitive Market",
      "Best Practices for Customer Retention",
      "The Future of Remote Work",
      "Understanding AI in Modern Business",
      "Marketing Strategies That Actually Work",
      "Improving Team Productivity",
      "Financial Planning for Business Growth",
      "How to Build a Strong Company Culture"
    ];
    
    const blogContents = [
      `<p>In today's competitive business landscape, having a solid strategy is crucial for success. This article explores 10 proven ways to improve your business strategy and stay ahead of the competition.</p>
       <h2>1. Define Clear Objectives</h2>
       <p>Start by setting clear, measurable goals that align with your company's mission and vision. Without clear objectives, your strategy will lack direction and purpose.</p>
       <h2>2. Understand Your Market</h2>
       <p>Conduct thorough market research to understand your target audience, competitors, and industry trends. This information will help you make informed strategic decisions.</p>`,
      
      `<p>Digital transformation is no longer optional for businesses that want to remain competitive. This comprehensive guide will help you navigate the complex process of digital transformation.</p>
       <h2>The Importance of Digital Transformation</h2>
       <p>Digital transformation involves integrating digital technology into all areas of your business, fundamentally changing how you operate and deliver value to customers.</p>
       <h2>Key Components of Digital Transformation</h2>
       <p>A successful digital transformation strategy includes technology infrastructure, data analytics, customer experience, and organizational culture.</p>`
    ];
    
    // Sample content for pages
    const pageTitles = [
      "About Us",
      "Our Services",
      "Contact Information",
      "Company History",
      "Our Team",
      "Careers"
    ];
    
    const pageContents = [
      `<h2>Our Story</h2>
       <p>Founded in 2010, our company has grown from a small startup to a leading industry player. We're passionate about delivering exceptional solutions that help our clients succeed.</p>
       <h2>Our Mission</h2>
       <p>Our mission is to provide innovative solutions that empower businesses to achieve their full potential. We believe in building long-term relationships with our clients based on trust, integrity, and results.</p>`,
      
      `<h2>What We Offer</h2>
       <p>Our comprehensive range of services is designed to meet the diverse needs of modern businesses. From strategic consulting to implementation support, we provide end-to-end solutions.</p>
       <h2>Our Approach</h2>
       <p>We follow a collaborative approach, working closely with our clients to understand their unique challenges and develop tailored solutions that deliver tangible results.</p>`
    ];
    
    for (const company of companies) {
      const companyId = company._id.toString();
      const companyUsers = usersByCompany[companyId] || [];
      const companyCategories = categoriesByCompany[companyId] || [];
      const companyTemplates = templatesByCompany[companyId] || [];
      const companyMedia = mediaByCompany[companyId] || [];
      
      if (companyUsers.length === 0 || companyCategories.length === 0 || companyTemplates.length === 0) {
        continue;
      }
      
      // Find templates by type
      const postTemplate = companyTemplates.find(t => t.template_type === 'post');
      const pageTemplate = companyTemplates.find(t => t.template_type === 'page');
      
      // Create blog posts
      for (let i = 0; i < blogTitles.length; i++) {
        if (!postTemplate) continue;
        
        const randomUser = companyUsers[Math.floor(Math.random() * companyUsers.length)];
        const blogCategory = companyCategories.find(c => c.name === 'Blog') || companyCategories[0];
        const featuredImage = companyMedia.length > 0 
          ? companyMedia[Math.floor(Math.random() * companyMedia.length)]._id 
          : null;
        
        const title = `${blogTitles[i]} - ${company.name}`;
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const visibility = visibilities[Math.floor(Math.random() * visibilities.length)];
        const publishDate = status === 'published' 
          ? new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) 
          : null;
        
        content.push({
          company_id: company._id,
          title: title,
          slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
          content: blogContents[i % blogContents.length],
          excerpt: blogContents[i % blogContents.length].substring(0, 150) + '...',
          author_id: randomUser._id,
          category_id: blogCategory._id,
          template_id: postTemplate._id,
          featured_image: featuredImage,
          status: status,
          visibility: visibility,
          password: visibility === 'password_protected' ? 'password123' : null,
          publish_date: publishDate,
          meta_title: title,
          meta_description: `${title} - Read our latest insights on ${blogTitles[i].toLowerCase()}`
        });
      }
      
      // Create pages
      for (let i = 0; i < pageTitles.length; i++) {
        if (!pageTemplate) continue;
        
        const randomUser = companyUsers[Math.floor(Math.random() * companyUsers.length)];
        const pageCategory = companyCategories.find(c => c.name !== 'Blog') || companyCategories[0];
        const featuredImage = companyMedia.length > 0 
          ? companyMedia[Math.floor(Math.random() * companyMedia.length)]._id 
          : null;
        
        const title = `${pageTitles[i]} - ${company.name}`;
        
        content.push({
          company_id: company._id,
          title: title,
          slug: pageTitles[i].toLowerCase().replace(/\s+/g, '-'),
          content: pageContents[i % pageContents.length],
          excerpt: '',
          author_id: randomUser._id,
          category_id: pageCategory._id,
          template_id: pageTemplate._id,
          featured_image: featuredImage,
          status: 'published', // Most pages are published
          visibility: 'public', // Most pages are public
          password: null,
          publish_date: new Date(),
          meta_title: title,
          meta_description: `${title} - Learn more about ${company.name}`
        });
      }
    }
    
    const createdContent = await Content.insertMany(content);
    console.log('Content seeded successfully');
    
    return createdContent;
  } catch (error) {
    console.error('Error seeding content:', error);
    process.exit(1);
  }
};

// Seed ContentTags (associations between Content and Tags)
const seedContentTags = async (content, tags) => {
  try {
    const contentTags = [];
    
    // Group tags by company
    const tagsByCompany = {};
    for (const tag of tags) {
      const companyId = tag.company_id.toString();
      if (!tagsByCompany[companyId]) {
        tagsByCompany[companyId] = [];
      }
      tagsByCompany[companyId].push(tag);
    }
    
    for (const contentItem of content) {
      const companyId = contentItem.company_id.toString();
      const companyTags = tagsByCompany[companyId] || [];
      
      if (companyTags.length === 0) continue;
      
      // Assign 2-5 random tags to each content item
      const numTags = Math.floor(Math.random() * 4) + 2;
      const shuffledTags = [...companyTags].sort(() => 0.5 - Math.random());
      const selectedTags = shuffledTags.slice(0, numTags);
      
      for (const tag of selectedTags) {
        contentTags.push({
          content_id: contentItem._id,
          tag_id: tag._id
        });
        
        // Update tag count (this will be done for real in the ContentTag model's post-save hook)
        await Tag.findByIdAndUpdate(tag._id, { $inc: { count: 1 } });
      }
    }
    
    const createdContentTags = await ContentTag.insertMany(contentTags);
    console.log('ContentTags seeded successfully');
    
    return createdContentTags;
  } catch (error) {
    console.error('Error seeding content tags:', error);
    process.exit(1);
  }
};

const seed = async () => {
  try {
    await connectDB();
    await clearDatabase();
    
    // Seed CRM data
    const users = await seedUsers();
    const companies = await seedCompanies();
    await assignUsersToCompanies(users, companies);
    const clients = await seedClients(companies);
    const contacts = await seedContacts(clients);
    const leads = await seedLeads(clients, users);
    const interactions = await seedInteractions(leads, contacts);
    await seedTasks(interactions, users);
    await seedNotes(clients);
    
    // Combine all users for ease of reference in CMS seeding
    const allUsers = [
      ...users.companyAdmins, 
      ...users.regularUsers
    ];
    
    // Seed CMS data
    const media = await seedMedia(companies, allUsers);
    const categories = await seedCategories(companies, media);
    const templates = await seedTemplates(companies, allUsers, media);
    const tags = await seedTags(companies);
    const content = await seedContent(companies, allUsers, categories, templates, media);
    await seedContentTags(content, tags);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed(); 