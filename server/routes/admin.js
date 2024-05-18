var express = require('express');
var router = express.Router();
const adminController = require('../controller/adminController')
const upload = require('../controller/multer'); 
const auth = require('../auth/auth')

/* GET home page. */
router.post('/signup', adminController.signUp);

router.post('/login', adminController.login);

router.post('/uploadPdf',auth.userAuth, upload.single('pdfFile'), adminController.uploadPdf);

router.post('/uploadReport',auth.userAuth,adminController.uploadReport)

router.get('/getPdf/:filename',adminController.getPdf)






module.exports = router;
