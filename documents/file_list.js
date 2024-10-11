//test append to page before ajax call
  $("#entries").append('<p>Hi World</p>');
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

              $('#entries').append('<table class="table"></table>');
              $('table').append('<thead />');
              $('thead').append('<tr />');
              $('thead tr').append('<th scope="col">Row</th>');
              $('thead tr').append('<th scope="col">Filename</th>');
              $('thead tr').append('<th scope="col">Date</th>');
              $('table').append('<tbody />');
              
              tablerow = '<tr>' +
                      '<th scope="row"><input class="form-check-input" type="radio" name="gridRadios" id="gridRadios" value="option"></th>' +
                      '<td>filename.txt</td>' +
                      '<td>2016-05-25</td>' +
                    '</tr>';
              $('tbody').append(tablerow);
              
              for(x in fileArr){
                $('#entries').append('<p>'+x+':'+fileArr[x]+'</p>');
              }
              
          }
    });   