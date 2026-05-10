    import { createSlice } from '@reduxjs/toolkit'

    // Holds the booking wizard state while customer creates a booking
    const initialState = {
    selectedService:  null,
    selectedProvider: null,
    bookingDetails:   null, // address, scheduledAt, notes
    }

    const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setSelectedService: (state, action) => {
        state.selectedService = action.payload
        },
        setSelectedProvider: (state, action) => {
        state.selectedProvider = action.payload
        },
        setBookingDetails: (state, action) => {
        state.bookingDetails = action.payload
        },
        clearBookingWizard: (state) => {
        state.selectedService  = null
        state.selectedProvider = null
        state.bookingDetails   = null
        },
    },
    })

    export const {
    setSelectedService,
    setSelectedProvider,
    setBookingDetails,
    clearBookingWizard,
    } = bookingSlice.actions

    export default bookingSlice.reducer