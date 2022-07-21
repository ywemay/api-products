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

const { uploadImage, makeThumb, vewImage, sendResult, viewImage } = require('ywemay-api-img-upload');

const UPLOADS = (process.env.UPLOADS || __dirname.split('node_modules/')[0] + 'uploads') + '/product';

const router = require("express").Router();
const { checkAuth, send } = require("ywemay-api-user");

router.use(checkAuth);

router.get("/", getList);
router.get("/id/:id", getOne);
router.get("/ref", getManyReference);
router.post("/", create);
router.post("/upload/image", uploadImage({ path: UPLOADS }), makeThumb({ size: { w: 160, h: 160}}), sendResult);
router.put("/", updateMany);
router.put("/id/:id", update);
router.delete("/", deleteMany);
router.delete("/id/:id", deleteOne);

router.use(send);

module.exports = router;
