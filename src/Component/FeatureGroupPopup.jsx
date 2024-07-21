import React from 'react'

function FeatureGroupPopup({propData, onButtonClick, number}) {

    function handleClick(){
        console.log('The button on the popup is clicked');
    }

    const components = [];

    for (let i = 0; i < number; i++) {
        components.push(
            <div className="flex-div-popup-row" isselected="selected">
                    <input className="flex-div-equal-items-rowCells"/>
                    <input className="flex-div-equal-items-rowCells"/>
            </div>
        );
    }

    console.log(onButtonClick);

    return (
        <>
        
        <div className="upper-popup-div">
            <div className="popup-vertical-flex">
                <div className="layer-name-div">
                    <input className="layer-name-input" placeholder="layer name"/>
                </div>
                <div className="flex-div-popup">
                    <p className="flex-div-equal-items">key</p>
                    <p className="flex-div-equal-items">value</p>
                </div>
                {
                    // for (let index = 0; index < array.length; index++) {
                    //     <p></p>
                    // }
                }
                {/* <div className="flex-div-popup-row" isselected="selected">
                    <input className="flex-div-equal-items-rowCells"/>
                    <input className="flex-div-equal-items-rowCells"/>
                </div> */}
                {components}    

            </div>
            <div className="button-container">
                <button className="popup-addrow-btn" onClick={onButtonClick}>Add Row</button>
                <button className="popup-submit-btn">Submit</button>
                <button className="popup-close-btn">Close</button>
            </div>
        </div>
        
        </>        
    )
}

export default FeatureGroupPopup


