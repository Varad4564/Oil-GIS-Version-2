import React from 'react'
import menuLogo from '../images/menulogo.png'
import settingLogo from '../images/setting.png'
import { useState, useRef, useEffect } from 'react'
import fullScreenLogo from '../images/fullScreen.png'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFullScreenState } from '../ReduxRelated/Slices/FullScreenSlice'
import { setDrawGeometryMode } from '../ReduxRelated/Slices/DrawGeometryModeSlice'
import * as tj from "@mapbox/togeojson";
import rewind from "@mapbox/geojson-rewind";
import { addFileLayer } from '../ReduxRelated/Slices/SelectedFilelayerArraySlice'
import MyMap2 from './MyMap2'
import { MultiSelect } from "react-multi-select-component";

// import { MultiSelect } from 'primereact/multiselect';
// import 'primereact/resources/themes/saga-blue/theme.css';   // theme
// import 'primereact/resources/primereact.min.css';           // core css
// import 'primeicons/primeicons.css';                         // icons
// import 'primeflex/primeflex.css';                           // flex utility

const isOnlyWhitespace = (str) => /^\s*$/.test(str);

function MainDivComponent2({ flyToCoordinates, setAdministrativeComponentActive, setSideComponentActive, mapZoom, setMapZoom, mapcenter, setMapcenter, setIsDestinationClicked, isDestinationClicked, adminComponentActive, layerBoundState, setLayerAdditionState}) {

    let selectedLayerArray = useSelector((state)=>state.SelectedLayerArrayState);
    let selectedLayerFillOpacity = useSelector((state)=>state.SelectedLayerFillOpacityArrayState);

    let [uidState, setUidState] = useState(1);  // This is used to set a unique id to the file layer

    let [rowListArray, setRowListArray] = useState([]);     // This is used for the list of inputs on the dailog box which appears after clicking the add buttn on the popup of a drawn feature

    let [drawnLayerInfoMap, setDrawnLayerInfoMap] = useState(new Map()); // This map state variable will hold the meta data related to all the leaflet layers which is drawn using the leaflet draw

    let dispatch = useDispatch();  

    let dialogRef= useRef();       // These 2 refs are referenceing the 2 dailogue box which are present in this component 
    let dialogRef2= useRef(); 
    
    let [showDataAddingDailogue, setShowDataAddingDailogue] = useState(false);      // This state variable is used as a toggler to toggle the dailog box which appears after clicking the add buttn on the popup of a drawn feature

    useEffect(()=>{     // This useEffect will react when the value in the showDataAddingDailogue toggle state variable changes to true and it will shwo the modal 

        if(showDataAddingDailogue){
            dialogRef2.current.showModal();
        }

    },[showDataAddingDailogue]);

    let [clickedLayerId, setClickedLayerId] = useState(0);  // This will hold the unique leaflet id of the layer on whose popup we have clicked the add button so that we can know, whose meta data we have to display on the modal 

    let layerNameInputRef = useRef();   // This ref variable reference the input box in the dailog which is responsible for recieving the name of the layer before hitting the backend API

    let [dailogeShowState, setDailogeShowState] = useState(false);  // This state variable is used as a toggler to toggle the dailog box which appears after clicking the add layer button for taking the layer name as input, before storing the layer into the database 

    let [layerNameState, setLayerNameState] = useState("");     // This state variable is responsible for holding the name of the layer before submitting it to the backend 

    let [layerListInfo, setlayerListInfo] = useState([]);       // This State variable contains the list of DTO objects where each dtoObject carries the Meta Data related to the inidvidual layer which is drawn on the map such as its well known text, key value attribute list, type, etc

    let [multiSelectSelectedArray, setMultiSelectSelectedArray] = useState([]);
    
    let [multiSelectOptionsState, setMultiSelectOptionsState] = useState({
        "Name": "",
        "Type": "",
        "State": "",
        "District": "",
    });

    let [multiSelectOptionsObject, setMultiSelectOptionsObject] = useState({
        "Name": {
            type: "text box",
            value: ""
        },
        "Type": {
            type: "selection box",
            options: ["Historical Monument", "Forest Reserve", "Tourist Place", "Beach", "Hill Station", "Goverment Office/ Property", "Private Property", "Other"]
            },
        "State":{
            type: "selection box",
            options: ["Andra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Orissa", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttaranchal", "Uttar Pradesh", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadar and Nagar Haveli", "Daman and Diu", "Delhi", "Lakshadeep", "Pondicherry"]
        },
        "District": {
            type: "selection box",
            options: ""
        } 
    });

    const multiSelectOptions = [
        { label: "Name", value: "Name" },
        { label: "Type", value: "Type"},
        { label: "State", value: "State"},
        { label: "District", value: "District"},
    ];

    let selectKeyValueOptions = [
        ["Type", ["Historical Monument", "Forest Reserve", "Tourist Place", "Beach", "Hill Station", "Goverment Office/ Property", "Private Property", "Other"]],
        ["State", [ "Andra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Orissa", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttaranchal", "Uttar Pradesh", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadar and Nagar Haveli", "Daman and Diu", "Delhi", "Lakshadeep", "Pondicherry"]],
        ["District", ""]
    ]

    let districtsOptionsList = {
        "Andra Pradesh": ["Anantapur","Chittoor","East Godavari","Guntur","Kadapa","Krishna","Kurnool","Prakasam","Nellore","Srikakulam","Visakhapatnam","Vizianagaram","West Godavari"],
        "Arunachal Pradesh": ["Anjaw","Changlang","Dibang Valley","East Kameng","East Siang","Kra Daadi","Kurung Kumey","Lohit","Longding","Lower Dibang Valley","Lower Subansiri","Namsai","Papum Pare","Siang","Tawang","Tirap","Upper Siang","Upper Subansiri","West Kameng","West Siang","Itanagar"],
        "Assam": ["Baksa","Barpeta","Biswanath","Bongaigaon","Cachar","Charaideo","Chirang","Darrang","Dhemaji","Dhubri","Dibrugarh","Goalpara","Golaghat","Hailakandi","Hojai","Jorhat","Kamrup Metropolitan","Kamrup (Rural)","Karbi Anglong","Karimganj","Kokrajhar","Lakhimpur","Majuli","Morigaon","Nagaon","Nalbari","Dima Hasao","Sivasagar","Sonitpur","South Salmara Mankachar","Tinsukia","Udalguri","West Karbi Anglong"],
        "Bihar": ["Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur","Buxar","Darbhanga","East Champaran","Gaya","Gopalganj","Jamui","Jehanabad","Kaimur","Katihar","Khagaria","Kishanganj","Lakhisarai","Madhepura","Madhubani","Munger","Muzaffarpur","Nalanda","Nawada","Patna","Purnia","Rohtas","Saharsa","Samastipur","Saran","Sheikhpura","Sheohar","Sitamarhi","Siwan","Supaul","Vaishali","West Champaran"],
        "Chhattisgarh": ["Balod","Baloda Bazar","Balrampur","Bastar","Bemetara","Bijapur","Bilaspur","Dantewada","Dhamtari","Durg","Gariaband","Janjgir Champa","Jashpur","Kabirdham","Kanker","Kondagaon","Korba","Koriya","Mahasamund","Mungeli","Narayanpur","Raigarh","Raipur","Rajnandgaon","Sukma","Surajpur","Surguja"],
        "Goa": ["North Goa","South Goa"],
        "Gujarat": ["Ahmedabad","Amreli","Anand","Aravalli","Banaskantha","Bharuch","Bhavnagar","Botad","Chhota Udaipur","Dahod","Dang","Devbhoomi Dwarka","Gandhinagar","Gir Somnath","Jamnagar","Junagadh","Kheda","Kutch","Mahisagar","Mehsana","Morbi","Narmada","Navsari","Panchmahal","Patan","Porbandar","Rajkot","Sabarkantha","Surat","Surendranagar","Tapi","Vadodara","Valsad"],
        "Haryana": ["Ambala","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad","Gurugram","Hisar","Jhajjar","Jind","Kaithal","Karnal","Kurukshetra","Mahendragarh","Mewat","Palwal","Panchkula","Panipat","Rewari","Rohtak","Sirsa","Sonipat","Yamunanagar"],
        "Himachal Pradesh": ["Bilaspur","Chamba","Hamirpur","Kangra","Kinnaur","Kullu","Lahaul Spiti","Mandi","Shimla","Sirmaur","Solan","Una"],
        "Jammu and Kashmir": ["Anantnag","Bandipora","Baramulla","Budgam","Doda","Ganderbal","Jammu","Kargil","Kathua","Kishtwar","Kulgam","Kupwara","Leh","Poonch","Pulwama","Rajouri","Ramban","Reasi","Samba","Shopian","Srinagar","Udhampur"],
        "Jharkhand": ["Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum","Garhwa","Giridih","Godda","Gumla","Hazaribagh","Jamtara","Khunti","Koderma","Latehar","Lohardaga","Pakur","Palamu","Ramgarh","Ranchi","Sahebganj","Seraikela Kharsawan","Simdega","West Singhbhum"],
        "Karnataka": ["Bagalkot","Bangalore Rural","Bangalore Urban","Belgaum","Bellary","Bidar","Vijayapura","Chamarajanagar","Chikkaballapur","Chikkamagaluru","Chitradurga","Dakshina Kannada","Davanagere","Dharwad","Gadag","Gulbarga","Hassan","Haveri","Kodagu","Kolar","Koppal","Mandya","Mysore","Raichur","Ramanagara","Shimoga","Tumkur","Udupi","Uttara Kannada","Yadgir"],
        "Kerala": ["Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam","Kottayam","Kozhikode","Malappuram","Palakkad","Pathanamthitta","Thiruvananthapuram","Thrissur","Wayanad"],
        "Madya Pradesh": ["Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani","Betul","Bhind","Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh","Datia","Dewas","Dhar","Dindori","Guna","Gwalior","Harda","Hoshangabad","Indore","Jabalpur","Jhabua","Katni","Khandwa","Khargone","Mandla","Mandsaur","Morena","Narsinghpur","Neemuch","Panna","Raisen","Rajgarh","Ratlam","Rewa","Sagar","Satna", "Sehore","Seoni","Shahdol","Shajapur","Sheopur","Shivpuri","Sidhi","Singrauli","Tikamgarh","Ujjain","Umaria","Vidisha"],
        "Maharashtra": ["Ahmednagar","Akola","Amravati","Aurangabad","Beed","Bhandara","Buldhana","Chandrapur","Dhule","Gadchiroli","Gondia","Hingoli","Jalgaon","Jalna","Kolhapur","Latur","Mumbai City","Mumbai Suburban","Nagpur","Nanded","Nandurbar","Nashik","Osmanabad","Palghar","Parbhani","Pune","Raigad","Ratnagiri","Sangli","Satara","Sindhudurg","Solapur","Thane","Wardha","Washim","Yavatmal"],
        "Manipur": ["Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West","Jiribam","Kakching","Kamjong","Kangpokpi","Noney","Pherzawl","Senapati","Tamenglong","Tengnoupal","Thoubal","Ukhrul"],
        "Meghalaya": ["East Garo Hills","East Jaintia Hills","East Khasi Hills","North Garo Hills","Ri Bhoi","South Garo Hills","South West Garo Hills","South West Khasi Hills","West Garo Hills","West Jaintia Hills","West Khasi Hills"],
        "Mizoram": ["Aizawl","Champhai","Kolasib","Lawngtlai","Lunglei","Mamit","Saiha","Serchhip"],
        "Nagaland": ["Dimapur","Kiphire","Kohima","Longleng","Mokokchung","Mon","Peren","Phek","Tuensang","Wokha","Zunheboto"],
        "Orissa": ["Angul","Balangir","Balasore","Bargarh","Bhadrak","Boudh","Cuttack","Debagarh","Dhenkanal","Gajapati","Ganjam","Jagatsinghpur","Jajpur","Jharsuguda","Kalahandi","Kandhamal","Kendrapara","Kendujhar","Khordha","Koraput","Malkangiri","Mayurbhanj","Nabarangpur","Nayagarh","Nuapada","Puri","Rayagada","Sambalpur","Subarnapur","Sundergarh"],
        "Punjab": ["Amritsar","Barnala","Bathinda","Faridkot","Fatehgarh Sahib","Fazilka","Firozpur","Gurdaspur","Hoshiarpur","Jalandhar","Kapurthala","Ludhiana","Mansa","Moga","Mohali","Muktsar","Pathankot","Patiala","Rupnagar","Sangrur","Shaheed Bhagat Singh Nagar","Tarn Taran"],
        "Rajasthan": ["Ajmer","Alwar","Banswara","Baran","Barmer","Bharatpur","Bhilwara","Bikaner","Bundi","Chittorgarh","Churu","Dausa","Dholpur","Dungarpur","Ganganagar","Hanumangarh","Jaipur","Jaisalmer","Jalore","Jhalawar","Jhunjhunu","Jodhpur","Karauli","Kota","Nagaur","Pali","Pratapgarh","Rajsamand","Sawai Madhopur","Sikar","Sirohi","Tonk","Udaipur"],
        "Sikkim": ["East Sikkim","North Sikkim","South Sikkim","West Sikkim"],
        "Tamil Nadu": ["Ariyalur","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kanchipuram","Kanyakumari","Karur","Krishnagiri","Madurai","Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukkottai","Ramanathapuram","Salem","Sivaganga","Thanjavur","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli","Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur","Vellore","Viluppuram","Virudhunagar"],
        "Telangana": ["Adilabad","Bhadradri Kothagudem","Hyderabad","Jagtial","Jangaon","Jayashankar","Jogulamba","Kamareddy","Karimnagar","Khammam","Komaram Bheem","Mahabubabad","Mahbubnagar","Mancherial","Medak","Medchal","Nagarkurnool","Nalgonda","Nirmal","Nizamabad","Peddapalli","Rajanna Sircilla","Ranga Reddy","Sangareddy","Siddipet","Suryapet","Vikarabad","Wanaparthy","Warangal Rural","Warangal Urban","Yadadri Bhuvanagiri"],
        "Tripura": ["Dhalai","Gomati","Khowai","North Tripura","Sepahijala","South Tripura","Unakoti","West Tripura"],
        "Uttar Pradesh": ["Agra","Aligarh","Allahabad","Ambedkar Nagar","Amethi","Amroha","Auraiya","Azamgarh","Baghpat","Bahraich","Ballia","Balrampur","Banda","Barabanki","Bareilly","Basti","Bhadohi","Bijnor","Budaun","Bulandshahr","Chandauli","Chitrakoot","Deoria","Etah","Etawah","Faizabad","Farrukhabad","Fatehpur","Firozabad","Gautam Buddha Nagar","Ghaziabad","Ghazipur","Gonda","Gorakhpur","Hamirpur","Hapur","Hardoi","Hathras","Jalaun","Jaunpur","Jhansi","Kannauj","Kanpur Dehat","Kanpur Nagar","Kasganj","Kaushambi","Kheri","Kushinagar","Lalitpur","Lucknow","Maharajganj","Mahoba","Mainpuri","Mathura","Mau","Meerut","Mirzapur","Moradabad","Muzaffarnagar","Pilibhit","Pratapgarh","Raebareli","Rampur","Saharanpur","Sambhal","Sant Kabir Nagar","Shahjahanpur","Shamli","Shravasti","Siddharthnagar","Sitapur","Sonbhadra","Sultanpur","Unnao","Varanasi"],
        "Uttaranchal" : ["Almora","Bageshwar","Chamoli","Champawat","Dehradun","Haridwar","Nainital","Pauri","Pithoragarh","Rudraprayag","Tehri","Udham Singh Nagar","Uttarkashi"],
        "West Bengal": ["Alipurduar","Bankura","Birbhum","Cooch Behar","Dakshin Dinajpur","Darjeeling","Hooghly","Howrah","Jalpaiguri","Jhargram","Kalimpong","Kolkata","Malda","Murshidabad","Nadia","North 24 Parganas","Paschim Bardhaman","Paschim Medinipur","Purba Bardhaman","Purba Medinipur","Purulia","South 24 Parganas","Uttar Dinajpur"],
        "Andaman and Nicobar Islands": ["Nicobar","North Middle Andaman","South Andaman"],
        "Chandigarh": ["Chandigarh"],
        "Dadar and Nagar Haveli": ["Dadra Nagar Haveli"],
        "Daman and Diu": ["Daman","Diu"],
        "Delhi": ["Central Delhi","East Delhi","New Delhi","North Delhi","North East Delhi","North West Delhi","Shahdara","South Delhi","South East Delhi","South West Delhi","West Delhi"],
        "Lakshadeep": ["Lakshadweep"],
        "Pondicherry": ["Karaikal","Mahe","Puducherry","Yanam"],
    }


    let [selectKeyValueOptionsState, setSelectKeyValueOptionsState] = useState(selectKeyValueOptions);

    let defaultSelectKeyValueOptionsArray = [
        ["Type", ""],
        ["State", ""],
        ["District", ""]
    ];

    let [selectKeyValueOptionsArray, setSelectKeyValueOptionsArray] =useState([
        ["Type", ""],
        ["State", ""],
        ["District", ""]
    ]);

    useEffect(()=>{             // This use effect will run when the value in clickedLayerId changes

        if(featureGrpRef.current && featureGrpRef.current._layers && featureGrpRef.current._layers[clickedLayerId]){
            
            let tempArray2 = [];    // This array is inistialised so that we can get the value (array of array) of the selectionListAttributesArray of the clicked layer in such a way that even if we make changes in this tempArray2 those changes are not directly reflected in the selectionListAttributesArray of the clicked layer 

            featureGrpRef.current._layers[clickedLayerId].selectionListAttributesArray.forEach(object=>{tempArray2.push([object[0],object[1]])});

            let tempArray = [...selectKeyValueOptionsState];    // The selectKeyValueOptionsState variable is an array of array which has the array of all the Indian states and types of a location. By using this state variable we can use the map method to populate the options list

            if(tempArray2[1][1]!==""){  // If the vlaue of the Indian State option is not an empty string in the selectionListAttributesArray of the clicked layer then this block of code will pupulate the district options list
                tempArray[2][1] = [...districtsOptionsList[tempArray2[1][1]]];
                setSelectKeyValueOptionsState(tempArray);
            }
            else{
                // this else block will remove the options from the district options list if the value of Indian State option is an empty string in the selectionListAttributesArray
                tempArray[2][1] = ""
                setSelectKeyValueOptionsState(tempArray);
            }
    
            setSelectKeyValueOptionsArray(tempArray2);      // The selectKeyValueOptionsArray is a temporrary array which will hold the value of selected options of the selection list untill the modal is open. 

            // console.log(featureGrpRef.current._layers[clickedLayerId].multiSelectOptionsState);

            let temporaryObject = {...featureGrpRef.current._layers[clickedLayerId].multiSelectOptionsState};

            // console.log(featureGrpRef.current._layers[clickedLayerId].multiSelectOptionsState);

            let sampleObject = {...multiSelectOptionsObject};

            if(temporaryObject["State"]!==""){
                sampleObject["District"].options = districtsOptionsList[temporaryObject["State"]];
                setMultiSelectOptionsObject(sampleObject);
            }
            else{
                sampleObject["District"].options = "";
                setMultiSelectOptionsObject(sampleObject);
            }
            
            setMultiSelectOptionsState(temporaryObject);

            let filteredArray = multiSelectOptions.filter(item => featureGrpRef.current._layers[clickedLayerId].multiSelectOptionsState[item.label] !== '');
            
            console.log(filteredArray);

            if(temporaryObject["State"]!==""&&featureGrpRef.current._layers[clickedLayerId].multiSelectOptionsState['District']===''){
                filteredArray.push({ label: "District", value: "District"});
            }

            setMultiSelectSelectedArray(filteredArray);

            //featureGrpRef.current._layers[clickedLayerId].multiSelectOptionsState

            let temporaryRowList = [];      // This is a temporrary array which will hold the value of user provided key value pairs in the text input boxes 

            // Object.entries(featureGrpRef.current._layers[clickedLayerId].userAddedAttribtes).forEach(object=>{
            //     let dummyObject= {
            //         key: object[0],
            //         value: object[1]
            //     }
            //     temporaryRowList.push(dummyObject);
            // })

            featureGrpRef.current._layers[clickedLayerId].userAddedAttribtesArray.forEach(array=>{
                temporaryRowList.push([array[0],array[1]]);  
            })

            setRowListArray(temporaryRowList);
            // rowListArray
        }
    },[clickedLayerId])
    
    // console.log(multiSelectOptionsState);

    useEffect(()=>{     // this use Effect will get executed when ever thevalue in the layerNameState state variable changes. And it will hit the backend api of the value inside the layerNameState is not null and not empty
        if(layerNameState!==""&&layerNameState!==null){
            let requestData = {
                layerName: layerNameState,
                geoSpatialDTO1List:layerListInfo,
            }

            console.log(requestData);

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

// -------------------------------------------------------------------------------------------------------------------------------------------

    const featureGrpRef = useRef();     // This reference variable holds the reference of the feature group in which the leaflet layers are drawn

    const clearAllLayers = () => {      // This function removes all the leaflet layers which are present in the leaflet draw feature group

        const featureGroup = featureGrpRef.current;
        if (featureGroup) {
            featureGroup.clearLayers();
        }

    };

    function toWKT(layer) {             // Function takes the leaflet layer as input and returns the well knwon text form of that geometry 
        
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
            } 
            else if (layer instanceof L.Polyline) {
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
        } 
        else if (layer instanceof L.Marker) {
            return "POINT(" + layer.getLatLng().lng + " " + layer.getLatLng().lat + ")";
        }
    }

    const getShapeTypes = () => {                   // This function gets executed when we click the add the layer button

        /*
         This function basically extacts all the features from the feature group and set the meta data related to each layer in the setlayerListInfo state variable and toggles the dailog box for recieving the layer name to true 
        */

        // drawnLayerInfoMap

        const featureGroup = featureGrpRef.current;
        if (featureGroup) {
            
            // let tempArray = [];
            // featureGroup.eachLayer(layer => {
            //     let dtoObject;
            //     let tempKeyValArrayHolder = [];

            //     console.log(layer._leaflet_id);
            //     console.log(drawnLayerInfoMap.get(layer._leaflet_id));

            //     let selectionInputArray = [...drawnLayerInfoMap.get(layer._leaflet_id).selectionAttributesArray];

            //     // console.log(selectionInputArray);

            //     selectionInputArray = selectionInputArray.filter(object => object[0]!==''&& object[1]!=='')

            //     let selectionInputObject = {}

            //     selectionInputArray.forEach(object=>{
            //         selectionInputObject[object[0]] = object[1];
            //     })

            //     selectionInputObject = {...drawnLayerInfoMap.get(layer._leaflet_id).calculatedInfoObject,...selectionInputObject,...drawnLayerInfoMap.get(layer._leaflet_id).userAddedAttribtes}

            //     // console.log(selectionInputObject);

            //     for(const key in selectionInputObject){
            //         let tempKeyValArray = [];
            //         tempKeyValArray.push(key);
            //         tempKeyValArray.push(selectionInputObject[key]);
            //         tempKeyValArrayHolder.push(tempKeyValArray);
            //     }

            //     let type = drawnLayerInfoMap.get(layer._leaflet_id).type;

            //     console.log(type);
                
            //     dtoObject = {
            //         type,
            //         wktString: toWKT(layer),
            //         keyValueArrayList: tempKeyValArrayHolder
            //     };
            //     tempArray.push(dtoObject);
            // });

            // setlayerListInfo(tempArray);
            dialogRef.current.showModal();
            setDailogeShowState(true);
        }
    };

    const displayLayerInfo = () => {        // this function basically logs all the layers info which os present on the feature group of the react leaflet
   
        const featureGroup = featureGrpRef.current;
        if (featureGroup) {
            featureGroup.eachLayer(layer => {
                console.log(layer);
            });
        }
        dialogRef.current.showModal();
        setDailogeShowState(true);

    }

    // Object.entries(selectKeyValueOptionsState).forEach((object)=>{
    //     console.log(object[0]);
    //     console.log(object[1]);
    // })

    // console.log(rowListArray.length);

    // rowListArray.forEach(object=>{
    //     console.log(object);
    // })    

    function changedKeyHandler(event, index){       // This function handles the change in the key column of the dailog box table
        let tempArray = [...rowListArray];
        tempArray[index][0] = event.target.value;
        setRowListArray(tempArray);
        // console.log(event.target.value);
    }

    function changedValueHandler(event, index){     // This function handles the change in the value column of the dailog box table
        let tempArray = [...rowListArray];
        tempArray[index][1] = event.target.value;
        setRowListArray(tempArray);
        // console.log(event.target.value);
    }

    function handleDropDownOptionChange(event, index) {
        let tempArray2 = [...selectKeyValueOptionsArray];
        if(tempArray2[index][0] === 'State'){
            tempArray2[2][1] = "";
            setSelectKeyValueOptionsArray(tempArray2);
            
            let tempArray = [...selectKeyValueOptionsState];
            if(event.target.value!==""){
                tempArray[2][1] = [...districtsOptionsList[event.target.value]];
                setSelectKeyValueOptionsState(tempArray);
            }
            else{
                tempArray[2][1] = ""
                setSelectKeyValueOptionsState(tempArray);
            }
        }
        
        tempArray2[index][1] = event.target.value;
        setSelectKeyValueOptionsArray(tempArray2);

        // console.log(selectKeyValueOptionsArray);
    }

    function handleLayersAdditionToBackEnd() {
        dialogRef.current.close();
        setDailogeShowState(false);

        // ------------------------------------------------------------------------------------------------------------------------------

        let tempArray = [];

        const featureGroup = featureGrpRef.current;
        if (featureGroup) {
            
            
            featureGroup.eachLayer(layer => {
                
                let dtoObject;
                let tempKeyValArrayHolder = [];

                // console.log(layer._leaflet_id);
                // console.log(featureGrpRef.current._layers[clickedLayerId]);
                
                let selectionInputArray = [];
                let calculatedDimentionArray = [];

                layer.selectionListAttributesArray.forEach(object=>{selectionInputArray.push([object[0],object[1]])});
                layer.calculatedInfoArray.forEach(object=>{calculatedDimentionArray.push([object[0],object[1]])});

                selectionInputArray = selectionInputArray.filter(object => object[0]!==''&& object[1]!=='')

                let userDefinedAttributesArray = []
                layer.userAddedAttribtesArray.forEach(object=>{userDefinedAttributesArray.push([object[0],object[1]])});

                // console.log(selectionInputObject);

                selectionInputArray.forEach(array=>{
                    tempKeyValArrayHolder.push([array[0],array[1]]);
                })

                calculatedDimentionArray.forEach(array=>{
                    tempKeyValArrayHolder.push([array[0],array[1]]);
                })

                userDefinedAttributesArray.forEach(array=>{
                    tempKeyValArrayHolder.push([array[0],array[1]]);
                })

                Object.entries(layer.multiSelectOptionsState).forEach(object=>{
                    if(object[1]!==''){
                        tempKeyValArrayHolder.push([object[0],object[1]])
                    }
                })

                // for(const key in userDefinedAttributes){
                //     let tempKeyValArray = [];
                //     tempKeyValArray.push(key);
                //     tempKeyValArray.push(userDefinedAttributes[key]);
                //     tempKeyValArrayHolder.push(tempKeyValArray);
                // }

                console.log(tempKeyValArrayHolder);
                console.log(selectionInputArray);
                console.log(calculatedDimentionArray);
                console.log(userDefinedAttributesArray);
                console.log(multiSelectOptionsState);

                let type = layer.type;

                console.log(type);
                
                dtoObject = {
                    type,
                    wktString: toWKT(layer),
                    keyValueArrayList: tempKeyValArrayHolder
                };
                tempArray.push(dtoObject);
            });

            // setlayerListInfo(tempArray);
            // dialogRef.current.showModal();
            // setDailogeShowState(true);
        }



        // ------------------------------------------------------------------------------------------------------------------------------

        dialogRef.current.close();
        setDailogeShowState(false);

        let nameOfTheLayer = "";

        if(layerNameInputRef.current.value!==null && !isOnlyWhitespace(layerNameInputRef.current.value) && tempArray.length>0){
            // setLayerNameState(layerNameInputRef.current.value);
            nameOfTheLayer = layerNameInputRef.current.value;

            console.log(tempArray);

            let requestData = {
                layerName: nameOfTheLayer,
                geoSpatialDTO1List:tempArray,
            }

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
        setlayerListInfo([]);
        layerNameInputRef.current.value = "";
        
        // setLayerNameState("");
    }


    function handleMultipleSelect(dataArray) {

        let tempArray1 = dataArray.map(value=>value.label);
        let tempArray2 = multiSelectSelectedArray.map(value=>value.label);

        let tempArray3 = [];

        if(tempArray1.length>tempArray2.length){
            tempArray1.forEach(value=>{
                if(!tempArray2.includes(value)){
                    tempArray3.push(value);
                }
            })
            console.log("Items added: ");
            console.log(tempArray3);
        }
        else{
            tempArray2.forEach(value=>{
                if(!tempArray1.includes(value)){
                    tempArray3.push(value);
                }
            })
            tempArray3.forEach(item=>{
                let tempObject = {...multiSelectOptionsState};
                tempObject[item] = '';
                setMultiSelectOptionsState(tempObject);
            })
        }

        // console.log(tempArray3);
        // console.log(dataArray);
        setMultiSelectSelectedArray(dataArray);
    }

    // if(clickedLayerId && drawnLayerInfoMap.get(clickedLayerId) ){

    //     Object.entries(drawnLayerInfoMap.get(clickedLayerId).userAddedAttribtes).forEach((object, index)=>{
    //         console.log(object);
    //         console.log(index);
    //     })
    // }


// -------------------------------------------------------------------------------------------------------------------------------------------

    // if(featureGrpRef.current && featureGrpRef.current._layers[clickedLayerId]){
    //     Object.entries(featureGrpRef.current._layers[clickedLayerId].calculatedInfoArray).forEach(array=>{
    //         console.log(array[1][0]);
    //         console.log(array[1][1]);
    //     })
    // }


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
                        
                        <MyMap2 flyToCoordinates={flyToCoordinates} mapZoom={mapZoom} setMapZoom={setMapZoom} mapcenter={mapcenter} setMapcenter={setMapcenter} setIsDestinationClicked={setIsDestinationClicked} isDestinationClicked={isDestinationClicked} featureGrpRef={featureGrpRef} layerBoundState={layerBoundState} setShowDataAddingDailogue={setShowDataAddingDailogue} setClickedLayerId={setClickedLayerId} setDrawnLayerInfoMap={setDrawnLayerInfoMap} drawnLayerInfoMap={drawnLayerInfoMap}/>

                    </div>

                    <div className="stat-container">
                        <div className="coordinates-container">
                            <input type="file" onChange={handleFileSelection}/>
                            <div style={{display:"flex"}}>
                                <p>Coordinates: </p>
                                <div className='coordinates-readings'>
                                    <p id="current-latlng-container">null, null</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button onClick={getShapeTypes}>Add the Layer</button>
                            <button onClick={clearAllLayers}>Remove all layers</button>
                            <button onClick={displayLayerInfo}>Display layers info</button>
                            <button onClick={()=>console.log(selectedLayerArray.array)}>Display Seelected Layers Array</button>
                            <button onClick={()=>console.log(selectedLayerFillOpacity.array)}>Display Selected fillOpacity Array</button>
                            <button onClick={()=>console.log(multiSelectOptionsState)}>multiSelectOptionsState</button>
                            <button onClick={()=>console.log(multiSelectSelectedArray)}>multiSelectSelectedArray</button>
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
                                // onClick={()=>{
                                //     // HandleLayersAdditionToBackEnd
                                //     dialogRef.current.close();
                                //     setDailogeShowState(false);
                                //     if(layerNameInputRef.current.value!==""&&layerNameInputRef.current.value!==null){
                                //         setLayerNameState(layerNameInputRef.current.value);
                                //         featureGrpRef.current.clearLayers();
                                //     }
                                //     layerNameInputRef.current.value = "";
                                // }}

                                onClick={handleLayersAdditionToBackEnd}
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

                <dialog ref={dialogRef2} className='data-adding-Popup'>

                    <div className="data-adding-Popup-relative-div">

                        <div className='data-adding-Popup-data-table'>

                            <div className="data-adding-Popup-data-table-header">
                                <div className="data-adding-Popup-data-table-key-header">Key</div>
                                <div className="data-adding-Popup-data-table-value-header">Value</div>
                            </div>

                            {/* {
                                clickedLayerId && drawnLayerInfoMap.get(clickedLayerId) && Object.entries(drawnLayerInfoMap.get(clickedLayerId).calculatedInfoObject).map(([key, value]) => {
                                    return(
                                        <div key={key} className="data-adding-Popup-data-table-row">
                                            <div className="data-adding-Popup-data-table-key-row">{key}</div>
                                            <div className="data-adding-Popup-data-table-valye-row">{value}</div>
                                        </div>
                                    )
                                })
                            } */}

                            {
                                featureGrpRef.current && featureGrpRef.current._layers[clickedLayerId] && Object.entries(featureGrpRef.current._layers[clickedLayerId].calculatedInfoArray).map((array) => {
                                    return(
                                        <div key={array[1][0]} className="data-adding-Popup-data-table-row">
                                            <div className="data-adding-Popup-data-table-key-row">{array[1][0]}</div>
                                            <div className="data-adding-Popup-data-table-valye-row">{array[1][1].toFixed(4)}</div>
                                        </div>
                                    )
                                })
                            }

                            {/* {
                                selectKeyValueOptionsState.map((array, index) => (
                                    array[1] !== "" &&
                                    <div className="data-adding-Popup-data-table-row" key={array[0]}>
                                        <div className="data-adding-Popup-data-table-key-row">{array[0]}</div>
                                        <select
                                            name={`${array[0]}`}
                                            id={`${array[0]}`}
                                            value={selectKeyValueOptionsArray[index][1] || ""}
                                            onChange={(event) => { handleDropDownOptionChange(event, index) }}>
                                            <option value="">---Select---</option>
                                            {
                                                array[1] && array[1].map(names => (
                                                    <option key={names} value={names}>{names}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                ))
                            } */}

                            {/* {
                                multiSelectSelectedArray.map(name=>{
                                    return(
                                        
                                        <>  

                                            {
                                                multiSelectOptionsObject[name.label].type === 'selection box' && multiSelectOptionsObject[name.label].options !== '' ?
                                                <div className="data-adding-Popup-data-table-row" key={name.label}>
                                                    <div className="data-adding-Popup-data-table-key-row">{name.label}</div>
                                                    <select
                                                        name={`${name.label}`}
                                                        id={`${name.label}`}
                                                    >
                                                    <option value="">---Select---</option>
                                                    {
                                                        multiSelectOptionsObject[name.label].options && multiSelectOptionsObject[name.label].options.map(names => (
                                                            <option key={names} value={names}>{names}</option>
                                                        ))
                                                    }
                                                    </select>
                                                </div> :

                                                // multiSelectOptionsObject[name.label].type === 'text box' &&
                                                <div className="data-adding-Popup-data-table-row" key={name.label}>
                                                    <div className="data-adding-Popup-data-table-key-row">{name.label}</div>
                                                    <input type='text'/>
                                                </div>
                                            }

                                        </>
                                    )
                                })
                            } */}

                            {
                                multiSelectSelectedArray.map(name=>{

                                    // console.log(name);
                                    // console.log(!(multiSelectOptionsObject[name.label].type === 'selection box' && multiSelectOptionsObject[name.label].options === ''));
                                    
                                    return(
                                        !(multiSelectOptionsObject[name.label].type === 'selection box' && multiSelectOptionsObject[name.label].options === '') &&

                                        <div className="data-adding-Popup-data-table-row" key={name.label}>  

                                            {
                                                multiSelectOptionsObject[name.label].type === 'selection box' && multiSelectOptionsObject[name.label].options !== '' &&
                                                <>
                                                    <div className="data-adding-Popup-data-table-key-row">{name.label}</div>
                                                    <select
                                                        name={`${name.label}`}
                                                        id={`${name.label}`}
                                                        value={multiSelectOptionsState[name.label]}
                                                        onChange={(event)=>{
                                                            if (name.label==="State") {
                                                                if(event.target.value!==""){
                                                                    let sampleObject = {...multiSelectOptionsObject};
                                                                    sampleObject["District"].options = districtsOptionsList[event.target.value];
                                                                    setMultiSelectOptionsObject(sampleObject);
                                                                }
                                                                else{
                                                                    let sampleObject = {...multiSelectOptionsObject};
                                                                    sampleObject["District"].options = "";
                                                                    setMultiSelectOptionsObject(sampleObject);
                                                                }
                                                            }
                                                            let tempObject = {...multiSelectOptionsState};
                                                            tempObject[name.label] = event.target.value;
                                                            setMultiSelectOptionsState(tempObject);
                                                        }}
                                                    >
                                                        <option value="">---Select---</option>
                                                        {
                                                            multiSelectOptionsObject[name.label].options && multiSelectOptionsObject[name.label].options.map(names => (
                                                                <option key={names} value={names}>{names}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </>
                                            }

                                            {
                                                multiSelectOptionsObject[name.label].type === 'text box' &&
                                                <>
                                                    <div className="data-adding-Popup-data-table-key-row">{name.label}</div>
                                                    <input value={multiSelectOptionsState[name.label]} 
                                                    onChange={(event)=>{
                                                        let tempObject = {...multiSelectOptionsState};
                                                        tempObject[name.label] = event.target.value;
                                                        setMultiSelectOptionsState(tempObject);
                                                    }} type='text'/>
                                                </>
                                            }

                                        </div>
                                    )
                                })
                            }


                            {/* {
                                rowListArray.map((array, index)=>{
                                    return(
                                        <div key={index} className="data-adding-Popup-data-table-row">
                                            <input className="data-adding-Popup-data-table-key-row" value={array[0]} onChange={(event)=>{changedKeyHandler(event, index)}}/>
                                            <input className="data-adding-Popup-data-table-valye-row" value={array[1]} onChange={(event)=>{changedValueHandler(event, index)}}/>
                                        </div>
                                    )
                                })                                
                            } */}
                            
                        </div>
                    
                        <MultiSelect
                            options={multiSelectOptions}
                            value={multiSelectSelectedArray}
                            onChange={handleMultipleSelect}
                            labelledBy="Select"
                        />

                        {/* <MultiSelect
                            value={multiSelectSelectedArray}
                            options={multiSelectOptions}
                            onChange={(e) => setMultiSelectSelectedArray(e.value)}
                            optionLabel="name"
                            placeholder="Select Cities"
                            display="chip"
                        /> */}

                        <div className="button-container">
                            
                            <button className="popup-addrow-btn"onClick={()=>{
                                let tempArray = [...rowListArray];
                                tempArray.push(['',''])
                                setRowListArray(tempArray);
                            }}>
                                Add Row
                            </button>
                            
                            <button className="popup-submit-btn" onClick={()=>{
                                let tempArray = [...rowListArray];
                                tempArray = tempArray.filter(array => array[0]!=='' && array[1]!=='')

                                let temporaryObject = featureGrpRef.current._layers[clickedLayerId];

                                temporaryObject.userAddedAttribtesArray = tempArray;

                                temporaryObject.selectionListAttributesArray = selectKeyValueOptionsArray;

                                // console.log(multiSelectOptionsState);

                                temporaryObject.multiSelectOptionsState = multiSelectOptionsState;

                                dialogRef2.current.close();
                                setShowDataAddingDailogue(false);
                                setRowListArray([]);
                                setClickedLayerId(0);
                                let newArray = [];
                                defaultSelectKeyValueOptionsArray.forEach(object=>newArray.push([object[0],object[1]]))
                                setSelectKeyValueOptionsArray(newArray);
                                setMultiSelectOptionsState({
                                    "Name": "",
                                    "Type": "",
                                    "State": "",
                                    "District": "",
                                });
                            }}>
                                Submit
                            </button>
                            
                            <button className="popup-close-btn" onClick={()=>{
                                dialogRef2.current.close();
                                setShowDataAddingDailogue(false);
                                setRowListArray([]);
                                setClickedLayerId(0);
                                let newArray = [];
                                defaultSelectKeyValueOptionsArray.forEach(object=>newArray.push([object[0],object[1]]))
                                setSelectKeyValueOptionsArray(newArray);
                                setMultiSelectSelectedArray([]);
                                setMultiSelectOptionsState({
                                    "Name": "",
                                    "Type": "",
                                    "State": "",
                                    "District": "",
                                });
                            }}>
                                Close
                            </button>

                        </div>

                        <div className="button-container">
                            <button onClick={()=>console.log(featureGrpRef.current._layers[clickedLayerId].multiSelectOptionsState)}>current Layer multiSelectOptionsState</button>
                            <button onClick={()=>console.log(featureGrpRef.current._layers[clickedLayerId].selectionListAttributesArray)}>current Layer selectionAttributes</button>
                            <button onClick={()=>console.log(multiSelectSelectedArray)}>multiSelectSelectedArray</button>
                        </div>
                        <div className="button-container">
                            <button onClick={()=>console.log(multiSelectOptionsState)}>multiSelectOptionsState</button>
                            <button onClick={()=>{
                                Object.entries(featureGrpRef.current._layers[clickedLayerId].multiSelectOptionsState).forEach(object=>{
                                    console.log(object);
                                })
                            }}>rowListArray</button>
                            <button onClick={()=>console.log(multiSelectOptionsObject)}>multiSelectOptionsObject</button>
                        </div>

                        <div className="footer-dailog-div">
                        </div>

                    </div>


                    
                </dialog>

            </div>

        </div>
    )
}

export default MainDivComponent2;

