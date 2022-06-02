# Products API

## Installation

```bash
npm i ywemay-api-products
```

## Usage

Standard functionality:

```js
require("dotenv-flow").config();
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(MONGO_LINK, mongooseOptions);

const { authRoutes } = require("ywemay-api-user");
const { productRoutes } = require("ywemay-api-products");

app.use("/auth", authRoutes);
app.use("/products", productRoutes);

const server = http.createServer(app);
// server.listen(process.env.PORT || 3000);

module.exports = server;
```

If custom user access logic is required - create a customer routes (example: routes/product.js) file:

```js
const validators = require("../validators/product");
// check ywemay-api-product/validators/product to see how validator may be written.

const permissions = require("../permissions/products");
// check ywemay-api-product/validators/product to see how permissions may be declared/processed.

const { makeProductRoutes } = require("ywemay-api-products/sets/products");

const router = makeProductRoutes(validators, permissions);
module.exports = router;
```
