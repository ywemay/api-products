const yup = require('yup');

const schemaAndKeys = (schema, keys) => {
  return {
    schema: schema.pick(keys),
    keys,
  }
}

const OPTION_SHAPE = {
  image: yup.string().max(255).required(),
  key: yup.string().max(25).required(),
  title: yup.string().max(255).required(),
  exclude: yup.array().of(yup.string().max(25).required()),
  limit: yup.array().of(yup.string().max(25).required()),
  priceChange: yup.number(),
}

const SHAPE = {
  sku: yup.string().min(1).max(25).required(),
  title: yup.string().min(3).max(225).required(),
  images: yup.array().of(yup.string().max(255)),
  keywords: yup.array().of(yup.string().max(35)),
  description: yup.string(),
  options: yup.array().of(yup.array().of(yup.object().shape(OPTION_SHAPE))),
  price: yup.number().min(0),
  currency: yup.string().min(1).max(5),
  published: yup.boolean(),
};

const schema = yup.object().shape(SHAPE);
const option_schema = yup.object().shape(OPTION_SHAPE);

module.exports = {
  schema,
  option_schema,

  postSchema: () => {
    const keys = Object.keys(SHAPE);
    return schemaAndKeys(schema, keys);
  },

  putSchema: ({req}) => {
    const pickKeys = Object.keys(req.body);
    return schema.pick(pickKeys);
  }
}
