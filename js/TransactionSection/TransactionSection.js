let maxD;
let Update_Ele;
let FORMATER = Intl.NumberFormat('en-US', { maximumSignificantDigits: 9})

var FirstLoad = true;
var RecordsList = [];
var Udate_List = [];
var Del_list =[];
var FPeriod = document.getElementById("FPeriod").value;
let Rmder_Amount = {month: 0 ,total: 0 }

const SrvDmn = (window.location.hostname != '') ? `http://${window.location.hostname}` : 'http://localhost'; 
const Rmder = document.getElementById("Remaining_Amt");
const TBLContain = document.getElementById('tableContent')
const Save_B = document.getElementById("Save_B");
const Date_chose = document.getElementById("in_Date");
// Get the Sidebar
var mySidebar = document.getElementById("mySidebar");

// Get the DIV with overlay effect
var overlayBg = document.getElementById("myOverlay");

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
function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}

function ChangePeriod(){
  FPeriod = document.getElementById("FPeriod").value;
  var Pre_setD = FPeriod + '-01';
  var Fmonth = FPeriod.slice(5);
  var Fyear = FPeriod.slice(0,4);
  Date_chose.value = Pre_setD;
  Date_chose.min = Pre_setD;
  maxD = daysInMonth(Fmonth,Fyear);
  Date_chose.max = FPeriod + `-${maxD}`;  
}

function Fetch_data() {
  if(FirstLoad)
  {
    const date = new Date();
    const month = ((date.getMonth()+1)<10) ? `0${date.getMonth()+1}` : `${date.getMonth()+1}`;  
    const year =  date.getFullYear();
    FPeriod = `${year}-${month}`;
    document.getElementById("FPeriod").value = FPeriod;
    Date_chose.min = Date_chose.value = FPeriod + '-01';
    maxD = daysInMonth(month,year);
    Date_chose.max = FPeriod + `-${maxD}`;  
    FirstLoad = false;
  }
  var option = {
  method: 'GET',
  headers:{'Content-Type':'application/json'}, 
  };
  const URL = `${SrvDmn}:3000/fetch/${FPeriod}`;
  fetch(URL,option)
  .then(res => {return res.json()})
  .then(objectData =>
  { 
    if(objectData.status == 200) {
      Rmder_Amount.month = objectData.month[0].period;
      Rmder_Amount.total = objectData.total[0].total;
      let tableData = "";
      objectData.data.map((values) => {
        tableData += `<tr id="Row_${values.ID}">
        <td ondblclick="TBLcell_click(${values.ID},'Date')"><div class="row_data"  id="Date_${values.ID}">${values.Date}</div></td>
        <td ondblclick="TBLcell_click(${values.ID},'Amt')"><div class="row_data" style="text-align:right"  id="Amt_${values.ID}">${FORMATER.format(values.Amount)}</div></td>
        <td ondblclick="TBLcell_click(${values.ID},'For')"><div class="row_data" id="For_${values.ID}">${values.Purpose}</div></td>
        <td ondblclick="TBLcell_click(${values.ID},'Acc')"><div class="row_data" id="Acc_${values.ID}">${values.Account}</div></td>
        <td ondblclick="TBLcell_click(${values.ID},'CCode')"><div class="row_data" id="CCode_${values.ID}">${values.Categorized}</div></td>
        <td ondblclick="Delete_CheckB(${values.ID})"><div id="Del_${values.ID}"></div></td>
        </tr>`
      // <td><div class="row_data" ondblclick="TBLcell_click(${values.ID},'Reserved')></div></td><tr>`
      TBLContain.innerHTML = tableData;});
    }
      else if (objectData.status == 300) {
      Rmder_Amount.month = 0;
      Rmder_Amount.total = objectData.total[0].total;
      TBLContain.innerHTML = '';
      alert('No records to show');
    }
    if(Btt_Mth_Total.textContent == "Month") Rmder.textContent = Rmder_Amount.month;
    else Rmder.textContent = Rmder_Amount.total;
  });  
  document.getElementById("TBLFrame").scrollTo(0,TBLContain.offsetHeight);
}

//Temporary submit newlines to the table
async function SubmitLine(CSV_DataArray) {
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
    Rmder.textContent = Rmder_Amount.month;
    Btt_Mth_Total.textContent = "Month";
  }
  else
  {
    Rmder.textContent = Rmder_Amount.total;
    Btt_Mth_Total.textContent = "Total"
  }
});
