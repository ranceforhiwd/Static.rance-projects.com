//test append to page before ajax call
$("#upload-list #entries").append('<p>Hi World</p>');
var API_URL = 'https://du2c8lhymg.execute-api.us-east-1.amazonaws.com/getObject';  
              
  $.ajax({
        url: API_URL,
        type: 'GET',
        dataType: 'json',
        headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'
},
        success: function(data){                              
            fileStr = JSON.stringify(data);
            fileArr = fileStr.split(',');

            $('#upload-list #entries').append('<table id="filelist" class="table"></table>');
            $('table#filelist').append('<thead />');
            $('thead').append('<tr />');
            $('thead tr').append('<th scope="col">Row</th>');
            $('thead tr').append('<th scope="col">Filename</th>');
            $('thead tr').append('<th scope="col">Date</th>');
            $('table#filelist').append('<tbody />');
                          
            for(x in fileArr){
              tablerow = '<tr>' +
                    '<th scope="row"><input class="form-check-input" type="radio" name="gridRadios" id="gridRadios" value="option"></th>' +
                    '<td>'+fileArr[x]+'</td>' +
                    '<td>2016-05-25</td>' +
                    '</tr>';
                  $('tbody').append(tablerow);
            }
            
        }
  });

  $.ajax({
      url: API_URL,
      type: 'GET',
      dataType: 'json',
      headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'
},
      success: function(data){                              
          adxStr = JSON.stringify(data);
          adxArr = adxStr.split(',');

          $('#globe #addresses').append('<table id="adx" class="table"></table>');
          $('table#adx').append('<thead />');
          $('thead').append('<tr />');
          $('thead tr').append('<th scope="col">Row</th>');
          $('thead tr').append('<th scope="col">Filename</th>');
          $('thead tr').append('<th scope="col">Date</th>');
          $('table#adx').append('<tbody />');
                        
          for(x in adxArr){
            tablerow = '<tr>' +
                  '<th scope="row"><input class="form-check-input" type="radio" name="gridRadios" id="gridRadios" value="option"></th>' +
                  '<td>'+adxArr[x]+'</td>' +
                  '<td>2016-05-25</td>' +
                  '</tr>';
                $('tbody').append(tablerow);
          }
          
      }
});
