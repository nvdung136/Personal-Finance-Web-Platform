// * OPERATION
const SrvDmn = (window.location.hostname != '') ? `http://${window.location.hostname}` : 'http://localhost'; 
const portNO = 3000;
const TCK_list = document.getElementById('TCK_list')
const FNC_name = document.getElementById('Func_Name')
const Main_Pnl = document.getElementById('Main_Analysis')
const WL_box = document.getElementById('WL_TCK_2_add')
var Cur_CW_lst = []
var WL_JS = []

// Page content 
const CW_HTML = `<div class="w3-half w3-left">
<div>
  <table class="w3-table-all sortable w3-light-grey w3-padding-16" style=" font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;" id="CW_Tbl_A">
    <thead>
      <tr style="position: sticky; top: 0;">
        <th>TCK</th>
        <th style="text-align: right">Price</th>
        <th style="text-align: center">Ratio</th>
        <th>ITM</th>
        <th class="num"><button style="text-align: center">D_left</button></th>
        <th style="text-align: center">BSM_prc</th>
        <th class="num"><button style="text-align: center">Dif*</button></th>
      </tr>
    </thead>
    <tbody id="CW_Tbl_B">
    </tbody>
  </table>
</div>
</div>`

const _WL_HTML = `<div class="w3-half w3-right w3-light-blue">
        <div>
          <table class="w3-table-all sortable w3-light-grey w3-padding-16" style=" font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;" id="Watch_LST">
            <thead>
              <tr style="position: sticky; top: 0;">
                <th><button style="text-align: center">TCK</button></th>
                <th class="num"><button style="text-align: center">D_left</button></th>
                <th style="text-align: right">Price</th>
                <th style="text-align: center">BSM_prc</th>
                <th class="num"><button style="text-align: center">Dif*</button></th>
              </tr>
            </thead>
            <tbody id="Watch_LST_B">
            </tbody>
          </table>
        </div>
        </div>
    </div>`

// Get the Sidebar
var mySidebar = document.getElementById("mySidebar");

// Get the DIV with overlay effect
var overlayBg = document.getElementById("myOverlay");

// Function variable
const TCK_input = document.getElementById("TCK_input");


// Toggle between showing and hiding the sidebar, and add overlay effect
function w3_open() {
if (mySidebar.style.display === 'block') {
    mySidebar.style.display = 'none';
    overlayBg.style.display = "none";
} else {
    mySidebar.style.display = 'block';
    overlayBg.style.display = "block";
}
}

// Close the sidebar with the close button
function w3_close() {
mySidebar.style.display = "none";
overlayBg.style.display = "none";
}

TCK_input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        CW_Fetch();
        TCK_input.blur();
    }
    
})

TCK_input.addEventListener("focus", function(event) {
   TCK_input.select(); 
})
// CW fetch and display by underlying ticker
async function get_TCK_list() {
let option = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
};
let URL = `${SrvDmn}:${portNO}/TCK_fetch`;
let _Fetching = await fetch(URL, option).catch(() => {alert("Failed to load data"); return});
let obj_Data = await _Fetching.json();
switch(obj_Data.status) {
    case 200:
    {
    obj_Data.data.forEach(element => {
        TCK_list.innerHTML += `<option>${element.name.toUpperCase()}</option>`;
    });
    break;
    };
    case 300:
    {
    alert('No data connection')
    break;
    }
    case 400:
    {
    alert('Wrong input')
    break;
    }
}
}
// Do this function still in use ?
async function TCK_Fetch() {
    FNC_name.innerText = 'Trading data'
    var TCK_data =[]
    var TCK_name = TCK_input.value.toLowerCase()
    if(TCK_name=='') {
        alert('NO INPUT');
        return;
    }
    let option = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };
    let URL = `${SrvDmn}:${portNO}/TCK_fetch/${TCK_name}`;
    let _Fetching = await fetch(URL, option).catch(() => {alert("Failed to load data"); return});
    let obj_Data = await _Fetching.json();
    switch(obj_Data.status) {
        case 200:{
            Chart_ObjData = []
            obj_Data.data.forEach(element => {
                object = {
                    Date: new d3.utcParse("%d/%m/%Y")(element.Date),
                    Open: +element.Opn,
                    High: +element.Hgh,
                    Low: +element.Low,
                    Close: +element.Cls,
                    Volume: +element.Vol, // convert "Length" column to number
                }
                Chart_ObjData.push(object)
            });
            break;
        };
        case 300:{
            alert('No data connection - reload page')
            break;
        }
        case 400:{
            alert('Wrong input')
            break;
        }
    }
}

async function CW_Fetch() {
    if(FNC_name.innerText !== 'Cover Warrant'){
        FNC_name.innerText = 'Cover Warrant'
        Main_Pnl.innerHTML += CW_HTML
        Main_Pnl.innerHTML += _WL_HTML
    }
    WL_box.value ='';
    var TCK_name = TCK_input.value.toUpperCase()
    if(TCK_name=='') {
        alert('NO INPUT');
        return;
    }
    WL_fetch()
    // Fetch Call for CW(s) corresponding to TCK
    let option = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };
    let URL = `${SrvDmn}:${portNO}/CW_Fetch/${TCK_name}`;
    let _Fetching = await fetch(URL, option).catch(() => {alert("Failed to load data"); return});
    let obj_Data = await _Fetching.json();
    // Table represented
    Sort_Trigger()
    switch(obj_Data.status) {
        case 200:{
            Cur_CW_lst = []
            let tableData = '';
            let DES_DATA; 
            obj_Data.des_data.map((values) => {Cur_CW_lst.push(values);DES_DATA = values;});
            obj_Data.data.map((values) => {Cur_CW_lst.push(values);tableData += Add_row_CW_TBL(values,DES_DATA);});
            document.getElementById('CW_Tbl_B').innerHTML = tableData;
            break;
        };
        case 300:{
            alert('No data connection - reload page')
            break;
        }
        case 400:{
            alert('Wrong input')
            break;
        }
    }
}
 
function Add_row_CW_TBL(Obj_DATA,DATA_des){
    let Row_DATA
    // function to process other information from data
    var Prcsed_DATA = CW_data_process(Obj_DATA,DATA_des)
    Row_DATA = `<tr id=${Obj_DATA.Ticker}>
    <td ondblclick="_2_WL_input('${Obj_DATA.Ticker}')">${Obj_DATA.Ticker}</td>
    <td style="text-align: right">${Obj_DATA.Price.toLocaleString('en-US')}</td>
    <td style="text-align: center">${Obj_DATA.Ratio}</td>
    <td style="text-align: left">${Prcsed_DATA[0].toLocaleString('en-US')}</td>
    <td style="text-align: center">${Prcsed_DATA[1]}</td>
    <td style="text-align: center">${Prcsed_DATA[2].toLocaleString('en-US')}</td>
    <td style="text-align: center">${((1-Prcsed_DATA[2]/Obj_DATA.Price)*100).toFixed(1)} %</td>
    </tr>`
    return Row_DATA;
}

// WATCHLIST fetching and management
function _2_WL_input(TCK) {
    const text = WL_box.value
    const index = text.indexOf(TCK)
    if(index !== -1){
        const part1 = text.slice(0, index);
        const part2 = text.slice(index + 9);
        WL_box.value = part1.concat(part2)
    }
    else{
        WL_box.value += `${TCK};`
    }
}

async function Add_WL(){
    // Take the input text and break it into individual TCK
    var _WL_input =   WL_box.value.split(';')
    _WL_input.pop()
    WL_JS.forEach(element => {
        if(_WL_input.includes(element.Ticker))
            _WL_input.remove(element.Ticker)
    });
    if(!_WL_input.length){
        alert('No input');
        return
    }
    // Deal with overlap CW
    var DLIST = []
    DLIST.push(Cur_CW_lst[0])
    // Using the TCK as ID to scrap data within the page content
    Cur_CW_lst.forEach(CW => {
        if (_WL_input.includes(CW.Ticker))
            DLIST.push(CW)
    })
    // Send the DLIST toward the POST method to update the TCK to the database
    // Request to update these to WL
    let option = {
    method: 'POST',
    headers:{'Content-Type':'application/json'}, 
    body: JSON.stringify(DLIST),  
    };
    let _Fetching = await fetch(`${SrvDmn}:3000/WL_postNew`,option).catch(() => {alert("Cannot reach the server"); return;})
    let Obj_DATA = await _Fetching.json();
    if(Obj_DATA.success == false) 
        alert(`Failed to save records`);
    else 
        alert(`All new records saved`); 
    WL_fetch()
}

async function WL_fetch(){
    // Fetch Call for CW(s) corresponding to TCK
    let option = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };
    WL_JS = []
    let URL = `${SrvDmn}:${portNO}/WL_fetch`
    let _Fetching = await fetch(URL, option).catch(() => {alert("Failed to load data"); return});
    let obj_Data = await _Fetching.json();
    switch(obj_Data.status) {
        case 200:{
            let tableData = '';
            obj_Data.data.map((values) => {
                WL_JS.push(values);
                tableData += Add_row_WL(values,values)
            });
            document.getElementById('Watch_LST_B').innerHTML = tableData;
            break;
        };
        case 300:{
            alert('No data connection - reload page')
            break;
        }
        case 400:{
            alert('Wrong input')
            break;
        }
    }
}

function Add_row_WL(Obj_DATA,DATA_des){
    let Row_DATA
    // function to process other information from data
    var Prcsed_DATA = CW_data_process(Obj_DATA,DATA_des)
    Row_DATA = `<tr id="${Obj_DATA.Ticker}_WL">
    <td ondblclick="WL_del('${Obj_DATA.Ticker}')"">${Obj_DATA.Ticker}</td>
    <td style="text-align: center">${Prcsed_DATA[1]}</td>
    <td style="text-align: right">${Obj_DATA.Price.toLocaleString('en-US')}</td>
    <td style="text-align: center">${Prcsed_DATA[2].toLocaleString('en-US')}</td>
    <td style="text-align: center">${((1-Prcsed_DATA[2]/Obj_DATA.Price)*100).toFixed(3)} %</td>
    </tr>`
    return Row_DATA;
}

async function WL_del(TCK){
    let option = {
        method: 'POST',
        headers:{'Content-Type':'application/json'},  
        };
    let _Fetching = await fetch(`${SrvDmn}:3000/WL_del/${TCK}`,option).catch(() => {alert("Cannot reach the server"); return;})
    let Obj_DATA = await _Fetching.json();
    if(Obj_DATA.success == false) 
        alert(`Delete failed`);
    else 
        alert(`Deleted ${TCK} from WL`); 
    WL_fetch()
}

function Auto_WL_Update(){
    
}


//To Processed and calculate black Scholes 
function CW_data_process(Obj_DATA,DATA_des){
    var DATA = []
    DATA.push(Obj_DATA.StrikePrc + Obj_DATA.Ratio*Obj_DATA.Price)
    DATA.push(daysBetween(Obj_DATA.Last_T_D))
    DATA.push(Math.round(blackScholes(Obj_DATA.StrikePrc,DATA[1],0.03,DATA_des)/Obj_DATA.Ratio))
    return DATA
}

function daysBetween(dateString1) {
    const today = new Date();
    const parts = dateString1.split("/");

    // Check for valid format (optional)
    if (parts.length !== 3) {
        return null; // Or throw an error if you prefer
    }

    // Convert the parts to integers
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months are zero-indexed in Date objects
    const year = parseInt(parts[2], 10);

    // Create a Date object from the extracted components
    const date1 = new Date(year, month, day);
  
    // Handle invalid dates gracefully (optional)
    if (isNaN(date1.getTime()) || isNaN(today.getTime())) {
      return null; // Or throw an error if you prefer
    }
  
    // Get the difference in milliseconds
    const timeDiff = date1.getTime() - today.getTime();
  
    // Convert milliseconds to days and round down to whole days
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
    return daysDiff;
}

function blackScholes(K,days,r,Des_DATA) {
    // Change sigma (represent in %) to 0.0x
    const sigma = Des_DATA.STD_2000*0.01
    // Change S0 to represent as XX000
    const S0 = days > 20 ? Des_DATA.Spot_PRC*1000 : (Des_DATA.AVG_4*4+Des_DATA.Spot_PRC)*200;
    const t = days/365
    
    // Calculate d1 and d2
    const d1 = (Math.log(S0 / K) + (r + sigma * sigma / 2) * t) / (sigma * Math.sqrt(t));
    const d2 = d1 - sigma * Math.sqrt(t);
  
    // Define helper functions for cumulative distribution function (CDF) of normal distribution
    const ndf = (x) => {
      let z = Math.abs(x);
      let t = 1 / (1 + 0.5 * Math.abs(z));
      let r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + 
        t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + 
        t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + 
        t * (-0.82215223 + t * 0.17087277)))))))));
      return (1.0 + (x >= 0 ? r : -r));
    };
  
    // Calculate option price using the Black-Scholes formula
    let optionPrice;
    optionPrice = S0 * ndf(d1) - K * Math.exp(-r * t) * ndf(d2);
    return optionPrice;
}
