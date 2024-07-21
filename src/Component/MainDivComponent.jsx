import React, { useReducer } from 'react'
import MyMap from './MyMap'
import menuLogo from '../images/menulogo.png'
import settingLogo from '../images/setting.png'
import { useState, useRef, useEffect } from 'react'
import fullScreenLogo from '../images/fullScreen.png'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFullScreenState } from '../ReduxRelated/Slices/FullScreenSlice'
import { setDrawGeometryMode } from '../ReduxRelated/Slices/DrawGeometryModeSlice'
import polygonLogo  from '../images/PolygonImage.png'
import lineSegment  from '../images/lineSegmentLogo.png'
import squareImage from '../images/squareImageScreenshot.png'
import circleImage from '../images/newCircleLogo.png'
import * as tj from "@mapbox/togeojson";
import rewind from "@mapbox/geojson-rewind";
import { addFileLayer } from '../ReduxRelated/Slices/SelectedFilelayerArraySlice'


function MainDivComponent({ flyToCoordinates, setAdministrativeComponentActive, setSideComponentActive, mapZoom, setMapZoom, mapcenter, setMapcenter, setIsDestinationClicked, isDestinationClicked, adminComponentActive, layerBoundState, setLayerAdditionState}) {

    let [drawRectAngleState, setDrawRectAngleState] = useState(null);

    let [uidState, setUidState] = useState(1);

    let dispatch = useDispatch();

    let dialogRef= useRef(); 

    let layerNameInputRef= useRef(); 

    let [dailogeShowState, setDailogeShowState] = useState(false); 

    let [layerNameState, setLayerNameState] = useState("");

    let [layerListInfo, setlayerListInfo] = useState([]);

    useEffect(()=>{
        if(layerNameState!==""&&layerNameState!==null){
            let requestData = {
                layerName: layerNameState,
                geoSpatialDTO1List:layerListInfo,
            }

            fetch("http://localhost:8084/addLayer", {
                method: 'POST', // Specify the HTTP method
                headers: {
                    'Content-Type': 'application/json' // Specify the content type
                },
                body: JSON.stringify(requestData) // Convert the data to a JSON string
            })
            .then(response => {
                setLayerAdditionState(true);
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response; // Parse the JSON response
            })
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    },[layerNameState])

// -------------------------------------------------------------------------------------------------------------------------------------------

const [fileSelectionLayer, setFileSelectionLayer] = useState(null);

    const handleFileSelection = (event) => {
    const file = event.target.files[0]; // get file
    const ext = getFileExtension(file);
    const reader = new FileReader();

    // on load file end, parse the text read
    reader.onloadend = (event) => {
        var text = event.target.result;
        if (ext === "kml") {
          parseTextAsKml(text);
        } else {
            // imported geojson
            const json = JSON.parse(text);
            rewind(json, false);
            
            // console.log(json.features[0].geometry.coordinates[0]);   //Polygon
            // console.log(json.features[0].geometry.coordinates);
            // console.log(json.features[0].geometry.coordinates);
            
            let addFileObject = {
                layerId: uidState,
                type: "LineString",
                layer: json,
            }
        
            setUidState(previousUidValue=>{previousUidValue+1});

            dispatch(addFileLayer(addFileObject));
            setFileSelectionLayer(json);
        }
    };

    reader.readAsText(file); // start reading file
};

const parseTextAsKml = (text) => {
    const dom = new DOMParser().parseFromString(text, "text/xml"); // create xml dom object
    const converted = tj.kml(dom); // convert xml dom to geojson
    rewind(converted, false); // correct right hand rule
    
    let addFileObject = {
        layerId: uidState,
        type: "LineString",
        layer: converted,
    }
    
    setUidState(previousUidValue=>{previousUidValue+1});
    dispatch(addFileLayer(addFileObject));

    setFileSelectionLayer(converted); // save converted geojson to hook state
};

const getFileExtension = (file) => {
    const name = file.name;
    const lastDot = name.lastIndexOf(".");
    return name.substring(lastDot + 1);
};



// -------------------------------------------------------------------------------------------------------------------------------------------

const featureGrpRef = useRef();

const clearAllLayers = () => {
    const featureGroup = featureGrpRef.current;
    if (featureGroup) {
      featureGroup.clearLayers();
    }
  };

function toWKT(layer) {
    var lng, lat, coords = [];
    if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
          
        if (layer instanceof L.Polygon) {
            var latlngs = layer.getLatLngs()[0];
            for (var i = 0; i < latlngs.length; i++) {
                latlngs[i]
                coords.push(latlngs[i].lng + " " + latlngs[i].lat);
                if (i === 0) {
                    lng = latlngs[i].lng;
                    lat = latlngs[i].lat;
                }
            };
            return "POLYGON((" + coords.join(",") + "," + lng + " " + lat + "))";
        } else if (layer instanceof L.Polyline) {
            var latlngs = layer.getLatLngs();
            for (var i = 0; i < latlngs.length; i++) {
                latlngs[i]
                coords.push(latlngs[i].lng + " " + latlngs[i].lat);
                if (i === 0) {
                    lng = latlngs[i].lng;
                    lat = latlngs[i].lat;
                }
            };
            return "LINESTRING(" + coords.join(",") + ")";
        }
    } else if (layer instanceof L.Marker) {
        return "POINT(" + layer.getLatLng().lng + " " + layer.getLatLng().lat + ")";
    }
}

const getShapeTypes = () => {
    const featureGroup = featureGrpRef.current;
    if (featureGroup) {
        
        let tempArray = [];
        featureGroup.eachLayer(layer => {
            let dtoObject;
            let tempKeyValArrayHolder = [];
            if(layer.sampleKey){
                for(const key in layer.sampleKey){
                    let tempKeyValArray = [];
                    tempKeyValArray.push(key);
                    tempKeyValArray.push(layer.sampleKey[key]);
                    tempKeyValArrayHolder.push(tempKeyValArray);
                }
            }
            let type;
            if (layer instanceof L.Marker) {
              type = 'Marker';
            } else if (layer instanceof L.Circle) {
              type = 'Circle';
            } else if (layer instanceof L.Polygon) {
              type = 'Polygon';
            } else if (layer instanceof L.Polyline) {
              type = 'Polyline';
            } else if (layer instanceof L.Rectangle) {
              type = 'Rectangle';
            } else {
              type = 'Unknown layer type';
            }
            dtoObject = {
                type,
                wktString: toWKT(layer),
                keyValueArrayList: tempKeyValArrayHolder
            };
            tempArray.push(dtoObject);
        });

        setlayerListInfo(tempArray);

        dialogRef.current.showModal();
        setDailogeShowState(true);

        // requestData = {
        //     layerName: "",
        //     geoSpatialDTO1List:tempArray,
        // }

        // fetch("http://localhost:8084/addPolygon", {
        //     method: 'POST', // Specify the HTTP method
        //     headers: {
        //         'Content-Type': 'application/json' // Specify the content type
        //     },
        //     body: JSON.stringify(tempArray) // Convert the data to a JSON string
        // })
        // .then(response => {
        //     if (!response.ok) {
        //         throw new Error('Network response was not ok ' + response.statusText);
        //     }
        //     return response; // Parse the JSON response
        // })
        // .then(data => {
        //     console.log('Success:', data);
        // })
        // .catch(error => {
        //     console.error('Error:', error);
        // });

        // console.log(JSON.stringify(tempArray));
    }
};

const displayLayerInfo = () => {
    const featureGroup = featureGrpRef.current;
    if (featureGroup) {
        featureGroup.eachLayer(layer => {
            console.log(layer);
        });
    }

    dialogRef.current.showModal();
    setDailogeShowState(true);
}

// -------------------------------------------------------------------------------------------------------------------------------------------



    return (
        <div className={`${adminComponentActive ? "functional-div":"functional-div"}`}>

            <div className="toolbar">

                <img src={menuLogo} alt="" className="sidebar-button" onClick={() => {
                        setSideComponentActive((previousState) => {
                            return !previousState
                        })
                        setAdministrativeComponentActive(false);
                    }
                } />
                <img src={settingLogo} alt="Img" className='admin-button' onClick={() => {
                    setAdministrativeComponentActive((previousState) => {
                        return !previousState
                    });
                    setSideComponentActive(false);
                }} />

            </div>

            <div className="map-and-chart-container">
                
                <div className="map-stat-container">
                    <div className='map-holder'>
                        
                        <button className='full-screen-button' onClick={()=>{
                            dispatch(toggleFullScreenState())
                            dispatch(setDrawGeometryMode(null));
                        }}><img src={fullScreenLogo} className='full-screen-logo'/></button>
                        
                        <MyMap flyToCoordinates={flyToCoordinates} mapZoom={mapZoom} setMapZoom={setMapZoom} mapcenter={mapcenter} setMapcenter={setMapcenter} setIsDestinationClicked={setIsDestinationClicked} isDestinationClicked={isDestinationClicked} drawRectAngleState={drawRectAngleState} setDrawRectAngleState={setDrawRectAngleState} fileSelectionLayer={fileSelectionLayer} featureGrpRef={featureGrpRef} layerBoundState={layerBoundState}/>

                    </div>

                    <div className="stat-container">
                        <div className="coordinates-container">
                            <input type="file" onChange={handleFileSelection}/>
                            {/* <p>Area</p> */}
                            <div style={{display:"flex"}}>
                                <p>Coordinates: </p>
                                <div className='coordinates-readings'>
                                    {/* <p>{currentLatLng ? currentLatLng.lat.toFixed(4) : "null"}, {currentLatLng ? currentLatLng.lng.toFixed(4) : "null"}</p> */}
                                    <p id="current-latlng-container">null, null</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button onClick={getShapeTypes}>Add the Layer</button>
                            <button onClick={clearAllLayers}>Remove all layers</button>
                            <button onClick={displayLayerInfo}>Display layers info</button>
                        </div>
                    </div>

                </div>

                <div className="chart-container"></div>

                <dialog ref={dialogRef} className={`layername-reciever-Dailoge ${dailogeShowState ? "":"d-none" }`}>
                    <div className='layername-reciever-Dailoge-relative-div'>
                        <h2 className='layername-reciever-Dailoge-title'>Enter the layer name</h2>
                        
                        <div className='modal-layer-name-input-handling-div'>
                            <input type="text" className='modal-layer-name-input' ref={layerNameInputRef}/>
                            <button className='modal-layer-name-submit-btn'
                                onClick={()=>{
                                    dialogRef.current.close();
                                    setDailogeShowState(false);
                                    if(layerNameInputRef.current.value!==""&&layerNameInputRef.current.value!==null){
                                        setLayerNameState(layerNameInputRef.current.value);
                                        featureGrpRef.current.clearLayers();
                                    }
                                    layerNameInputRef.current.value = "";
                                }}
                            >
                                Submit
                            </button>
                        </div>
                        <button onClick={()=>{
                            dialogRef.current.close();
                            setDailogeShowState(false);
                        }} className='layername-reciever-Dailoge-close-btn'>
                            <p>x</p>
                        </button>
                    </div>
                
                </dialog>

            </div>

        </div>
    )
}

export default MainDivComponent;
