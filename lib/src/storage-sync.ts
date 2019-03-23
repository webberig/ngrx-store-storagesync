import { Action } from '@ngrx/store';
import { merge } from 'lodash';

import { INIT_ACTION, UPDATE_ACTION } from './actions';
import { IStorageSyncOptions } from './models/storage-sync-options';
import { rehydrateState } from './rehydrate-state';
import { stateSync } from './state-sync';

/**
 * @internal Check to see if not inside a browser (for SSR)
 * @returns returns true if not in a browser
 */
export const isNotBrowser = typeof window === 'undefined';

/**
 * The StorageSync Meta Reducer for @ngrx/store.
 *
 * @param options The configuration for the meta reducer
 *
 * Check out github for more information.
 * @see https://github.com/larscom/ngrx-store-storagesync *
 *
 * @returns returns the meta reducer function
 */
export const storageSync = <T>(options: IStorageSyncOptions) => (
  reducer: (state: T, action: Action) => T
): ((state: T, action: Action) => T) => {
  if (isNotBrowser) {
    return (state: T, action: Action): T => {
      const isInit = !state && action.type === INIT_ACTION;
      return isInit ? reducer(state, action) : { ...state };
    };
  }

  const config: IStorageSyncOptions = {
    rehydrate: true,
    syncEmptyObjects: false,
    storageKeySerializer: (key: string) => key,
    rehydrateStateMerger: (nextState, rehydratedState) => merge({}, nextState, rehydratedState),
    ...options
  };

  const restoredState = config.rehydrate ? rehydrateState<T>(config) : null;

  return (state: T, action: Action): T => {
    let nextState: T = null;

    if (!state && action.type === INIT_ACTION) {
      nextState = reducer(state, action);
    } else {
      nextState = { ...state };
    }

    if (restoredState && [INIT_ACTION, UPDATE_ACTION].includes(action.type)) {
      nextState = config.rehydrateStateMerger(nextState, restoredState);
    }

    nextState = reducer(nextState, action);

    if (action.type !== INIT_ACTION) {
      stateSync(nextState, config);
    }

    return nextState;
  };
};
