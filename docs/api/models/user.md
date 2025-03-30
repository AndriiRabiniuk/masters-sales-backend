# User Model

The User model represents users in the CMS system who can create and manage content.

## Schema

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `_id` | String | Unique identifier for the user | Generated automatically |
| `name` | String | Full name of the user | Yes |
| `email` | String | Email address (used for login) | Yes |
| `password` | String | Hashed password | Yes (for creation, not included in responses) |
| `role` | String | User role: `admin`, `editor`, `author`, `viewer` | Default: `author` |
| `avatar` | String | URL to user avatar image | No |
| `bio` | String | Short biography or description | No |
| `created_at` | Date | Date when user was created | Generated automatically |
| `updated_at` | Date | Date when user was last updated | Generated automatically |
| `last_login` | Date | Date of last login | Updated on login |
| `active` | Boolean | Whether the user account is active | Default: true |

## Role Permissions

| Role | Permissions |
|------|-------------|
| `admin` | Full access to all functionality, can manage users and settings |
| `editor` | Can create, edit, publish, and delete all content, categories, tags, and templates |
| `author` | Can create content and edit their own content, cannot publish without approval |
| `viewer` | Read-only access to published content |

## Relationships

| Relationship | Target Model | Description |
|--------------|--------------|-------------|
| `content` | [Content](content.md)[] | Content items created by this user |

## Example JSON

### User Response (Public View)

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "editor",
  "avatar": "https://example.com/avatars/johndoe.jpg",
  "bio": "Content editor specializing in technical writing and documentation.",
  "created_at": "2022-12-01T09:30:00.000Z",
  "updated_at": "2023-01-15T11:45:00.000Z",
  "last_login": "2023-03-20T14:25:12.000Z",
  "active": true
}
```

### User with Content Count

When retrieving a user with the `include_content_count=true` parameter, the response includes a count of content items created by the user:

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "editor",
  "avatar": "https://example.com/avatars/johndoe.jpg",
  "bio": "Content editor specializing in technical writing and documentation.",
  "created_at": "2022-12-01T09:30:00.000Z",
  "updated_at": "2023-01-15T11:45:00.000Z",
  "last_login": "2023-03-20T14:25:12.000Z",
  "active": true,
  "content_count": 27
}
```

### Current User Response (Self View)

When a user requests their own profile, additional fields are included:

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "editor",
  "avatar": "https://example.com/avatars/johndoe.jpg",
  "bio": "Content editor specializing in technical writing and documentation.",
  "created_at": "2022-12-01T09:30:00.000Z",
  "updated_at": "2023-01-15T11:45:00.000Z",
  "last_login": "2023-03-20T14:25:12.000Z",
  "active": true,
  "preferences": {
    "theme": "light",
    "language": "en",
    "email_notifications": true
  }
}
```

## Notes

- User passwords are hashed and never returned in API responses.
- The `email` field must be unique in the system.
- User permissions are determined by the `role` field.
- User accounts can be deactivated by setting `active` to `false`, which prevents login but does not delete the account.
- When creating content, the current user's `_id` is automatically assigned as the `author_id`.
- Users can only edit their own content unless they have the `editor` or `admin` role.
- Only `admin` users can create, edit, or delete other users.
- The `avatar` field typically contains a URL to an uploaded image or a Gravatar URL based on the email.
- User preferences are stored in a separate object and are only included in responses when a user requests their own profile.
- The API provides endpoints for user authentication, profile management, and password reset.
- Some API endpoints may include a simplified user object with only `_id` and `name` fields when returning related data. 