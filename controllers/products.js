const { reqPage, keyFilter } = require("ywemay-api-utils");
const { sendError, sendData, ifFound } = require('ywemay-api-send');

const Model = require('../models/products');

const getScoppedFilter = (req) => {
  const { scopedFilter, userData } = req;
  return typeof scoppedFilter === 'function' ? scopedFilter(userData) : {};
}

exports.setSearchFilter = (req, res, next) => {
  try {
    const { t, enabled } = req.query;
    const q = getScoppedFilter(req);
    if (t) {
      const re = new RegExp(t, 'i');
      q.$or = [
        { title: re },
        { description: re },
      ]
    }
    if (enabled !== undefined) {
      q.enabled = enabled
    }
    req.search = q;
  }
  catch (e) {
    console.error(e);
  }
}

exports.countDocuments = (req, res, next) => {
  const page = reqPage(req);
  Model.countDocuments(req.searchFilter)
   .then((total) => {
     res.data = res.data || {};
     res.data.pagination = { total, page }
     if (total === 0) {
       res.data.items = [];
       return sendData(res);
     }
     next();
   })
   .catch(err => sendError(res, err));
}

exports.list = (req, res, next) => {
  const { page } = res.data.pagination;
  const { sort, limit } = req.params;
  Model.find(req.searchFilter || {})
    .select(['sku', 'title', 'images'])
    .skip(page.skip)
    .limit(limit || page.limit)
    .sort(sort || {_id: -1})
    .then((items) => {
      res.data.items = items
      next();
    })
    .catch(err => {
      return sendError(res, err);
    })
}

exports.createItem = ({ data, alter } = {}) => {
  return new Promise((resolve, reject) => {
    const allowed = Object.keys(Model.definition);
    const values = keyFilter(data, allowed);
    const { published } = data;
    values.published = published ? true : false;
    if (typeof alter === 'function') alter(values);
    const item = new Model(values);
    item.save()
      .then(newItem => resolve(newItem))
      .catch(err => reject(err));
  });
}

exports.create = (req, res, next) => {
  const { body, alter }= req; 
  this.createItem({data: body, alter})
    .then((newItem) => {
      const { _id } = newItem;
      res.data = {
        createdItem: { _id }
      }
      next();
    })
    .catch(err => sendError(res, err));
}

exports.getItem = (req, res, next) => {
  const allowed = Object.keys(Model.definition);
  const q = getScoppedFilter(req);
  q._id = req.params.id;
  Model.findOne(q)
    .select(allowed)
    .exec()
    .then(item => {
      ifFound(item, res, () => {
        if (!res.data) res.data = {};
        res.data.item = item;
        next();
      })
    })
    .catch(err => sendError(res, err))
}

exports.update = (req, res, next) => {
  const { id } = req.params;
  const allowed = Object.keys(Model.definition);
  const ops = keyFilter(req.body, allowed);

  Model.updateOne({ _id: id}, { $set: ops })
    .exec()
    .then((result) => {
      res.data = { result, ops };
      next();
    })
    .catch(err => sendError(res, err));
}

exports.del = (req, res, next) => {
  const { id } = req.params;
  Model.deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.data = { result }
      next()
    })
    .catch(err => sendError(res, err));
}
