const chai = require('chai');
require('chai').should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('./server');

const uri = '/products';
const headers = { "content-type": "application/json" }

exports.server = server;

exports.checkListItems = ({done, token, products, status = 200}) => {
  chai.request(server)
  .get(uri)
  .set({"x-token": token, ...headers})
  .end((err, res) => {
    if (!err) {
      res.status.should.be.eq(status);
      if (status === 200) {
        res.body.items.should.be.an('array');
        res.body.items[0].should.be.a('object');
        if (products) {
          res.body.items.length.should.be.equal(products.length);
        }
      }
      done();
    }
    else {
      console.error(err);
    }
  })
}

exports.checkGetItem = ({done, token, item, status = 200}) => {
  const url = uri + '/' + item._id.toString();
  chai.request(server)
  .get(url)
  .set({"x-token": token, ...headers})
  .end((err, res) => {
    if (!err) {
      res.status.should.be.eq(status);
      if (status === 200) {
        res.body.item.should.be.an('object');
        res.body.item.title.should.be.eq(item.title);
      }
      done();
    }
  })
}

exports.checkCreateItem = ({done, token, item, status = 200}) => {
  chai.request(server)
  .post(uri)
  .set({"x-token": token, ...headers})
  .send(item)
  .end((err, res) => {
    if (!err) {
      res.status.should.be.eq(status);
      if (status === 200) {
        res.body.createdItem.should.be.an('object');
        res.body.createdItem._id.should.be.a('string');
      }
      done();
    }
  })
}

exports.checkModifyItem = ({done, token, item, status = 200}) => {
  chai.request(server)
  .put(uri + '/' + item._id.toString())
  .set({"x-token": token, ...headers})
  .send({ops: {published: true, title: 'Modified Product'}})
  .end((err, res) => {
    if (!err) {
      res.status.should.be.eq(status);
      if (status === 200) {
        res.body.ops.should.be.an('object');
        res.body.result.should.be.an('object');
      }
      done();
    }
  })
}

exports.checkDeleteItem = ({done, item, token, status = 200}) => {
  chai.request(server)
  .delete(uri + '/' + item._id.toString())
  .set({"x-token": token, ...headers})
  .end((err, res) => {
    if (!err) {
      res.status.should.be.eq(status);
      done();
    }
  })
}