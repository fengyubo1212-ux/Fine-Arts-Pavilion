// Mock data for static frontend (no backend API)
import * as mock from '../mock';

// Use mock data directly (no backend needed)
const api = mock;

export const login = api.login;
export const getArtists = api.getArtists;
export const getArtist = api.getArtist;
export const createArtist = async (data) => ({ data: { id: Date.now(), ...data } });
export const updateArtist = async (id, data) => ({ data: { id, ...data } });
export const deleteArtist = async () => ({});

export const getExhibitions = api.getExhibitions;
export const getExhibition = api.getExhibition;
export const createExhibition = async (data) => ({ data: { id: Date.now(), ...data } });
export const updateExhibition = async (id, data) => ({ data: { id, ...data } });
export const deleteExhibition = async () => ({});

export const getArtworks = api.getArtworks;
export const getArtwork = api.getArtwork;
export const createArtwork = async (data) => ({ data: { id: Date.now(), ...data } });
export const updateArtwork = async (id, data) => ({ data: { id, ...data } });
export const deleteArtwork = async () => ({});

export const getSettings = api.getSettings;
export const updateSettings = async (data) => ({ data });
