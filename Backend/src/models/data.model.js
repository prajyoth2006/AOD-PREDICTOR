import mongoose from "mongoose";

const environmentalDataSchema = new mongoose.Schema({
  windSpeed: {
    type: Number, // in m/s or km/h
    required: true,
  },
  airTemperature: {
    type: Number, // in °C
    required: true,
  },
  landSurfaceTemperature: {
    type: Number, // in °C
    required: true,
  },
  cloudCover: {
    type: Number, // in percentage (0–100)
    required: true,
  },
  soilMoisture: {
    type: Number, // volumetric or percent
    required: true,
  },
  relativeHumidity: {
    type: Number, // in percentage (0–100)
    required: true,
  },
  precipitation: {
    type: Number, // in mm
    required: true,
  },
  vegetationIndex: {
    type: Number,
    required: true,
  },
  surfacePressure: {
    type: Number, // in hPa
    required: true,
  },
  aerosolPrecursorGases: {
    no2: {
      type: Number, // in µg/m³ or ppb
      default: null,
    },
    so2: {
      type: Number, // in µg/m³ or ppb
      default: null,
    }
  },
  location: {
    type: String, 
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

export const EnvironmentalData = mongoose.model("EnvironmentalData", environmentalDataSchema);
