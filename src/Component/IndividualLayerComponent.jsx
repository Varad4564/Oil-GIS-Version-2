// import { geoJSON } from 'leaflet';
import React, { useState } from 'react'
import { parse as parseWKT } from 'terraformer-wkt-parser';
import { useDispatch } from 'react-redux';
import { addLayer, removeLayer } from '../ReduxRelated/Slices/SelectedLayerArraySlice';

import { addLayerFillOpacity, editLayerFillOpacity, removeLayerFillOpacity } from '../ReduxRelated/Slices/SelectedLayerFillOpacityArraySlice';



function IndividualLayerComponent({individualComponent, setLayerBoundState}) {


  const dispatch = useDispatch();

  let [fillOpacityState, setFillOpacityState] = useState(0.5);

  function handleCheckBox(event, id) {

    // console.log(event.target.checked);
    // console.log(event);
    if(event.target.checked){
      // console.log(id);
      
      fetch(`http://localhost:8084/getLayerById/${id}`,{
        method:"GET",
        headers:{
          "Content-Type":"application/json",
        }
      }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parse the JSON response
      })
      .then(data => {
        // setAdministrativeLayerList(data);
        console.log('Success:', data);
        let geoJsonObject = {
          "type": "FeatureCollection",
          "features": [],
        };

        let geoJsonFeatures = data.shapeWktEntities.map(singleLayerObject => {
          let shapeObject = parseWKT(singleLayerObject.largeString);
          // console.log((shapeObject));
          // console.log(L.geoJSON(shapeObject));
          return {
            "type": "Feature",
            "geometry": shapeObject,
          }
        });
        
        geoJsonObject["features"] = geoJsonFeatures;

        // console.log(geoJsonObject);
        // console.log(L.geoJSON(geoJsonObject).getBounds());
        

        let geoJsonObjectBound = L.geoJSON(geoJsonObject).getBounds();

        setLayerBoundState(geoJsonObjectBound);

        dispatch(addLayer(data));
        dispatch(addLayerFillOpacity({layerid: data.id,fillOpacity: 0.5}));
        setFillOpacityState(0.5);

      })
      .catch(error => {
        console.error('Error:', error);
      });
      
    }
    else{
      dispatch(removeLayer(id));
      dispatch(removeLayerFillOpacity(id));
      setFillOpacityState(0.5);
    }
  }

  function handleRangeValueChange(event, id){
    dispatch(editLayerFillOpacity({layerid: id,fillOpacity: event.target.value}));
    setFillOpacityState(event.target.value);
  }

  return (
    <div className='layers-container'>
        
        <div className="check-box-div">
            <input type="checkbox" onChange={(event)=>{
              // console.log(event.target.checked);
              handleCheckBox(event,individualComponent.id);
            }}/>
        </div>

        <div className="location-transperancy-div">
            <div>{individualComponent.layerName}</div>

            <div className="transperancy-div">
                <label htmlFor="transparency-slider" className="slider-label">Transparency:</label>
                <input type="range" min="0" max="1" step="0.01" value={fillOpacityState} className="slider-input" id="transparency-slider" onChange={(event)=>handleRangeValueChange(event, individualComponent.id)} />
                <input type="number" min="0" max="1" className="value-input" id="transparency-value"></input>
            </div>
        </div>

    </div> 
  )
}

export default IndividualLayerComponent
