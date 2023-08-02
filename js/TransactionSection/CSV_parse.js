var DataArray = [];
var ElementArray = [];
const FileRdr = new FileReader();
var PushRecords = [];

async function CSV_2_Array(DataString,BckGround,LoadingLine,Close) {
    BckGround.appendChild(LoadingLine);

    //Start parsing the data - parsing each line
    var Index = DataString.indexOf('\r\n');
    for(let i=0;i<1000;i++)
    {   //Parsing each element in a line
        var EleString = DataString.slice(0,Index);
        var Septr_index = EleString.indexOf('|');
        for(let n=0;n<10;n++){
            let Element = EleString.slice(0,Septr_index)
            ElementArray.push(Element);
            // Modify element line
            EleString = EleString.slice(Septr_index+1);
            Septr_index = EleString.indexOf('|');
            if(Septr_index == -1) break;
        }
        DataArray.push(ElementArray);
        ElementArray =[];   
        //Modify input string
        DataString = DataString.slice(Index+2);
        Index = DataString.indexOf('\r\n');   
        if(Index == -1) {
            if (DataString.length > 0)
                Index = DataString.length;
            else break;
        }
    }
    //Create pushing list records array
    for(let i=0;i<DataArray.length;i++){
        let refineNumber = DataArray[i][1].replace(/,/g,'');
        let RecordList = {
            //Transform amount
            date: DataArray[i][0],
            amount: refineNumber,
            // amount: DataArray[i][1],
            purpose: DataArray[i][3],
            account: 'TCB',
            categorized: 'null',
        }
        PushRecords.push(RecordList);
    } 
    console.log(PushRecords);
    SaveNew(PushRecords);
    BckGround.removeChild(LoadingLine);
    return Close.click();
}


function CSV_input(){
//Create a front backdrop area ......................

    //CSV load file backdrop
    const LoaderScr = document.createElement('div');
    LoaderScr.classList.add("loader");
    document.body.style.position = "fixed";
    document.body.appendChild(LoaderScr);

    // Closing ----- exit Loading screen
    const cls_btn = document.createElement('span');
    cls_btn.classList.add('close-btn')
    cls_btn.innerText += 'Close';
    cls_btn.addEventListener("click", function () {
      document.body.removeChild(LoaderScr)
      document.body.style.position = "static";
    });

    // Read button - proceed to read file
    const rd_btn = document.createElement('span');
    rd_btn.classList.add("rd-btn");
    rd_btn.textContent = "Read file";
    // rd_btn.addEventListener("")

    // Drop area 
    const DropArea = document.createElement('div');
    DropArea.classList.add("file-drop-area");
    DropArea.innerHTML += `<span class="fake-btn">Choose files</span>`
    const DropFmsg = document.createElement('span');
    DropFmsg.classList.add("file-msg");
    DropFmsg.textContent = "or drag and drop a file here";

    //Animate interaction
    var Eve = ["mouseover","dragenter","focus"]
    Eve.forEach(eve => {
      DropArea.addEventListener(eve, ()=> {
        DropArea.classList.add("is-active");
      });
    })
    Eve = ["dragleave","click","mouseout","drop"]
    Eve.forEach((eve => {
      DropArea.addEventListener(eve, ()=> {
        DropArea.classList.remove("is-active")
      });
    }));

    //Input element
    const InputF = document.createElement("input");
    InputF.classList.add("file-input");
    InputF.type="file"
    InputF.accept="text/csv"
    InputF.addEventListener("change", () =>{
      if(InputF.files.length == 0){
        if(rd_btn.isConnected) LoaderScr.removeChild(rd_btn);
        DropFmsg.textContent = "or drag and drop a file here";
        return;
      }
      const FNames = InputF.value.split('\\');
      DropFmsg.textContent = FNames[FNames.length-1];
  
      FileRdr.onloadend = () => {
        LoaderScr.appendChild(rd_btn);
        rd_btn.addEventListener("click", () => CSV_2_Array(FileRdr.result,LoaderScr,LoaderLine,cls_btn));
      }
      FileRdr.readAsText(InputF.files[0])
    });

    //Weaving initial drop
    DropArea.appendChild(DropFmsg);
    DropArea.appendChild(InputF);
    LoaderScr.appendChild(cls_btn);
    LoaderScr.appendChild(DropArea);
    
  
    //CSV processing file
    const LoaderLine = document.createElement('div');
    LoaderLine.classList.add("loader__element");
  }
  