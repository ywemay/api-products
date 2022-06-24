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
  
  beforeEach(async () => {
    const r = await populateDB({server, role: 'customer'});
    token = r.token;
    products = r.products;
    newProduct = r.newProduct;
  })

  describe('Customer (customer group)', () => {

    it('should list items', (done) => checkListItems({done, token}))
    
    it('should get one item', (done) => checkGetItem({
      done, 
      token,
      item: products[0],
    }))

    it('should not create a new item', (done) => checkCreateItem({
      done, 
      isCustomer: true,
      token,
      item: newProduct,
      status: 403
    }))

    it('should not modify manager\'s user account', (done) => checkModifyItem({
      done,
      token,
      item: products[0],
      status: 403
    }));

    it('should not delete user account', (done) => checkDeleteItem({
      done, 
      token,
      item: products[1],
      status: 403
    }))
  })
});
