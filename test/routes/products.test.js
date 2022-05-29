const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { server, users, getToken, cleanDB, createUser } = require('ywemay-api-user/test/common');
const { createItem } = require('../../controllers/products');
const Product = require('../../models/products');

const { getItems } = require('../../fake/product');


const tokens = {};

const uri = '/products';
const headers = { "content-type": "application/json" }

const newItem = {
  sku: 'PRO1',
  title: 'New product',
}

const checkListItems = ({done, token, status = 200}) => {
  chai.request(server)
  .get(uri)
  .set({"x-token": tokens, ...headers})
  .end((err, res) => {
    if (!err) {
      res.status.should.be.eq(status);
      if (status !== 200) {
        res.body.items.should.be.an('array');
        res.body.items[0].should.be.a('object');
        res.body.items.length.should.be.equal(4);
      }
      done();
    }
  })
}

const checkGetItem = ({done, token, status = 200}) => {
  chai.request(server)
  .get(uri + '/' + managerId)
  .set({"x-token": tokens.admin, ...headers})
  .end((err, res) => {
    if (!err) {
      res.status.should.be.eq(status);
      if (status !== 200) {
        res.body.item.should.be.an('object');
        res.body.item.title.should.be.eq(newItem.title);
      }
      done();
    }
  })
}

let fakeProducts = [];

describe('Products management  CRUD routes', () => {
  
  beforeEach(async () => {
    await cleanDB();
    await createUser({ data: users.admin });
    await createUser({ data: users.manager });
    await createUser({ data: users.customer });
    tokens.admin = await getToken(users.admin);
    tokens.manager = await getToken(users.manager);
    tokens.customer = await getToken(users.customer);
    
    const params = { length: 3, currency: 'CNY'};

    console.log('Generating fake products...');
    fakeProdusts = await getItems({...params, published: true});
    const unpublished = await getItems({...params, published: false});
    fakeProdusts = await { ...fakeProdusts, unpublished}
    console.log('Removing all products from db...');
    await Product.deleteMany({});
    console.log('Saving fake products in db...');
    for (let i = 0; i < fakeProducts.length; i++) {
      await createItem({data: fakeProducts[i]});
    }

    fakeProducts = await Product.find({});
  })

  describe('Administrator (admin group)', () => {

    const token = tokens.admin;

    it('should list items', (done) => checkListItems({done, token}))
    
    it('should get one item', (done) => checkGetItem({done, token}))

    it('should create a new user', (done) => {
      chai.request(server)
      .post(uri)
      .set({"x-token": tokens.admin, ...headers})
      .send(users.secretary)
      .end((err, res) => {
        if (!err) {
          res.status.should.be.eq(200);
          done();
        }
      })
    })

    it('should modify manager\'s user account', (done) => {
      chai.request(server)
      .put(`${uri}/${managerId}`)
      .set({"x-token": tokens.admin, ...headers})
      .send({ops: {enabled: false}})
      .end((err, res) => {
        if (!err) {
          res.status.should.be.eq(200);
          res.body.ops.should.be.an('object');
        }
        else console.error(err);
        done();
      })
    });

    it('should delete user account', (done) => {
      chai.request(server)
      .delete(uri + '/' + managerId)
      .set({"x-token": tokens.admin, ...headers})
      .end((err, res) => {
        if (!err) {
          res.status.should.be.eq(200);
          done();
        }
        else console.error(err);
      })
    })
  })


  describe('manager (manager group)', () => {

    it('should list users', (done) => {
      chai.request(server)
      .get(uri)
      .set({"x-token": tokens.manager, ...headers})
      .end((err, res) => {
        if (!err) {
          res.status.should.be.eq(200);
          res.body.items.should.be.an('array');
          res.body.items[0].should.be.a('object');
          res.body.items.length.should.be.equal(2);
          done();
        }
      })
    })
    
    it('should get one user', (done) => {
      chai.request(server)
      .get(uri + '/' + managerId)
      .set({"x-token": tokens.manager, ...headers})
      .end((err, res) => {
        if (!err) {
          res.status.should.be.eq(200);
          res.body.item.should.be.an('object');
          res.body.item.username.should.be.eq('manager');
          done();
        }
      })
    })

    it('should create a new user', (done) => {
      chai.request(server)
      .post(uri)
      .set({"x-token": tokens.manager, ...headers})
      .send(users.secretary)
      .end((err, res) => {
        if (!err) {
          res.status.should.be.eq(200);
          done();
        }
      })
    })

    it('should modify manager\'s user account', (done) => {
      chai.request(server)
      .put(`${uri}/${managerId}`)
      .set({"x-token": tokens.manager, ...headers})
      .send({ops: {enabled: false}})
      .end((err, res) => {
        if (!err) {
          res.status.should.be.eq(200);
          res.body.ops.should.be.an('object');
        }
        else console.error(err);
        done();
      })
    });

    it('should delete user account', (done) => {
      chai.request(server)
      .delete(uri + '/' + managerId)
      .set({"x-token": tokens.manager, ...headers})
      .end((err, res) => {
        if (!err) {
          res.status.should.be.eq(200);
          done();
        }
        else console.error(err);
      })
    })
  })


  describe('customer (customer group)', () => {

    it('should not list users', (done) => {
      chai.request(server)
      .get(uri)
      .set({"x-token": tokens.customer, ...headers})
      .end((err, res) => {
        if (!err) {
          res.status.should.be.eq(403);
          done();
        }
      })
    })
    
    it('should not get one user', (done) => {
      chai.request(server)
      .get(uri + '/' + managerId)
      .set({"x-token": tokens.customer, ...headers})
      .end((err, res) => {
        if (!err) {
          res.status.should.be.eq(403);
          done();
        }
      })
    })

    it('should not create a new user', (done) => {
      chai.request(server)
      .post(uri)
      .set({"x-token": tokens.customer, ...headers})
      .send(users.secretary)
      .end((err, res) => {
        if (!err) {
          res.status.should.be.eq(403);
          done();
        }
      })
    })

    it('should not modify manager\'s user account', (done) => {
      chai.request(server)
      .put(`${uri}/${managerId}`)
      .set({"x-token": tokens.customer, ...headers})
      .send({ops: {enabled: false}})
      .end((err, res) => {
        if (!err) {
          res.status.should.be.eq(403);
        }
        else console.error(err);
        done();
      })
    });

    it('should not delete user account', (done) => {
      chai.request(server)
      .delete(uri + '/' + managerId)
      .set({"x-token": tokens.customer, ...headers})
      .end((err, res) => {
        if (!err) {
          res.status.should.be.eq(403);
          done();
        }
        else console.error(err);
      })
    })
  })

  describe('anonymous (not logged in)', () => {

    it('should not list users', (done) => {
      chai.request(server)
      .get(uri)
      .set({...headers})
      .end((err, res) => {
        if (!err) {
          res.status.should.be.eq(401);
          done();
        }
      })
    })
    
    it('should not get one user', (done) => {
      chai.request(server)
      .get(uri + '/' + managerId)
      .set({...headers})
      .end((err, res) => {
        if (!err) {
          res.status.should.be.eq(401);
          done();
        }
      })
    })

    it('should not create a new user', (done) => {
      chai.request(server)
      .post(uri)
      .set({...headers})
      .send(users.secretary)
      .end((err, res) => {
        if (!err) {
          res.status.should.be.eq(401);
          done();
        }
      })
    })

    it('should not modify manager\'s user account', (done) => {
      chai.request(server)
      .put(`${uri}/${managerId}`)
      .set({...headers})
      .send({ops: {enabled: false}})
      .end((err, res) => {
        if (!err) {
          res.status.should.be.eq(401);
        }
        else console.error(err);
        done();
      })
    });

    it('should not delete user account', (done) => {
      chai.request(server)
      .delete(uri + '/' + managerId)
      .set({...headers})
      .end((err, res) => {
        if (!err) {
          res.status.should.be.eq(401);
          done();
        }
        else console.error(err);
      })
    })
  })
})