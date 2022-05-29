const { faker } = require('@faker-js/faker');

const fakeImages = async () => {
  const count = await faker.mersenne.rand(1, 6);
  const images = [];
  for (let i = 0; i < count; i++) {
    const src = await faker.random.alphaNumeric(32);
    await images.push(src);
  }
  return images;
}

const fakeOptionsLine = async () => {
  const options = [];
  const count = await faker.mersenne.rand(1, 6);
  for (let i = 0; i < count; i++) {
    await options.push({
      image: await faker.random.alphaNumeric(32),
      key: await faker.random.alphaNumeric(8),
      title: await faker.commerce.productName(),
      exclude: await faker.lorem.words(3).split(' '),
      limit: await faker.lorem.words(3).split(' '),
      priceChange: await faker.datatype.number({ min: 0, max: 25})
    })
  }
  return options;
}

const fakeOptions = async () => {
  const options = [];
  const count = await faker.mersenne.rand(1, 6);
  for (let i = 0; i < count; i++) {
    await options.push(await fakeOptionsLine())
  }
  return options;
}

exports.getItem = async ({lng, published, currency} = {lng: "en"}) => {
  try {
    faker.locale = lng || 'en';

    const len = {
      sku: await faker.mersenne.rand(2, 20),
      images: await faker.mersenne.rand(1, 8),
      keywords: await faker.mersenne.rand(1, 9),
    }
    
    const keywords = await faker.lorem.words(len.keywords).split(' ');

    const item = {
      sku: await faker.lorem.word(len.sku),
      title: await faker.commerce.productName(),
      images: await fakeImages(),
      keywords: await keywords,
      description: await faker.commerce.productDescription(),
      options: await fakeOptions(),
      price: await faker.datatype.number({min: 300, max: 36000}),
      cucurrency: currency || await faker.finance.currencyCode(),
      published: published !== undefined ? published : await faker.datatype.boolean(),
    }

    return item;
  } catch(e) {
    console.error(e);
  }
}

exports.getItems = (params) => {
  const { length } = params
  return new Promise(async (resolve, reject) => {
    try {
      items = [];
      for (let i = 0; i < (length || 2); i++) {
        await items.push(await exports.getItem(params));
      }
      resolve(items);
    }
    catch(err) {
      reject(err);
    }
  })
}
