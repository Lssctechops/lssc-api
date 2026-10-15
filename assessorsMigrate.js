const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust path to your User model
const config = require('./config'); // Adjust path to your config if needed


// MongoDB Connection
mongoose.connect(config.database.dbConnectionString).then(() => {
  console.log('MongoDB connected');
  importCSV();
}).catch(console.error);

// CSV path
const csvFilePath = path.join(__dirname, 'assessor-Sheet1.csv');

// Read and import
function importCSV() {
  const assessors = [];
  let lastAssessor = null;

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      const employeeId = row['User ID']?.trim();
      if (employeeId) {
        // New assessor row
        const assessor = {
          employeeId,
          name: row['User Name'].trim(),
          category: row['User Category'].trim(),
          email: row['Email id'].trim(),
          mobile: row['Mobile Number'].trim(),
          role: 'assessor',
          specialization: `${row['QP name'].trim()} (${row['QP Code'].trim()})`,
          status: 'active',
          isApproved: true,
          isVerified: true,
        };
        assessors.push(assessor);
        lastAssessor = assessor;
      } else if (lastAssessor) {
        // Additional QP row, append to specialization
        lastAssessor.specialization += `, ${row['QP name'].trim()} (${row['QP Code'].trim()})`;
      }
    })
    .on('end', async () => {
      console.log(`Read ${assessors.length} assessors from CSV`);
      for (const assessor of assessors) {
        try {
          const exists = await User.findOne({ employeeId: assessor.employeeId });
          if (!exists) {
            await User.create(assessor);
            console.log(`Inserted: ${assessor.name}`);
          } else {
            console.log(`Skipped (exists): ${assessor.name}`);
          }
        } catch (err) {
          console.error(`Error inserting ${assessor.name}:`, err.message);
        }
      }
      console.log('Import completed');
      mongoose.disconnect();
    });
}