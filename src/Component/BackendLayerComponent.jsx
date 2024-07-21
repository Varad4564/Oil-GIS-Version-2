import React from 'react'
import {GeoJSON, useMap} from 'react-leaflet'
import { parse as parseWKT } from 'terraformer-wkt-parser';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function BackendLayerComponent({layerBoundState, setBackendSelectedGeometryInfoArray}) {

  let selectedLayerFillOpacity = useSelector((state)=>state.SelectedLayerFillOpacityArrayState);

  const geojsonStyle = {
    fillColor: '#5a8fe8',
    color: '#5a8fe8',
    fillOpacity: 0.4,  // Set the fill transparency
    opacity: 0.8       // Set the border transparency
  };

  function returnStyleObject(value) {
    return {
      fillColor: '#5a8fe8',
      color: '#5a8fe8',
      fillOpacity: value,  // Set the fill transparency
      opacity: 0.8       // Set the border transparency
    };
  }

    let map = useMap();

    useEffect(()=>{
        if(layerBoundState){
            // map2.fitBounds(layerBoundState);
            // console.log("Bound zoom = "+map2.getBoundsZoom(layerBoundState));
            // console.log(layerBoundState.getCenter());
            let boundZoom = (map.getBoundsZoom(layerBoundState)-0.2);
            if(boundZoom>18){
                boundZoom = 18;
            }
            map.flyTo([layerBoundState.getCenter().lat, layerBoundState.getCenter().lng],boundZoom);
        }
    },[layerBoundState]);

    let selectedLayerArray = useSelector((state)=>state.SelectedLayerArrayState);

    function createPopupContent2(keyValueEntities, layer){
      
        // console.log(layer instanceof L.Polygon);

        const container = document.createElement('div');
        container.classList.add('upper-popup-div');
  
        const verticalTableFlexContainer = document.createElement('div')
        verticalTableFlexContainer.classList.add('popup-vertical-flex');
      
        const Header = document.createElement('div');
        // Header.classList.add('flex-div-popup');
        Header.classList.add('popup-header');
  
        const headerKey = document.createElement('p')
        headerKey.classList.add('flex-div-equal-items');
        headerKey.innerText = 'key';
  
        const headervalue = document.createElement('p')
        headervalue.classList.add('flex-div-equal-items');
        headervalue.innerText = 'value';
  
        Header.appendChild(headerKey);
        Header.appendChild(headervalue);
      
        verticalTableFlexContainer.appendChild(Header);
  
        container.appendChild(verticalTableFlexContainer);
  

        let slicedArray = null;
        
        console.log(layer instanceof L.Polygon);
        console.log(layer instanceof L.Polyline);

        if(layer instanceof L.Polyline && !(layer instanceof L.Polygon)){
          slicedArray = keyValueEntities.slice(0,1);
        }
        else{
          // console.log();
          slicedArray = keyValueEntities.slice(0,2);
        }

        slicedArray.forEach((entity)=>{
            
            const infoDiv = document.createElement('div');
            infoDiv.classList.add('flex-div-popup');
  
            const infoDivKey = document.createElement('p')
            infoDivKey.classList.add('flex-div-equal-items');
            infoDivKey.innerText = `${entity.key}`;
  
            const infoDivValue = document.createElement('p')
            infoDivValue.classList.add('flex-div-equal-items');
            infoDivValue.innerText = `${entity.value}`;
  
            infoDiv.appendChild(infoDivKey);
            infoDiv.appendChild(infoDivValue);
  
            verticalTableFlexContainer.appendChild(infoDiv);
  
        })
  
        const buttonContainer = document.createElement('div'); 
        buttonContainer.classList.add('button-container-center');
  
        const moreInfoBtn = document.createElement('button');
        moreInfoBtn.innerText = 'more-info';
        moreInfoBtn.classList.add('popup-addrow-btn');
        moreInfoBtn.onclick = () => {
          console.log('more info btn clicked');
          if(layer instanceof L.Polyline && !(layer instanceof L.Polygon)){
            setBackendSelectedGeometryInfoArray(keyValueEntities.slice(1));
          }
          else{
            setBackendSelectedGeometryInfoArray(keyValueEntities.slice(2));
          }
          // console.log(keyValueEntities.slice(2));
        };

        const closeBtn = document.createElement('button');
        closeBtn.innerText = 'Close';
        closeBtn.classList.add('popup-close-btn');
        closeBtn.onclick = () => {
          layer.closePopup();
        };

        buttonContainer.appendChild(moreInfoBtn);
        buttonContainer.appendChild(closeBtn);
  
        container.appendChild(buttonContainer);
  
        return container;
    }

    return (
        <>
            {
              selectedLayerArray.array.map((individuallayer, index)=>{
                return (
                
                  individuallayer.shapeWktEntities.map((singleLayer)=>{
                    let geoJsonObject = singleLayer.largeString;
                    // console.log(selectedLayerFillOpacity.array[index].fillOpacity);
                    return(
                      <GeoJSON key={singleLayer.id} style={returnStyleObject(selectedLayerFillOpacity.array[index].fillOpacity)} data={parseWKT(geoJsonObject)} onEachFeature={(feature, layer)=>{
                          const popupContent = createPopupContent2(singleLayer.keyValueEntities, layer);
                          layer.bindPopup(popupContent);
                      }}/>
                    )
                  })
                )

                //returnStyleObject
                //style={{fillOpacity:selectedLayerFillOpacity.array[index].fillOpacity}}



                // let geoJsonObject = individuallayer.shapeWktEntities[1].largeString
                // console.log(geoJsonObject);
                // return(
                //   <GeoJSON key={individuallayer.shapeWktEntities[1].id} data={parseWKT(geoJsonObject)}/>
                // )

              })
            }
        </>
    )
}

export default BackendLayerComponent;
