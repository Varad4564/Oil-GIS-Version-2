import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    array: [],
};

export const SelectedLayerFillOpacityArraySlice = createSlice({
    name: "SelectedLayerFillOpacityArray",
    initialState,
    reducers:{
        addLayerFillOpacity: (state,action) => {
            console.log(action.payload);
            state.array.push(action.payload);
        },
        editLayerFillOpacity: (state,action) => {
            // state.array.push(action.payload);
            state.array = state.array.map(object=>{
                if(object.layerid === action.payload.layerid){
                    return action.payload;
                }
                return object;
            })
        },
        removeLayerFillOpacity:(state, action) => {
            state.array = state.array.filter(individualLayer => individualLayer.layerid!==action.payload);
        }
    }
}); 

export const { addLayerFillOpacity, editLayerFillOpacity, removeLayerFillOpacity } = SelectedLayerFillOpacityArraySlice.actions;
export default SelectedLayerFillOpacityArraySlice.reducer;