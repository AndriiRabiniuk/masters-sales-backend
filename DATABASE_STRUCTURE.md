# Masters Sales Backend - Database Structure

## Overview

The Masters Sales Backend uses MongoDB with Mongoose as the ODM (Object Document Mapper). The database follows a hierarchical structure where companies are at the top level, with clients belonging to companies, and various entities (leads, contacts, notes, interactions) associated with clients.

## Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│    User     │     │   Company   │     │   Client    │     │    Lead     │
│             │     │             │     │             │     │             │
└─────┬───────┘     └─────┬───────┘     └──────┬──────┘     └──────┬──────┘
      │                   │                    │                   │
      │ belongs_to        │ has_many           │ has_many          │ belongs_to
      └───────────────────┘                    │                   │
                                               │                   │
                                               └───────────────────┘
                                                                   │
          ┌─────────────┐     ┌─────────────┐     ┌───────────────┐
          │             │     │             │     │               │
          │   Contact   │     │    Note     │     │  Interaction  │
          │             │     │             │     │               │
          └──────┬──────┘     └──────┬──────┘     └───────┬───────┘
                 │                   │                    │
                 │ belongs_to        │ belongs_to         │ belongs_to
                 └───────────────────┴────────────────────┘
                                     │
                                     │
                           ┌─────────┴───────┐
                           │                 │
                           │      Task       │
                           │                 │
                           └─────────────────┘
```

## Data Model

### User

Users represent the system operators with different permission levels.

```javascript
{
  name: String,
  email: String,
  password: String,
  role: String, // "super_admin", "admin", "manager", "sales"
  company_id: ObjectId, // Reference to Company (except for super_admin)
  created_at: Date
}
```

### Company

Companies are the top-level organization units.

```javascript
{
  name: String,
  SIREN: String,
  SIRET: String,
  code_postal: String,
  code_NAF: String,
  chiffre_d_affaires: Number,
  EBIT: Number,
  latitude: Number,
  longitude: Number,
  pdm: Number,
  created_at: Date
}
```

### Client

Clients are businesses associated with a company.

```javascript
{
  company_id: ObjectId, // Reference to Company
  name: String,
  SIREN: String,
  SIRET: String,
  code_postal: String,
  code_NAF: String,
  chiffre_d_affaires: Number,
  EBIT: Number,
  latitude: Number,
  longitude: Number,
  pdm: Number,
  created_at: Date
}
```

### Lead

Leads are potential sales opportunities associated with clients.

```javascript
{
  client_id: ObjectId, // Reference to Client
  user_id: ObjectId, // Reference to User (the salesperson)
  name: String,
  source: String, // "website", "referral", "event", etc.
  statut: String, // "new", "contacted", "won", "lost", etc.
  valeur_estimee: Number,
  created_at: Date
}
```

### Contact

Contacts are individual people associated with clients.

```javascript
{
  client_id: ObjectId, // Reference to Client
  name: String,
  prenom: String,
  email: String,
  telephone: String,
  fonction: String,
  created_at: Date
}
```

### Note

Notes contain important information related to clients.

```javascript
{
  client_id: ObjectId, // Reference to Client
  contenu: String,
  created_at: Date
}
```

### Interaction

Interactions record communication events with leads.

```javascript
{
  lead_id: ObjectId, // Reference to Lead
  date_interaction: Date,
  type_interaction: String, // "call", "email", "meeting", etc.
  description: String,
  created_at: Date
}
```

### InteractionContact

A junction model to establish many-to-many relationships between interactions and contacts.

```javascript
{
  interaction_id: ObjectId, // Reference to Interaction
  contact_id: ObjectId, // Reference to Contact
  created_at: Date
}
```

### Task

Tasks represent follow-up actions related to interactions.

```javascript
{
  interaction_id: ObjectId, // Reference to Interaction
  titre: String,
  description: String,
  statut: String, // "pending", "in progress", "completed", etc.
  due_date: Date,
  assigned_to: ObjectId, // Reference to User
  created_at: Date
}
```

## Key Relationships

### Company-centric Data Model

The system follows a company-centric data model, where:

1. **Companies** are the top-level entities.
2. Users (except super_admin) belong to a company.
3. Clients belong to a company.
4. All other entities link to clients, which provides an indirect relationship to companies.

### Important Relationship Chains

#### User Authorization Chain

- **User → Company → Client → [Lead/Contact/Note]**
  - Users can only access data from their own company
  - System checks company_id on the user, then finds clients of that company, then accesses child entities

#### Lead Management Chain

- **Lead → Client → Company**
  - Leads are associated with clients
  - The company relationship is derived from the client
  - This avoids redundant company_id fields

#### Interaction and Task Chain

- **Task → Interaction → Lead → Client → Company**
  - Tasks are linked to interactions
  - Interactions are linked to leads
  - Leads are linked to clients
  - Clients are linked to companies

## Authorization Logic

The system implements a hierarchical authorization model:

1. **Super Admin**: Can access and manage all data across all companies
2. **Admin**: Can access and manage data within their own company
3. **Manager**: Can access and manage specific data within their company
4. **Sales**: Limited access to data related to their assigned leads within their company

### Permission Checks

When accessing data, the system performs these checks:

1. For lead/contact/note access: Verify that the entity's client belongs to the user's company
2. For interaction access: Verify that the interaction's lead belongs to a client in the user's company
3. For task access: Verify that the task's interaction is related to a lead in the user's company

## Data Flow Examples

### Creating a Lead

1. User submits lead information with client_id
2. System verifies user has permission to create leads for this client
   - Checks if client belongs to user's company
3. Lead is created with client_id and user_id
4. The lead is now indirectly associated with the company through the client

### Viewing Interactions

1. User requests to view interactions
2. For non-super_admin users:
   - System finds all clients in user's company
   - Then finds all leads associated with these clients
   - Then finds all interactions associated with these leads
3. For super_admin:
   - Returns all interactions

## Design Decisions

### Removal of Redundant Company ID Fields

The original design included company_id fields in Lead, Contact, and Note models. These were removed because:

1. **Reduced Data Redundancy**: Eliminated duplicate company references
2. **Single Source of Truth**: The company relationship is now only established through the client
3. **Simplified Data Model**: Removed unnecessary fields while preserving functionality
4. **Reduced Error Potential**: Prevents potential data inconsistencies where company_id might not match client's company

### Many-to-Many Relationship Handling

The InteractionContact model demonstrates a junction table approach to handling many-to-many relationships in MongoDB, allowing:

1. Multiple contacts to be associated with an interaction
2. Contacts to participate in multiple interactions
3. Future metadata addition to the relationship if needed 