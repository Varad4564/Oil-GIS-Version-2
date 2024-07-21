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
import 'proj4leaflet';

import LeafletDrawComponent from './LeafletDrawComponent';
import BackendLayerComponent from './BackendLayerComponent';
import LeafletDrawComponent3 from './LeafletDrawComponent3';
// import shp from "shpjs";

function MyMap3(
  {
    flyToCoordinates, mapZoom, setMapZoom, mapcenter, setMapcenter, setBackendSelectedGeometryInfoArray,
    setIsDestinationClicked, isDestinationClicked, featureGrpRef, layerBoundState,
    setShowDataAddingDailogue, setClickedLayerId, setDrawnLayerInfoMap, drawnLayerInfoMap
  }
) {

  // ====================================== This Object is passed as a parameter to the wmsLayer. Begin  ======================================

  const wmsLayerParams = {
      layers: 'TOPO-OSM-WMS',
      // layers: 'LAYER_NAME', // Specify the name of the WMS layer
      format: 'image/png', // Image format
      transparent: true, // Transparency
      attribution: 'Your attribution here', // Attribution text
      min_long: 76.2342277,
      min_latt: 16.3622245, 
      max_long: 95.8182578,
      max_latt: 31.4962708,
  };

  const cdacWMSLayer1 = {
    layer_name: "dyn_brtms",
    transparent: true,
    format:'image/png',
    received_timestamp: 1649060147494, 
    sensor: "IRS-OCM",
    id: 19204,
    date: "2022-03-30",
    data: "Z:/brtms/IRS-OCM/30MAR2022_IRS-OCM_2224093121.tif",
    image: "30MAR2022_IRS-OCM_2224093121",
    min_long: 76.2342277,
    min_latt: 16.3622245, 
    max_long: 95.8182578,
    max_latt: 31.4962708,
    agency_data_sources_id: 2
  }

  const cdacWMSLayerAttributes ={
    layers: cdacWMSLayer1.layer_name,
    transparent: true,
    format: cdacWMSLayer1.format,
    attribution: "Bhuvan BRTMS Layer",
    data: cdacWMSLayer1.data,
    received_timestamp: cdacWMSLayer1.received_timestamp,
    sensor: cdacWMSLayer1.sensor,
    id: cdacWMSLayer1.id,
    date: cdacWMSLayer1.date,
    image: cdacWMSLayer1.image,
    min_long: cdacWMSLayer1.min_long,
    min_latt: cdacWMSLayer1.min_latt,
    max_long: cdacWMSLayer1.max_long,
    max_latt: cdacWMSLayer1.max_latt,
    zIndex: 10000,
  }

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

  // var crs = new L.Proj.CRS("");

  var crs = new L.Proj.CRS("EPSG:4326","+proj=longlat +datum=WGS84 +no_defs +type=crs", {

    resolutions: [
    1.40625,
    0.703125,
    0.3515625,
    0.17578125,
    0.087890625,
    0.0439453125,
    0.02197265625,
    0.010986328125,
    0.0054931640625,
    0.00274658203125,
    0.001373291015625,
    0.0006866455078125,
    0.00034332275390625,
    0.000171661376953125,
    0.0000858306884765625,
    0.00004291534423828125,
    0.000021457672119140625
    ],
    // origin: [-180, 178.55] //[-180, 178.59] [-180, 180]
    origin: [-180.001, 179.587] //[-180, 178.59] [-180, 180]
  });

  return (
    <>
        {/* <MapContainer center={mapcenter} zoom={mapZoom} maxZoom={25} scrollWheelZoom={true} className='varad' crs={crs} attributionControl={false}> */}
        <MapContainer center={mapcenter} zoom={mapZoom} maxZoom={25} scrollWheelZoom={true} className='varad'>
            
          <FullscreenControlWrapper position="topright"/>
            
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

            {/* <WMSTileLayer url={'http://ows.mundialis.de/services/service?'} {...wmsLayerParams}/> */}

            {/* <WMSTileLayer url={'https://bhuvan-ras2.nrsc.gov.in/cgi-bin/brtms.exe'} {...cdacWMSLayerAttributes}/> */}

            <GeoJSON data={geojsonData} pointToLayer={pointToLayer} onEachFeature={onEachFeature}></GeoJSON>

            {jobj.features.map((feature, index) => <MarkerLayer key={String(feature.geometry.coordinates)} index={index} feature={feature}/>)}
            
            <MyLocationComponent flyToCoordinates={flyToCoordinates} setMapZoom={setMapZoom} setMapcenter={setMapcenter} setIsDestinationClicked={setIsDestinationClicked} isDestinationClicked={isDestinationClicked} />

            { 
                SelectedFilelayerArrayShape.array.map((individualLayer)=>{
                    console.log(individualLayer);
                    return(
                        <SelectedFilelayeComponent key={individualLayer.layerId} individualLayer={individualLayer}/>
                    )
                }) 
            }

            <LeafletDrawComponent3 featureGrpRef={featureGrpRef} setShowDataAddingDailogue={setShowDataAddingDailogue} setClickedLayerId={setClickedLayerId} setDrawnLayerInfoMap={setDrawnLayerInfoMap} drawnLayerInfoMap={drawnLayerInfoMap}/>

            <BackendLayerComponent layerBoundState={layerBoundState} setBackendSelectedGeometryInfoArray={setBackendSelectedGeometryInfoArray}/>
          
            {/* <FeatureGroup ref={featureGrpRef}> 
                <EditControl
                    position="topright"
                    onCreated={onCreated}
                    onEdited={onEdited}
                    draw={{
                    rectangle: { showArea: false, }, // This fixes the drawing rectangle issue 
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

export default MyMap3;

// style={geoJsonStyle} onEachFeature={onEachFeature}