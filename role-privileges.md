# User Role Privileges and Functionality

## Role Hierarchy (from highest to lowest privileges)

### 1. Platform Admin (`platform_admin`)
**Highest level of access - Full system control**

**Privileges:**
- **User Management:**
  - View all users in the system
  - Create, edit, and delete any user account
  - Assign/change roles for any user
  - Manage user permissions
  - View user activity and login history

- **Content Management:**
  - View, edit, and delete any profile (published, draft, or archived)
  - Approve/reject any profile for publication
  - Edit any timeline events or stories
  - Manage all media uploads
  - Delete any content

- **System Administration:**
  - Access to all dashboard sections
  - Manage universities (add, edit, delete)
  - View system analytics and metrics
  - Manage system settings
  - Access to debug/admin tools
  - View all notifications
  - Manage RLS policies and database settings

- **University Management:**
  - Assign university admins
  - Manage university-specific settings
  - Override university-level permissions

### 2. University Admin (`university_admin`)
**University-specific administrative access**

**Privileges:**
- **User Management (University Scope):**
  - View users associated with their university
  - Assign roles to users within their university
  - Manage university-specific user permissions
  - Cannot manage platform-level users

- **Content Management (University Scope):**
  - View, edit, and approve profiles from their university
  - Manage timeline events and stories for their university's profiles
  - Approve/reject profiles for publication within their university
  - Cannot edit profiles from other universities

- **University Administration:**
  - Access to university dashboard
  - Manage university information and settings
  - View university-specific analytics
  - Manage university-specific notifications
  - Cannot access platform-wide settings

- **Profile Management:**
  - Create and edit profiles for their university
  - Archive profiles from their university
  - Cannot manage profiles from other universities

### 3. Alumni (`alumni`)
**Alumni users with profile creation privileges**

**Privileges:**
- **Profile Management:**
  - Create their own alumni profile
  - Edit their own profile (basic info, timeline, stories)
  - Upload profile and cover photos
  - Submit profile for review/publication
  - Cannot edit other users' profiles

- **Content Creation:**
  - Add timeline events to their profile
  - Write and edit stories for their profile
  - Upload media to their profile
  - Cannot create content for other profiles

- **Viewing:**
  - View published profiles from any university
  - View their own profile (regardless of status)
  - Cannot view unpublished profiles from other users

- **Limited Access:**
  - Access to profile creation and editing tools
  - Cannot access admin dashboard
  - Cannot manage other users or content

### 4. Viewer (`viewer`)
**Basic user with read-only access**

**Privileges:**
- **Viewing Only:**
  - View published profiles from any university
  - Cannot view unpublished or draft profiles
  - Cannot view admin-only content

- **Limited Interaction:**
  - Cannot create or edit profiles
  - Cannot upload media
  - Cannot access profile creation tools
  - Cannot access admin dashboard

- **Basic Features:**
  - Search and browse published profiles
  - View timeline events and stories (published only)
  - Cannot interact with content creation

## Role Assignment Logic

### Default Roles:
- **New signups**: Default to `viewer` role
- **Alumni signups**: Can be manually upgraded to `alumni` role
- **University staff**: Manually assigned `university_admin` role
- **Platform administrators**: Manually assigned `platform_admin` role

### Role Promotion:
- **Viewer → Alumni**: Manual promotion by admin
- **Alumni → University Admin**: Manual promotion by platform admin
- **University Admin → Platform Admin**: Manual promotion by existing platform admin

## Access Control Implementation

### Dashboard Access:
- **Platform Admin**: Full dashboard access
- **University Admin**: University-specific dashboard
- **Alumni**: Profile creation/editing tools only
- **Viewer**: No dashboard access

### Profile Management:
- **Platform Admin**: All profiles
- **University Admin**: University-specific profiles
- **Alumni**: Own profile only
- **Viewer**: No profile management

### Content Moderation:
- **Platform Admin**: All content
- **University Admin**: University-specific content
- **Alumni**: Own content only
- **Viewer**: No moderation access

## Security Considerations

### Data Isolation:
- University admins can only access their university's data
- Alumni can only access their own profile data
- Platform admins have access to all data

### Audit Trail:
- All role changes should be logged
- All content modifications should be tracked
- User activity should be monitored for security

### Escalation Path:
- University admins can escalate issues to platform admins
- Alumni can request role upgrades through support
- Platform admins have final authority on all decisions 