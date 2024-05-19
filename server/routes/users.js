var express = require('express');
var router = express.Router();
const userController = require('../controller/userController')
/* GET users listing. */

router.get('/getPdf/:filename',userController.getPdf)

router.get('/getReports',userController.getReports)

router.post('/search',userController.search)




module.exports = router;
