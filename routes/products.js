const {
  getList,
  getOne,
  getManyReference,
  create,
  update,
  updateMany,
  deleteOne,
  deleteMany
} = require('../controllers/products');
const router = require("express").Router();
const { checkAuth, send } = require("ywemay-api-user");

router.use(checkAuth);

router.get("/", getList);
router.get("/id/:id", getOne);
router.get("/ref", getManyReference);
router.post("/", create);
router.put("/", updateMany);
router.put("/id/:id", update);
router.delete("/", deleteMany);
router.delete("/id/:id", deleteOne);

router.use(send);

module.exports = router;
