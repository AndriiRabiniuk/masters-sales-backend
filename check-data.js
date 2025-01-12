const mongoose = require('mongoose');
const { Lead, Contact, Note } = require('./src/models');
require('dotenv').config();

const checkData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');

    // Check leads
    const leads = await Lead.find().limit(2);
    console.log('\n--- LEADS SAMPLE ---');
    console.log(JSON.stringify(leads, null, 2));
    
    // Verify if company_id exists in Lead schema
    const leadSchemaKeys = Object.keys(Lead.schema.paths);
    console.log('\nLead schema fields:', leadSchemaKeys);
    console.log('Lead has company_id field:', leadSchemaKeys.includes('company_id'));

    // Check contacts
    const contacts = await Contact.find().limit(2);
    console.log('\n--- CONTACTS SAMPLE ---');
    console.log(JSON.stringify(contacts, null, 2));
    
    // Verify if company_id exists in Contact schema
    const contactSchemaKeys = Object.keys(Contact.schema.paths);
    console.log('\nContact schema fields:', contactSchemaKeys);
    console.log('Contact has company_id field:', contactSchemaKeys.includes('company_id'));

    // Check notes
    const notes = await Note.find().limit(2);
    console.log('\n--- NOTES SAMPLE ---');
    console.log(JSON.stringify(notes, null, 2));
    
    // Verify if company_id exists in Note schema
    const noteSchemaKeys = Object.keys(Note.schema.paths);
    console.log('\nNote schema fields:', noteSchemaKeys);
    console.log('Note has company_id field:', noteSchemaKeys.includes('company_id'));

    process.exit(0);
  } catch (error) {
    console.error('Error checking data:', error);
    process.exit(1);
  }
};

checkData(); 