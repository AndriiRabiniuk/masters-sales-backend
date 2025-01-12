const mongoose = require('mongoose');
const { Task, Interaction, Lead } = require('./src/models');
require('dotenv').config();

const checkTaskData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');

    // Check tasks
    const tasks = await Task.find().limit(1);
    console.log('\n--- TASK SAMPLE ---');
    console.log(JSON.stringify(tasks, null, 2));
    
    if (tasks.length > 0) {
      // Get the interaction for a task
      const interaction = await Interaction.findById(tasks[0].interaction_id);
      console.log('\n--- RELATED INTERACTION ---');
      console.log(JSON.stringify(interaction, null, 2));
      
      if (interaction) {
        // Get the lead for the interaction
        const lead = await Lead.findById(interaction.lead_id).populate('client_id');
        console.log('\n--- RELATED LEAD ---');
        console.log(JSON.stringify(lead, null, 2));
        
        // Verify the task-interaction-lead-client chain is intact
        console.log('\nTask-Interaction-Lead chain intact:', !!lead);
        console.log('Lead has client relationship:', !!lead?.client_id);
        console.log('Client has company relationship:', !!lead?.client_id?.company_id);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error checking task data:', error);
    process.exit(1);
  }
};

checkTaskData(); 