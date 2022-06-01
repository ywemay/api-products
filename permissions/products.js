const { hasRole } = require('ywemay-api-user')

const ADMIN = 'admin';
const MANAGER = 'manager';
const SELLER = 'seller';
const CUSTOMER = 'customer';

exports.canView = (user, _item) => {
  return hasRole(user, [ADMIN, MANAGER, SELLER, CUSTOMER]);
}

exports.canList = (user) => {
  return hasRole(user, [ADMIN, MANAGER, SELLER, CUSTOMER]);
}

exports.scopedFilter = (user) => {
  if (hasRole(user, [ADMIN, MANAGER, SELLER])) return {}
  return { published: true };
}

exports.canPost = (user, _item, {req}) => {
  return hasRole(user, [ADMIN, MANAGER, SELLER]);
}

exports.canPut = (user, item, {req} = {}) => {
  return hasRole(user, [ADMIN, MANAGER, SELLER]);
}

exports.canDelete = (user, item, {flags, req} = {}) => {
  return hasRole(user, [ADMIN, MANAGER]);
}