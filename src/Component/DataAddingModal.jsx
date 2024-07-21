import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { MultiSelect } from "react-multi-select-component";

function DataAddingModal({featureGrpRef, dialogRef2, clickedLayerId, setClickedLayerId, setShowDataAddingDailogue}) {


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


    useEffect(()=>{             // This use effect will run when the value in clickedLayerId changes

        if(featureGrpRef.current && featureGrpRef.current._layers && featureGrpRef.current._layers[clickedLayerId]){
            
            let temporaryObject = {...featureGrpRef.current._layers[clickedLayerId].multiSelectOptionsState};

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

        }
    },[clickedLayerId])

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

        setMultiSelectSelectedArray(dataArray);
    }

    return (
        <dialog ref={dialogRef2} className='data-adding-Popup'>
            <div className="data-adding-Popup-relative-div">
                <div className='data-adding-Popup-data-table'>
                    <div className="data-adding-Popup-data-table-header">
                        <div className="data-adding-Popup-data-table-key-header">Key</div>
                        <div className="data-adding-Popup-data-table-value-header">Value</div>
                    </div>
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
                    {
                        multiSelectSelectedArray.map(name=>{
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
                </div>
                <MultiSelect
                    options={multiSelectOptions}
                    value={multiSelectSelectedArray}
                    onChange={handleMultipleSelect}
                    labelledBy="Select"
                />
                <div className="button-container">
                    <button className="popup-addrow-btn"onClick={()=>{
                    }}>
                        Add Row
                    </button>
                    <button className="popup-submit-btn" onClick={()=>{
                        let temporaryObject = featureGrpRef.current._layers[clickedLayerId];
                        temporaryObject.multiSelectOptionsState = multiSelectOptionsState;
                        dialogRef2.current.close();
                        setShowDataAddingDailogue(false);
                        setClickedLayerId(0);
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
                        setClickedLayerId(0);
                        // let newArray = [];
                        // defaultSelectKeyValueOptionsArray.forEach(object=>newArray.push([object[0],object[1]]))
                        // setSelectKeyValueOptionsArray(newArray);
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
                {/* <div className="button-container">
                    <button onClick={()=>{
                        Object.entries(featureGrpRef.current._layers[clickedLayerId].multiSelectOptionsState).forEach(object=>{
                            console.log(object);
                        })
                    }}>current layer multiSelectOptionsState</button>
                    <button onClick={()=>console.log(multiSelectSelectedArray)}>multiSelectSelectedArray</button>
                </div>
                <div className="button-container">
                    <button onClick={()=>console.log(multiSelectOptionsState)}>multiSelectOptionsState</button>
                    <button onClick={()=>console.log(multiSelectOptionsObject)}>multiSelectOptionsObject</button>
                    <button onClick={()=>console.log(featureGrpRef.current._layers[clickedLayerId])}>current Layer</button>
                </div> */}
                <div className="footer-dailog-div">
                </div>
            </div>
        </dialog>
    )
}

export default DataAddingModal
