const express = require('express');
const bodyParser = require('body-parser');
const app = express();
let sql;
const url = require('url');
const { error } = require('console');
const { promises } = require('dns');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('../DB/PersonalFinance_TestnGitHub.db',sqlite.OPEN_READWRITE, (err) => {
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
app.post("/rcd_postNew",async (req,res) => {
    const RecordData = req.body;
    try {
        for (let i = 0; i < RecordData.length;i++)
            {
                const {date, amount, purpose, account, categorized} = RecordData[i];
                sql = "INSERT INTO TransactionTable(date,amount,purpose,account,categorized) VALUES (?,?,?,?,?)";
                db.run(sql, [date, amount, purpose, account, categorized], (err) => {
                if(err) return res.json({status: 300, success: false ,error: err, data:req.body});});
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
 app.post("/rcd_update", (req,res)=> {
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
                db.run(sql, (err) => {
                    if(err) return res.json({status: 300, success: false ,error: err, data:req.body});
                });
            }
            return res.json({status: 200,success: true,});
        }
    catch (error) {
                return res.json({
                    status: 400,
                    success: false,});
            }
 });

app.post("/rcd_delete", (req,res) => {
    const Del_list = req.body;
    try
    {
        for(let i = 0; i<Del_list.length; i++)
        {
            sql = `DELETE FROM TransactionTable WHERE ID = ${Del_list[i]}`; 
            db.run(sql, (err) => {
                if(err) return res.json({status: 300, success: false ,error: err, data:req.body});
            });
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
app.get("/trnst_fetch/:period", async (req,res) => {
    fperiod = req.params.period;
    sql = [ `SELECT * FROM TransactionTable WHERE strftime('%Y-%m',Date) = '${fperiod}' ORDER by date(Date)`,
            `SELECT SUM(Amount) AS total FROM TransactionTable WHERE strftime('%Y-%m',Date) <= '${fperiod}'`,
            `SELECT SUM(Amount) AS period FROM TransactionTable WHERE strftime('%Y-%m',Date) = '${fperiod}'`,
            `SELECT Account,SUM(Amount) AS Amount FROM TransactionTable WHERE strftime('%Y-%m',Date) <= '${fperiod}' GROUP BY Account`,
            `SELECT Account,SUM(Amount) AS Amount FROM TransactionTable WHERE strftime('%Y-%m',Date) = '${fperiod}' GROUP BY Account`,
        ]
    
    try {
        const Rdata = await QueryIt(sql[0]);
        const Total_Rmder = await QueryIt(sql[1]).then(res => {return res[0].total});
        const Month_Rmder = await QueryIt(sql[2]).then(res => {return res[0].period});
        const  T_Acc_Rmder = await QueryIt(sql[3])
        const M_Acc_Rmder = await QueryIt(sql[4])
        if(Rdata.length<1)  return res.json({status: 300, total:Total_Rmder, success: false}); 
        return res.json({
            status: 200,
            total:Total_Rmder,
            month:Month_Rmder,
            success: true,
            data:Rdata,
            T_acc:T_Acc_Rmder,
            M_acc: M_Acc_Rmder,
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
app.listen(3000);