const router = require("express").Router();
const { send } = require("ywemay-api-send")
const validate = require("ywemay-api-validate")
const { checkAuth, authAction } = require('ywemay-api-user');

const cProduct = require('../controllers/products');
const schema = require('../validators/product');
const perm = require('../permissions/products');
  
const log = (msg) => {
  return (_req, _res, next) => {
    console.log(msg);
    next();
  }
}
router.get("/",
  checkAuth,
  authAction(perm.canList),
  cProduct.setSearchFilter,
  cProduct.countDocuments,
  cProduct.list,
  send
);

router.post("/",
  checkAuth, 
  authAction(perm.canPost),
  validate(schema.newItem),
  cProduct.create, 
  send
);

router.get("/:id",
  checkAuth,
  cProduct.getItem,
  authAction(perm.canView),
  send
);

router.put("/:id",
  checkAuth,
  cProduct.getItem,
  authAction(perm.canPut),
  validate(schema.update),
  cProduct.update,
  send
);

router.delete("/:id",
  checkAuth,
  cProduct.getItem,
  authAction(perm.canDelete),
  cProduct.del,
  send
);

module.exports = router;

