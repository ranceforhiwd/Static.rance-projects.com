function flynow(){
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 1400),
    duration: 20
  });  
}