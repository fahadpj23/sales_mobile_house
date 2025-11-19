import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { SalesData, SalesState, SalesFormData } from "../types/sales";

export const submitSalesData = createAsyncThunk(
  "sales/submitSalesData",
  async (salesData: SalesFormData, { rejectWithValue }) => {
    try {
      const dataToSubmit = {
        ...salesData,
        salesTotal: parseFloat(salesData.salesTotal),
        serviceTotal: parseFloat(salesData.serviceTotal),
        timestamp: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "sales"), dataToSubmit);
      return { id: docRef.id, ...dataToSubmit } as SalesData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSalesData = createAsyncThunk(
  "sales/fetchSalesData",
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, "sales"));
      const sales: SalesData[] = [];
      querySnapshot.forEach((doc) => {
        sales.push({ id: doc.id, ...doc.data() } as SalesData);
      });
      return sales;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState: SalesState = {
  salesData: [],
  loading: false,
  error: null,
  success: false,
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitSalesData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        submitSalesData.fulfilled,
        (state, action: PayloadAction<SalesData>) => {
          state.loading = false;
          state.success = true;
          state.salesData.push(action.payload);
        }
      )
      .addCase(submitSalesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSalesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSalesData.fulfilled,
        (state, action: PayloadAction<SalesData[]>) => {
          state.loading = false;
          state.salesData = action.payload;
        }
      )
      .addCase(fetchSalesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccess } = salesSlice.actions;
export default salesSlice.reducer;
