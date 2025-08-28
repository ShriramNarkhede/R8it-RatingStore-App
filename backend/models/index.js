const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// User can rate many stores (use explicit FK names and aliases)
User.belongsToMany(Store, {
  through: Rating,
  foreignKey: 'userId',
  otherKey: 'storeId',
  as: 'ratedStores'
});
Store.belongsToMany(User, {
  through: Rating,
  foreignKey: 'storeId',
  otherKey: 'userId',
  as: 'users'
});

// Ratings belong to a specific user and store
Rating.belongsTo(User, { foreignKey: 'userId' });
Rating.belongsTo(Store, { foreignKey: 'storeId' });
User.hasMany(Rating, { foreignKey: 'userId' });
Store.hasMany(Rating, { foreignKey: 'storeId' });

// Store belongs to a Store Owner (User)
Store.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
User.hasMany(Store, { as: 'ownedStores', foreignKey: 'ownerId' });

module.exports = { User, Store, Rating };