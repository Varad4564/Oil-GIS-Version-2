import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { MapContainer, TileLayer, Marker,Popup, WMSTileLayer, GeoJSON, LayersControl, Circle } from 'react-leaflet'
import { jobj } from '../data/geodata1'
import MarkerLayer from './MarkerLayer'
import { useState } from 'react'
import MyLocationComponent from './MyLocationComponent'
import 'leaflet/dist/leaflet.css';
import geojsonData from './mountain.json'
import { useMapEvents } from 'react-leaflet'
import { Polygon, Rectangle, FeatureGroup, Polyline } from 'react-leaflet'
import L, { marker } from 'leaflet'
import customIconUrl from './MountainLogo.png'
import clickedLocation from '../images/location.svg'
import { useSelector, useDispatch } from 'react-redux'
import { deleteRectangle } from '../ReduxRelated/Slices/ReactangleArraySlice'
import { deletePolygon } from '../ReduxRelated/Slices/PolygonArraySlice'
import pointIconSvg from "../images/Selected_point.svg";
import { deletePolyLine } from '../ReduxRelated/Slices/PolyLineArraySlice'
import { deleteCircle } from '../ReduxRelated/Slices/CircleArraySlice'
import SelectedFilelayeComponent from './SelectedFilelayeComponent'
import { setDrawGeometryMode } from '../ReduxRelated/Slices/DrawGeometryModeSlice'
import { EditControl } from 'react-leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { parse as parseWKT } from 'terraformer-wkt-parser';
import "react-leaflet-fullscreen/styles.css";
import FullscreenControlWrapper from './FullscreenControlWrapper';
import * as turf from '@turf/turf';
import ReactDOMServer from 'react-dom/server';
import FeatureGroupPopup from './FeatureGroupPopup'

import LeafletDrawComponent from './LeafletDrawComponent';
import BackendLayerComponent from './BackendLayerComponent';
import LeafletDrawComponent2 from './LeafletDrawComponent2';

function MyMap(
  {
    flyToCoordinates, mapZoom, setMapZoom, mapcenter, setMapcenter,
    setIsDestinationClicked, isDestinationClicked, drawRectAngleState,
    setDrawRectAngleState, fileSelectionLayer, featureGrpRef, layerBoundState
  }
) {

  // ====================================== This Object is passed as a parameter to the wmsLayer. Begin  ======================================

  const wmsLayerParams = {
      layers: 'TOPO-OSM-WMS',
      // layers: 'LAYER_NAME', // Specify the name of the WMS layer
      format: 'image/png', // Image format
      transparent: true, // Transparency
      attribution: 'Your attribution here' // Attribution text
  };

  // ======================================= This Object is passed as a parameter to the wmsLayer. End  =======================================


  // =========================== Following functions and Objects are Related to GeoJson component for showing Mountains. Begin  ===========================

  const customIcon = new L.Icon({
    iconUrl: customIconUrl, // Provide the path to your custom icon image
    iconSize: [38, 38], // Adjust the size as needed
    iconAnchor: [19, 38], // The point of the icon which will correspond to marker's location
    popupAnchor: [0, -38] // The point from which the popup should open relative to the iconAnchor
  });

  const pointToLayer = (feature, latlng) => {
    return L.marker(latlng, { icon: customIcon });
  };
      
  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
        const popupContent = 
            `<div>
              <h3>${feature.properties.name}</h3>
              <p>Height: ${feature.properties.elevation}</p>
              <a href={'https://example.com/details/${feature.properties.id}'}>More info</a>
            </div>`
        layer.bindPopup(`${popupContent}`); // Customize popup content
    }
    else{
      layer.bindPopup('<h1>Sample Popup</h1>');
    }
  };

  // =========================== Following functions are Related to GeoJson component for showing Mountains. End  ===========================


  // ======================================== The following Redux Related variable is not used. Begin =========================================
  
  let FullScreenMode = useSelector((state)=>state.FullScreenState);
  let dispatch = useDispatch();

  // ========================================= The following Redux Related variable is not used. End =========================================
  
  
  // =================================== The following Redux Related variable is used for file layer. Begin ===================================

  let SelectedFilelayerArrayShape = useSelector((state)=>state.SelectedFilelayerArrayState);

  // =================================== The following Redux Related variable is used for file layer. End ===================================


  // ========================= The following Redux Related variable is used for displaying layer from backend. Begin =========================

  let selectedLayerArray = useSelector((state)=>state.SelectedLayerArrayState);

  // ========================== The following Redux Related variable is used for displaying layer from backend. End ==========================

  
  // ============================ Following code is for testing the parseWKT function Begin ============================

  const wkt = 'POLYGON((76.77246093750001 26.55138821688711,75.49804687500001 24.170079571275945, 76.86035156250001 21.498504993957802, 81.12304687500001 23.083521498330956, 80.50781250000001 26.669206869472468, 76.77246093750001 26.55138821688711))';
  
  const geoJson = parseWKT(wkt);

  // ============================ Following code is for testing the parseWKT function End ============================

  return (
    <>
        <MapContainer center={mapcenter} zoom={mapZoom} maxZoom={25} scrollWheelZoom={true} className='varad'>
            
          <FullscreenControlWrapper position="topleft"/>
            
            {/* <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            /> */}
            
            {/* The following will load a wms layer on the map  */}
            
            {/* <WMSTileLayer url={'http://ows.mundialis.de/services/service?'} {...wmsLayerParams}/> */}

            <LayersControl position="bottomleft" collapsed={true}>
                <LayersControl.BaseLayer checked name="OpenStreetMap">
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Google Maps">
                  <TileLayer
                    attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
                    url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                  />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Satellite">
                  <TileLayer
                    attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
                    url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                  />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="WMS Layer">
                  <WMSTileLayer url={'http://ows.mundialis.de/services/service?'} {...wmsLayerParams}/>
                </LayersControl.BaseLayer>

            </LayersControl>

            <GeoJSON data={geojsonData} pointToLayer={pointToLayer} onEachFeature={onEachFeature}></GeoJSON>

            {jobj.features.map((feature, index) => <MarkerLayer key={String(feature.geometry.coordinates)} index={index} feature={feature}/>)}
            
            <MyLocationComponent flyToCoordinates={flyToCoordinates} setMapZoom={setMapZoom} setMapcenter={setMapcenter} setIsDestinationClicked={setIsDestinationClicked} isDestinationClicked={isDestinationClicked} drawRectAngleState={drawRectAngleState} setDrawRectAngleState={setDrawRectAngleState} />

            { 
                SelectedFilelayerArrayShape.array.map((individualLayer)=>{
                    console.log(individualLayer);
                    return(
                        <SelectedFilelayeComponent key={individualLayer.layerId} individualLayer={individualLayer}/>
                    )
                }) 
            }

            <LeafletDrawComponent featureGrpRef={featureGrpRef}/>

            <BackendLayerComponent layerBoundState={layerBoundState}/>

            {/* <FeatureGroup ref={featureGrpRef}> 
                <EditControl
                    position="topright"
                    onCreated={onCreated}
                    onEdited={onEdited}
                    draw={{
                    rectangle: { showArea: false,  }, // This fixes the drawing rectangle issue 
                    polyline: true,
                    polygon: true,
                    circle: true,
                    marker: true,
                    circlemarker: false,
                    }}
                />
            </FeatureGroup> */}

            {/* <GeoJSON data={geoJson}  /> */}

            {/* {
              selectedLayerArray.array.map((individuallayer)=>{
                
                return (
                  individuallayer.shapeWktEntities.map((singleLayer)=>{
                    let geoJsonObject = singleLayer.largeString;
                    console.log();
                    return(
                      <GeoJSON key={singleLayer.id} data={parseWKT(geoJsonObject)} onEachFeature={(feature, layer)=>{
                          const popupContent = createPopupContent2(singleLayer.keyValueEntities, layer);
                          layer.bindPopup(popupContent);
                      }}/>
                    )
                  })
                )


                // let geoJsonObject = individuallayer.shapeWktEntities[1].largeString
                // console.log(geoJsonObject);
                // return(
                //   <GeoJSON key={individuallayer.shapeWktEntities[1].id} data={parseWKT(geoJsonObject)}/>
                // )

              })
            } */}

        </MapContainer>


    </>
  )
}

export default MyMap;

// style={geoJsonStyle} onEachFeature={onEachFeature}