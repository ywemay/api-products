process.env.NODE_ENV = 'test';

require('dotenv-flow').config()

const mongoose = require('mongoose');
const { makeUser, Credentials } = require('ywemay-api-user/test/utils/dummy-users');
const { createUser } = require('ywemay-api-user/controllers/users');
const logIn = require('ywemay-api-test/lib/login');
const User = require('ywemay-api-user/models/user');
const Flood = require('ywemay-api-user/models/flood');
const Product = require('../models/products');
const { createItem } = require('../controllers/products');
const { getItems, getItem } = require('../fake/product');

async function getToken(server, user) {
  try {
    const rez = await logIn({server, credentials: Credentials(user)});
    return rez.body?.token;
  } catch (err) {
    console.error(err);
  }
}

const connect = () => {
  return mongoose.connect(process.env.MONGO_TEST_SERVER, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

const cleanDB = async () => {
  await connect();
  await User.deleteMany({})
  await Flood.deleteMany({})
  await Product.deleteMany({})
}

const getFakeProducts = async () => {
  try {
    const params = { length: 3, currency: 'CNY'};
    let products = [];

    products = await getItems({...params, published: true});
    const unpublished = await getItems({...params, published: false});
    products = await [ ...products, ...unpublished ]
    for (let i = 0; i < products.length; i++) {
      await createItem({data: products[i]});
    }

    products = await Product.find({});
    newProduct = await getItem({...params, published: true});
    return { products, newProduct }
  } catch (err) {
    console.error(err);
  }
}

const populateDB = async ({server, role} = {role: 'admin'}) => {
  try {
    const user = await makeUser(role + '123', [role]);
    await cleanDB();
    await createUser({ data: user });
    token = await getToken(server, user);
    const { products, newProduct } = await getFakeProducts();
    return { token, products, newProduct };
  }
  catch(err) { console.log(err) }
}

module.exports = {
  cleanDB, populateDB
}