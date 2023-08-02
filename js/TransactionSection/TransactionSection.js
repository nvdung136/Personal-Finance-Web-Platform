// ** GLOBAL VARIABLES ** 
// * ELEMENTS
const Rmder = document.getElementById("Remaining_Amt");
const TBLContain = document.getElementById('tableContent')
const Save_B = document.getElementById("Save_B");
const Date_chose = document.getElementById("in_Date");

// SUPPORT 
var FirstLoad = true;
var maxD = "";
var Update_Ele = "";
const FORMATER = Intl.NumberFormat('en-US', { maximumSignificantDigits: 9, maximumFractionDigits: 2})

// OPERATION
var RecordsList = [];
var Udate_List = [];
var Del_list =[];
var FPeriod = document.getElementById("FPeriod").value;
var Rmder_Amount = {month: 0 ,total: 0 }
const SrvDmn = (window.location.hostname != '') ? `http://${window.location.hostname}` : 'http://localhost'; 
const portNO = 3000;

// Get the Sidebar
var mySidebar = document.getElementById("mySidebar");

// Get the DIV with overlay effect
var overlayBg = document.getElementById("myOverlay");

// ** FUNCTIONS **
// * INTERACTIVE 

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

// * OPERATING 


// MAIN 
//To fectch the data of the input month
function Fetch_data() {
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
  let _Fetching = fetch(URL,option).catch(() => {alert("Failed to load data"); return});
  
  // Parsing and displaying data
  let objectData = _Fetching.json();
  switch (objectData.status){
    case 200: {
    Rmder_Amount.month = objectData.month;
    Rmder_Amount.total = objectData.total;
    let tableData = '';
    objectData.data.map((values) => {tableData += Add_row(values);});
    TBLContain.innerHTML = tableData;
    }
    case 300: {
    Rmder_Amount.month = 0;
    Rmder_Amount.total = objectData.total;
    TBLContain.innerHTML = '';
    alert('No records to show');
    }
  }
  if(Btt_Mth_Total.textContent == "Month") Rmder.textContent =FORMATER.format(Rmder_Amount.month);
  else Rmder.textContent = FORMATER.format(Rmder_Amount.total); //Re-format data
  //
  document.getElementById("TBLFrame").scrollTo(0,TBLContain.offsetHeight);
}

// MINOR OPS
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

// * SUPPORTING 
// Get number of days in a specified month
function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}

// Adding Element Data to records display table 
function Add_row(Obj_DATA){
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


//Temporary submit newlines to the table
function SubmitLine(CSV_DataArray) {
  var ThisList = {};
  var date = '',amount = '',purpose = '',account = '',categorized='';
  var tableData = TBLContain.innerHTML;
  if(CSV_DataArray == undefined){
    date = document.getElementById("in_Date").value;
    amount = document.getElementById("in_Amount").value;
    purpose = document.getElementById("in_Purpose").value;
    account = document.getElementById("in_Acc").value;
    categorized = document.getElementById("in_CCode").value;
    if((amount == '') || (purpose == '')) {
      alert("Not sufficient inputs");
      return;
    }
  ThisList = {date,amount,purpose,account,categorized};
  tableData += `<tr class="w3-indigo">
    <td>${date}</td>
    <td>${amount}</td>
    <td>${purpose}</td>
    <td>${account}</td>
    <td>${categorized}</td> 
    <tr>`;
  console.log(ThisList);
  RecordsList.push(ThisList);
  Date_chose.focus();
  TBLContain.innerHTML = tableData;
  document.getElementById("TBLFrame").scrollTo(0,TBLContain.offsetHeight);
  }
  else {
  RecordsList = CSV_DataArray;
  SaveNew();
  }
}

//Save all the newlines onto the database
function SaveNew() { 
    if(RecordsList.length) 
    {
      var option = {
      method: 'POST',
      headers:{'Content-Type':'application/json'}, 
      body: JSON.stringify(RecordsList),  
      };
      fetch(`${SrvDmn}:3000/postNew`,option)
      .then(res => {return res.json()})
      .then(data => {if(data.success == false) alert(`Failed to save records`);else alert(`All new records saved`);});
      RecordsList = []; 
    }
    if (Udate_List.length) Update();
}

function Delete_CheckB(ID){
  const deleteB = document.getElementById(`Del_${ID}`);
  const SelectRow = document.getElementById(`Row_${ID}`);
  deleteB.innerHTML = `<input onclick="Delete_List(${ID})" ID="DelBox_${ID}" type="checkbox" checked="true"></input>`;
  SelectRow.classList.add('w3-orange');
  if(!Del_list.includes(ID)) Del_list.push(ID);
}

function Delete_List(ID)
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

function Delete_rec(){
  if (!Del_list.length) return;
  var optionD = {
  method: 'POST',
  headers:{'Content-Type':'application/json'}, 
  body: JSON.stringify(Del_list),};
  fetch(`${SrvDmn}:3000/delete`,optionD)
  .then(res => {return res.json()})
  .then(data => {if(data.success == false) alert(`Failed to save records`);else alert(`All selected records deleted`);});
  Del_list = [];
}



function Update() {  
  var optionU = {
  method: 'POST',
  headers:{'Content-Type':'application/json'}, 
  body: JSON.stringify(Udate_List),};
  fetch(`${SrvDmn}:3000/update`,optionU)
  .then(res => {return res.json()})
  .then(data => {if(data.success == false) alert(`Failed to save records`);else alert(`All update records saved`);});
  Udate_List = [];
}

function TBLcell_click(RowID, Content){
  const SelectRow = document.getElementById(`Row_${RowID}`);
  const idt = `${Content}_${RowID}`;
  const selectDiv = document.getElementById(idt);
  const DefaultVal = selectDiv.innerHTML;
  // selectDiv.setAttribute("contenteditable",'true');
  SelectRow.classList.add("w3-khaki");
  switch(Content){
    case ('Date'):
      selectDiv.innerHTML = `<Input type="date" id="${idt}_UDate"></Input>`;
      Update_Ele = document.getElementById(`${idt}_UDate`); 
      Update_Ele.max = FPeriod + '-'+maxD; 
      Update_Ele.min = FPeriod + '-01';
      break;
      case ('Amt'):
      selectDiv.innerHTML = `<Input type="number" id="${idt}_UDate"></Input>`;
      Update_Ele  = document.getElementById(`${idt}_UDate`);
      break;
      case ('Acc'):
      selectDiv.innerHTML = `<select id="${idt}_UDate"><option value="TCB">TCB</option><option value="BID">BID</option></select>`;
      Update_Ele = document.getElementById(`${idt}_UDate`); 
      break;
      case ('CCode'):
      selectDiv.innerHTML = `<select id="${idt}_UDate"><option value="null">N/A</option><option value="PB">PB</option><option value="CK-">CK-</option><option value="CK+">CK+</option></select>`;
      Update_Ele = document.getElementById(`${idt}_UDate`); 
      break;  
      case ('For'):
      selectDiv.innerHTML = `<Input type="text" style="width:100%;" id="${idt}_UDate"></Input>`;
      Update_Ele = document.getElementById(`${idt}_UDate`); 
      break;
  }
  Update_Ele.value = DefaultVal;
  Update_Ele.focus();
  Update_Ele.setAttribute('onfocusout',`Udate_Row(${RowID},'${Content}','${DefaultVal}')`);
}

function Udate_Row(ID, Content, DefaultVal){
  const SelectRow = document.getElementById(`Row_${ID}`);
  SelectRow.classList.remove("w3-khaki");
  const idt = `${Content}_${ID}`;
  const selectDiv = document.getElementById(idt);
  const NewVal = Update_Ele.value;
  selectDiv.innerHTML = Update_Ele.value;
  if (DefaultVal == NewVal) return;
  
  SelectRow.classList.add("w3-light-green");
  var UpdateObj = {}
  UpdateObj.ID = ID;
  for(let i = 0; i< Udate_List.length; i++)
  {
    if (Udate_List[i].ID == ID) 
    {
      UpdateObj = Udate_List[i];
      Udate_List.splice(i,1);
      break;
    }
  } 
  switch(Content){
    case ('Date'): UpdateObj.date = Update_Ele.value; break;
    case ('Amt'): UpdateObj.amount = Update_Ele.value; break;
    case ('Acc'): UpdateObj.account = Update_Ele.value; break;
    case ('CCode'):UpdateObj.categorized = Update_Ele.value; break;
    case ('For'): UpdateObj.purpose = Update_Ele.value; break;
  }
  Udate_List.push(UpdateObj);
}

const P_enter = document.getElementById("input_Tb");
P_enter.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("Submit_B").click();
  }
});

P_enter.addEventListener("keydown", function(event){
  if (event.shiftKey && event.key === 'Enter'){
    event.preventDefault();
    document.getElementById("Save_B").click();
  }
})

const Btt_Mth_Total = document.getElementById("AmtRem_ByMth")
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
