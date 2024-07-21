import './App.css'
import logo from './images/Oil_India_Logo.png'
import AdministrativeComponent from './Component/AdministrativeComponent'
import SidebarComponent from './Component/SidebarComponent'
import MainDivComponent from './Component/MainDivComponent'
import {useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import FullScreenMapComponent from './Component/FullScreenMapComponent'
import MainDivComponent3 from './Component/MainDivComponent3'

function App() {

  let [flyToCoordinates, setFlyToCoordinates] = useState([]);
  let [adminComponentActive, setAdministrativeComponentActive] = useState(false);
  let [sideComponentActive, setSideComponentActive] = useState(false);
  let [mapZoom, setMapZoom] = useState(5); 
  let [mapcenter, setMapcenter] = useState([22.505, +80.09]);
  let [isDestinationClicked, setIsDestinationClicked] = useState(false);
  
  let FullScreenMode = useSelector((state)=>state.FullScreenState);

  let [administrativeLayerList, setAdministrativeLayerList] = useState([]);

  let [displayLayersArrayState, setDisplayLayersArrayState] = useState();

  let [layerBoundState, setLayerBoundState] = useState();

  let [layerAdditionState, setLayerAdditionState] = useState(false);
  
  let [fillOpacity, setFillOpacity] = useState(0.5);
  
  let [opacity, setOpacity] = useState(0.5);

  useEffect(()=>{
    
    if(layerAdditionState===true){
      fetch("http://localhost:8084/getLayerNames", {
        method: 'GET', // Specify the HTTP method
        headers: {
            'Content-Type': 'application/json' // Specify the content type
        },
      })
      .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parse the JSON response
      })
      .then(data => {
        setAdministrativeLayerList(data);
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
      setLayerAdditionState(false);
    }
  },[layerAdditionState])

  useEffect(()=>{
    fetch("http://localhost:8084/getLayerNames", {
      method: 'GET', // Specify the HTTP method
      headers: {
          'Content-Type': 'application/json' // Specify the content type
      },
    })
    .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json(); // Parse the JSON response
    })
    .then(data => {
      setAdministrativeLayerList(data);
      console.log('Success:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  },[])
  
  let destinations = [
    {
      id: 1,
      name: "Sambhaji Nagar",
      latlng: [19.87617280367163, 75.33976419305348]
    },
    {
      id: 2,
      name: "Nashik",
      latlng: [20.006880533141008, 73.78728244893463]
    },
    {
      id: 3,
      name: "Mumbai",
      latlng: [19.077183417608715, 72.87799149648569]
    },
    {
      id: 4,
      name: "Pune",
      latlng: [18.521635431494985, 73.85492112056373]
    },
    {
      id: 5,
      name: "Nagpur",
      latlng: [21.14880925977312, 79.08157657614952]
    },
    {
      id: 6,
      name: "Kolhapur",
      latlng: [16.702969946625156, 74.23945592309634]
    }
  ]

  // let administrativeLayerList = [
  //   {
  //     id: 1,
  //     name: "Location Name"
  //   },
  //   {
  //     id: 2,
  //     name: "Road Network"
  //   },
  //   {
  //     id: 3,
  //     name: "Railway Network"
  //   },
  //   {
  //     id: 4,
  //     name: "Forest and PA"
  //   },
  //   {
  //     id: 5,
  //     name: "River Network"
  //   },
  //   {
  //     id: 6,
  //     name: "Water body"
  //   },
  //   {
  //     id: 7,
  //     name: "CRZ Boundary"
  //   },
  //   {
  //     id: 8,
  //     name: "Forest and PA"
  //   },
  //   {
  //     id: 9,
  //     name: "Drainage Network"
  //   },
  //   {
  //     id: 10,
  //     name: "Soil"
  //   },
  //   {
  //     id: 11,
  //     name: "Geomorphology"
  //   },
  //   {
  //     id: 12,
  //     name: "Geology"
  //   },
  //   {
  //     id: 13,
  //     name: "State Boundary"
  //   },
  //   {
  //     id: 14,
  //     name: "Tehsil Boundary"
  //   },
  //   {
  //     id: 15,
  //     name: "Village Boundary"
  //   },
  //   {
  //     id: 16,
  //     name: "Khasra Boundary"
  //   },
  //   {
  //     id: 17,
  //     name: "Utility Layer"
  //   },
  //   {
  //     id: 18,
  //     name: "Infrastructure Lasyer"
  //   },
  //   {
  //     id: 19,
  //     name: "LULC"
  //   },
  //   {
  //     id: 20,
  //     name: "Transmission line"
  //   },
  //   {
  //     id: 21,
  //     name: "Water Pipeline"
  //   }
  // ];

  return (
    <>

      {FullScreenMode.isFullScreen 
      
        ? <FullScreenMapComponent mapcenter={mapcenter} setMapcenter={setMapcenter} mapZoom={mapZoom} setMapZoom={setMapZoom} flyToCoordinates={flyToCoordinates} />
      
        :

        <>
          <div className="header" style={{position:"relative"}}>
            <img src={logo} alt="An image was here" />
            <center><h1>GIS based Asset Management Information System (AMIS)</h1></center>
            <button style={{position:"fixed", right:0}}>Sample Button</button>
          </div>

          <div className= 'main-div'>

            <SidebarComponent destinations={destinations} setFlyToCoordinates={setFlyToCoordinates} sideComponentActive={sideComponentActive} setSideComponentActive={setSideComponentActive} setIsDestinationClicked={setIsDestinationClicked} adminComponentActive={adminComponentActive}/>

            <AdministrativeComponent administrativeLayerList={administrativeLayerList} adminComponentActive={adminComponentActive} sideComponentActive={sideComponentActive} setAdministrativeComponentActive={setAdministrativeComponentActive} setLayerBoundState={setLayerBoundState}/>

            <MainDivComponent3 flyToCoordinates={flyToCoordinates} setAdministrativeComponentActive={setAdministrativeComponentActive} setSideComponentActive={setSideComponentActive} mapZoom={mapZoom} setMapZoom={setMapZoom} mapcenter={mapcenter} setMapcenter={setMapcenter} setIsDestinationClicked={setIsDestinationClicked} isDestinationClicked={isDestinationClicked} adminComponentActive={adminComponentActive} layerBoundState={layerBoundState} setLayerAdditionState={setLayerAdditionState}/>

          </div>
        </>

      }

      

    </>
  )
}

export default App;
