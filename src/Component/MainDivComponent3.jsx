import React from "react";
import menuLogo from "../images/menulogo.png";
import settingLogo from "../images/setting.png";
import { useState, useRef, useEffect } from "react";
import fullScreenLogo from "../images/fullScreen.png";
import { useDispatch, useSelector } from "react-redux";
import { toggleFullScreenState } from "../ReduxRelated/Slices/FullScreenSlice";
import { setDrawGeometryMode } from "../ReduxRelated/Slices/DrawGeometryModeSlice";
import MyMap3 from "./MyMap3";
import DataAddingModal from "./DataAddingModal";
import FileAdditionComponent from "./FileAdditionComponent";

const isOnlyWhitespace = (str) => /^\s*$/.test(str);

function MainDivComponent3({
    flyToCoordinates,
    setAdministrativeComponentActive,
    setSideComponentActive,
    mapZoom,
    setMapZoom,
    mapcenter,
    setMapcenter,
    setIsDestinationClicked,
    isDestinationClicked,
    adminComponentActive,
    layerBoundState,
    setLayerAdditionState,
}) {
    let selectedLayerArray = useSelector(
        (state) => state.SelectedLayerArrayState
    );
    let selectedLayerFillOpacity = useSelector(
        (state) => state.SelectedLayerFillOpacityArrayState
    );

    let dispatch = useDispatch();

    let [drawnLayerInfoMap, setDrawnLayerInfoMap] = useState(new Map()); // This map state variable will hold the meta data related to all the leaflet layers which is drawn using the leaflet draw

    let dialogRef = useRef(); // These 2 refs are referenceing the 2 dailogue box which are present in this component
    let dialogRef2 = useRef();
    let dialogRef3 = useRef();

    let layerNameInputRef = useRef(); // This ref variable reference the input box in the dailog which is responsible for recieving the name of the layer before hitting the backend API

    let [dailogeShowState, setDailogeShowState] = useState(false); // This state variable is used as a toggler to toggle the dailog box which appears after clicking the add layer button for taking the layer name as input, before storing the layer into the database

    let [showDataAddingDailogue, setShowDataAddingDailogue] = useState(false); // This state variable is used as a toggler to toggle the dailog box which appears after clicking the add buttn on the popup of a drawn feature

    let [backendLayerDataShowDailogeState, setBackendLayerDataShowDailogeState] = useState(false);

    useEffect(() => {
        // This useEffect will react when the value in the showDataAddingDailogue toggle state variable changes to true and it will shwo the modal

        if (showDataAddingDailogue) {
            dialogRef2.current.showModal();
        }
    }, [showDataAddingDailogue]);

    let [clickedLayerId, setClickedLayerId] = useState(0); // This will hold the unique leaflet id of the layer on whose popup we have clicked the add button so that we can know, whose meta data we have to display on the modal

    const featureGrpRef = useRef(); // This reference variable holds the reference of the feature group in which the leaflet layers are drawn

    let [backendSelectedGeometryInfoArray, setBackendSelectedGeometryInfoArray] = useState([]);

    useEffect(() => {
        console.log(backendSelectedGeometryInfoArray);
        if (backendSelectedGeometryInfoArray.length > 0) {
            // dialogRef3.current.
            dialogRef3.current.showModal();
            setBackendLayerDataShowDailogeState(true);
        }
    }, [backendSelectedGeometryInfoArray])

    const clearAllLayers = () => {
        // This function removes all the leaflet layers which are present in the leaflet draw feature group

        const featureGroup = featureGrpRef.current;
        if (featureGroup) {
            featureGroup.clearLayers();
        }
    };

    function toWKT(layer) {
        // Function takes the leaflet layer as input and returns the well knwon text form of that geometry

        var lng,
            lat,
            coords = [];
        if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
            if (layer instanceof L.Polygon) {
                var latlngs = layer.getLatLngs()[0];
                for (var i = 0; i < latlngs.length; i++) {
                    latlngs[i];
                    coords.push(latlngs[i].lng + " " + latlngs[i].lat);
                    if (i === 0) {
                        lng = latlngs[i].lng;
                        lat = latlngs[i].lat;
                    }
                }
                return "POLYGON((" + coords.join(",") + "," + lng + " " + lat + "))";
            } else if (layer instanceof L.Polyline) {
                var latlngs = layer.getLatLngs();
                for (var i = 0; i < latlngs.length; i++) {
                    latlngs[i];
                    coords.push(latlngs[i].lng + " " + latlngs[i].lat);
                    if (i === 0) {
                        lng = latlngs[i].lng;
                        lat = latlngs[i].lat;
                    }
                }
                return "LINESTRING(" + coords.join(",") + ")";
            }
        } else if (layer instanceof L.Marker) {
            return (
                "POINT(" + layer.getLatLng().lng + " " + layer.getLatLng().lat + ")"
            );
        }
    }

    const showLayerNameSubmissionModal = () => {
        const featureGroup = featureGrpRef.current;
        if (featureGroup) {
            dialogRef.current.showModal();
            setDailogeShowState(true);
        }
    };

    const displayLayerInfo = () => {
        // this function basically logs all the layers info which os present on the feature group of the react leaflet
        const featureGroup = featureGrpRef.current;
        if (featureGroup) {
            featureGroup.eachLayer((layer) => {
                console.log(layer);
            });
        }
        dialogRef.current.showModal();
        setDailogeShowState(true);
    };

    function handleLayersAdditionToBackEnd() {
        dialogRef.current.close();
        setDailogeShowState(false);

        // ------------------------------------------------------------------------------------------------------------------------------

        let tempArray = [];

        const featureGroup = featureGrpRef.current;
        if (featureGroup) {
            featureGroup.eachLayer((layer) => {
                let dtoObject;
                let tempKeyValArrayHolder = [];

                let selectionInputArray = [];
                let calculatedDimentionArray = [];

                layer.selectionListAttributesArray.forEach((object) => {
                    selectionInputArray.push([object[0], object[1]]);
                });
                layer.calculatedInfoArray.forEach((object) => {
                    calculatedDimentionArray.push([object[0], object[1]]);
                });

                selectionInputArray = selectionInputArray.filter(
                    (object) => object[0] !== "" && object[1] !== ""
                );

                let userDefinedAttributesArray = [];
                layer.userAddedAttribtesArray.forEach((object) => {
                    userDefinedAttributesArray.push([object[0], object[1]]);
                });

                selectionInputArray.forEach((array) => {
                    tempKeyValArrayHolder.push([array[0], array[1]]);
                });

                calculatedDimentionArray.forEach((array) => {
                    tempKeyValArrayHolder.push([array[0], array[1]]);
                });

                userDefinedAttributesArray.forEach((array) => {
                    tempKeyValArrayHolder.push([array[0], array[1]]);
                });

                Object.entries(layer.multiSelectOptionsState).forEach((object) => {
                    if (object[1] !== "") {
                        tempKeyValArrayHolder.push([object[0], object[1]]);
                    }
                });

                console.log(tempKeyValArrayHolder);
                console.log(calculatedDimentionArray);

                let type = layer.type;

                console.log(type);

                dtoObject = {
                    type,
                    wktString: toWKT(layer),
                    keyValueArrayList: tempKeyValArrayHolder,
                };
                tempArray.push(dtoObject);
            });

            // dialogRef.current.showModal();
            // setDailogeShowState(true);
        }

        // ------------------------------------------------------------------------------------------------------------------------------

        dialogRef.current.close();
        setDailogeShowState(false);

        let nameOfTheLayer = "";

        if (
            layerNameInputRef.current.value !== null &&
            !isOnlyWhitespace(layerNameInputRef.current.value) &&
            tempArray.length > 0
        ) {
            nameOfTheLayer = layerNameInputRef.current.value;

            console.log(tempArray);

            let requestData = {
                layerName: nameOfTheLayer,
                geoSpatialDTO1List: tempArray,
            };

            console.log(requestData);

            // fetch("http://localhost:8084/addLayer", {
            //     method: 'POST', // Specify the HTTP method
            //     headers: {
            //         'Content-Type': 'application/json' // Specify the content type
            //     },
            //     body: JSON.stringify(requestData) // Convert the data to a JSON string
            // })
            // .then(response => {
            //     setLayerAdditionState(true);
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

            nameOfTheLayer = "";
            // featureGrpRef.current.clearLayers();
        }

        // if(nameOfTheLayer){

        // }
        layerNameInputRef.current.value = "";
    }

    // -------------------------------------------------------------------------------------------------------------------------------------------

    return (
        <div
            className={`${adminComponentActive ? "functional-div" : "functional-div"
                }`}
        >
            <div className="toolbar">
                <img
                    src={menuLogo}
                    alt=""
                    className="sidebar-button"
                    onClick={() => {
                        setSideComponentActive((previousState) => {
                            return !previousState;
                        });
                        setAdministrativeComponentActive(false);
                    }}
                />
                <img
                    src={settingLogo}
                    alt="Img"
                    className="admin-button"
                    onClick={() => {
                        setAdministrativeComponentActive((previousState) => {
                            return !previousState;
                        });
                        setSideComponentActive(false);
                    }}
                />
            </div>

            <div className="map-and-chart-container">
                <div className="map-stat-container">
                    <div className="map-holder">
                        <button
                            className="full-screen-button"
                            onClick={() => {
                                dispatch(toggleFullScreenState());
                                dispatch(setDrawGeometryMode(null));
                            }}
                        >
                            <img src={fullScreenLogo} className="full-screen-logo" />
                        </button>

                        <MyMap3
                            flyToCoordinates={flyToCoordinates}
                            mapZoom={mapZoom}
                            setMapZoom={setMapZoom}
                            mapcenter={mapcenter}
                            setMapcenter={setMapcenter}
                            setIsDestinationClicked={setIsDestinationClicked}
                            isDestinationClicked={isDestinationClicked}
                            featureGrpRef={featureGrpRef}
                            layerBoundState={layerBoundState}
                            setShowDataAddingDailogue={setShowDataAddingDailogue}
                            setClickedLayerId={setClickedLayerId}
                            setDrawnLayerInfoMap={setDrawnLayerInfoMap}
                            drawnLayerInfoMap={drawnLayerInfoMap}
                            setBackendSelectedGeometryInfoArray={setBackendSelectedGeometryInfoArray}
                        />
                    </div>

                    <div className="stat-container">
                        <div className="coordinates-container">
                            {/* <input type="file" onChange={handleFileSelection}/> */}
                            <FileAdditionComponent />
                            <div style={{ display: "flex" }}>
                                <p>Coordinates: </p>
                                <div className="coordinates-readings">
                                    <p id="current-latlng-container">null, null</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button onClick={showLayerNameSubmissionModal}>
                                Add the Layer
                            </button>
                            <button onClick={clearAllLayers}>Remove all layers</button>
                            <button onClick={displayLayerInfo}>Display layers info</button>
                            <button onClick={() => console.log(selectedLayerArray.array)}>
                                Display Seelected Layers Array
                            </button>
                            <button
                                onClick={() => console.log(selectedLayerFillOpacity.array)}
                            >
                                Display Selected fillOpacity Array
                            </button>
                        </div>
                    </div>
                </div>

                <div className="chart-container"></div>

                <dialog
                    ref={dialogRef}
                    className={`layername-reciever-Dailoge ${dailogeShowState ? "" : "d-none"
                        }`}
                >
                    <div className="layername-reciever-Dailoge-relative-div">
                        <h2 className="layername-reciever-Dailoge-title">
                            Enter the layer name
                        </h2>

                        <div className="modal-layer-name-input-handling-div">
                            <input
                                type="text"
                                className="modal-layer-name-input"
                                ref={layerNameInputRef}
                            />
                            <button
                                className="modal-layer-name-submit-btn"
                                onClick={handleLayersAdditionToBackEnd}
                            >
                                Submit
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                dialogRef.current.close();
                                setDailogeShowState(false);
                            }}
                            className="layername-reciever-Dailoge-close-btn"
                        >
                            <p>x</p>
                        </button>
                    </div>
                </dialog>

                <DataAddingModal
                    featureGrpRef={featureGrpRef}
                    dialogRef2={dialogRef2}
                    clickedLayerId={clickedLayerId}
                    setClickedLayerId={setClickedLayerId}
                    setShowDataAddingDailogue={setShowDataAddingDailogue}
                />

                <dialog className="backend-data-display-Popup" open="" ref={dialogRef3}   >  {/*backendLayerDataShowDailogeState*/}
                    <div className="data-adding-Popup-relative-div">
                        <div className="data-adding-Popup-data-table">
                            <div className="data-adding-Popup-data-table-header">
                                <div className="data-adding-Popup-data-table-key-header">
                                    Key
                                </div>
                                <div className="data-adding-Popup-data-table-value-header">
                                    Value
                                </div>
                            </div>
                            {/* <div className="data-adding-Popup-data-table-row">
                                <div className="data-adding-Popup-data-table-key-row">latitude</div>
                                <div className="data-adding-Popup-data-table-valye-row">19.9554</div>
                            </div> */}
                            {
                                backendSelectedGeometryInfoArray.map(object => {
                                    console.log(object);
                                    return (
                                        <div key={object.id} className="data-adding-Popup-data-table-row">
                                            <div className="data-adding-Popup-data-table-key-row">{object.key}</div>
                                            <div className="data-adding-Popup-data-table-valye-row">{object.value}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="button-container">
                            <button className="popup-close-btn" onClick={()=>dialogRef3.current.close()}>Close</button>
                        </div>
                    </div>
                </dialog>

            </div>
        </div>
    );
}

export default MainDivComponent3;
