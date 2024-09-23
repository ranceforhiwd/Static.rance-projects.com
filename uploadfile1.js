

(function () {
    var accessKeyId,secretKeyId,originId;
    var s3;
    var pdfJsonData = '';
    var apiURL = 'https://b33pveimi1.execute-api.us-east-1.amazonaws.com/dev/simpleLambda';
    
    /* BEGINING FOR INTIAL CODE SETUP WHILE LOADING PAGE
        Written by Hemanth on 18/06/2024
        Load initial page with objects
    */
    setInitialStep();


    async function setInitialStep() {
        await prepareS3Object();
        
    }

    async function prepareS3Object() {

        const form = new FormData();
        form.append('process', 'S3Upload')
        form.append('user', 'getCredentialObject')

        await $.ajax({
            type: "POST",
            url: apiURL,
            enctype: 'multipart/form-data',
            data: JSON.stringify(Object.fromEntries(form)), 
            headers :{
                'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
            },
            success: function(response){
                
                console.log("test",response);
                if(response != '') {
                    if(response.validateUser == true){
                      $("#sample-ajax-button").show();
                    }
                    accessKeyId = response.accessKey;
                    secretKeyId = response.secretKey;
                    originId = response.region;

                    s3 = new AWS.S3({
                            credentials: {
                            accessKeyId: accessKeyId,
                            secretAccessKey: secretKeyId,
                            region: originId
                            }
                        });
                    connectS3();
                }
            }
        }); 
    }

    async function connectS3() {

        var params = {
            Bucket: "support-doc-pdfs",
        };

        await s3.listObjectsV2(params, async function (err, data) {
            if (await err) {
            console.log(err, err.stack); // an error occurred
            } else { 
            
            let filelistInfo = await data;
            let filesObject = filelistInfo.Contents;
            let filesList = '';
            let filesArray =[];
            for (var i in filesObject) {
                filesList = filesList + filesObject[i].Key+ ',';
                filesArray[i]= filesObject[i].Key;
            }
            
            let files = filesList.substring(0, filesList.length - 1);
            document.getElementById("listOfPdfFiles").value = files;
            document.getElementById("selectedFile").value =filesArray[0];
            document.getElementById("currentFile").innerHTML = filesArray[0];
            let pdfName = filesArray[0];
            await readPngFiles();
            await prepareObject(pdfName);
            }
        });
    }

  /*
    Written by Hemanth on 18/06/2024
    read png files from support-docs-pngs based on current pdf
  */
    async function readPngFiles() {
        let currentFile = document.getElementById("selectedFile").value;
        
        var params = {
        Bucket: "support-docs-pngs",
        Prefix: currentFile+"_folder/",
        };
        
        s3.listObjectsV2(params, async function (err, data) {
        if (await err){
        console.log(err, err.stack); // an error occurred
        } else {
        let pngData1 = await data;
        let pngData = data.Contents;
        
        const signedUrlExpireSeconds = 60 * 1;
        var imgDetails = '';
        for (var i = 0; i < pngData.length; i++) {
          let pngFile = pngData[i].Key;
          const url = s3.getSignedUrl('getObject', {
            Bucket: "support-docs-pngs",
            Key: pngFile,
            Expires: signedUrlExpireSeconds
          })
          imgDetails = imgDetails+'<img src="'+url+'" style="width:100%;"><br>';
        }
        document.getElementById("showImages").innerHTML = imgDetails;
        
        }
        });
    }
/*
  Written by Hemanth on 18/06/2024
  get all png page object details from api
  */
  async function prepareObject(pdfName) {

    

    //setup the form data
    const form = new FormData();
    form.append('process', pdfName)
    form.append('user', 'getObjectInfo')
    
    let result = $.ajax({
        type: "POST",
        url: apiURL,
        enctype: 'multipart/form-data',
        data: JSON.stringify(Object.fromEntries(form)), 
        headers :{
            'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
        },
        success: function(result){
            console.log("filejsondata",result);
            
            if(result.Count > 0) {
                //const response
                pdfJsonData = result.Items;
              }
        }
    }); 

    
  }
  /* ENDING FOR MOVE PREVIOUS AND NEXT BUTTON LINKS */


/* STARTING CODE BLOCK FOR UPLOAD FILE */    


var button = document.getElementById('upload-button');
var testAjaxCall = document.getElementById('sample-ajax-button');

button.addEventListener('click', function(){
    uploadFile();

});

async function uploadFile() {
   
    var bucketName = 'support-doc-pdfs';
    var user_id = document.getElementById("userId");
    var loan_id = document.getElementById("loanId");
    var selectedReports = []
    var optionString = '';
    var reportCheckboxes = document.querySelectorAll('input[type=checkbox]:checked')
    for (var i = 0; i < reportCheckboxes.length; i++) {
        selectedReports.push(reportCheckboxes[i].value)
        //tag setting
        optionString += 'key'+(i + 1) + '=' + reportCheckboxes[i].value + "&";
    }
    // additional tag setting
    if(reportCheckboxes.length > 0) {
        optionString += 'userId='+ user_id.value +'&loanId=' + loan_id.value;
    }
       
    var fileChooser = document.getElementById('fileToUpload');
    var file = fileChooser.files[0];
    if(typeof file == 'undefined' ||file == '') {
        alert("select file");
        return false;
    }

    if(accessKeyId != '' && secretKeyId != '') {
        s3 = new AWS.S3({
            credentials: {
              accessKeyId: accessKeyId,
              secretAccessKey: secretKeyId,
              region: originId
            }
        });
        var objKey = file.name;
        var params = {
                        Bucket: bucketName,
                        Key: objKey,
                        ContentType: file.type,
                        Body: file,
                        Tagging: optionString
                        // ACL: 'public-read'
                    };
        s3.putObject(params, function(err, data) {
            if (err) {
                document.getElementById("loading").style.display = "none";
                console.log(err);
            } else {
                document.getElementById("loading").style.display = "none";
                console.log('good upload');
            }
        });
    }
}
/* END CODE BLOCK FOR UPLOAD FILE */  

/* BEGINING FOR MOVE NEXT AND PREVIOUS PAGES
      Written by Hemanth on 18/06/2024
      event for move next pdf
  */
 /* Begin move next and previous buttons */
/* Code for calling next and previous button calls  */
document.getElementById("nextArrow").addEventListener("click", function(){moveNext();});
document.getElementById("previousArrow").addEventListener("click", function(){movePrevious();});
/* End move next and previous buttons */

      function moveNext(){
        allFiles = document.getElementById("listOfPdfFiles").value; 
        let fileList = allFiles.split(",");
        let currentFileName = document.getElementById("selectedFile").value;
        var currentPosition =0;
        
        let selIndex = 0;
        for(i=0;i<fileList.length;i++) {
        
        if(fileList[i] == currentFileName) {
        currentPosition = i;
        break;
        }
        }
        if(parseInt(currentPosition) == fileList.length - 1){
        var next =0;
        }else{
        var next = parseInt(currentPosition)+1;
        }
        let nextvalue = fileList[next];
        document.getElementById("selectedFile").value =nextvalue;
        document.getElementById("currentFile").innerHTML = nextvalue;
        readPngFiles();
        prepareObject(nextvalue);
      }
    
      /*
        Written by Hemanth on 18/06/2024
        event for loading previous pdf
      */
    
      function movePrevious(){
        allFiles = document.getElementById("listOfPdfFiles").value;
        let fileList = allFiles.split(",");
        let currentFileName = document.getElementById("selectedFile").value;
        var currentPosition =0;
        
        let selIndex = 0;
        for(i=0;i<fileList.length;i++) {
        
        if(fileList[i] == currentFileName) {
        currentPosition = i;
        break;
        }
        }
        if(parseInt(currentPosition) == 0){
        var previous =fileList.length - 1;
        }else{
        var previous = parseInt(currentPosition)-1;
        }
        let previousvalue = fileList[previous];
        document.getElementById("selectedFile").value =previousvalue;
        document.getElementById("currentFile").innerHTML = previousvalue;
        readPngFiles();
        prepareObject(previousvalue);
      }
/* ENDING CODE BLOCK FOR UPLOAD FILE */

/* STARTING CODE BLOCK FOR MANUAL SEARCH */

document.getElementById("search").addEventListener("click", function() {
    let keyword = document.getElementById("keyword").value;
    if(keyword == '') {
      alert("Enter keyword");
      return false;
    }
    document.getElementById("loading").style.display = "block";
    let currentPDF = document.getElementById("currentFile").innerHTML;
    
    serchkey(keyword, currentPDF);
  });

  /*
    Written by Hemanth on 18/06/2024
    event for manual search
  */

  async function serchkey(keyword, currentPDF){

    var result = '';
    document.getElementById("loading").style.display = "block";
    pngFilesList = '';
    
    if(pdfJsonData != '') {
      let searchword = keyword.toLowerCase();
      var page = 1;
      var coordinatesData = []
      let pngfilename;
      let totalPages =0;

      // sort pdf json data
      pdfJsonData.sort((a, b) => {
        return a.page - b.page;
      });

      for(i=0;i<pdfJsonData.length;i++) {
        var wordCount = 0;
        let pngFile = pdfJsonData[i].text;
        let coordinateData = JSON.parse(pngFile);
        pngfilename = pdfJsonData[i].pngfilename;
        let pg = pngfilename.split('~');
        let pgCount = pg[1].split('.png');
        await deleteSingleMarkuopFromS3(currentPDF,pngfilename);
        
        for (j in coordinateData)
        {
          if(coordinateData[j]["text"] != '' && typeof(coordinateData[j]["text"]) != "undefined"){
            var dt = coordinateData[j]["text"];
            var paraText = dt.toLowerCase();
            
            if(paraText.includes(searchword)) {
              wordCount = wordCount +1;
              let newObject = {
                x: coordinateData[j]['x'],
                y: coordinateData[j]['y'],
                height: coordinateData[j]['height'],
                width: coordinateData[j]['width'],
                page: coordinateData[j]['page'],
                text: coordinateData[j]['text'],
                pngfilename: pdfJsonData[i].pngfilename
              }
              coordinatesData.push(newObject)
            }
          }
        }
        if(wordCount != 0) {
          result = result+"<br>"+ '<a href="javascript:void(0);" onclick=movePage("'+pgCount[0]+'")> Page '+page+' keyword '+keyword+' is found '+wordCount+' times </a>';
          totalPages = totalPages + 1;
        }
        page = page+1;
      }

      // group by page
      var groupBy = function(xs, key) {
        return xs.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      }; 

      // group the coordinatesdata by page
      let data = groupBy(coordinatesData, 'page')

      // Check if the user is autheticated
      
      let fileArray = [];
      let processPages =0;
      Object.keys(data).forEach(function(key) {
        let fileName = data[key][0].pngfilename;
        processPages = processPages + 1;
        sendCoordinates(data[key],currentPDF,totalPages,processPages);
        fileArray.push(fileName);
      });
      checkFilesInBucket(fileArray,currentPDF) ;
    }
    
    document.getElementById("result").innerHTML=result;
  }

  async function checkFilesInBucket(fileArray,currentPDF) {
    let totalPages = fileArray.length;
    for(i=0;i<fileArray.length;i++) {
        let currentPage = i+1;
        await checkSingleFileExistOrNot(fileArray[i],currentPDF,totalPages,currentPage); 
    }
  }

  /*
  Written by Hemanth on 18/06/2024
  send page coordinates to api 
  */
  async function sendCoordinates(coordinatesData,currentPDF,totalPages,processPages) {
    try {
        
        const form = new FormData();
        form.append('process', 'searchResult')
        form.append('user', 'searchResult')
        form.append('coordinatesData', JSON.stringify(coordinatesData))

        await $.ajax({
            type: "POST",
            url: apiURL,
            data: JSON.stringify(Object.fromEntries(form)), 
            headers :{
                'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
            },
            success: function(response){
                console.log("checkfilestatus",response);
            }
        });
    } catch(err) {
        console.log(err)
    }   
  }

  /*
    Written by Hemanth on 18/06/2024
    after creating markup check new file is exist or not in markup bucket
  */
    async function checkSingleFileExistOrNot(pngName,currentPDF,totalPages,processPages) {
   
        if(pngName != '' && typeof(pngName) != "undefined")  {
            
            let keyValue = currentPDF+"_folder/"+ pngName.replace('./','').replace('.png','.png_map_report.png');
            var params = {
            Bucket: "markup-images",
            Prefix: keyValue,
            };
            
            await s3.listObjectsV2(params, async function (err, data) {
              if (await err){
                  console.log(err, err.stack); // an error occurred
              } else {
                  let filelistInfo = await data;
                  let pngData = filelistInfo.Contents;
                  
                  if(pngData.length == 0) {
                    
                    setTimeout(function(){
                      checkSingleFileExistOrNot(pngName,currentPDF,totalPages,processPages);
                  }, 4000);
                    
                  } else {
                    await loadSingleMarkupImages(pngName,currentPDF,totalPages,processPages);
                  }
            
              }
            });
        }
        
    }
    async function loadSingleMarkupImages(pngName,currentPDF,totalPages,processPages) {
      
        let keyValue = currentPDF+"_folder/"+ pngName.replace('./','').replace('.png','.png_map_report.png');
        var params = {
        Bucket: "markup-images",
        Prefix: keyValue,
        };
        const signedUrlExpireSeconds = 60 * 1;
        const url = s3.getSignedUrl('getObject', {
            Bucket: "markup-images",
            Key: keyValue,
            Expires: signedUrlExpireSeconds
        })
      
        pngFilesList = pngFilesList+'<img src="'+url+'" style="width:100%;" id="pg_"><br>';
    
        if(pngFilesList != '') {
            document.getElementById("showImages").innerHTML = '';
            document.getElementById("showImages").innerHTML = pngFilesList;
        }
        if(totalPages == processPages) {
            document.getElementById("loading").style.display = "none";   
        }
    }

    async function deleteSingleMarkuopFromS3(currentPDF,pngName){
    
        try {
            
            let fileName = currentPDF+"_folder/"+pngName.replace('./','').replace('.png','.png_map_report.png');
            
            const form = new FormData();
            form.append('process', 'deleteExistingFile')
            form.append('user', 'deleteExistingFile')
            form.append('fileName', fileName)

            await $.ajax({
                type: "POST",
                url: apiURL,
                data: JSON.stringify(Object.fromEntries(form)), 
                headers :{
                    'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
                },
                success: function(response){
                    
                    console.log("fiileDeelted",response);
                    
                }
            });
            
            
        } catch(err) {
            console.log(err)
        } 
      }

})();
