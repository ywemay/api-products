const { Controller, expand, compact } = require("ywemay-api-controller");
const yup = require("yup");
const {
  ADMIN,
  MANAGER,
  SELLER,
  CUSTOMER,
  hasRole,
} = require("ywemay-api-role");
const model = require("../models/product");

const schema = yup.object().shape({
  name: yup.string().min(2).max(30).required(),
  tags: yup.array().of(
    yup.object().shape({
      id: yup.string().min(1).max(20),
    })
  ),
});

const Adv = new Controller({
  model,
  security: {
    list: () => Promise.resolve(),
    view: () => Promise.resolve(),
    post: ({ user }) => {
      return new Promise((resolve, reject) => {
        hasRole(user, [ADMIN, MANAGER, SELLER]) ? resolve({}) : reject();
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
    post: ({ data }) => schema.validate(data),
    put: ({ data }) => schema.pick(Object.keys(data)).validate(data),
  },
  projections: {
    list: { name: true },
    references: { name: true },
    view: { name: true, tags: true },
  },
  hooks: {
    expand: (item) => {
      if (Array.isArray(item.tags)) item.tags = expand(item.tags);
      return item;
    },
    compact: (item) => {
      if (Array.isArray(item.tags)) item.tags = compact(item.tags);
      return item;
    },
  },
});

module.exports = Adv;
