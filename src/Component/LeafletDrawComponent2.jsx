import React, { useEffect, useState } from 'react';
import L, { marker } from 'leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import * as turf from '@turf/turf';
import {FeatureGroup, useMap} from 'react-leaflet'

import { useSelector } from 'react-redux';
import { parse as parseWKT } from 'terraformer-wkt-parser';

// =========================================== The following Code is related to leaflet draw. Begin ===========================================

L.Edit.Circle = L.Edit.CircleMarker.extend({
    _createResizeMarker: function () {
      var center = this._shape.getLatLng(),
        resizemarkerPoint = this._getResizeMarkerPoint(center)
  
      this._resizeMarkers = []
      this._resizeMarkers.push(this._createMarker(resizemarkerPoint, this.options.resizeIcon))
    },
  
    _getResizeMarkerPoint: function (latlng) {
      var delta = this._shape._radius * Math.cos(Math.PI / 4),
        point = this._map.project(latlng)
      return this._map.unproject([point.x + delta, point.y - delta])
    },
  
    _resize: function (latlng) {
      var moveLatLng = this._moveMarker.getLatLng()
      var radius
  
      if (L.GeometryUtil.isVersion07x()) {
        radius = moveLatLng.distanceTo(latlng)
      }
      else {
        radius = this._map.distance(moveLatLng, latlng)
      }
  
      // **** This fixes the cicle resizing ****
      this._shape.setRadius(radius)
  
      this._map.fire(L.Draw.Event.EDITRESIZE, { layer: this._shape })
    }
})

// ============================================ The following Code is related to leaflet draw. End ============================================



// ======================================== This code is used for validation of input in popup. Begin  ========================================

const isOnlyWhitespace = (str) => /^\s*$/.test(str);

// ========================================= This code is used for validation of input in popup. End  =========================================

function LeafletDrawComponent2({featureGrpRef, setShowDataAddingDailogue, setClickedLayerId, setDrawnLayerInfoMap, drawnLayerInfoMap}) {


// ============================ Following functions are for creating the popup contents of leaflet draw. Begin ============================
  
    function createPopupContent(layer, calculatedInfoObject){
      const container = document.createElement('div');
      container.classList.add('upper-popup-div');
  
      const verticalTableFlexContainer = document.createElement('div')
      verticalTableFlexContainer.classList.add('popup-vertical-flex');
  
      const layerName = document.createElement('div');
      layerName.classList.add('layer-name-div');
  
      const layerNameInput = document.createElement('input');
      layerNameInput.classList.add('layer-name-input');
      layerNameInput.placeholder = "layer name";
  
      const Header = document.createElement('div');
      // Header.classList.add('flex-div-popup');
      Header.classList.add('popup-header');
  
      const headerKey = document.createElement('p')
      headerKey.classList.add('flex-div-equal-items');
      headerKey.innerText = 'key';
  
      const headervalue = document.createElement('p')
      headervalue.classList.add('flex-div-equal-items');
      headervalue.innerText = 'value';
  
      layerName.appendChild(layerNameInput);
  
      Header.appendChild(headerKey);
      Header.appendChild(headervalue);
  
      verticalTableFlexContainer.appendChild(layerName);
      verticalTableFlexContainer.appendChild(Header);
        
    //   setSampleState("Dummy data");
    //   console.log(sampleState);
    //   setSampleState2("Dummy data");
    //   console.log(sampleState2);
          
      let type;
      if (layer instanceof L.Marker) {
  
        const latDiv = document.createElement('div');
        latDiv.classList.add('flex-div-popup');
  
        const latDivKey = document.createElement('p')
        latDivKey.classList.add('flex-div-equal-items');
        latDivKey.innerText = 'Latitude';
  
        const latDivValue = document.createElement('p')
        latDivValue.classList.add('flex-div-equal-items');
        latDivValue.innerText = `${calculatedInfoObject.lat.toFixed(4)}`;
  
        latDiv.appendChild(latDivKey);
        latDiv.appendChild(latDivValue);
  
        const lngDiv = document.createElement('div');
        lngDiv.classList.add('flex-div-popup');
  
        const lngDivKey = document.createElement('p')
        lngDivKey.classList.add('flex-div-equal-items');
        lngDivKey.innerText = 'Longitude';
  
        const lngDivValue = document.createElement('p')
        lngDivValue.classList.add('flex-div-equal-items');
        lngDivValue.innerText = `${calculatedInfoObject.lng.toFixed(4)}`;
  
        lngDiv.appendChild(lngDivKey);
        lngDiv.appendChild(lngDivValue);
  
        verticalTableFlexContainer.appendChild(latDiv);
        verticalTableFlexContainer.appendChild(lngDiv);          
  
      } else if (layer instanceof L.Circle) {
  
      } else if (layer instanceof L.Polygon) {
        
        const areaDiv = document.createElement('div');
        areaDiv.classList.add('flex-div-popup');
  
        const areaDivKey = document.createElement('p')
        areaDivKey.classList.add('flex-div-equal-items');
        areaDivKey.innerText = 'Area';
  
        const areaDivValue = document.createElement('p')
        areaDivValue.classList.add('flex-div-equal-items');
        areaDivValue.innerText = `${calculatedInfoObject.area.toFixed(4)} Acres`;
  
        areaDiv.appendChild(areaDivKey);
        areaDiv.appendChild(areaDivValue);
  
        const perimeterDiv = document.createElement('div');
        perimeterDiv.classList.add('flex-div-popup');
  
        const perimeterDivKey = document.createElement('p')
        perimeterDivKey.classList.add('flex-div-equal-items');
        perimeterDivKey.innerText = 'Perimeter';
  
        const perimeterDivValue = document.createElement('p')
        perimeterDivValue.classList.add('flex-div-equal-items');
        perimeterDivValue.innerText = `${calculatedInfoObject.perimeter.toFixed(4)} km`;
  
        perimeterDiv.appendChild(perimeterDivKey);
        perimeterDiv.appendChild(perimeterDivValue);
  
        verticalTableFlexContainer.appendChild(areaDiv);
        verticalTableFlexContainer.appendChild(perimeterDiv);
            
      } else if (layer instanceof L.Polyline) {
            
        const distanceDiv = document.createElement('div');
        distanceDiv.classList.add('flex-div-popup');
  
        const distanceDivKey = document.createElement('p')
        distanceDivKey.classList.add('flex-div-equal-items');
        distanceDivKey.innerText = 'Total Distance';
  
        const distanceDivValue = document.createElement('p')
        distanceDivValue.classList.add('flex-div-equal-items');
        distanceDivValue.innerText = `${calculatedInfoObject.totalDistance} km`;
  
        distanceDiv.appendChild(distanceDivKey);
        distanceDiv.appendChild(distanceDivValue);
  
        verticalTableFlexContainer.appendChild(distanceDiv);
  
      } else if (layer instanceof L.Rectangle) {
        type = 'Rectangle';
      } else {
        type = 'Unknown layer type';
      }
  
      container.appendChild(verticalTableFlexContainer);
  
      const buttonContainer = document.createElement('div'); 
      buttonContainer.classList.add('button-container');
  
      const addRowBtn = document.createElement('button');
      addRowBtn.innerText = 'Add Row';
      addRowBtn.classList.add("popup-addrow-btn");
      addRowBtn.onclick = () => {
        setShowDataAddingDailogue(true);
        setClickedLayerId(layer._leaflet_id);
      }
      buttonContainer.appendChild(addRowBtn);
  
      const submitBtn = document.createElement('button');
      submitBtn.innerText = 'Submit';
      submitBtn.classList.add("popup-submit-btn");
      submitBtn.onclick = () => submitData(layer, verticalTableFlexContainer);
      buttonContainer.appendChild(submitBtn);
  
      const closeBtn = document.createElement('button');
      closeBtn.innerText = 'Close';
      closeBtn.classList.add('popup-close-btn');
      closeBtn.onclick = () => submitData(layer, verticalTableFlexContainer);
      buttonContainer.appendChild(closeBtn);
  
      container.appendChild(buttonContainer);
  
      const fixedRows = verticalTableFlexContainer.querySelectorAll('.flex-div-popup');
  
      fixedRows.forEach((row) => {
        if(layer.sampleKey===undefined){
            layer.sampleKey={};
        }
        const key = row.childNodes[0].innerText;
        const value = row.childNodes[1].innerText;
        layer.sampleKey[key] = value;
        row.setAttribute("isSelected", "selected");
      });

      return container;
    };
  
    const addRow = (tbody) => {

      const postHeaderBodyRow1 = document.createElement('div');
      postHeaderBodyRow1.classList.add('flex-div-popup-row');
  
      const postHeaderBodyRow1Key = document.createElement('input');
      postHeaderBodyRow1Key.classList.add('flex-div-equal-items-rowCells');
  
      const postHeaderBodyRow1Value = document.createElement('input');
      postHeaderBodyRow1Value.classList.add('flex-div-equal-items-rowCells');
  
      postHeaderBodyRow1.appendChild(postHeaderBodyRow1Key);
      postHeaderBodyRow1.appendChild(postHeaderBodyRow1Value);
  
      tbody.appendChild(postHeaderBodyRow1);
    };
  
    const submitData = (layer, tbody) => {        
  
      const rows = tbody.querySelectorAll('.flex-div-popup-row');
      rows.forEach((row) => {
        if(layer.sampleKey===undefined){
            layer.sampleKey={};
        }
        const key = row.childNodes[0].value;
        const value = row.childNodes[1].value;
        if (isOnlyWhitespace(key) || isOnlyWhitespace(value)) {
            row.remove();
        }
        else{
            layer.sampleKey[key] = value;
            row.setAttribute("isSelected", "selected");
        }
      }); 

      layer.closePopup();
  
    };

// ============================ Following functions are for creating the popup contents of leaflet draw. End ============================

// ============================= Following functions are for handling various events of leaflet draw. Begin =============================
    
    const onCreated = (e) => {

      const { layer } = e;

      let type;
      let latlngArray = null;
      let calculatedInfoObject = null;

      if (layer instanceof L.Marker) {
         
        type = 'Marker';
        layer.type = 'Marker';
        latlngArray = [];
        latlngArray.push(layer.getLatLng());

        let currentLatLngObject = layer.getLatLng();

        calculatedInfoObject = {
            lat: latlngArray[0].lat,
            lng: latlngArray[0].lng,
        };

        layer.calculatedInfoArray = [["latitude",currentLatLngObject.lat],["longitude",currentLatLngObject.lng]];

      } 
      else if (layer instanceof L.Circle) {
          
        type = 'Circle';
        
      } 
      else if (layer instanceof L.Polygon) {
          
        type = 'Polygon';
        layer.type = 'Polygon';
        latlngArray = layer.getLatLngs();
        calculatedInfoObject = getPolygonMeasurement(transformPolygonArray(layer.getLatLngs()[0]));
        layer.calculatedInfoArray = getPolygonMeasurementArray(transformPolygonArray(layer.getLatLngs()[0]));

      } 
      else if (layer instanceof L.Polyline) {

        type = 'Polyline';
        layer.type = 'Polyline';
        latlngArray = layer.getLatLngs();

        calculatedInfoObject = {
          totalDistance: calculateOverallDistance(layer.getLatLngs()).toFixed(4),
        }

        layer.calculatedInfoArray = [["total distance", calculateOverallDistance(layer.getLatLngs())]]
          
      }  
      else {
        type = 'Unknown layer type'; 
      }

      layer.selectionListAttributesArray = [["Type", ""],["State", ""],["District", ""]]; 

      layer.multiSelectOptionsState = {
        "Name": "",
        "Type": "",
        "State": "",
        "District": "",
      }

      layer.userAddedAttribtesArray = [];

      // console.log(layer._leaflet_id);

      let drawnLayerInfoObject = {
          leafletId: layer._leaflet_id,
          type: type,
          calculatedInfoObject: calculatedInfoObject, 
          userAddedAttribtes: {},
          selectionAttributesArray: [["Type", ""],["State", ""],["District", ""]]
      }          
        
      // setDrawnLayerInfoMap(previousMap=>{
      //   const newMap = new Map(previousMap);
      //   newMap.set(layer._leaflet_id, drawnLayerInfoObject);
      //   return newMap;
      // })

      const popupContent = createPopupContent(layer, calculatedInfoObject);
      layer.bindPopup(popupContent, drawnLayerInfoObject);

    };

    const onEdited = (e) => {

      let updatedDataArray = null;
      // let temporaryDrawnLayerInfoMap = drawnLayerInfoMap;
      let calculatedInfoObject=null;

      // console.log(e.layers._layers);

      Object.values(e.layers._layers).forEach(layer=>{
        if (layer instanceof L.Polygon) {
          // console.log(layer.getLatLngs());
          // console.log(layer.getLatLngs()[0]);
          calculatedInfoObject = getPolygonMeasurement(transformPolygonArray(layer.getLatLngs()[0]));
          let polygonDataObject = getPolygonMeasurement(transformPolygonArray(layer.getLatLngs()[0]));
          layer.calculatedInfoArray = getPolygonMeasurementArray(transformPolygonArray(layer.getLatLngs()[0]));
          console.log(layer.calculatedInfoArray[0][1]);
          console.log(layer.calculatedInfoArray[1][1]);
          layer.updatedDataArray = [layer.calculatedInfoArray[0][1].toFixed(4)+' Acres', layer.calculatedInfoArray[1][1].toFixed(4)+' km'];
          updatedDataArray = [layer.calculatedInfoArray[0][1].toFixed(4)+' Acres', layer.calculatedInfoArray[1][1].toFixed(4)+' km'];
        }
        else if (layer instanceof L.Polyline) {
          layer.calculatedInfoArray = [["total distance", calculateOverallDistance(layer.getLatLngs())]]
          console.log(layer.calculatedInfoArray[0][1]);
          layer.updatedDataArray = [layer.calculatedInfoArray[0][1].toFixed(4)+" km"]; 
          updatedDataArray = [layer.calculatedInfoArray[0][1].toFixed(4)+" km"];
        }
        else if (layer instanceof L.Marker) {
          let currentLatLngObject = layer.getLatLng();
          layer.calculatedInfoArray = [["latitude",currentLatLngObject.lat],["longitude",currentLatLngObject.lng]];
          // console.log(layer.calculatedInfoArray[0][1]);
          // console.log(layer.calculatedInfoArray[1][1]);
          layer.updatedDataArray = [layer.calculatedInfoArray[0][1].toFixed(4), layer.calculatedInfoArray[1][1].toFixed(4)];
        }
      })
      

      // if(e.layers.getLayers()[0] instanceof L.Polygon){

      //   calculatedInfoObject = getPolygonMeasurement(transformPolygonArray(e.layers.getLayers()[0].getLatLngs()[0]));
      //   temporaryDrawnLayerInfoMap.calculatedInfoObject = calculatedInfoObject;
      //   setDrawnLayerInfoMap(previousMap=>{
      //     const newMap = new Map(previousMap);
      //     newMap.set(e.layers.getLayers()[0]._leaflet_id, temporaryDrawnLayerInfoMap);
      //     return newMap;
      //   });

      //   let polygonDataObject = getPolygonMeasurement(transformPolygonArray(e.layers.getLayers()[0].getLatLngs()[0]));
      //   updatedDataArray = [polygonDataObject.area.toFixed(4)+' Acres', polygonDataObject.perimeter.toFixed(4)+' km'];

      // }

      // else if(e.layers.getLayers()[0] instanceof L.Polyline){

      //   calculatedInfoObject = {
      //     totalDistance: calculateOverallDistance(e.layers.getLayers()[0].getLatLngs()).toFixed(4),
      //   };
      //   temporaryDrawnLayerInfoMap.calculatedInfoObject = calculatedInfoObject;
      //   setDrawnLayerInfoMap(previousMap=>{
      //     const newMap = new Map(previousMap);
      //     newMap.set(e.layers.getLayers()[0]._leaflet_id, temporaryDrawnLayerInfoMap);
      //     return newMap;
      //   });

      //   updatedDataArray = [calculateOverallDistance(e.layers.getLayers()[0].getLatLngs()).toFixed(4)+" km"];
      // }

      // else if(e.layers.getLayers()[0] instanceof L.Marker){
      //   let latlngObject = e.layers.getLayers()[0].getLatLng();

      //   calculatedInfoObject={
      //     lat: latlngObject.lat,
      //     lng: latlngObject.lng,
      //   }
      //   temporaryDrawnLayerInfoMap.calculatedInfoObject = calculatedInfoObject;
      //   setDrawnLayerInfoMap(previousMap=>{
      //     const newMap = new Map(previousMap);
      //     newMap.set(e.layers.getLayers()[0]._leaflet_id, temporaryDrawnLayerInfoMap);
      //     return newMap;
      //   });

      //   updatedDataArray = [e.layers.getLayers()[0].getLatLng().lat.toFixed(4), e.layers.getLayers()[0].getLatLng().lng.toFixed(4)];
      // }


      Object.values(e.layers._layers).forEach(layer=>{
        
        let selectedPopupDiv = layer.getPopup().getContent();

        function updatePopupContent() {
          const popupElements = selectedPopupDiv.querySelectorAll('.flex-div-popup');
  
          // Iterate over the selected popup elements and update the content
          popupElements.forEach((element, index) => {
            // const keyElement = element.querySelector('p:first-child');
            const valueElement = element.querySelector('p:last-child');
            valueElement.textContent = layer.updatedDataArray[index];
          });
        }

        updatePopupContent();
        
        let verticalTableFlexContainer = selectedPopupDiv.querySelectorAll('.popup-vertical-flex')[0];      

        const fixedRows = verticalTableFlexContainer.querySelectorAll('.flex-div-popup');

        fixedRows.forEach((row) => {
          if(layer.sampleKey===undefined){
            layer.sampleKey={};
          }
          const key = row.childNodes[0].innerText;
          const value = row.childNodes[1].innerText;
          layer.sampleKey[key] = value;
          row.setAttribute("isSelected", "selected");
        });

        delete layer.updatedDataArray;

      })

    }

    const onDeleted = (e) => {
      // console.log();

      // let temporaryMap = new Map(drawnLayerInfoMap);

      // Object.keys(e.layers._layers).forEach(object=>{
      //   temporaryMap.delete(object);
      // });

      // setDrawnLayerInfoMap(temporaryMap);

    }

// ============================= Following functions are for handling various events of leaflet draw. End =============================    

// ================================ Following functions are for measuring the attributes of geometry. Begin ================================
    
    function isClockwise(coordinates) {
      let sum = 0;
      for (let i = 0; i < coordinates.length - 1; i++) {
          const [x1, y1] = coordinates[i];
          const [x2, y2] = coordinates[i + 1];
          sum += (x2 - x1) * (y2 + y1);
      }
      return sum > 0;
    }
        
    function calculateDistanceBetween2Points(latlng1, latlng2){
      let from = turf.point([latlng1.lng, latlng1.lat]);
      let to = turf.point([latlng2.lng, latlng2.lat]);
      return turf.distance(from, to);
    }

    function calculateOverallDistance(latLngArray){
      let distance = 0;
      for(let i = 0; i < latLngArray.length - 1; i++){
          distance += calculateDistanceBetween2Points(latLngArray[i], latLngArray[i+1]);
      }
      return distance;
    }

    function transformPolygonArray(latLngArray) {
      let polygonArray = latLngArray.map(latlng => [latlng.lng, latlng.lat]);
      if(!isClockwise(polygonArray)){
          const part1 = polygonArray.slice(0, 1);
          const part2 = polygonArray.slice(1).reverse();
          polygonArray = part1.concat(part2);
      }
      polygonArray = [...polygonArray,polygonArray[0]];
      return polygonArray;
    }

    function getPolygonMeasurement(polygonArray) {
      let dummyPolygonReference = turf.polygon([[...polygonArray]]);
      return {
          area: (turf.area(dummyPolygonReference)/4046.8564224),
          perimeter: turf.length(dummyPolygonReference, { units: 'kilometers' }),
          // coordinates: polygonArray
      };
    }

    function getPolygonMeasurementArray(polygonArray) {
      let dummyPolygonReference = turf.polygon([[...polygonArray]]);
      return [
          ["area", (turf.area(dummyPolygonReference)/4046.8564224)],
          ["perimeter", turf.length(dummyPolygonReference, { units: 'kilometers' })],
      ]
    }

// ================================= Following functions are for measuring the attributes of geometry. End =================================

    return (
        <>
            <FeatureGroup ref={featureGrpRef}> 
                <EditControl
                    position="topright"
                    onCreated={onCreated}
                    onEdited={onEdited}
                    onDeleted={onDeleted}
                    draw={{
                    /* rectangle: { showArea: false,  }, This fixes the drawing rectangle issue */
                      rectangle: false,
                      polyline: true,
                      polygon: true,
                      circle: false,
                      marker: true,
                      circlemarker: false,
                    }}
                />
            </FeatureGroup>
        </>
    )
}

export default LeafletDrawComponent2;
