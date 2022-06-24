const { Controller, expand, compact } = require("ywemay-api-controller");
const yup = require("yup");
const {
  ADMIN,
  MANAGER,
  SELLER,
  SECRETARY,
  CUSTOMER,
  hasRole,
} = require("ywemay-api-role");
const model = require("../models/product");
const { ObjectId } = require('mongoose').Types;

const schemaShape = { 
  sku: yup.string().min(2).max(30).required(),
  title: yup.string().min(2).max(150).required(),
  images: yup.array().of(yup.string().min(2).max(150).required()),
  keywords: yup.array().of(
    yup.object().shape({
      id: yup.string().min(1).max(20),
    })
  ),
  description: yup.string(),
  options: yup.array().of(yup.array().of(
    yup.object().shape({
      image: yup.string(),
      key: yup.string().required(),
      title: yup.string().required(),
      exclude: yup.array().of(yup.string().required()),
      limit: yup.array().of(yup.string().required()),
      priceChange: yup.number(),
    })
  )),
  price: yup.number().min(0),
  currency: yup.string().min(2).max(4),
  published: yup.boolean(),
};

const schema = yup.object().shape(schemaShape);

const ADMIN_ROLES = [ADMIN, MANAGER, SELLER, SECRETARY]

const secureView = ({user}) => {
  return new Promise((resolve) => {
    hasRole(user, ADMIN_ROLES) ? (resolve({})) : resolve({ published: true})
  })
}

const projection = { 
  sku: true,
  title: true,
  images: true,
  price: true, 
  currency: true,
  published: true
}

const Adv = new Controller({
  model,
  security: {
    list: secureView,
    view: secureView,
    post: ({ user, req }) => {
      return new Promise((resolve, reject) => {
        if (!req.body) reject();
        req.body.owner = user.uid;
        hasRole(user, ADMIN_ROLES) ? resolve({}) : reject();
      });
    },
    put: ({ user }) => {
      return new Promise((resolve, reject) => {
        hasRole(user, [ADMIN, MANAGER, SELLER]) ? resolve({}) : reject();
      });
    },
    delete: ({ user }) => {
      return new Promise((resolve, reject) => {
        if (hasRole(user, [ADMIN, MANAGER])) return resolve({});
        if (hasRole(user, [SELLER])) return resolve({ owner: user.uid });
        reject();
      });
    },
  },
  validators: {
    post: ({ data, user }) => {
      const s = hasRole(user, [ADMIN, MANAGER])
        ? yup.object().shape({...schemaShape, owner: yup.string()})
        : yup.object().shape(schemaShape);
      return s.validate(data);
    },
    put: ({ data }) => schema.pick(Object.keys(data)).validate(data),
  },
  projections: {
    list: projection,
    references: projection,
    view: {
      ...projection,
      keywords: true,
      description: true,
      options: true,
    },
  },
  hooks: {
    expand: (item) => {
      if (Array.isArray(item.keywords)) item.keywords = expand(item.keywords);
      return item;
    },
    compact: (item) => {
      if (Array.isArray(item.keywords)) item.keywords = compact(item.keywords);
      return item;
    },
  },
});

module.exports = Adv;
