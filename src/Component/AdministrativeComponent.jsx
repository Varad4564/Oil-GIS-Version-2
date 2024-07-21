import { map } from 'leaflet';
import React from 'react'
import IndividualLayerComponent from './IndividualLayerComponent';
import crossButton from '../images/remove.png'

function AdministrativeComponent({administrativeLayerList, adminComponentActive, sideComponentActive, setAdministrativeComponentActive, setLayerBoundState}) {

    return (
        <div className={`administrative-layer ${adminComponentActive && !sideComponentActive ? "active":""}`}>
            <div className="adv-title">
                <img src={crossButton} alt="" onClick={()=>setAdministrativeComponentActive(false)}/>
                <center><h2>Administrative layers</h2></center>
            </div>

            <div className='scroll-container-2'>

            {administrativeLayerList.map( 
                
                (individualComponent,index) => <IndividualLayerComponent key={individualComponent.id} individualComponent={individualComponent} setLayerBoundState={setLayerBoundState}/> 
            
            )}

            </div>





        </div>
    )
}

export default AdministrativeComponent
