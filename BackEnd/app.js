require("dotenv").config();
const cors = require("cors");

const express = require("express");
const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

const path = require("path");

app.use("/Uploads", express.static(path.join(__dirname, "Uploads")));

app.use(express.json());

app.get('/test',(req,res)=>{
    res.json({msg:'test'})
});

const connect = require("./Config/db")
connect();

const adminRoutes = require("./Routes/usersRoutes");
const glRoutes = require("./Routes/glRoutes");
const accperRoutes = require("./Routes/accperRoutes");
const jour_lRoutes = require("./Routes/Journal_lRoutes");
const jour_HRoutes = require("./Routes/JournalHRoutes");
const vendorRoutes = require("./Routes/vendorRoutes");
const ap_invoicesRoutes = require("./Routes/ap_invoicesRoutes");
const ap_invoiceslinesRoutes = require("./Routes/ap_invoice_linesRoutes");
const Ap_paymentsRoutes = require("./Routes/ap_paymentsRoutes");
const customerRoutes = require("./Routes/customerRoutes");
const ar_invoicesRoutes = require("./Routes/ar_invoicesRoutes");
const ar_receiptsRoutes = require("./Routes/ar_receiptsRoutes");


app.use('/api/dashboard', adminRoutes)
app.use('/api/gl', glRoutes);
app.use('/api/accper', accperRoutes);
app.use('/api/jour_l', jour_lRoutes);
app.use('/api/jour_h', jour_HRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/ap_invoices', ap_invoicesRoutes);
app.use('/api/ap_invoiceslines', ap_invoiceslinesRoutes);
app.use('/api/ap_payment', Ap_paymentsRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/ar_invoices', ar_invoicesRoutes);
app.use('/api/ar_receipts', ar_receiptsRoutes);

const port = process.env.PORT || 3000;
    
app.listen(port,()=>{
    console.log("Server Running");
});