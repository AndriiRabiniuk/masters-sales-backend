const User = require('./User');
const Company = require('./Company');
const Client = require('./Client');
const Lead = require('./Lead');
const Contact = require('./Contact');
const Note = require('./Note');
const Interaction = require('./Interaction');
const InteractionContact = require('./InteractionContact');
const Task = require('./Task');
const LeadStatusLog = require('./LeadStatusLog');

// CMS Models
const Content = require('./Content');
const Category = require('./Category');
const Media = require('./Media');
const Tag = require('./Tag');
const ContentTag = require('./ContentTag');
const Template = require('./Template');

module.exports = {
  // CRM Models
  User,
  Company,
  Client,
  Lead,
  Contact,
  Note,
  Interaction,
  InteractionContact,
  Task,
  LeadStatusLog,
  
  // CMS Models
  Content,
  Category,
  Media,
  Tag,
  ContentTag,
  Template
}; 