import fr from 'antd/lib/locale-provider/fr_FR';
import en from 'antd/lib/locale-provider/default';
import {
  SELECT_APP,
  SELECT_ENTITY,
  SELECT_SEASON,
  SET_APPS,
  SELECT_LOCALE,
  SET_CONFIG,
  ADD_ENTITY,
  UPDATE_ENTITY,
  ADD_SEASON,
  UPDATE_SEASON,
} from '../actions/types';
import defaultConfig from '../config/default.json';

const INITIAL_STATE = {
  apps: [],
  entities: [],
  seasons: [],
  currentApp: null,
  currentEntity: null,
  currentSeason: null,
  config: defaultConfig,
  locale: fr,
  role: '',
};

const locales = { fr, en };

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case SET_APPS: {
      return { ...state, apps: payload.apps, role: payload.role || state.role };
    }
    case SELECT_APP: {
      const { selectedApp, config, update } = payload;
      if (!state.currentApp || selectedApp.id !== state.currentApp.id || update) {
        const { entities } = selectedApp;
        const newState = {
          ...state,
          currentApp: { ...selectedApp },
          currentEntity: entities.length > 0 ? entities[0] : INITIAL_STATE.currentEntity,
          currentSeason:
            entities.length > 0
              ? entities[0].seasons[entities[0].seasons.length - 1]
              : INITIAL_STATE.currentSeason,
          entities,
          seasons: entities.length > 0 ? entities[0].seasons : INITIAL_STATE.seasons,
          config,
        };
        return newState;
      }
      return state;
    }
    case SELECT_ENTITY: {
      return {
        ...state,
        currentEntity: payload,
        seasons: payload.seasons,
        currentSeason: payload.seasons[payload.seasons.length - 1],
      };
    }
    case ADD_ENTITY: {
      const appIndex = state.apps.findIndex(a => a.id === state.currentApp.id);
      const newApps = [...state.apps];
      const newEntities = [...state.apps[appIndex].entities, payload];
      const updatedApp = {
        ...state.apps[appIndex],
        entities: newEntities,
      };
      newApps[appIndex] = updatedApp;

      return {
        ...state,
        apps: newApps,
        currentApp: updatedApp,
        currentEntity: payload,
        entities: newEntities,
        seasons: payload.seasons,
        currentSeason: payload.seasons[payload.seasons.length - 1],
      };
    }
    case UPDATE_ENTITY: {
      const appIndex = state.apps.findIndex(a => a.id === state.currentApp.id);
      const newApps = [...state.apps];
      const entityIndex = state.currentApp.entities.findIndex(e => e.id === payload.id);
      const newEntities = [...state.currentApp.entities];
      newEntities.splice(entityIndex, 1, payload);
      const updatedApp = {
        ...state.apps[appIndex],
        entities: newEntities,
      };
      newApps[appIndex] = updatedApp;

      return {
        ...state,
        apps: newApps,
        currentApp: updatedApp,
        currentEntity: payload,
        entities: newEntities,
      };
    }
    case SELECT_SEASON:
      return { ...state, currentSeason: payload };
    case ADD_SEASON: {
      const newApps = [...state.apps];
      const appIndex = state.apps.findIndex(a => a.id === state.currentApp.id);
      const { seasons } = state;
      const newSeasons = [...seasons, payload];
      const newEntity = { ...state.currentEntity, seasons: newSeasons };
      const currentEntityIndex = state.currentApp.entities.findIndex(
        e => e.id === state.currentEntity.id,
      );
      newApps[appIndex].entities.splice(currentEntityIndex, 1, newEntity);

      const newState = {
        ...state,
        apps: newApps,
        seasons: newSeasons,
        currentEntity: newEntity,
        currentSeason: payload,
      };
      return newState;
    }
    case UPDATE_SEASON: {
      const newApps = [...state.apps];
      const appIndex = state.apps.findIndex(a => a.id === state.currentApp.id);
      const { seasons } = state.currentEntity;
      const newSeasons = [...seasons];
      const seasonToReplace = newSeasons.findIndex(s => s.id === payload.id);
      newSeasons.splice(seasonToReplace, 1, payload);
      const newEntity = { ...state.currentEntity, seasons: newSeasons };
      const currentEntityIndex = state.currentApp.entities.findIndex(
        e => e.id === state.currentEntity.id,
      );
      newApps[appIndex].entities.splice(currentEntityIndex, 1, newEntity);

      return {
        ...state,
        apps: newApps,
        seasons: newSeasons,
        currentEntity: newEntity,
        currentSeason: payload,
      };
    }
    case SET_CONFIG:
      return { ...state, config: payload };
    case SELECT_LOCALE:
      return { ...state, locale: locales[payload] };
    default:
      return state;
  }
};
