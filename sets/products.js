const { send } = require("ywemay-api-send")
const validate = require("ywemay-api-validate")
const { checkAuth, authAction } = require('ywemay-api-user');

const cProduct = require('../controllers/products');
  
module.exports = {
  getList: ({canList, scopedFilter}) => {
    return [
      checkAuth,
      authAction(canList),
      cProduct.setScopedFilter({scopedFilter}),
      cProduct.setSearchFilter,
      cProduct.countDocuments,
      cProduct.list,
      send
    ];
  },
  getItem: ({canView, scopedFilter}) => {
    return [
      checkAuth,
      cProduct.setScopedFilter({scopedFilter}),
      cProduct.getItem,
      authAction(canView),
      send
    ];
  },
  postItem: ({canPost, postSchema}) => {
    return [
      checkAuth, 
      authAction(canPost),
      validate(postSchema),
      cProduct.create, 
      send
    ];
  },
  putItem: ({canPut, putSchema}) => {
    return [
      checkAuth,
      cProduct.getItem,
      authAction(canPut),
      validate(putSchema),
      cProduct.update,
      send
    ]
  },
  deleteItem: ({canDelete}) => {
    return [
      checkAuth,
      cProduct.getItem,
      authAction(canDelete),
      cProduct.del,
      send
    ];
  }
}