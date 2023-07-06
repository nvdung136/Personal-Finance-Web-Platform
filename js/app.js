const express = require('express');
const bodyParser = require('body-parser');
const app = express();
let sql;
const url = require('url');
const { error } = require('console');
const { promises } = require('dns');
const { resolve } = require('path');
const { rejects } = require('assert');
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

//post new request
app.post("/postNew",async (req,res) => {
    const RecordData = req.body;
    try {
        for (let i = 0; i < RecordData.length;i++)
            {
                const {date, amount, purpose, account, categorized} = RecordData[i];
                sql = "INSERT INTO TransactionTable(date,amount,purpose,account,categorized) VALUES (?,?,?,?,?)";
                var Q_Res = await UpdateQuery(sql,[date, amount, purpose, account, categorized]);
                if (Q_Res != true) return res.json({status: 300, success: false ,error:Q_Res , data:req.body});
            }
            return res.json({status: 200,success: true,});
        } 
    catch (error){
        return res.json({
            status: 400,
            success: false,
        });
    }
 });

 //post update request 
 app.post("/update",async (req,res)=> {
    const updateData = req.body;
    var baseSQL = "UPDATE TransactionTable SET"
    try{
        for (let i = 0; i< updateData.length; i++)
            {
                var ID = ``;
                var SQLline = ``;
                var SQLcond = ``;
                for (const key in updateData[i]){   
                    switch (key){
                        case ('ID'): 
                        SQLcond = ` WHERE ID = ${updateData[i][key]}`;
                        break;
                        case ('amount'): 
                        SQLline += ` ${key} = ${updateData[i][key]},`;
                        break;
                        default:
                        SQLline += ` ${key} = '${updateData[i][key]}',`;
                    }}
                SQLline = SQLline.slice(0,-1);
                sql = baseSQL + SQLline + SQLcond;
                var Q_Res = await UpdateQuery(sql,[]);
                if (Q_Res != true) return res.json({status: 300, success: false ,error:Q_Res , data:req.body});
            }
            return res.json({status: 200,success: true,});
        }
    catch (error) {
                return res.json({
                    status: 400,
                    success: false,});
            }
 });

app.post("/delete",async (req,res) => {
    const Del_list = req.body;
    try
    {
        for(let i = 0; i<Del_list.length; i++)
        {
            sql = `DELETE FROM TransactionTable WHERE ID = ${Del_list[i]}`; 
            var Q_Res = await UpdateQuery(sql,[]);
            if (Q_Res != true) return res.json({status: 300, success: false ,error:Q_Res , data:req.body});
        }
        return res.json({status: 200,success: true,});
    }
    catch (error) {
        return res.json({
            status: 400,
            success: false,});
        }
});

//get request
app.get("/fetch/:period", async (req,res) => {
    fperiod = req.params.period;
    sql = [ `SELECT * FROM TransactionTable WHERE strftime('%Y-%m',Date) = '${fperiod}' ORDER by date(Date)`,
            `SELECT SUM(Amount) AS total FROM TransactionTable WHERE strftime('%Y-%m',Date) <= '${fperiod}'`,
            `SELECT SUM(Amount) AS period FROM TransactionTable WHERE strftime('%Y-%m',Date) = '${fperiod}'`]
    try {
        const Rdata = await QueryIt(sql[0]);
        const Total_Rmder = await QueryIt(sql[1]);
        const Month_Rmder = await QueryIt(sql[2]);
        if(Rdata.length<1)  return res.json({status: 300, total:Total_Rmder, success: false}); 
        return res.json({
            status: 200,
            success: true,
            data:Rdata,
            total:Total_Rmder,
            month:Month_Rmder,
        });
    }

    catch (error){
        return res.json({
            status: 400,
            success: false,
        });
    }
});

function QueryIt (Queryline){
    return new Promise((resolve,reject)=> {
        db.all(Queryline,(err,rows) =>{
            if(err) reject(err);
            else resolve(rows);
        })
    })
}

function UpdateQuery (Queryline,Para){
    return new Promise((resolve,reject) =>
    db.all(Queryline,Para,(err)=>{
        if(err) reject(err);
        else resolve(true);
    })
)}
app.listen(3000);