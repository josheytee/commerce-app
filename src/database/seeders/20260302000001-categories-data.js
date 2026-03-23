module.exports = {
  async up(queryInterface, Sequelize) {
    // Create main categories
    const categories = [
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices, gadgets, and accessories',
        icon: 'fa-solid fa-laptop',
        image: '/images/categories/electronics.jpg',
        level: 0,
        sort_order: 1,
        is_active: true,
        meta_title: 'Electronics Vendors',
        meta_description: 'Find the best electronics vendors',
        meta_keywords: 'electronics, gadgets, devices, technology',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Fashion & Apparel',
        slug: 'fashion-apparel',
        description: 'Clothing, footwear, and fashion accessories',
        icon: 'fa-solid fa-shirt',
        image: '/images/categories/fashion.jpg',
        level: 0,
        sort_order: 2,
        is_active: true,
        meta_title: 'Fashion Vendors',
        meta_description: 'Find the best fashion and apparel vendors',
        meta_keywords: 'fashion, clothing, apparel, footwear',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Food & Beverage',
        slug: 'food-beverage',
        description: 'Restaurants, cafes, and food suppliers',
        icon: 'fa-solid fa-utensils',
        image: '/images/categories/food.jpg',
        level: 0,
        sort_order: 3,
        is_active: true,
        meta_title: 'Food & Beverage Vendors',
        meta_description: 'Find the best food and beverage vendors',
        meta_keywords: 'food, beverage, restaurants, catering',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Furniture, decor, and home essentials',
        icon: 'fa-solid fa-house',
        image: '/images/categories/home.jpg',
        level: 0,
        sort_order: 4,
        is_active: true,
        meta_title: 'Home & Living Vendors',
        meta_description: 'Find the best home and living vendors',
        meta_keywords: 'home, furniture, decor, living',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Health & Wellness',
        slug: 'health-wellness',
        description: 'Healthcare products, fitness, and wellness services',
        icon: 'fa-solid fa-heartbeat',
        image: '/images/categories/health.jpg',
        level: 0,
        sort_order: 5,
        is_active: true,
        meta_title: 'Health & Wellness Vendors',
        meta_description: 'Find the best health and wellness vendors',
        meta_keywords: 'health, wellness, fitness, healthcare',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Beauty & Personal Care',
        slug: 'beauty-personal-care',
        description: 'Cosmetics, skincare, and personal care products',
        icon: 'fa-solid fa-spa',
        image: '/images/categories/beauty.jpg',
        level: 0,
        sort_order: 6,
        is_active: true,
        meta_title: 'Beauty & Personal Care Vendors',
        meta_description: 'Find the best beauty and personal care vendors',
        meta_keywords: 'beauty, cosmetics, skincare, personal care',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Automotive',
        slug: 'automotive',
        description: 'Cars, parts, and automotive services',
        icon: 'fa-solid fa-car',
        image: '/images/categories/automotive.jpg',
        level: 0,
        sort_order: 7,
        is_active: true,
        meta_title: 'Automotive Vendors',
        meta_description: 'Find the best automotive vendors',
        meta_keywords: 'automotive, cars, parts, services',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Services',
        slug: 'services',
        description: 'Professional and business services',
        icon: 'fa-solid fa-briefcase',
        image: '/images/categories/services.jpg',
        level: 0,
        sort_order: 8,
        is_active: true,
        meta_title: 'Service Vendors',
        meta_description: 'Find the best service providers',
        meta_keywords: 'services, professional, business, consulting',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    // Insert categories
    const insertedCategories = [];
    for (const category of categories) {
      const [insertedCategory] = await queryInterface.sequelize.query(
        `INSERT INTO categories (name, slug, description, icon, image, level, sort_order, is_active, meta_title, meta_description, meta_keywords, created_at, updated_at)
         VALUES (:name, :slug, :description, :icon, :image, :level, :sort_order, :is_active, :meta_title, :meta_description, :meta_keywords, :created_at, :updated_at)
         RETURNING *`,
        {
          replacements: category,
          type: queryInterface.sequelize.QueryTypes.INSERT,
        }
      );
      insertedCategories.push(insertedCategory[0]);
    }

    // Create subcategories
    const subcategories = [
      // Electronics Subcategories
      {
        name: 'Smartphones & Tablets',
        slug: 'smartphones-tablets',
        description: 'Mobile phones, tablets, and accessories',
        parent_id: insertedCategories.find(c => c.name === 'Electronics')?.id,
        level: 1,
        sort_order: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Laptops & Computers',
        slug: 'laptops-computers',
        description: 'Laptops, desktops, and computer accessories',
        parent_id: insertedCategories.find(c => c.name === 'Electronics')?.id,
        level: 1,
        sort_order: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Audio & Headphones',
        slug: 'audio-headphones',
        description: 'Headphones, speakers, and audio equipment',
        parent_id: insertedCategories.find(c => c.name === 'Electronics')?.id,
        level: 1,
        sort_order: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      
      // Fashion Subcategories
      {
        name: "Men's Clothing",
        slug: 'mens-clothing',
        description: "Men's shirts, pants, suits, and accessories",
        parent_id: insertedCategories.find(c => c.name === 'Fashion & Apparel')?.id,
        level: 1,
        sort_order: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Women's Clothing",
        slug: 'womens-clothing',
        description: "Women's dresses, tops, bottoms, and accessories",
        parent_id: insertedCategories.find(c => c.name === 'Fashion & Apparel')?.id,
        level: 1,
        sort_order: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Footwear',
        slug: 'footwear',
        description: 'Shoes, sneakers, boots, and sandals',
        parent_id: insertedCategories.find(c => c.name === 'Fashion & Apparel')?.id,
        level: 1,
        sort_order: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    // Insert subcategories
    const insertedSubcategories = [];
    for (const subcategory of subcategories) {
      if (subcategory.parent_id) {
        const [insertedSubcategory] = await queryInterface.sequelize.query(
          `INSERT INTO categories (name, slug, description, parent_id, level, sort_order, is_active, created_at, updated_at)
           VALUES (:name, :slug, :description, :parent_id, :level, :sort_order, :is_active, :created_at, :updated_at)
           RETURNING *`,
          {
            replacements: subcategory,
            type: queryInterface.sequelize.QueryTypes.INSERT,
          }
        );
        insertedSubcategories.push(insertedSubcategory[0]);
      }
    }

    // Get existing vendors and assign them categories
    const vendors = await queryInterface.sequelize.query(
      `SELECT id FROM vendors WHERE deleted_at IS NULL`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Assign each vendor to a random category
    const allCategories = [...insertedCategories, ...insertedSubcategories];
    for (const vendor of vendors) {
      // Randomly select a category for this vendor
      const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
      
      await queryInterface.sequelize.query(
        `UPDATE vendors SET category_id = :category_id WHERE id = :vendor_id`,
        {
          replacements: {
            category_id: randomCategory.id,
            vendor_id: vendor.id,
          },
          type: queryInterface.sequelize.QueryTypes.UPDATE,
        }
      );
    }

    // If there are vendors without categories, assign them to a default category
    await queryInterface.sequelize.query(
      `UPDATE vendors 
       SET category_id = (SELECT id FROM categories WHERE slug = 'services' LIMIT 1)
       WHERE category_id IS NULL AND deleted_at IS NULL`,
      {
        type: queryInterface.sequelize.QueryTypes.UPDATE,
      }
    );

    // Make category_id NOT NULL after all vendors have categories
    await queryInterface.changeColumn('vendors', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  async down(queryInterface) {
    // Remove category assignments
    await queryInterface.sequelize.query(
      `UPDATE vendors SET category_id = NULL WHERE category_id IS NOT NULL`
    );
    
    // Make category_id nullable again
    await queryInterface.changeColumn('vendors', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    
    // Delete all seeded categories
    await queryInterface.sequelize.query(
      `DELETE FROM categories WHERE slug IN (
        'electronics', 'fashion-apparel', 'food-beverage', 'home-living', 
        'health-wellness', 'beauty-personal-care', 'automotive', 'services',
        'smartphones-tablets', 'laptops-computers', 'audio-headphones',
        'mens-clothing', 'womens-clothing', 'footwear'
      )`
    );
  },
};