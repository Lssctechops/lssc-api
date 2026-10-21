require("dotenv").config(); 
// library's
const  express =  require("express");
const mongoose = require('mongoose');
const cors = require('cors'); 

// custom imports
const routes  =  require("./routes/admin");
const auth  = require("./routes/authOtp");
const media  = require("./routes/media");
const assessorRoutes  =  require("./routes/assessor");
const trainerRoutes  =  require("./routes/trainer");
const publicRoutes  =  require("./routes/public");


// config
const config  =  require("./config");

const app  =  express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

mongoose.connect(config.database.dbConnectionString)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));



app.get("/",(req,res)=>{
    res.json({  "message":"LSSC api is running"})
})

app.use("/api/admin",routes);
app.use("/api/media",media);
app.use("/api/auth",auth);
app.use("/api/assessor", assessorRoutes);
app.use("/api/trainer", trainerRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/seed", require("./routes/seed"));



app.use((req,res)=>{
     res.status(404).json({"message":"route not found"})
})

app.listen(config.http.port , ()=>{
     console.log("Server started successfully at port " + config.http.port)
})


