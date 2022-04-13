const express = require('express')
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
var mysql = require('mysql');

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Chisql@27",
    database: "laundromat"
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

// app.get('/api',(req,res)=>{
//     const sqlInsert = "INSERT INTO cust VALUES ('Katta',69),('Katta2',80);";
//     const sqlSelect = "SELECT * from cust;";
      
//     db.query(sqlSelect, function (error, results, fields) {
//         if (error) res.send('Error in connecting Database!');
//         res.send(results);
//     });

//     // db.query(sqlInsert, function (error, results) {
//     //     if (error) res.send(error);
//     //     else res.send(results);
//     // });

// })
//******************LOGIN
app.post('/api/login', (req,res) =>{
    const user = req.query.user;
    const id = req.body.id;
    const pass = req.body.pass;

    const sqlSelectStudent = `SELECT * from users WHERE Userpassword='${pass}' AND Email='${id}';`;
    const sqlManagerSelect = `SELECT * from manager WHERE ManagerPassword='${pass}' AND ManagerLogin='${id}';`;

    if(user==='student')
    {
        db.query(sqlSelectStudent, function (error, results) {
            if (error) res.send(error);
            else res.send(results);
        });
    }
    else
    {
        db.query(sqlManagerSelect, function (error, results) {
            if (error) res.send(error);
            else res.send(results);
        });
    }

});

//******************USER
app.post('/api/orderdetails', (req,res) =>{
    const UID = req.body.UID;

    const sqlSelectOrderTable = `SELECT * from order_details WHERE UID='${UID}' ORDER BY Submission_Date DESC;`;

    db.query(sqlSelectOrderTable, function (error, results) {
        if (error) res.send(error);
        else res.send(results);
    });
    
});

app.post('/api/packagedetails', (req,res) =>{
    const PID = req.body.PID;

    const sqlSelectPackage = `SELECT * from packages WHERE PID='${PID}';`;

    db.query(sqlSelectPackage, function (error, results) {
        if (error) res.send(error);
        else res.send(results);
    });
    

});

app.post('/api/placeOrder', (req,res) =>{
    const Uid = req.body.UID;
    const Weight = req.body.Weight;
    const Lid = req.body.LID;
    const Pid = req.body.PID;
    const OrderID = req.body.OrderID;

    const sqlPlaceOrder = `CALL ADD_ORDER('${OrderID}',${Weight},'${Uid}','${Pid}','${Lid}')`;

    db.query(sqlPlaceOrder, function (error, results) {
        if (error) res.send(error);
        else res.send(results);
    });
});

app.post('/api/userInfo', (req,res) =>{
    const Uid = req.body.UID;

    const sqlSelectStudent = `SELECT * from users WHERE UID='${Uid}';`;

    db.query(sqlSelectStudent, function (error, results) {
        if (error) res.send(error);
        else res.send(results);
    });
});



//******************************MANAGER
app.get('/api/manager/order', (req,res) =>{

    const sqlSelectOrders = `SELECT * from order_details WHERE OStatus=0;`;

    db.query(sqlSelectOrders, function (error, results) {
        if (error) res.send(error);
        else res.send(results);
    });
});

app.get('/api/manager/allorder', (req,res) =>{

    const sqlSelectOrders = `SELECT * from order_details;`;

    db.query(sqlSelectOrders, function (error, results) {
        if (error) res.send(error);
        else res.send(results);
    });
});


app.get('/api/manager/allemp', (req,res) =>{

    const sqlSelectEmp = `SELECT * from employee;`;

    db.query(sqlSelectEmp, function (error, results) {
        if (error) res.send(error);
        else res.send(results);
    });
});

app.get('/api/manager/allcust', (req,res) =>{

    const sqlSelectEmp = `SELECT * from users;`;

    db.query(sqlSelectEmp, function (error, results) {
        if (error) res.send(error);
        else res.send(results);
    });
});

app.post('/api/manager/updatewash', (req,res) =>{
    const OrderID = req.body.OrderID;

    const sqlUpdateWash = `UPDATE order_details SET Actual_Delivery_Date=curdate(), OStatus=1 WHERE OrderID='${OrderID}'`;

    db.query(sqlUpdateWash, function (error, results) {
        if (error) res.send(error);
        else res.send(results);
    });
});


app.listen(3001,() => {
    console.log('API IS Running at http://localhost:3001');
})