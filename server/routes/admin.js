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

router.get('/getMyReport',auth.userAuth,adminController.getMyReport)

router.get('/deleteReport/:id',auth.userAuth,adminController.deleteReport)

router.post('/deleteMultipleReports',auth.userAuth,adminController.deleteMultipleReports)

router.post('/updateReport',auth.userAuth,adminController.updateReport)












module.exports = router;
