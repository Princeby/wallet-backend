import User from './User';
import Wallet from './Wallet';

// Set up associations after all models are defined
const setupAssociations = () => {
    // User has many wallets
    User.hasMany(Wallet, { 
      sourceKey: 'id',
      foreignKey: 'userId',
      as: 'wallets' 
    });
    
    // Wallet belongs to a user
    Wallet.belongsTo(User, { 
      targetKey: 'id',
      foreignKey: 'userId',
      as: 'user' 
    });
  };

export default setupAssociations;

