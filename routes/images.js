const router = require("express").Router();
const { viewImage } = require('ywemay-api-img-upload');

const UPLOADS = (process.env.UPLOADS || __dirname.split('node_modules/')[0] + 'uploads') + '/product';

router.get("/:fileName", viewImage({ path: UPLOADS }));
router.get("/thumb/:fileName", viewImage({ path: UPLOADS + '/thumb' }));

module.exports = router;