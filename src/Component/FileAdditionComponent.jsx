import React from 'react'
import { useDispatch } from 'react-redux'
import * as tj from "@mapbox/togeojson";
import rewind from "@mapbox/geojson-rewind";
import { addFileLayer } from '../ReduxRelated/Slices/SelectedFilelayerArraySlice'
import { useState } from 'react';


function FileAdditionComponent() {

    const dispatch = useDispatch();

    let [uidState, setUidState] = useState(1);  // This is used to set a unique id to the file layer

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
                    
                let addFileObject = {
                    layerId: uidState,
                    type: "LineString",
                    layer: json,
                }
                
                setUidState(previousUidValue=>{previousUidValue+1});

                dispatch(addFileLayer(addFileObject));
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

    };

    const getFileExtension = (file) => {
        const name = file.name;
        const lastDot = name.lastIndexOf(".");
        return name.substring(lastDot + 1);
    };

    return (
        <input type="file" onChange={handleFileSelection}/>
    )
}

export default FileAdditionComponent;