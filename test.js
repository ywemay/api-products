const { getItems } = require('./fake/product');

getItems({ length: 3, published: true}).then((items) => {
  console.log('Published items', items);
  getItems({ length: 3, published: false, currency: 'CNY'}).then((items) => {
    console.log('Unpublished items', items);
  })
});