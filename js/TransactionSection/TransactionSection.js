//---------------------------------- ** GLOBAL VARIABLES ** ---------------------------------- 
// * ELEMENTS
const Rmder = document.getElementById("Remaining_Amt");
const TBLContain = document.getElementById('tableContent')
const Save_B = document.getElementById("Save_B");
const Date_chose = document.getElementById("in_Date");
const P_enter = document.getElementById("input_Tb");
const Btt_Mth_Total = document.getElementById("AmtRem_ByMth")

// * SUPPORT 
var FirstLoad = true;
var maxD = "";
var Update_Ele = "";
const FORMATER = Intl.NumberFormat('en-US', { maximumSignificantDigits: 12})

// * OPERATION
var RecordsList = [];
var Udate_List = [];
var Del_list =[];
var OutFlow = 0;
var InFlow = 0;
var CK_check = 0;
var Un_usual = 0;
var Fet_DATA_obj = {};
var FPeriod = document.getElementById("FPeriod").value;
var Rmder_Amount = {month: 0,total: 0}
var T_Acc_Rmder = {}
var M_Acc_Rmder = {}
const SrvDmn = (window.location.hostname != '') ? `http://${window.location.hostname}` : 'http://localhost'; 
const portNO = 3000;

// Get the Sidebar
var mySidebar = document.getElementById("mySidebar");

// Get the DIV with overlay effect
var overlayBg = document.getElementById("myOverlay");

//---------------------------------- *** FUNCTIONS *** ----------------------------------

// ** INTERACTIVE - ELEMENTS **

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

// When focus() at the input Table - press enter to initate submiting line
P_enter.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("Submit_B").click();
  }
});

// When focus() at the input Table - press shift + enter to initate save records
P_enter.addEventListener("keydown", function(event){
  if (event.shiftKey && event.key === 'Enter'){
    event.preventDefault();
    document.getElementById("Save_B").click();
  }
})

// Toggle between Month SUM and Total SUM
Btt_Mth_Total.addEventListener("click", function() {
  if(Btt_Mth_Total.textContent == "Total") 
  {
    Rmder.textContent = FORMATER.format(Rmder_Amount.month);
    Btt_Mth_Total.textContent = "Month";
  }
  else
  {
    Rmder.textContent = FORMATER.format(Rmder_Amount.total);
    Btt_Mth_Total.textContent = "Total"
  }
});

Rmder.addEventListener("click",function(){
  let Alert = ``;
  if(Btt_Mth_Total.textContent == "Total") 
  {
    T_Acc_Rmder.map(data => {
      Alert += `${data.Account} : ${FORMATER.format(data.Amount)}\n`
    }) 
  }
  else
  {
    M_Acc_Rmder.map(data => {
      Alert += `${data.Account} : ${FORMATER.format(data.Amount)}\n`
    })
  }
  alert(Alert)
})

// ** OPERATING ** 

// * API * 
//To fectch the data of the input month
async function Fetch_data() {
  // ONload run - to adjust the fetching period to the current month
  if(FirstLoad)
  {
    let date = new Date();
    let month = ((date.getMonth()+1)<10) ? `0${date.getMonth()+1}` : `${date.getMonth()+1}`;  
    let year =  date.getFullYear();
    FPeriod = `${year}-${month}`;
    document.getElementById("FPeriod").value = FPeriod;
    Date_chose.min = Date_chose.value = FPeriod + '-01';
    maxD = daysInMonth(month,year);
    Date_chose.max = FPeriod + `-${maxD}`;  
    FirstLoad = false;
  }
  
  // Prepare payload and url for proceed fetch() 
  let option = {
  method: 'GET',
  headers:{'Content-Type':'application/json'}, 
  };
  let URL = `${SrvDmn}:${portNO}/fetch/${FPeriod}`;
  let _Fetching = await fetch(URL,option).catch(() => {alert("Failed to load data"); return});

  // Parsing and displaying data
  let objectData = await _Fetching.json();
  switch (objectData.status){
    case 200: {
      // fetching the account remaining data from the server is not a sustainable approach 
      // later on, replace that with using function within the the JavaScript (Loop from Fet_DATA_obj)
      Fet_DATA_obj = objectData.data;
      OutFlow = 0;
      InFlow = 0;
      Rmder_Amount.month = objectData.month;
      Rmder_Amount.total = objectData.total;
      T_Acc_Rmder = objectData.T_acc;
      M_Acc_Rmder = objectData.M_acc;
      let tableData = '';
      objectData.data.map((values) => {tableData += Add_row(values);});
      TBLContain.innerHTML = tableData;
      break;
    }
    case 300: {
    Rmder_Amount.month = 0;
    Rmder_Amount.total = 0;
    Rmder_Amount.t_CIC = 0;
    Rmder_Amount.t_Cash = 0;
    Rmder_Amount.m_CIC = 0;
    Rmder_Amount.m_Cash = 0;
    TBLContain.innerHTML = '';
    alert('No records to show');
    break;
    }
  }
  if(Btt_Mth_Total.textContent == "Month") Rmder.textContent =FORMATER.format(Rmder_Amount.month);
  else Rmder.textContent = FORMATER.format(Rmder_Amount.total); //Re-format data
  document.getElementById('outFlow').textContent = FORMATER.format(OutFlow);
  document.getElementById('inFlow').textContent = FORMATER.format(InFlow);
  document.getElementById("C_CK").textContent = (CK_check == 0) ? "TRUE" : "FALSE";
  
  //Scroll the display table to the end
  document.getElementById("TBLFrame").scrollTo(0,TBLContain.offsetHeight);
  // Clear all operation variable
  RecordsList = [];
  Udate_List = [];
  Del_list =[];
}

//Save all the newlines onto the database
async function SaveNew(CSV_DataArray) { 
  RecordsList = (CSV_DataArray != (undefined || null)) ? CSV_DataArray : RecordsList; 
  if(RecordsList.length) 
  {
    let option = {
    method: 'POST',
    headers:{'Content-Type':'application/json'}, 
    body: JSON.stringify(RecordsList),  
    };
    let _Fetching = await fetch(`${SrvDmn}:3000/postNew`,option).catch(() => {alert("Cannot reach the server"); return;})
    let Obj_DATA = await _Fetching.json();
    if(Obj_DATA.success == false) 
      alert(`Failed to save records`);
    else 
      alert(`All new records saved`);
    RecordsList = []; 
  }
  if (Udate_List.length) Update();
  setTimeout(Fetch_data(),500);
}

// Delete chosen records
async function Delete_rec(){
  if (!Del_list.length) return;
  let option = {
  method: 'POST',
  headers:{'Content-Type':'application/json'}, 
  body: JSON.stringify(Del_list)
  };
  let _Fetching = await fetch(`${SrvDmn}:3000/delete`,option).catch(() => {alert("Cannot reach the server"); return;})
  let Obj_DATA = await _Fetching.json();
  if(Obj_DATA.success == false) alert(`Failed to delete records`);
  else alert(`All selected records deleted`);
  Del_list = [];
  setTimeout(Fetch_data(),500);
}

// Update modifies to records
async function Update() {  
  let option = {
  method: 'POST',
  headers:{'Content-Type':'application/json'}, 
  body: JSON.stringify(Udate_List),};
  let _Fetching = await fetch(`${SrvDmn}:3000/update`,option).catch(() => {alert("Cannot reach the server"); return;})
  let Obj_DATA = await _Fetching.json();
  if(Obj_DATA.success == false) alert(`Failed to save records`);
  else alert(`All update records saved`);
  Udate_List = [];
  setTimeout(Fetch_data(),500);
}

// * Pre-API functions *
// Change the data fetching period (by month) AND update submit section to follow suit
function ChangePeriod(){
  FPeriod = document.getElementById("FPeriod").value;
  let Pre_setD = FPeriod + '-01';
  let Fmonth = FPeriod.slice(5);
  let Fyear = FPeriod.slice(0,4);
  Date_chose.value = Pre_setD;
  Date_chose.min = Pre_setD;
  maxD = daysInMonth(Fmonth,Fyear);
  Date_chose.max = FPeriod + `-${maxD}`;  
}

//Temporary submit newlines to the table
function SubmitLine() {
  let ThisList = {};
  let date = '',amount = '',purpose = '',account = '',categorized='';
  let N_row = document.createElement('tr');
  date = document.getElementById("in_Date").value;
  amount = document.getElementById("in_Amount").value;
  purpose = document.getElementById("in_Purpose").value;
  account = document.getElementById("in_Acc").value;
  categorized = document.getElementById("in_CCode").value;
  if((amount == '') || (purpose == '')) {
    alert("Not enough inputs");
    return;
  }
  ThisList = {date,amount,purpose,account,categorized};
  N_row.classList.add('w3-indigo')
  let Submiting =`<td>${date}</td>
    <td style="text-align: right;">${FORMATER.format(amount)}</td>
    <td>${purpose}</td>
    <td>${account}</td>
    <td>${categorized}</td>`;
  let Clk2Del = document.createElement('td')
  N_row.innerHTML += Submiting;
  N_row.appendChild(Clk2Del);
  RecordsList.push(ThisList);
  Date_chose.focus();
  TBLContain.appendChild(N_row); 
  Clk2Del.addEventListener('dblclick',() => Del_Submit(ThisList.length,N_row));
  Clk2Del.classList.add('w3-hover-red');
  document.getElementById("TBLFrame").scrollTo(0,TBLContain.offsetHeight);
}

//To delete the submited line
function Del_Submit(index,line){
  RecordsList.splice(index,1);
  TBLContain.removeChild(line);
  return;
}

//Check and uncheck Delete box
function Delete_CheckB(ID){
  const deleteB = document.getElementById(`Del_${ID}`);
  const SelectRow = document.getElementById(`Row_${ID}`);
  deleteB.innerHTML = `<input onclick="Delete_UnCheck(${ID})" ID="DelBox_${ID}" type="checkbox" checked="true"></input>`;
  SelectRow.classList.add('w3-orange');
  if(!Del_list.includes(ID)) Del_list.push(ID);
}

function Delete_UnCheck(ID)
{
  const SelectRow = document.getElementById(`Row_${ID}`);
  const deleteB = document.getElementById(`Del_${ID}`);
  const Del_CB = document.getElementById(`DelBox_${ID}`);
  if(!Del_CB.checked) 
  {
    SelectRow.classList.remove('w3-orange'); 
    Del_list.splice(Del_list.indexOf(ID),1); 
    deleteB.innerHTML =``;
  }
}

// Upon double click to the table cell - it let the user to modify record
function TBLcell_click(RowID, Content){
  // Get the modyfing row
  const SelectRow = document.getElementById(`Row_${RowID}`);
  const idt = `${Content}_${RowID}`;
  const SelectCell = document.getElementById(idt);
  // Get the value before modification - a little modify if it is a FORMATED displayed number 
  const DefaultVal = SelectCell.innerHTML.match(',') ? SelectCell.innerHTML.replaceAll(',','') : SelectCell.innerHTML ;
  // Give the row a khaki color
  SelectRow.classList.add("w3-khaki");
  // Modify the HTML based on the content under modification
  switch(Content){
    case ('Date'):
    SelectCell.innerHTML = `<Input type="date" id="${idt}_UDate"></Input>`; 
    break;
    case ('Amt'):
    SelectCell.innerHTML = `<Input type="number" id="${idt}_UDate"></Input>`;
    break;
    case ('For'):
    SelectCell.innerHTML = `<Input type="text" style="width:100%;" id="${idt}_UDate"></Input>`; 
    break;
    case ('Acc'):
    SelectCell.innerHTML = `<select id="${idt}_UDate"><option value="CIC">CIC</option>
    <option value="Cash">Cash</option><option value="TCB">TCB</option><option value="BID">BID</option></select>`; 
    break;
    case ('CCode'):
    SelectCell.innerHTML = `<select id="${idt}_UDate"><option value="null">N/A</option><option value="unsual">U_Spend</option><option value="null">N/A</option><option value="PB">PB</option><option value="CK-">CK-</option><option value="CK+">CK+</option></select>`; 
    break;
  }
  Update_Ele = document.getElementById(`${idt}_UDate`);
  // For date we need a scope of possible changes 
  if(Content == 'Date')
  {
    Update_Ele.max = FPeriod + '-'+maxD; 
    Update_Ele.min = FPeriod + '-01';
  }
  Update_Ele.value = DefaultVal;
  Update_Ele.focus();
  // Update to the update list upon on of focus
  Update_Ele.setAttribute('onfocusout',`Udate_Row(${RowID},'${Content}','${DefaultVal}')`);
  return;
}

// Once modified - the data of the row will be updated 
function Udate_Row(ID, Content, DefaultVal){
  // Get the modyfied row and remove its brown
  const SelectRow = document.getElementById(`Row_${ID}`);
  SelectRow.classList.remove("w3-khaki");
  const idt = `${Content}_${ID}`;
  // Get the cell div and update its value
  const SelectCell = document.getElementById(idt);
  const NewVal = Update_Ele.value;
  SelectCell.innerHTML = (Content == 'Amt') ? FORMATER.format(Update_Ele.value) : Update_Ele.value;

  //If no changes compare to the previous value then return
  if (DefaultVal == NewVal) return;
  
  //If there is(are) change(s) we make it lime
  SelectRow.classList.add("w3-lime");

  // Create an Object instance to represent the update informatio (records ID and update content)
  var UpdateObj = {}
  UpdateObj.ID = ID;
  for(let i = 0; i< Udate_List.length; i++)
  {
    // If the ID has been modified with other changes before, its ID will shown up in Udate_List
    if (Udate_List[i].ID == ID) 
    {
      // If found then we can update the current one instead of add another obj to Udate_List
      // By copy and delete the array element ...
      UpdateObj = Udate_List[i];
      Udate_List.splice(i,1)
      break;
    }
  } 
  //... then update its key with the co-responding value. 
  switch(Content){
    case ('Date'): UpdateObj.date = Update_Ele.value; break;
    case ('Amt'): UpdateObj.amount = Update_Ele.value; break;
    case ('Acc'): UpdateObj.account = Update_Ele.value; break;
    case ('CCode'):UpdateObj.categorized = Update_Ele.value; break;
    case ('For'): UpdateObj.purpose = Update_Ele.value; break;
  }
  // Push the element to the array
  Udate_List.push(UpdateObj);
}

// * SUPPORTING 
// Get number of days in a specified month
function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}

// Adding Element Data to records display table 
function Add_row(Obj_DATA){
  Categorized(Obj_DATA)
  let Row_DATA;
  Row_DATA = `<tr id="Row_${Obj_DATA.ID}">
  <td ondblclick="TBLcell_click(${Obj_DATA.ID},'Date')"><div class="row_data"  id="Date_${Obj_DATA.ID}">${Obj_DATA.Date}</div></td>
  <td ondblclick="TBLcell_click(${Obj_DATA.ID},'Amt')"><div class="row_data" style="text-align:right"  id="Amt_${Obj_DATA.ID}">${FORMATER.format(Obj_DATA.Amount)}</div></td>
  <td ondblclick="TBLcell_click(${Obj_DATA.ID},'For')"><div class="row_data" id="For_${Obj_DATA.ID}">${Obj_DATA.Purpose}</div></td>
  <td ondblclick="TBLcell_click(${Obj_DATA.ID},'Acc')"><div class="row_data" id="Acc_${Obj_DATA.ID}">${Obj_DATA.Account}</div></td>
  <td ondblclick="TBLcell_click(${Obj_DATA.ID},'CCode')"><div class="row_data" id="CCode_${Obj_DATA.ID}">${Obj_DATA.Categorized}</div></td>
  <td ondblclick="Delete_CheckB(${Obj_DATA.ID})"><div id="Del_${Obj_DATA.ID}"></div></td>
  </tr>`
  return Row_DATA;
}

// Categorized data
function Categorized(Obj_DATA){
  if (Obj_DATA.Categorized.includes('CK',0)) 
  {
    CK_check += Obj_DATA.Amount;
    return
  }
  if(Obj_DATA.Amount<0) {OutFlow += Obj_DATA.Amount;} else {InFlow += Obj_DATA.Amount;}
}