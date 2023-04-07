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
      return res.rows[0]; 
    })
    .catch((err) => {
      console.log(err.message);
    });
}; 

/// Reservations

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
} 

if (options.city) {
  queryParams.push(`%${options.city}%`);
  filters.push(`city LIKE $${queryParams.length}`);  
}

if (options.minimum_price_per_night > 0 && options.maximum_price_per_night > 0) {
  queryParams.push(options.minimum_price_per_night * 100);
  queryParams.push(options.maximum_price_per_night * 100);
  filters.push(`(cost_per_night >= $${queryParams.length - 1} AND cost_per_night <= $${queryParams.length})`);  
}  

if (options.minimum_rating > 0) {
  queryParams.push(options.minimum_rating);
  filters.push(`(SELECT AVG(property_reviews.rating) FROM property_reviews) >= $${queryParams.length}`);
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

// Add user created property

const addProperty = (properties) => {

  return pool
    .query(`INSERT INTO
              properties
                (
                  owner_id,
                  title,
                  description,
                  thumbnail_photo_url,
                  cover_photo_url,
                  cost_per_night, 
                  street,
                  city,
                  province,
                  post_code,
                  country,
                  parking_spaces,
                  number_of_bathrooms,
                  number_of_bedrooms
                )
            VALUES 
              (
                $1, 
                $2, 
                $3, 
                $4, 
                $5, 
                $6, 
                $7, 
                $8, 
                $9, 
                $10, 
                $11, 
                $12, 
                $13, 
                $14
              )
            RETURNING *;`, 
            [
              properties.owner_id, 
              properties.title, 
              properties.description, 
              properties.thumbnail_photo_url, 
              properties.cover_photo_url, 
              properties.cost_per_night,
              properties.street, 
              properties.city, 
              properties.province, 
              properties.post_code, 
              properties.country, 
              properties.parking_spaces, 
              properties.number_of_bathrooms, 
              properties.number_of_bedrooms
            ]
    )
    .then((res) => {
      return res.rows[0]; 
    })
    .catch((err) => {
      console.log(err.message);
    });
}

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
