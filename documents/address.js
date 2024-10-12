var API_URL = 'https://du2c8lhymg.execute-api.us-east-1.amazonaws.com/getObject';

$.ajax({
    url: API_URL,
    type: 'GET',
    dataType: 'json',
    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'
},
    success: function(data){                              
        adxStr = JSON.stringify(data);
        adxArr = adxStr.split(',');

        $('#globe #addresses').htm('<table id="adx" class="table"></table>');
        $('table#adx').append('<thead />');
        $('thead').append('<tr />');
        $('thead tr').append('<th scope="col">Row</th>');
        $('thead tr').append('<th scope="col">City</th>');
        $('thead tr').append('<th scope="col">Zipi</th>');
        $('table#adx').append('<tbody />');
                      
        for(x in adxArr){
          tablerow = '<tr>' +
                '<th scope="row"><input class="form-check-input" type="radio" name="gridRadios" id="gridRadios" value="option"></th>' +
                '<td>'+adxArr[x]+'</td>' +
                '<td>2020-05-09</td>' +
                '</tr>';
              $('tbody').append(tablerow);
        }
        
    }
});