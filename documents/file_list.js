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

            $('#upload-list #entries').append('<table class="table"></table>');
            $('table').append('<thead />');
            $('thead').append('<tr />');
            $('thead tr').append('<th scope="col">Row</th>');
            $('thead tr').append('<th scope="col">Filename</th>');
            $('thead tr').append('<th scope="col">Date</th>');
            $('table').append('<tbody />');
                          
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
    

    function globe(){
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNjViMzZhNS00MGJlLTQ4YTktOWUzNS1mYjNkZjNkYjViMmYiLCJpZCI6MzQyMjcsImlhdCI6MTYwMDAzNTkxMX0.EQBtegHNt-HolrydRiNV0gD75tu0cbpo57K-Hwfcu4E';

      // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
      const viewer = new Cesium.Viewer('cesiumContainer', {
        terrain: Cesium.Terrain.fromWorldTerrain(),
      });    

      // Fly the camera to San Francisco at the given longitude, latitude, and height.
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 11400),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
        },
        duration: 20
      });

      // Add Cesium OSM Buildings, a global 3D buildings layer.
      const buildingTileset = await Cesium.createOsmBuildingsAsync();
      viewer.scene.primitives.add(buildingTileset);
    }