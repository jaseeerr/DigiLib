const User = require('../models/userSchema')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const Report = require('../models/reportSchema')
const path = require('path');
const fs = require('fs');
module.exports = {

    signUp: async (req,res) => {
      const {name, email, password} = req.body
        try {
          // Check if the user already exists
          const userExists = await User.findOne({ email: email });
          if (userExists) {
            res.json({status:false,message:"User already exists with that email"})
          }
      
          // Hash the password with argon2
          const hashedPassword = await argon2.hash(password);
      
          // Create a new user
          const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword
          });
      
          // Save the user
          await newUser.save();
          console.log('User registered successfully');
          res.json({success:true,message:"User registered successfully"}) 
        } catch (err) {
          console.error("Error in signUp function:", err.message);
          res.json({success:false,message:"unknown internal error"})
        }
      },
      login: async (req, res) => {
        const {email, password} = req.body;
        console.log(req.body);
        try {
            // Retrieve the user by email
            const user = await User.findOne({ email: email });
            if (!user) {
                return res.json({message:"Email Not Found",success:false});
            }
        
            // Verify the password with argon2
            const validPassword = await argon2.verify(user.password, password);
            if (!validPassword) {
                return res.json({message:"Invalid Password",success:false});
            }
    
            const data1 = JSON.parse(JSON.stringify(user));
            const token = jwt.sign(
                data1,
                process.env.ACCESS_TOKEN_SECRET
            );
        
            console.log('User logged in successfully');
            res.json({message:"User logged in successfully",success:true,token});
        } catch (err) {
            console.error("Error in login function:", err.message);
            res.status(500).json({message:"Internal Error",success:false}); // Also set proper HTTP status code
        }
    },
      uploadPdf:async(req,res)=>{
        try {
          if (req.file) {
              res.status(200).json({
                success:true,
                  message: 'File uploaded successfully!',
                  filename: req.file.filename,
                  filepath: req.file.path
              });
          } else {
              res.status(400).json({sucess:false,message:"Error Uploading"});
          }
      } catch (error) {
          res.status(500).json({sucess:false,message:"Error Uploading"});
      }

      },
      uploadReport:async(req,res)=>{
        console.log(req.body)
        try {
          const newReport = new Report({
              reportId: req.body.reportId,
              title: req.body.title,
              content: req.body.content,  // Store the file path
              publicationYear: parseInt(req.body.publicationYear),
              keywords: req.body.keywords,
              ownerId: req.user._id,
              ownerName: req.user.name
          });
  
          await newReport.save();
          res.status(201).json({ message: "Report uploaded successfully!", success: true });
      } catch (error) {
          console.error('Error saving report:', error);
          res.status(500).json({ message: error.message });
      }
      },


      getPdf:(req,res)=>{
        const filename = req.params.filename;
    const filePath = path.join(__dirname, 'public', 'reports', filename);

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('File does not exist:', filePath);
            return res.status(404).send('File not found');
        }

        console.log("Sending file:", filePath);
        res.sendFile(filePath, err => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Internal Server Error');
            }
        });
    });
      },

      getMyReport:async(req,res)=>{

        try {
          let x= req.user._id
          x = x.toString()
          console.log(x);
          const data = await Report.find({ownerId:x}).sort({ date: -1 })
          res.json({data,success:true})
        } catch (error) {
          console.log(error.message)
          res.json({success:false})
        }

      },
      deleteReport:async(req,res)=>{
        try {
               const data = await Report.findByIdAndDelete(req.params.id)
               res.json({success:true})     
        } catch (error) {
          console.log(error.message)
          res.json({success:false})
        }
      }

}