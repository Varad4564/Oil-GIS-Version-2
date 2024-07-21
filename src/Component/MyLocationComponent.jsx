import { useMapEvents } from 'react-leaflet/hooks'
import { useEffect } from 'react';
import { useMap } from 'react-leaflet/hooks';
import 'leaflet.fullscreen';
import L from 'leaflet';
import pointIconSvg from "../images/Selected_point.svg";

function MyLocationComponent({ flyToCoordinates, setMapZoom, setMapcenter, setIsDestinationClicked, isDestinationClicked}) {

    let customIcon = L.icon(
        {
            // iconUrl: customIconSvg,
            iconUrl: pointIconSvg,
            iconSize:     [14, 50], // size of the icon
            iconAnchor:   [6, 25], // point of the icon which will correspond to marker's location
            popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
        }
    )

    var map2 = useMap();

    useEffect(()=>{
        // if(flyToCoordinates.length !== 0){
        if(isDestinationClicked){ 
            setIsDestinationClicked(false)
            // console.log(flyToCoordinates);
            map2.flyTo(flyToCoordinates,12)
        }

        
    // },[flyToCoordinates]);
    },[isDestinationClicked, flyToCoordinates, map2, setIsDestinationClicked]);


    const map = useMapEvents({
        
        click: (event) => {
            
        },

        mousemove: (event)=>{
            const latlng = event.latlng;
            const pElement = document.getElementById('current-latlng-container');
            if (pElement) {
              pElement.textContent = `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;
            }
        },

        contextmenu: ()=>{      // This even is fired on right clicking on the map

        },

        zoomend: () => {
            // console.log(map.getZoom());
            setMapZoom(map.getZoom());
        }, 

        // moveend: (event)=>{
        //     setMapcenter(map.getCenter());
        // },
        
        moveend: () => {
            const newCenter = map.getCenter();
            setMapcenter((prevCenter) => {
              const distance = Math.sqrt(
                Math.pow(newCenter.lat - prevCenter[0], 2) +
                Math.pow(newCenter.lng - prevCenter[1], 2)
              );
              // Only update if the center has changed significantly
              if (distance > 0.001) {
                return [newCenter.lat, newCenter.lng];
              }
              return prevCenter;
            });
        },

        resize: () => {
            // console.log("Map resized");
        }

    })

    return null

}

export default MyLocationComponent;
