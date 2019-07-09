import {
  SET_APPS,
  SELECT_APP,
  SELECT_ENTITY,
  SELECT_SEASON,
  SELECT_LOCALE,
  SET_CONFIG,
  ADD_ENTITY,
  UPDATE_ENTITY,
  ADD_SEASON,
  UPDATE_SEASON,
} from './types';

// App
export const setApps = payload => ({ type: SET_APPS, payload });

export const selectApp = payload => ({ type: SELECT_APP, payload });

// Entity
export const selectEntity = payload => ({ type: SELECT_ENTITY, payload });

export const addEntity = payload => ({ type: ADD_ENTITY, payload });

export const updateEntity = payload => ({ type: UPDATE_ENTITY, payload });

// Season
export const selectSeason = payload => ({ type: SELECT_SEASON, payload });

export const addSeason = payload => ({ type: ADD_SEASON, payload });

export const updateSeason = payload => ({ type: UPDATE_SEASON, payload });

// Config
export const selectLocale = payload => ({ type: SELECT_LOCALE, payload });

export const setConfig = payload => ({ type: SET_CONFIG, payload });
