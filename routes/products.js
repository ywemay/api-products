const validators = require('../validators/product');
const permissions = require('../permissions/products');
const makeRouter = require('../utils/make-product-routes');

const router = makeRouter({validators, permissions});

module.exports = router;

/*
const router = require("express").Router();
const { postSchema, putSchema } = require('../validators/product');
const { canList, canView, canPost, canPut, canDelete } = require('../permissions/products');
const { getList, getItem, postItem, putItem, deleteItem } = require('../sets/products');

router.get("/", getList({canList})); 
router.get("/:id", getItem({canView}));

router.post("/", postItem({canPost, postSchema}));
router.put("/:id", putItem({canPut, putSchema}));
router.delete("/:id", deleteItem({canDelete}));

module.exports = router;
*/