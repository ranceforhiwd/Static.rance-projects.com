$(document).ready(function(){
  var API_URL = 'https://du2c8lhymg.execute-api.us-east-1.amazonaws.com/getObject?method=search&action=normal&data=none';  
              
  $.ajax({
        url: API_URL,
        type: 'GET',
        dataType: 'json',
        headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'
},
        success: function(data){                              
            fileStr = JSON.stringify(data);
            fileStr_ = fileStr.slice(0,-1);
            fileArr = fileStr_.split(',');

            $('#upload-list #entries').html('<table id="filelist" class="table"></table>');
            $('table#filelist').append('<thead />');
            $('thead').append('<tr />');
            $('thead tr').append('<th scope="col">Row</th>');
            $('thead tr').append('<th scope="col">Filename</th>');
            $('thead tr').append('<th scope="col">Date</th>');
            $('table#filelist').append('<tbody />');
                          
            for(x in fileArr){
              tablerow = '<tr>' +
                    '<th scope="row"><input class="form-check-input" type="radio" name="option" id="gridRadios" value="'+fileArr[x]+'"></th>' +
                    '<td>'+fileArr[x].replace(/"/g, '');+'</td>' +
                    '<td>2016-05-25</td>' +
                    '</tr>';
                  $('tbody').append(tablerow);
            }
            
        }
  });

  
    
    
  });

  