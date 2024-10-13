$(document).ready(function(){
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

            $('#upload-list #entries').html('<table id="filelist" class="table"></table>');
            $('table#filelist').append('<thead />');
            $('thead').append('<tr />');
            $('thead tr').append('<th scope="col">Row</th>');
            $('thead tr').append('<th scope="col">Filename</th>');
            $('thead tr').append('<th scope="col">Date</th>');
            $('table#filelist').append('<tbody />');
                          
            for(x in fileArr){
              tablerow = '<tr>' +
                    '<th scope="row"><input class="form-check-input" type="radio" name="option" id="gridRadios" value="'+x+'"></th>' +
                    '<td>'+fileArr[x]+'</td>' +
                    '<td>2016-05-25</td>' +
                    '</tr>';
                  $('tbody').append(tablerow);
            }
            
        }
  });

  $("input[type='button']").click(function(){
      var radioValue = $("input[name='option']:checked").val();
        if(radioValue){
            alert("Your are a - " + radioValue);
            gonow();
        }
    });
    
    function gonow(){
        // Fly the camera to San Francisco at the given longitude, latitude, and height.
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 11400),
        orientation: {
          heading:Cesium.Math.toRadians(0.0),
        },
        duration:25,
        complete: function(){
          viewer.camera.flyTo({
            destination:Cesium.Cartesian3.fromDegrees(-80.8431,35.2271, 900),
            orientation:{
              heading:Cesium.Math.toRadians(0.0)
            },
            duration:25
          })
        }
      });
    }






  });

  