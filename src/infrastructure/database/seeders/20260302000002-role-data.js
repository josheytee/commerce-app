'use strict';

// Roles data
const roles = [
  {
    id: 1,
    name: 'super_admin',
    description: 'Super Administrator with full system access',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: 'parish_admin',
    description: 'Parish Administrator - manages all parish activities',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    name: 'vendor_owner',
    description: 'Vendor Owner - manages their own vendor account',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 4,
    name: 'store_manager',
    description: 'Store Manager - manages store operations',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 5,
    name: 'cashier',
    description: 'Cashier - processes sales and payments',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 6,
    name: 'member',
    description: 'Church Member - basic church member access',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 7,
    name: 'first_timer',
    description: 'First Timer - guest access with limited permissions',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 8,
    name: 'content_manager',
    description: 'Content Manager - manages church content',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 9,
    name: 'finance_officer',
    description: 'Finance Officer - manages church finances',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 10,
    name: 'volunteer',
    description: 'Volunteer - assists with church activities',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 11,
    name: 'group_leader',
    description: 'Group Leader - leads small groups or departments',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 12,
    name: 'vendor_staff',
    description: 'Vendor Staff - assists with vendor operations',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 13,
    name: 'auditor',
    description: 'Auditor - reviews financial records',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 14,
    name: 'event_coordinator',
    description: 'Event Coordinator - manages church events',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 15,
    name: 'media_team',
    description: 'Media Team - manages church media and AV',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

// Permissions data
const permissions = [
  // Dashboard & Analytics
  {
    id: 1,
    name: 'view_dashboard',
    description: 'View dashboard',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: 'view_analytics',
    description: 'View analytics and reports',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // User Management
  {
    id: 10,
    name: 'manage_users',
    description: 'Create, edit, delete users',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 11,
    name: 'view_users',
    description: 'View user list',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 12,
    name: 'assign_roles',
    description: 'Assign roles to users',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 13,
    name: 'impersonate_user',
    description: 'Impersonate other users',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Member Management
  {
    id: 20,
    name: 'manage_members',
    description: 'Manage church members',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 21,
    name: 'view_members',
    description: 'View member list',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 22,
    name: 'add_member',
    description: 'Add new members',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 23,
    name: 'edit_member',
    description: 'Edit member details',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 24,
    name: 'delete_member',
    description: 'Delete members',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 25,
    name: 'export_members',
    description: 'Export member data',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 26,
    name: 'import_members',
    description: 'Import members',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // First Timer Management
  {
    id: 30,
    name: 'manage_first_timers',
    description: 'Manage first timers',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 31,
    name: 'view_first_timers',
    description: 'View first timer list',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 32,
    name: 'convert_to_member',
    description: 'Convert first timer to member',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Contribution Management
  {
    id: 40,
    name: 'manage_contributions',
    description: 'Manage contributions',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 41,
    name: 'view_contributions',
    description: 'View contribution list',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 42,
    name: 'add_contribution',
    description: 'Add new contribution',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 43,
    name: 'edit_contribution',
    description: 'Edit contribution',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 44,
    name: 'delete_contribution',
    description: 'Delete contribution',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 45,
    name: 'export_contributions',
    description: 'Export contributions',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 46,
    name: 'view_contribution_reports',
    description: 'View contribution reports',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Program Management
  {
    id: 50,
    name: 'manage_programs',
    description: 'Manage church programs',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 51,
    name: 'view_programs',
    description: 'View programs',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 52,
    name: 'add_program',
    description: 'Add new program',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 53,
    name: 'edit_program',
    description: 'Edit program',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 54,
    name: 'delete_program',
    description: 'Delete program',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Event Management
  {
    id: 60,
    name: 'manage_events',
    description: 'Manage events',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 61,
    name: 'view_events',
    description: 'View events',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 62,
    name: 'create_event',
    description: 'Create events',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 63,
    name: 'edit_event',
    description: 'Edit events',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 64,
    name: 'delete_event',
    description: 'Delete events',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Announcement Management
  {
    id: 70,
    name: 'manage_announcements',
    description: 'Manage announcements',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 71,
    name: 'create_announcement',
    description: 'Create announcements',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 72,
    name: 'edit_announcement',
    description: 'Edit announcements',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 73,
    name: 'delete_announcement',
    description: 'Delete announcements',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 74,
    name: 'publish_announcement',
    description: 'Publish announcements',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Vendor Management
  {
    id: 80,
    name: 'manage_vendors',
    description: 'Manage vendors',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 81,
    name: 'view_vendors',
    description: 'View vendor list',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 82,
    name: 'approve_vendor',
    description: 'Approve vendors',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 83,
    name: 'suspend_vendor',
    description: 'Suspend vendors',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Store Management
  {
    id: 90,
    name: 'manage_stores',
    description: 'Manage stores',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 91,
    name: 'view_stores',
    description: 'View store list',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 92,
    name: 'create_store',
    description: 'Create stores',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 93,
    name: 'edit_store',
    description: 'Edit stores',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 94,
    name: 'delete_store',
    description: 'Delete stores',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Product Management
  {
    id: 100,
    name: 'manage_products',
    description: 'Manage products',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 101,
    name: 'view_products',
    description: 'View product list',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 102,
    name: 'add_product',
    description: 'Add new products',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 103,
    name: 'edit_product',
    description: 'Edit products',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 104,
    name: 'delete_product',
    description: 'Delete products',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Inventory Management
  {
    id: 110,
    name: 'manage_inventory',
    description: 'Manage inventory',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 111,
    name: 'view_inventory',
    description: 'View inventory',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 112,
    name: 'update_stock',
    description: 'Update stock levels',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Order Management
  {
    id: 120,
    name: 'manage_orders',
    description: 'Manage orders',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 121,
    name: 'view_orders',
    description: 'View orders',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 122,
    name: 'process_orders',
    description: 'Process orders',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 123,
    name: 'cancel_orders',
    description: 'Cancel orders',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 124,
    name: 'refund_orders',
    description: 'Process refunds',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Settings
  {
    id: 130,
    name: 'manage_settings',
    description: 'Manage system settings',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 131,
    name: 'view_settings',
    description: 'View settings',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 132,
    name: 'update_settings',
    description: 'Update settings',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Reports
  {
    id: 140,
    name: 'view_reports',
    description: 'View reports',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 141,
    name: 'generate_reports',
    description: 'Generate reports',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 142,
    name: 'export_reports',
    description: 'Export reports',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

// Role-Permission mappings (which permissions belong to which roles)
const rolePermissions = [
  // Super Admin (id: 1) - All permissions (1-142)
  ...Array.from({ length: 142 }, (_, i) => ({
    role_id: 1,
    permission_id: i + 1,
    created_at: new Date(),
    updated_at: new Date(),
  })),

  // Parish Admin (id: 2)
  {
    role_id: 2,
    permission_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  }, // view_dashboard
  {
    role_id: 2,
    permission_id: 2,
    created_at: new Date(),
    updated_at: new Date(),
  }, // view_analytics
  {
    role_id: 2,
    permission_id: 10,
    created_at: new Date(),
    updated_at: new Date(),
  }, // manage_users
  {
    role_id: 2,
    permission_id: 11,
    created_at: new Date(),
    updated_at: new Date(),
  }, // view_users
  {
    role_id: 2,
    permission_id: 12,
    created_at: new Date(),
    updated_at: new Date(),
  }, // assign_roles
  {
    role_id: 2,
    permission_id: 20,
    created_at: new Date(),
    updated_at: new Date(),
  }, // manage_members
  {
    role_id: 2,
    permission_id: 21,
    created_at: new Date(),
    updated_at: new Date(),
  }, // view_members
  {
    role_id: 2,
    permission_id: 22,
    created_at: new Date(),
    updated_at: new Date(),
  }, // add_member
  {
    role_id: 2,
    permission_id: 23,
    created_at: new Date(),
    updated_at: new Date(),
  }, // edit_member
  {
    role_id: 2,
    permission_id: 25,
    created_at: new Date(),
    updated_at: new Date(),
  }, // export_members
  {
    role_id: 2,
    permission_id: 30,
    created_at: new Date(),
    updated_at: new Date(),
  }, // manage_first_timers
  {
    role_id: 2,
    permission_id: 31,
    created_at: new Date(),
    updated_at: new Date(),
  }, // view_first_timers
  {
    role_id: 2,
    permission_id: 32,
    created_at: new Date(),
    updated_at: new Date(),
  }, // convert_to_member
  {
    role_id: 2,
    permission_id: 40,
    created_at: new Date(),
    updated_at: new Date(),
  }, // manage_contributions
  {
    role_id: 2,
    permission_id: 41,
    created_at: new Date(),
    updated_at: new Date(),
  }, // view_contributions
  {
    role_id: 2,
    permission_id: 42,
    created_at: new Date(),
    updated_at: new Date(),
  }, // add_contribution
  {
    role_id: 2,
    permission_id: 43,
    created_at: new Date(),
    updated_at: new Date(),
  }, // edit_contribution
  {
    role_id: 2,
    permission_id: 45,
    created_at: new Date(),
    updated_at: new Date(),
  }, // export_contributions
  {
    role_id: 2,
    permission_id: 46,
    created_at: new Date(),
    updated_at: new Date(),
  }, // view_contribution_reports
  {
    role_id: 2,
    permission_id: 50,
    created_at: new Date(),
    updated_at: new Date(),
  }, // manage_programs
  {
    role_id: 2,
    permission_id: 51,
    created_at: new Date(),
    updated_at: new Date(),
  }, // view_programs
  {
    role_id: 2,
    permission_id: 52,
    created_at: new Date(),
    updated_at: new Date(),
  }, // add_program
  {
    role_id: 2,
    permission_id: 53,
    created_at: new Date(),
    updated_at: new Date(),
  }, // edit_program
  {
    role_id: 2,
    permission_id: 60,
    created_at: new Date(),
    updated_at: new Date(),
  }, // manage_events
  {
    role_id: 2,
    permission_id: 61,
    created_at: new Date(),
    updated_at: new Date(),
  }, // view_events
  {
    role_id: 2,
    permission_id: 62,
    created_at: new Date(),
    updated_at: new Date(),
  }, // create_event
  {
    role_id: 2,
    permission_id: 63,
    created_at: new Date(),
    updated_at: new Date(),
  }, // edit_event
  {
    role_id: 2,
    permission_id: 70,
    created_at: new Date(),
    updated_at: new Date(),
  }, // manage_announcements
  {
    role_id: 2,
    permission_id: 71,
    created_at: new Date(),
    updated_at: new Date(),
  }, // create_announcement
  {
    role_id: 2,
    permission_id: 74,
    created_at: new Date(),
    updated_at: new Date(),
  }, // publish_announcement
  {
    role_id: 2,
    permission_id: 80,
    created_at: new Date(),
    updated_at: new Date(),
  }, // manage_vendors
  {
    role_id: 2,
    permission_id: 81,
    created_at: new Date(),
    updated_at: new Date(),
  }, // view_vendors
  {
    role_id: 2,
    permission_id: 82,
    created_at: new Date(),
    updated_at: new Date(),
  }, // approve_vendor
  {
    role_id: 2,
    permission_id: 90,
    created_at: new Date(),
    updated_at: new Date(),
  }, // manage_stores
  {
    role_id: 2,
    permission_id: 91,
    created_at: new Date(),
    updated_at: new Date(),
  }, // view_stores
  {
    role_id: 2,
    permission_id: 100,
    created_at: new Date(),
    updated_at: new Date(),
  }, // manage_products
  {
    role_id: 2,
    permission_id: 101,
    created_at: new Date(),
    updated_at: new Date(),
  }, // view_products
  {
    role_id: 2,
    permission_id: 110,
    created_at: new Date(),
    updated_at: new Date(),
  }, // manage_inventory
  {
    role_id: 2,
    permission_id: 111,
    created_at: new Date(),
    updated_at: new Date(),
  }, // view_inventory
  {
    role_id: 2,
    permission_id: 120,
    created_at: new Date(),
    updated_at: new Date(),
  }, // manage_orders
  {
    role_id: 2,
    permission_id: 121,
    created_at: new Date(),
    updated_at: new Date(),
  }, // view_orders
  {
    role_id: 2,
    permission_id: 130,
    created_at: new Date(),
    updated_at: new Date(),
  }, // manage_settings
  {
    role_id: 2,
    permission_id: 131,
    created_at: new Date(),
    updated_at: new Date(),
  }, // view_settings
  {
    role_id: 2,
    permission_id: 140,
    created_at: new Date(),
    updated_at: new Date(),
  }, // view_reports
  {
    role_id: 2,
    permission_id: 141,
    created_at: new Date(),
    updated_at: new Date(),
  }, // generate_reports
  {
    role_id: 2,
    permission_id: 142,
    created_at: new Date(),
    updated_at: new Date(),
  }, // export_reports

  // Vendor Owner (id: 3)
  {
    role_id: 3,
    permission_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 3,
    permission_id: 80,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 3,
    permission_id: 90,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 3,
    permission_id: 91,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 3,
    permission_id: 100,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 3,
    permission_id: 101,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 3,
    permission_id: 102,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 3,
    permission_id: 103,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 3,
    permission_id: 110,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 3,
    permission_id: 111,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 3,
    permission_id: 112,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 3,
    permission_id: 120,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 3,
    permission_id: 121,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 3,
    permission_id: 122,
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Store Manager (id: 4)
  {
    role_id: 4,
    permission_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 4,
    permission_id: 90,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 4,
    permission_id: 91,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 4,
    permission_id: 92,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 4,
    permission_id: 93,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 4,
    permission_id: 100,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 4,
    permission_id: 101,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 4,
    permission_id: 102,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 4,
    permission_id: 103,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 4,
    permission_id: 110,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 4,
    permission_id: 111,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 4,
    permission_id: 112,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 4,
    permission_id: 120,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 4,
    permission_id: 121,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 4,
    permission_id: 122,
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Cashier (id: 5)
  {
    role_id: 5,
    permission_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 5,
    permission_id: 101,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 5,
    permission_id: 111,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 5,
    permission_id: 120,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 5,
    permission_id: 121,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 5,
    permission_id: 122,
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Member (id: 6)
  {
    role_id: 6,
    permission_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 6,
    permission_id: 21,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 6,
    permission_id: 41,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 6,
    permission_id: 42,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 6,
    permission_id: 61,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 6,
    permission_id: 71,
    created_at: new Date(),
    updated_at: new Date(),
  },

  // First Timer (id: 7)
  {
    role_id: 7,
    permission_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 7,
    permission_id: 42,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 7,
    permission_id: 61,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 7,
    permission_id: 71,
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Content Manager (id: 8)
  {
    role_id: 8,
    permission_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 8,
    permission_id: 70,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 8,
    permission_id: 71,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 8,
    permission_id: 72,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 8,
    permission_id: 74,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 8,
    permission_id: 60,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 8,
    permission_id: 61,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 8,
    permission_id: 62,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 8,
    permission_id: 63,
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Finance Officer (id: 9)
  {
    role_id: 9,
    permission_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 9,
    permission_id: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 9,
    permission_id: 40,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 9,
    permission_id: 41,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 9,
    permission_id: 43,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 9,
    permission_id: 45,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 9,
    permission_id: 46,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 9,
    permission_id: 140,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 9,
    permission_id: 141,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 9,
    permission_id: 142,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert roles
    await queryInterface.bulkInsert('roles', roles, {});
    console.log(`✅ Inserted ${roles.length} roles`);

    // Insert permissions
    await queryInterface.bulkInsert('permissions', permissions, {});
    console.log(`✅ Inserted ${permissions.length} permissions`);

    // Insert role-permissions mappings
    await queryInterface.bulkInsert(
      'user_vendor_role_permissions',
      rolePermissions,
      {},
    );
    console.log(
      `✅ Inserted ${rolePermissions.length} role-permission mappings`,
    );

    // Reset sequences
    await queryInterface.sequelize.query(
      `SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));`,
    );
    await queryInterface.sequelize.query(
      `SELECT setval('permissions_id_seq', (SELECT MAX(id) FROM permissions));`,
    );
  },

  async down(queryInterface, Sequelize) {
    // Delete in reverse order (due to foreign key constraints)
    await queryInterface.bulkDelete('user_vendor_role_permissions', null, {});
    console.log('✅ Role-permission mappings removed');

    await queryInterface.bulkDelete('permissions', null, {});
    console.log('✅ Permissions removed');

    await queryInterface.bulkDelete('roles', null, {});
    console.log('✅ Roles removed');

    // Reset sequences
    await queryInterface.sequelize.query(
      `ALTER SEQUENCE roles_id_seq RESTART WITH 1;`,
    );
    await queryInterface.sequelize.query(
      `ALTER SEQUENCE permissions_id_seq RESTART WITH 1;`,
    );
  },
};
