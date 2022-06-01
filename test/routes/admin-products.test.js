const { populateDB } = require('../common');
const { 
  server,
  checkListItems,
  checkGetItem,
  checkCreateItem,
  checkModifyItem,
  checkDeleteItem
} = require('../requests')

let token;
let products = [];
let newProduct;


describe('Products management  CRUD routes', () => {
  
  before(async () => {
    const r = await populateDB({server, role: 'admin'});
    token = r.token;
    products = r.products;
    newProduct = r.newProduct;
  })

  describe('Administrator (admin group)', () => {

    it('should list items', (done) => checkListItems({done, token}))
    
    it('should get one item', (done) => checkGetItem({
      done, 
      token,
      item: products[0],
    }))

    it('should create a new item', (done) => checkCreateItem({
      done, 
      token,
      item: newProduct
    }))

    it('should modify manager\'s user account', (done) => checkModifyItem({
      done,
      token,
      item: products[0],
    }));

    it('should delete user account', (done) => checkDeleteItem({
      done, 
      token,
      item: products[1],
    }))
  })
});
