// Configure the AWS SDK
AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:d67a078c-2f97-4551-8d7a-c1a25b4970c3'
});

// Create an S3 client
const s3 = new AWS.S3();

document.getElementById('upload-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file to upload.');
        return;
    }

    const key = `${file.name}`;
    const params = {
        Bucket: 'support-doc-pdfs',
        Key: key,
        Body: file
    };

    s3.putObject(params, (err, data) => {
        if (err) {
            console.error('Error uploading file:', err);
            alert('An error occurred while uploading the file.');
        } else {
            console.log('File uploaded successfully:', data);
            alert('File uploaded successfully!');
        }
    });
});

function startFindAdx(selectedPDF){
    var someval = Math.floor(Math.random() * 100);
    $("#addresses").text("Addresses found:" + someval);
    var ADX_URL = 'https://du2c8lhymg.execute-api.us-east-1.amazonaws.com/getObject?method=findadx&action=normal&data='+selectedPDF;
    
    $.ajax({
            url: ADX_URL,
            type: 'GET',
            dataType: 'json',
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            success: function(data){
              
            }
    });
}

function checkForAdx(){
    var ADX_URL = 'https://du2c8lhymg.execute-api.us-east-1.amazonaws.com/getObject?method=globe&action=checkadx&data=none';
    
    $.ajax({
            url: ADX_URL,
            type: 'GET',
            dataType: 'json',
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            success: function(data){                        
                $("#globeloc").html("<p>"+JSON.stringify(data)+"</p>");                           
            }
    });
}

function init(){
  var API_URL = 'https://du2c8lhymg.execute-api.us-east-1.amazonaws.com/getObject?method=search&action=normal&data=none';
    $.ajax({
      url: API_URL,
      type: 'GET',
      dataType: 'json',
          headers: {'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'},
      success: function(data){                              
          fileStr = JSON.stringify(data);
          fileStr_ = fileStr.slice(1,-1);
          fileArr = fileStr_.split(',');

          $('#upload-list #entries').html('<table id="filelist" class="table"></table>');
          $('table#filelist').append('<thead />');
          $('thead').append('<tr />');
          $('thead tr').append('<th scope="col">Row</th>');
          $('thead tr').append('<th scope="col">Filename</th>');
          $('thead tr').append('<th scope="col">Date</th>');
          $('table#filelist').append('<tbody />');
                        
          for(x in fileArr){
            f = fileArr[x].replace(/"/g, '');    
            tablerow = '<tr>' +
                  '<th scope="row"><input class="form-check-input" type="radio" name="option" id="'+f+'" value="'+f+'"></th>' +
                  '<td>'+f+'</td>' +
                  '<td>2024-10-17</td>' +
                  '</tr>';
                $('tbody').append(tablerow);
          }
      }
    });
}
 

$("button#adxbtn").click(function(){
      var radioValue = $("table#filelist input[name='option']:checked").val();            
      if(radioValue){
        //startFindAdx(radioValue);
        checkForAdx(radioValue);                
      }else{
            alert('select a document');
          }      
});  

init();