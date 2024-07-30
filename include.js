//GV
const timer = ms => new Promise(res => setTimeout(res, ms))

var LinkArray = new Array
var dataarray = new Array
let url2 = new String
let LSID = new String
let LSCNAME = new String
let reportcount = new Number
var reports = new String






async function Engine(){
    console.log(LinkArray)
    for(let i = 0; i < LinkArray.length; i++){
        window.open(LinkArray[i])
    }


    let timerforload = Math.max(reports.split(",").length*3500,20000)
    console.log(timerforload)
    window.alert("Load Compensation Timer for: "+ timerforload/1000 +" seconds. Close this Popup to start timer.")
    await timer(timerforload)
    Parser()
}

function rows2cols(a) {
    var r = [];
    var t;

    for (let i=0, iLen=a.length; i<iLen; i++) {
      t = a[i];

      for (var j=0, jLen=t.length; j<jLen; j++) {
        if (!r[j]) {
          r[j] = [];
        }
        r[j][i] = t[j];
      }
    }
    return r;
  }



async function Parser(){

    let temparray =  new Array
    let listlength = dataarray.length / 2

    for (let i=0; i<listlength; i++) {
      dataarray.shift()
    }

    dataarray = rows2cols(dataarray)


    for(let i =0; i < dataarray.length; i++){
        temparray.push(dataarray[i])
    }

    dataarray = temparray

    let csvContent = "data:text/csv;charset=utf-8,";

    dataarray.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });


    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");

    await getAccount()

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Exported Fields for ${LSID}} / ${LSCNAME}.csv`);
    document.body.appendChild(link); // Required for FF

    link.click();


}





async function getAccount(){
let Resp = new String

    await fetch("https://lightspeedanalytics.net/cl_accounts/settings", {
        "headers": {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "max-age=0",
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
      }) .then(function(response) {
        return response.text();
      }).then(function(data) {
        Resp = data; // this will be a string
      });


Resp = Resp.split("window.LSanalytics.user")[1]
Resp = Resp.split("}")[0]
Resp = Resp.split(",")
LSID = Resp[3].split(":")[1].replaceAll("`","").replaceAll("}","").replaceAll("'","").replaceAll("}","").replaceAll("_","")
LSCNAME = Resp[8].split(":")[1].replaceAll("`","").replaceAll("}","").replaceAll("'","").replaceAll("}","").replaceAll("_","")





}






//Create Event Listeners for postMessage
function Listeners(){
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";


    eventer(messageEvent,function(e) {
        dataarray.push(e.data)
    },false);

}
















// ________________________________________________MAIN WINDOW EVENTS________________________________________________________________________
if (window.top === window.self) {
    Listeners()


    GM_registerMenuCommand('Get Info',async function() {
        reports = window.prompt("Insert Comma Spaced Report URLS. Remove Spaces","https://lightspeedanalytics.net/category/1/reports/66933,https://lightspeedanalytics.net/category/1/reports/68548,https://lightspeedanalytics.net/category/2/reports/85580")
        LinkArray = reports.split(",")

        Engine()
    }, 'r')


}

//________________________SECONDARY POP TAB EVENTS________________________________________________________________________________________________

//Find Main Window, and postMessage the MetaData back to main, then suicide
if (document.URL.includes("https://app.lightspeedanalytics.net/embed/explore/")){
    var temparray = new Array





    await timer(10000)
    let headerrowcount = document.querySelector("#explore-results-panel > div.non-empty-state > ng-transclude > div > lk-dataflux-data-table > lk-vis-table > div > div > div.lk-vis-table-main-wrapper > table > thead > tr").childElementCount


    let reportname = document.querySelector("#lk-react-container > div > div > div > section > explore-subrouter > ui-view > lk-explore-dataflux > lk-explore-header > div.title-block > lk-title-editor > div:nth-child(1) > span").innerText
    temparray.push(reportname)


    for(let i = 2; i < headerrowcount + 1; i++){

        let temp
        let temp2

        try{temp = document.querySelector(`#explore-results-panel > div.non-empty-state > ng-transclude > div > lk-dataflux-data-table > lk-vis-table > div > div > div.lk-vis-table-main-wrapper > table > thead > tr > th:nth-child(${i}) > div > span > span > span.field-name > span:nth-child(1)`)}catch{temp = "fail1"}

        try{temp2 = document.querySelector(`#explore-results-panel > div.non-empty-state > ng-transclude > div > lk-dataflux-data-table > lk-vis-table > div > div > div.lk-vis-table-main-wrapper > table > thead > tr > th:nth-child(${i}) > div > span > span > span.view-name.remove-if-truncate`)}catch{temp2 = "fail2"}
        temparray.push(temp2.outerText.replaceAll(" ","")+ "-" + temp.outerText.replaceAll(" ",""))



    }
    console.log(temparray)




    var winRef = window.parent.opener
    winRef.postMessage(temparray, "*")
    window.parent.close()



}




