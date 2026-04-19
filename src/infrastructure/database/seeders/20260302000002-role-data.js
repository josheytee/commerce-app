'use strict';

// Roles data for Multi-Vendor E-Commerce Platform
const roles = [
  // System Level Roles
  {
    id: 4,
    name: 'super_admin',
    description:
      'Super Administrator with full system access across all vendors and stores',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: 'platform_manager',
    description:
      'Platform Manager - manages overall platform operations, vendors, and disputes',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    name: 'support_agent',
    description:
      'Customer Support Agent - handles customer inquiries and disputes',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Vendor Level Roles
  {
    id: 10,
    name: 'vendor_owner',
    description:
      'Vendor Owner - full control over their vendor account and stores',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 11,
    name: 'vendor_admin',
    description: 'Vendor Admin - manages vendor operations, staff, and stores',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 12,
    name: 'vendor_manager',
    description: 'Vendor Manager - oversees multiple stores under a vendor',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Store Level Roles
  {
    id: 20,
    name: 'store_owner',
    description: 'Store Owner - full control over a specific store',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 21,
    name: 'store_manager',
    description: 'Store Manager - manages daily store operations',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 22,
    name: 'store_staff',
    description: 'Store Staff - assists with store operations',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Operations Roles
  {
    id: 30,
    name: 'inventory_manager',
    description:
      'Inventory Manager - manages product inventory and stock levels',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 31,
    name: 'order_processor',
    description: 'Order Processor - processes and fulfills orders',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 32,
    name: 'shipping_coordinator',
    description: 'Shipping Coordinator - manages shipping and deliveries',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Marketing Roles
  {
    id: 40,
    name: 'marketing_manager',
    description: 'Marketing Manager - manages promotions and campaigns',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 41,
    name: 'seo_specialist',
    description: 'SEO Specialist - optimizes product listings for search',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 42,
    name: 'social_media_manager',
    description: 'Social Media Manager - handles social media presence',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Customer Support Roles
  {
    id: 50,
    name: 'customer_support',
    description: 'Customer Support - handles customer inquiries and issues',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 51,
    name: 'dispute_resolver',
    description: 'Dispute Resolver - handles customer-vendor disputes',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Financial Roles
  {
    id: 60,
    name: 'finance_manager',
    description:
      'Finance Manager - manages vendor payouts and platform finances',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 61,
    name: 'payout_specialist',
    description: 'Payout Specialist - processes vendor payouts',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Customer Roles
  {
    id: 70,
    name: 'customer',
    description: 'Customer - regular platform customer',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 71,
    name: 'premium_customer',
    description: 'Premium Customer - loyalty program member with benefits',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Church/Organization Specific (if applicable)
  {
    id: 80,
    name: 'church_admin',
    description: 'Church Administrator - manages church-related activities',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 81,
    name: 'church_member',
    description: 'Church Member - basic church member access',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

// Permissions data for Multi-Vendor Platform
const permissions = [
  // ==================== PLATFORM LEVEL PERMISSIONS (1-50) ====================

  // Dashboard & Analytics
  {
    id: 1,
    name: 'view_platform_dashboard',
    description: 'View platform-level dashboard',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: 'view_platform_analytics',
    description: 'View platform analytics and reports',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Vendor Management
  {
    id: 10,
    name: 'manage_all_vendors',
    description: 'Manage all vendors on the platform',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 11,
    name: 'view_all_vendors',
    description: 'View all vendor list',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 12,
    name: 'approve_vendor_registration',
    description: 'Approve new vendor registrations',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 13,
    name: 'suspend_vendor',
    description: 'Suspend vendor accounts',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 14,
    name: 'verify_vendor_documents',
    description: 'Verify vendor documents and KYC',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Store Management
  {
    id: 20,
    name: 'manage_all_stores',
    description: 'Manage all stores across platform',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 21,
    name: 'view_all_stores',
    description: 'View all stores',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 22,
    name: 'feature_stores',
    description: 'Feature stores on homepage',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Product Moderation
  {
    id: 30,
    name: 'moderate_products',
    description: 'Moderate product listings',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 31,
    name: 'remove_products',
    description: 'Remove inappropriate products',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 32,
    name: 'feature_products',
    description: 'Feature products on platform',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Category Management
  {
    id: 40,
    name: 'manage_categories',
    description: 'Manage product categories',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 41,
    name: 'create_categories',
    description: 'Create new categories',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 42,
    name: 'edit_categories',
    description: 'Edit categories',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 43,
    name: 'delete_categories',
    description: 'Delete categories',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Order Management
  {
    id: 50,
    name: 'view_all_orders',
    description: 'View all platform orders',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 51,
    name: 'manage_disputes',
    description: 'Manage customer-vendor disputes',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // ==================== VENDOR LEVEL PERMISSIONS (51-100) ====================

  // Vendor Profile
  {
    id: 51,
    name: 'manage_own_vendor_profile',
    description: 'Manage own vendor profile',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 52,
    name: 'view_vendor_reports',
    description: 'View vendor performance reports',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Store Management (Vendor Level)
  {
    id: 60,
    name: 'manage_own_stores',
    description: 'Manage own stores',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 61,
    name: 'create_stores',
    description: 'Create new stores',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 62,
    name: 'edit_stores',
    description: 'Edit store details',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 63,
    name: 'delete_stores',
    description: 'Delete stores',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Staff Management
  {
    id: 70,
    name: 'manage_staff',
    description: 'Manage vendor/store staff',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 71,
    name: 'invite_staff',
    description: 'Invite staff members',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 72,
    name: 'assign_roles_to_staff',
    description: 'Assign roles to staff members',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 73,
    name: 'remove_staff',
    description: 'Remove staff members',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Product Management
  {
    id: 80,
    name: 'manage_own_products',
    description: 'Manage own products',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 81,
    name: 'add_products',
    description: 'Add new products',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 82,
    name: 'edit_products',
    description: 'Edit products',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 83,
    name: 'delete_products',
    description: 'Delete products',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 84,
    name: 'manage_product_inventory',
    description: 'Manage product inventory',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 85,
    name: 'bulk_import_products',
    description: 'Bulk import products via CSV/Excel',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Inventory Management
  {
    id: 90,
    name: 'manage_inventory',
    description: 'Manage inventory levels',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 91,
    name: 'update_stock',
    description: 'Update stock levels',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 92,
    name: 'manage_low_stock_alerts',
    description: 'Manage low stock alerts',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Order Management (Vendor Level)
  {
    id: 100,
    name: 'view_own_orders',
    description: 'View own store orders',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 101,
    name: 'process_orders',
    description: 'Process and fulfill orders',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 102,
    name: 'update_order_status',
    description: 'Update order status',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 103,
    name: 'cancel_orders',
    description: 'Cancel orders',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 104,
    name: 'manage_refunds',
    description: 'Process refunds',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Shipping Management
  {
    id: 110,
    name: 'manage_shipping_settings',
    description: 'Manage shipping settings',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 111,
    name: 'create_shipping_zones',
    description: 'Create shipping zones',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 112,
    name: 'manage_shipping_methods',
    description: 'Manage shipping methods',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 113,
    name: 'print_shipping_labels',
    description: 'Print shipping labels',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Pricing & Discounts
  {
    id: 120,
    name: 'manage_pricing',
    description: 'Manage product pricing',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 121,
    name: 'create_discounts',
    description: 'Create discount codes',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 122,
    name: 'manage_sales',
    description: 'Manage sales and promotions',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Analytics (Vendor Level)
  {
    id: 130,
    name: 'view_own_analytics',
    description: 'View own store analytics',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 131,
    name: 'view_sales_reports',
    description: 'View sales reports',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 132,
    name: 'export_reports',
    description: 'Export reports',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Payouts & Finance
  {
    id: 140,
    name: 'view_payouts',
    description: 'View payout history',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 141,
    name: 'request_payout',
    description: 'Request payout',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 142,
    name: 'view_earnings',
    description: 'View earnings',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Customer Management (Vendor Level)
  {
    id: 150,
    name: 'view_customers',
    description: 'View store customers',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 151,
    name: 'respond_to_reviews',
    description: 'Respond to customer reviews',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Marketing (Vendor Level)
  {
    id: 160,
    name: 'manage_promotions',
    description: 'Manage store promotions',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 161,
    name: 'run_advertisements',
    description: 'Run paid advertisements',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // ==================== STORE LEVEL PERMISSIONS (161-200) ====================

  // Store Operations
  {
    id: 161,
    name: 'manage_store_settings',
    description: 'Manage store settings',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 162,
    name: 'manage_store_theme',
    description: 'Manage store theme and appearance',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 163,
    name: 'manage_store_pages',
    description: 'Manage store pages',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Point of Sale (POS)
  {
    id: 170,
    name: 'use_pos',
    description: 'Use Point of Sale system',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 171,
    name: 'process_pos_payments',
    description: 'Process POS payments',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // ==================== CUSTOMER LEVEL PERMISSIONS (201-230) ====================

  // Customer Account
  {
    id: 201,
    name: 'manage_account',
    description: 'Manage own account',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 202,
    name: 'view_order_history',
    description: 'View order history',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 203,
    name: 'track_orders',
    description: 'Track orders',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Shopping
  {
    id: 210,
    name: 'add_to_cart',
    description: 'Add items to cart',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 211,
    name: 'checkout',
    description: 'Checkout and place orders',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 212,
    name: 'save_wishlist',
    description: 'Save items to wishlist',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Reviews & Ratings
  {
    id: 220,
    name: 'write_reviews',
    description: 'Write product reviews',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 221,
    name: 'rate_products',
    description: 'Rate products',
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Customer Support
  {
    id: 230,
    name: 'open_tickets',
    description: 'Open support tickets',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 231,
    name: 'request_refund',
    description: 'Request refund',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

// Role-Permission Mappings
const rolePermissions = [
  // ==================== SUPER ADMIN (id: 1) - All permissions ====================
  ...permissions.map((p) => ({
    role_id: 1,
    permission_id: p.id,
    created_at: new Date(),
    updated_at: new Date(),
  })),

  // ==================== PLATFORM MANAGER (id: 2) ====================
  // Platform level permissions
  {
    role_id: 2,
    permission_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 2,
    permission_id: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 2,
    permission_id: 10,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 2,
    permission_id: 11,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 2,
    permission_id: 12,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 2,
    permission_id: 13,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 2,
    permission_id: 14,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 2,
    permission_id: 20,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 2,
    permission_id: 21,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 2,
    permission_id: 22,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 2,
    permission_id: 30,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 2,
    permission_id: 31,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 2,
    permission_id: 32,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 2,
    permission_id: 40,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 2,
    permission_id: 41,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 2,
    permission_id: 42,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 2,
    permission_id: 43,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 2,
    permission_id: 50,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 2,
    permission_id: 51,
    created_at: new Date(),
    updated_at: new Date(),
  },

  // ==================== VENDOR OWNER (id: 10) ====================
  {
    role_id: 10,
    permission_id: 51,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 52,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 60,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 61,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 62,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 63,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 70,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 71,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 72,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 73,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 80,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 81,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 82,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 83,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 84,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 85,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 90,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 91,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 92,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 100,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 101,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 102,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 103,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 104,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 110,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 111,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 112,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 113,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 120,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 121,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 122,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 130,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 131,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 132,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 140,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 141,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 142,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 150,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 151,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 160,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 161,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 161,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 162,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 163,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 170,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 10,
    permission_id: 171,
    created_at: new Date(),
    updated_at: new Date(),
  },

  // ==================== STORE MANAGER (id: 21) ====================
  {
    role_id: 21,
    permission_id: 51,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 21,
    permission_id: 80,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 21,
    permission_id: 81,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 21,
    permission_id: 82,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 21,
    permission_id: 84,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 21,
    permission_id: 90,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 21,
    permission_id: 91,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 21,
    permission_id: 100,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 21,
    permission_id: 101,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 21,
    permission_id: 102,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 21,
    permission_id: 103,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 21,
    permission_id: 110,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 21,
    permission_id: 111,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 21,
    permission_id: 112,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 21,
    permission_id: 120,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 21,
    permission_id: 130,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 21,
    permission_id: 131,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 21,
    permission_id: 150,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 21,
    permission_id: 151,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 21,
    permission_id: 161,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 21,
    permission_id: 162,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 21,
    permission_id: 170,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 21,
    permission_id: 171,
    created_at: new Date(),
    updated_at: new Date(),
  },

  // ==================== STORE STAFF (id: 22) ====================
  {
    role_id: 22,
    permission_id: 80,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 22,
    permission_id: 81,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 22,
    permission_id: 90,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 22,
    permission_id: 91,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 22,
    permission_id: 100,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 22,
    permission_id: 101,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 22,
    permission_id: 102,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 22,
    permission_id: 110,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 22,
    permission_id: 112,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 22,
    permission_id: 170,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 22,
    permission_id: 171,
    created_at: new Date(),
    updated_at: new Date(),
  },

  // ==================== CUSTOMER (id: 70) ====================
  {
    role_id: 70,
    permission_id: 201,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 70,
    permission_id: 202,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 70,
    permission_id: 203,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 70,
    permission_id: 210,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 70,
    permission_id: 211,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 70,
    permission_id: 212,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 70,
    permission_id: 220,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 70,
    permission_id: 221,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 70,
    permission_id: 230,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 70,
    permission_id: 231,
    created_at: new Date(),
    updated_at: new Date(),
  },

  // ==================== PREMIUM CUSTOMER (id: 71) ====================
  {
    role_id: 71,
    permission_id: 201,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 71,
    permission_id: 202,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 71,
    permission_id: 203,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 71,
    permission_id: 210,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 71,
    permission_id: 211,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 71,
    permission_id: 212,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 71,
    permission_id: 220,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 71,
    permission_id: 221,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 71,
    permission_id: 230,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    role_id: 71,
    permission_id: 231,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // Premium customers get early access to sales
  {
    role_id: 71,
    permission_id: 160,
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
