
import crossButton from "../images/remove.png";
import ButtonList from "./ButtonList";
import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
// import 'jstree/dist/jstree.min.css';
// import 'jstree';
import 'jstree/dist/themes/default/style.min.css'; // Correct CSS path
import 'jstree';

function SidebarComponent({destinations,setFlyToCoordinates,sideComponentActive,setSideComponentActive, setIsDestinationClicked, adminComponentActive}) {
    
    let [checkedId, setCheckedId] = useState(-1);

    const [treeData, setTreeData] = useState([
        {
          'text': 'Root folder',
          'state': { 'opened': false },
          'children': [
            {
              'text': 'Folder 1',
              'state': { 'opened': false },
              'children': [
                { 
                    'text': 'Subfolder 1',
                    'state': { 'opened': false },
                    'children': [
                        { 'text': 'Sub-subfolder 1', 'type': 'file' },
                        { 'text': 'sub-Subfolder 2', 'type': 'file' }
                    ]
                },
                { 'text': 'Subfolder 2' }
              ]
            },
            { 'text': 'Folder 2' }
          ]
        }
    ]);

    const treeRef = useRef(null);

    useEffect(() => {
        $(treeRef.current).jstree({
          'core': {
            'data': treeData
          },
          'types': {
            'folder': {
              'icon': 'jstree-folder'
            },
            'file': {
              'icon': 'jstree-file'
            }
          },
          'plugins': ['types']
        });
    
        return () => {
          if ($(treeRef.current).jstree(true)) {
            $(treeRef.current).jstree("destroy");
          }
        };
      }, [treeData]);

    return (
        <div className={`sidebar ${sideComponentActive && !adminComponentActive ? "active" : ""}`}>
            <img
                src={crossButton}
                alt=""
                className="cross-button"
                onClick={() => setSideComponentActive(false)}
            />
            <div className="sidebar-first-section">
                <div className="side-section"></div>

                <div className="oil-sphere">
                    <h2 className="oil-sphere-title">Oil Spheres</h2>

                    <div className="location-option-list-outer">
                        <div className="location-option-list">
                            {destinations.map((obj, index) => {
                                return (
                                    <ButtonList
                                        key={index}
                                        obj={obj}
                                        index={index}
                                        setFlyToCoordinates={setFlyToCoordinates}
                                        checkedId={checkedId}
                                        setCheckedId={setCheckedId}
                                        setIsDestinationClicked={setIsDestinationClicked}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="sidebar-second-section">
                {/* <ul></ul> */}
                <div ref={treeRef}></div>
            </div>
            <div className="sidebar-third-section"></div>
            <div className="sidebar-last-section">
                <p>Select a basemap</p>
            </div>
        </div>
    );
}

export default SidebarComponent;
