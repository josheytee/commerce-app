// seeders/002-demo-attribute-values.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get inserted attributes
    const [attributes] = await queryInterface.sequelize.query(
      'SELECT id, code, type FROM attributes;'
    );

    if (!attributes.length) {
      console.log('No attributes found, skipping attribute values');
      return;
    }

    const attributeMap = attributes.reduce((acc, attr) => {
      acc[attr.code] = attr;
      return acc;
    }, {});

    const attributeValues = [];

    // Color values (with hex codes)
    if (attributeMap.color) {
      const colors = [
        { value: 'Red', display: 'Crimson Red', hex: '#DC143C' },
        { value: 'Blue', display: 'Royal Blue', hex: '#4169E1' },
        { value: 'Black', display: 'Midnight Black', hex: '#000000' },
        { value: 'White', display: 'Pure White', hex: '#FFFFFF' },
        { value: 'Green', display: 'Forest Green', hex: '#228B22' },
        { value: 'Yellow', display: 'Golden Yellow', hex: '#FFD700' },
        { value: 'Purple', display: 'Deep Purple', hex: '#673AB7' },
        { value: 'Orange', display: 'Bright Orange', hex: '#FF9800' },
        { value: 'Pink', display: 'Hot Pink', hex: '#FF69B4' },
        { value: 'Gray', display: 'Charcoal Gray', hex: '#36454F' },
        { value: 'Brown', display: 'Chocolate Brown', hex: '#7B3F00' },
        { value: 'Navy', display: 'Navy Blue', hex: '#000080' },
      ];

      colors.forEach((color, index) => {
        attributeValues.push({
          attribute_id: attributeMap.color.id,
          value: color.value,
          display_value: color.display,
          color_code: color.hex,
          sort_order: index + 1,
         // is_default: index === 0,
          created_at: new Date(),
          updated_at: new Date(),
        });
      });
    }

    // Size values
    if (attributeMap.size) {
      const sizes = [
        { value: 'XS', display: 'Extra Small' },
        { value: 'S', display: 'Small' },
        { value: 'M', display: 'Medium' },
        { value: 'L', display: 'Large' },
        { value: 'XL', display: 'Extra Large' },
        { value: 'XXL', display: '2X Large' },
        { value: '3XL', display: '3X Large' },
        { value: 'One Size', display: 'One Size Fits All' },
      ];

      sizes.forEach((size, index) => {
        attributeValues.push({
          attribute_id: attributeMap.size.id,
          value: size.value,
          display_value: size.display,
          color_code: null,
          sort_order: index + 1,
          // is_default: size.value === 'M',
          created_at: new Date(),
          updated_at: new Date(),
        });
      });
    }

    // Material values
    if (attributeMap.material) {
      const materials = [
        { value: 'Cotton', display: '100% Cotton' },
        { value: 'Polyester', display: 'Polyester Blend' },
        { value: 'Leather', display: 'Genuine Leather' },
        { value: 'Silk', display: 'Pure Silk' },
        { value: 'Wool', display: 'Merino Wool' },
        { value: 'Linen', display: 'Natural Linen' },
        { value: 'Denim', display: 'Premium Denim' },
        { value: 'Velvet', display: 'Soft Velvet' },
        { value: 'Nylon', display: 'Durable Nylon' },
        { value: 'Canvas', display: 'Heavy Canvas' },
      ];

      materials.forEach((material, index) => {
        attributeValues.push({
          attribute_id: attributeMap.material.id,
          value: material.value,
          display_value: material.display,
          color_code: null,
          sort_order: index + 1,
          // is_default: index === 0,
          created_at: new Date(),
          updated_at: new Date(),
        });
      });
    }

    // Country of Origin values
    if (attributeMap.country_of_origin) {
      const countries = [
        { value: 'USA', display: 'United States' },
        { value: 'China', display: 'China' },
        { value: 'Italy', display: 'Italy' },
        { value: 'Germany', display: 'Germany' },
        { value: 'Japan', display: 'Japan' },
        { value: 'India', display: 'India' },
        { value: 'Vietnam', display: 'Vietnam' },
        { value: 'Bangladesh', display: 'Bangladesh' },
        { value: 'Turkey', display: 'Turkey' },
        { value: 'Portugal', display: 'Portugal' },
      ];

      countries.forEach((country, index) => {
        attributeValues.push({
          attribute_id: attributeMap.country_of_origin.id,
          value: country.value,
          display_value: country.display,
          color_code: null,
          sort_order: index + 1,
          // is_default: false,
          created_at: new Date(),
          updated_at: new Date(),
        });
      });
    }

    // Style values
    if (attributeMap.style) {
      const styles = [
        { value: 'Casual', display: 'Casual Wear' },
        { value: 'Formal', display: 'Formal/Business' },
        { value: 'Sporty', display: 'Athletic/Sporty' },
        { value: 'Vintage', display: 'Vintage/Retro' },
        { value: 'Modern', display: 'Modern/Contemporary' },
        { value: 'Bohemian', display: 'Boho Style' },
        { value: 'Minimalist', display: 'Minimalist' },
        { value: 'Luxury', display: 'Luxury/Premium' },
      ];

      styles.forEach((style, index) => {
        attributeValues.push({
          attribute_id: attributeMap.style.id,
          value: style.value,
          display_value: style.display,
          color_code: null,
          sort_order: index + 1,
          // is_default: index === 0,
          created_at: new Date(),
          updated_at: new Date(),
        });
      });
    }

    // Features (multi-select)
    if (attributeMap.features) {
      const features = [
        { value: 'Eco-Friendly', display: 'Eco-Friendly Material' },
        { value: 'Quick-Dry', display: 'Quick Drying' },
        { value: 'Anti-Microbial', display: 'Anti-Microbial' },
        { value: 'UV-Protection', display: 'UV Protection' },
        { value: 'Wrinkle-Free', display: 'Wrinkle Resistant' },
        { value: 'Stretch', display: '4-Way Stretch' },
        { value: 'Breathable', display: 'Breathable Fabric' },
        { value: 'Waterproof', display: 'Waterproof' },
        { value: 'Insulated', display: 'Thermal Insulated' },
        { value: 'Pockets', display: 'Multiple Pockets' },
      ];

      features.forEach((feature, index) => {
        attributeValues.push({
          attribute_id: attributeMap.features.id,
          value: feature.value,
          display_value: feature.display,
          color_code: null,
          sort_order: index + 1,
          // is_default: false,
          created_at: new Date(),
          updated_at: new Date(),
        });
      });
    }

    if (attributeValues.length > 0) {
      await queryInterface.bulkInsert('attribute_values', attributeValues);
      console.log(`Inserted ${attributeValues.length} attribute values`);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('attribute_values', null, {});
  },
};