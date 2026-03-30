'use strict';

const countries = [
  {
    name: 'United States',
    code: 'US',
    phone_code: '+1',
    currency: 'USD',
    currency_symbol: '$',
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    phone_code: '+44',
    currency: 'GBP',
    currency_symbol: '£',
  },
  {
    name: 'Nigeria',
    code: 'NG',
    phone_code: '+234',
    currency: 'NGN',
    currency_symbol: '₦',
  },
  {
    name: 'Canada',
    code: 'CA',
    phone_code: '+1',
    currency: 'CAD',
    currency_symbol: 'C$',
  },
  {
    name: 'Australia',
    code: 'AU',
    phone_code: '+61',
    currency: 'AUD',
    currency_symbol: 'A$',
  },
  {
    name: 'Germany',
    code: 'DE',
    phone_code: '+49',
    currency: 'EUR',
    currency_symbol: '€',
  },
  {
    name: 'France',
    code: 'FR',
    phone_code: '+33',
    currency: 'EUR',
    currency_symbol: '€',
  },
  {
    name: 'Italy',
    code: 'IT',
    phone_code: '+39',
    currency: 'EUR',
    currency_symbol: '€',
  },
  {
    name: 'Spain',
    code: 'ES',
    phone_code: '+34',
    currency: 'EUR',
    currency_symbol: '€',
  },
  {
    name: 'Japan',
    code: 'JP',
    phone_code: '+81',
    currency: 'JPY',
    currency_symbol: '¥',
  },
  {
    name: 'China',
    code: 'CN',
    phone_code: '+86',
    currency: 'CNY',
    currency_symbol: '¥',
  },
  {
    name: 'India',
    code: 'IN',
    phone_code: '+91',
    currency: 'INR',
    currency_symbol: '₹',
  },
  {
    name: 'Brazil',
    code: 'BR',
    phone_code: '+55',
    currency: 'BRL',
    currency_symbol: 'R$',
  },
  {
    name: 'South Africa',
    code: 'ZA',
    phone_code: '+27',
    currency: 'ZAR',
    currency_symbol: 'R',
  },
  {
    name: 'Kenya',
    code: 'KE',
    phone_code: '+254',
    currency: 'KES',
    currency_symbol: 'KSh',
  },
  {
    name: 'Ghana',
    code: 'GH',
    phone_code: '+233',
    currency: 'GHS',
    currency_symbol: '₵',
  },
  {
    name: 'Egypt',
    code: 'EG',
    phone_code: '+20',
    currency: 'EGP',
    currency_symbol: 'E£',
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    phone_code: '+966',
    currency: 'SAR',
    currency_symbol: '﷼',
  },
  {
    name: 'UAE',
    code: 'AE',
    phone_code: '+971',
    currency: 'AED',
    currency_symbol: 'د.إ',
  },
  {
    name: 'Singapore',
    code: 'SG',
    phone_code: '+65',
    currency: 'SGD',
    currency_symbol: 'S$',
  },
].map((country) => ({
  ...country,
  created_at: new Date(),
  updated_at: new Date(),
}));

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert countries
    await queryInterface.bulkInsert('countries', countries, {});

    // Get country IDs
    const [results] = await queryInterface.sequelize.query(
      `SELECT id, code FROM countries`,
    );

    const countryMap = {};
    results.forEach((row) => {
      countryMap[row.code] = row.id;
    });

    // Sample states for some countries
    const states = [
      // Nigeria
      { country_id: countryMap['NG'], name: 'Lagos', code: 'LA' },
      { country_id: countryMap['NG'], name: 'Abuja', code: 'FC' },
      { country_id: countryMap['NG'], name: 'Rivers', code: 'RI' },
      { country_id: countryMap['NG'], name: 'Kano', code: 'KN' },
      { country_id: countryMap['NG'], name: 'Oyo', code: 'OY' },

      // US
      {
        country_id: countryMap['US'],
        name: 'California',
        code: 'CA',
        capital: 'Sacramento',
      },
      {
        country_id: countryMap['US'],
        name: 'Texas',
        code: 'TX',
        capital: 'Austin',
      },
      {
        country_id: countryMap['US'],
        name: 'New York',
        code: 'NY',
        capital: 'Albany',
      },
      {
        country_id: countryMap['US'],
        name: 'Florida',
        code: 'FL',
        capital: 'Tallahassee',
      },
      {
        country_id: countryMap['US'],
        name: 'Illinois',
        code: 'IL',
        capital: 'Springfield',
      },

      // UK
      { country_id: countryMap['GB'], name: 'England', code: 'ENG' },
      { country_id: countryMap['GB'], name: 'Scotland', code: 'SCT' },
      { country_id: countryMap['GB'], name: 'Wales', code: 'WLS' },
      { country_id: countryMap['GB'], name: 'Northern Ireland', code: 'NIR' },

      // Canada
      { country_id: countryMap['CA'], name: 'Ontario', code: 'ON' },
      { country_id: countryMap['CA'], name: 'Quebec', code: 'QC' },
      { country_id: countryMap['CA'], name: 'British Columbia', code: 'BC' },
      { country_id: countryMap['CA'], name: 'Alberta', code: 'AB' },

      // Australia
      { country_id: countryMap['AU'], name: 'New South Wales', code: 'NSW' },
      { country_id: countryMap['AU'], name: 'Victoria', code: 'VIC' },
      { country_id: countryMap['AU'], name: 'Queensland', code: 'QLD' },
      { country_id: countryMap['AU'], name: 'Western Australia', code: 'WA' },
    ].map((state) => ({
      ...state,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert('states', states, {});

    // Get state IDs
    const [stateResults] = await queryInterface.sequelize.query(
      `SELECT s.id, s.name, c.code as country_code 
       FROM states s 
       JOIN countries c ON s.country_id = c.id`,
    );

    // Sample cities
    const cities = [];

    // Add cities for Lagos, Nigeria
    const lagosId = stateResults.find(
      (s) => s.name === 'Lagos' && s.country_code === 'NG',
    )?.id;
    if (lagosId) {
      const lagosCities = [
        'Ikeja',
        'Victoria Island',
        'Lekki',
        'Surulere',
        'Apapa',
        'Yaba',
        'Mainland',
        'Badagry',
        'Epe',
        'Ikorodu',
      ].map((name) => ({
        state_id: lagosId,
        name,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }));
      cities.push(...lagosCities);
    }

    // Add cities for California, US
    const californiaId = stateResults.find(
      (s) => s.name === 'California' && s.country_code === 'US',
    )?.id;
    if (californiaId) {
      const californiaCities = [
        'Los Angeles',
        'San Francisco',
        'San Diego',
        'Sacramento',
        'San Jose',
        'Fresno',
        'Long Beach',
        'Oakland',
      ].map((name) => ({
        state_id: californiaId,
        name,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }));
      cities.push(...californiaCities);
    }

    // Add cities for England, UK
    const englandId = stateResults.find(
      (s) => s.name === 'England' && s.country_code === 'GB',
    )?.id;
    if (englandId) {
      const englandCities = [
        'London',
        'Manchester',
        'Birmingham',
        'Liverpool',
        'Leeds',
        'Sheffield',
        'Bristol',
        'Newcastle',
      ].map((name) => ({
        state_id: englandId,
        name,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }));
      cities.push(...englandCities);
    }

    if (cities.length > 0) {
      await queryInterface.bulkInsert('cities', cities, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('addresses', null, {});
    await queryInterface.bulkDelete('cities', null, {});
    await queryInterface.bulkDelete('states', null, {});
    await queryInterface.bulkDelete('countries', null, {});
  },
};
