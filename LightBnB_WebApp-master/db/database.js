const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require('pg');
const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

const getUserWithEmail = (email) => {

  return pool
    .query(
      'SELECT * FROM users WHERE email = $1;', [email])
    .then((res) => {
      console.log('successfully logged in!');
      return res.rows[0];
    })
    .catch((err) => { 
      console.log(err.message);
    });
}; 

// /**
//  * Get a single user from the database given their id.
//  * @param {string} id The id of the user.
//  * @return {Promise<{}>} A promise to the user.
//  */
// const getUserWithId = function (id) {
//   return Promise.resolve(users[id]);
// };

const getUserWithId = (id) => {

  return pool
    .query(
      'SELECT * FROM users WHERE id = $1;', [id])
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
}; 

// Add a new user to the database.

const addUser = (user) => {

  return pool
    .query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;', [user.name, user.email, user.password]
    )
    .then((res) => {
      // console.log('results.row[0]', result.rows[0]);
      return res.rows[0]; 
    })
    .catch((err) => {
      console.log(err.message);
    });
}; 

/// Reservations

// /**
//  * Get all reservations for a single user.
//  * @param {string} guest_id The id of the user.
//  * @return {Promise<[{}]>} A promise to the reservations.
//  */
// const getAllReservations = function (guest_id, limit = 10) {
//   return getAllProperties(null, 2);
// };

const getAllReservations = (guest_id, limit = 10) => {
  return pool
    .query(
      `SELECT * FROM reservations 
      JOIN properties ON reservations.property_id = properties.id 
      WHERE reservations.guest_id = $1
      GROUP BY properties.id, reservations.id 
      ORDER BY reservations.start_date 
      LIMIT $2;`, [guest_id, limit]
    )
    .then((res) => {
    console.log('Reservations: ', res.rows)  
        return res.rows; 
    })
    .catch((err) => {
      console.log(err.message);
    });
}



/// Properties

const getAllProperties = (options, limit = 10) => {
const queryParams = [];
let queryString = `
SELECT properties.*, avg(property_reviews.rating) as average_rating
FROM properties
JOIN property_reviews ON properties.id = property_id
`;
const filters = []; 

if (options.owner_id) {
  queryParams.push(options.owner_id);
  filters.push(`owner_id = $${queryParams.length}`);

  // queryString += `WHERE owner_id = $${queryParams.length}`;
  // console.log('queryString, queryParams', queryString, queryParams);

} 

if (options.city) {
  queryParams.push(`%${options.city}%`);
  filters.push(`city LIKE $${queryParams.length}`);  
}

if (options.minimum_price_per_night > 0 && options.maximum_price_per_night > 0) {
  queryParams.push(options.minimum_price_per_night);
  queryParams.push(options.maximum_price_per_night);
  filters.push(`(cost_per_night >= $${queryParams.length - 1} AND cost_per_night <= $${queryParams.length})`);  
}  



if (filters.length > 0) {
  queryString += `WHERE ${filters.join(' AND ')}`; 
}

queryParams.push(limit);
queryString += `
GROUP BY properties.id
ORDER BY cost_per_night
LIMIT $${queryParams.length};
`;


console.log({queryString, queryParams, options});


return pool.query(queryString, queryParams)
  .then((res) => res.rows);
};

// /**
//  * Add a property to the database
//  * @param {{}} property An object containing all of the property details.
//  * @return {Promise<{}>} A promise to the property.
//  */
// const addProperty = function (property) {
//   const propertyId = Object.keys(properties).length + 1;
//   property.id = propertyId;
//   properties[propertyId] = property;
//   return Promise.resolve(property);
// };

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  // addProperty,
};
