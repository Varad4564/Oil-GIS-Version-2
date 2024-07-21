import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    array: [],
};

export const SelectedLayerArraySlice = createSlice({
    name: "selectedLayerArray",
    initialState,
    reducers:{
        addLayer: (state,action) => {
            // console.log(action.payload);
            state.array.push(action.payload);
        },
        removeLayer:(state, action) => {
            state.array = state.array.filter(individualLayer => individualLayer.id!==action.payload);
        }
    }
}); 

export const { addLayer, removeLayer } = SelectedLayerArraySlice.actions;
export default SelectedLayerArraySlice.reducer;