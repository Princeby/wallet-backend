
import User from './User';
import Wallet from './Wallet';
import BlacklistedToken from './blacklistedToken';
import setupAssociations from './associations';

setupAssociations();

export {
  User,
  Wallet,
  BlacklistedToken
};