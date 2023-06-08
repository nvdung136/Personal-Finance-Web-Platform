const express = require('express');
const bodyParser = require('body-parser');
const app = express();
let sql;
const url = require('url');
const { error } = require('console');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('../DB/PersonalFinance.db',sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err);
});

// Middle ware 
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  })

//post request
app.post("/postNew", (req,res) => {
    try {
        const {date, amount, purpose, account, categorized} = req.body;
        console.log(req.body);
        console.log({date, amount, purpose, account, categorized});
        sql = "INSERT INTO TransactionTable(date,amount,purpose,account,categorized) VALUES (?,?,?,?,?)";
        db.run(sql, [date, amount, purpose, account, categorized], (err) => {
            console.log(sql,[date, amount, purpose, account, categorized])
            if(err) return res.json({status: 300, success: false ,error: err, data:req.body});
            return res.json({status: 200,success: true,});
            });
        } 
    catch (error){
        return res.json({
            status: 400,
            success: false,
        });
    }
 });

//get request
app.get("/fetch", (req,res) => {
    sql = "SELECT * FROM TransactionTable WHERE strftime('%Y-%m',Date) = '2023-05' ORDER by date(Date)";
    try {
        db.all(sql,(err,rows) =>{
            if(err) return res.json({status: 300, success: false ,error: err});

            if(rows.length<1) return res.json({ status:300, success: false, error:"No match"});

            return res.json({status: 200, data:rows, success: true})
        });
    }
    catch (error){
        return res.json({
            status: 400,
            success: false,
        });
    }
});
app.listen(3000);