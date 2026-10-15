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

// CSV file path
const csvFilePath = path.join(__dirname, 'trainer-Sheet1.csv');

// Read and import function
function importCSV() {
  const trainers = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      const trainer = {
        employeeId: row['User ID'].trim(),
        name: row['User Name'].trim(),
        gender: row['Gender'].trim(),
        dateOfBirth: formatDate(row['Date of Birth'].trim()),
        category: row['User Category'].trim(),
        email: row['Email id'].trim(),
        mobile: row['Mobile Number'].trim(),
        role: 'trainer',
        specialization: row['QP name'].trim(),
        status: 'active',
        isApproved: true,
        isVerified: true
      };
      trainers.push(trainer);
    })
    .on('end', async () => {
      console.log(`Read ${trainers.length} trainers from CSV`);

      for (const trainer of trainers) {
        try {
          const exists = await User.findOne({ employeeId: trainer.employeeId });
          if (!exists) {
            await User.create(trainer);
            console.log(`Inserted: ${trainer.name}`);
          } else {
            console.log(`Skipped (exists): ${trainer.name}`);
          }
        } catch (err) {
          console.error(`Error inserting ${trainer.name}:`, err.message);
        }
      }
      mongoose.disconnect();
    });
}

// Format date from DD-MM-YYYY to Date object
function formatDate(dateStr) {
  if (!dateStr || dateStr === 'Invalid Date') {
    return undefined; // Handle invalid or empty date
  }
  const [dd, mm, yyyy] = dateStr.split('-');
  return new Date(`${yyyy}-${mm}-${dd}`);
}
