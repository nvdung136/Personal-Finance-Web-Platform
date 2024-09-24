// * OPERATION
const SrvDmn = (window.location.hostname != '') ? `http://${window.location.hostname}` : 'http://localhost'; 
const portNO = 3000;
var Chart_ObjData=[];
const formatTime = d3.utcFormat("%d-%b");

var ChartArea = document.querySelector('#my_dataviz')

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
width = 800 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

// Read the data
async function TCK_Fetch() {
    var TCK_name = 'hpg'
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
            console.log(Chart_ObjData)
            break;
        };
        case 300:
        {
        alert('No data connection - reload page')
        break;
        }
    }
    }