const newRouter = require("express").Router;
const { getList, getItem, postItem, putItem, deleteItem } = require('../sets/products');

module.exports = ({validators, permissions}) => {
  const router = newRouter();
  const { postSchema, putSchema } = validators;
  const { canList, canView, canPost, canPut, canDelete, scopedFilter } = permissions;

  router.get("/", getList({canList, scopedFilter})); 
  router.get("/:id", getItem({canView, scopedFilter}));
  router.post("/", postItem({canPost, postSchema}));
  router.put("/:id", putItem({canPut, putSchema}));
  router.delete("/:id", deleteItem({canDelete}));
  return router;
};