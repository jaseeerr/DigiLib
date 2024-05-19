

const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const Report = require('../models/reportSchema')
const path = require('path');
const fs = require('fs');


module.exports={
    getPdf:(req,res)=>{
        const filename = req.params.filename+'.pdf';
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

      getReports:async(req,res)=>{
        try {
            const reports = await Report.find().sort({ date: -1 }).limit(10); // adjust the limit as needed
            res.json(reports);
        } catch (error) {
            console.error('Failed to fetch latest reports:', error);
            res.status(500).json({ message: "Failed to retrieve data" });
        }
      },
      search:async(req,res)=>{
        const {keyword,from,to} = req.body

        // Check for required keyword parameter
        if (!keyword) {
            return res.status(400).json({ message: "Keyword query parameter is required." });
        }
    
        // Construct the query in a single line
        const query = {
            keywords: { $regex: keyword, $options: 'i' }, // Case insensitive search for keywords
            ...(from && { publicationYear: { $gte: parseInt(from) } }), // Conditionally add fromYear to the query
            ...(to && { publicationYear: { ...((from && to) ? { $lte: parseInt(to) } : {}), $gte: parseInt(from) } }), // Conditionally add toYear, and manage range if both are present
        };
    
        try {
            const reports = await Report.find(query);
            res.json({data:reports,success:true});
        } catch (error) {
            console.error('Error searching reports:', error);
            res.status(500).json({ message: "Error retrieving reports" });
        }
      },
}