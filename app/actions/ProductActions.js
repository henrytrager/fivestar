import axios from 'axios'

import { push } from 'react-router-redux'

export const BEGIN_SEARCH = 'BEGIN_SEARCH'
export function beginSearch() {
  return {
    type: BEGIN_SEARCH
  }
}

export function commitParamsToHistory(params) {
  return push({query: params})
}

export const NEW_RESULTS = 'NEW_RESULTS'
export function performSearch(inputParams) {
  return (dispatch, getState) => {
    const params = inputParams || getState().params

    if (params.query === undefined || params.query.length < 1) {
      return dispatch(clearResults())
    }

    dispatch(beginSearch())
    dispatch(getSearchResults(params))
  }
}

export function getSearchResults(params) {
  return dispatch => {
    axios({
      method: 'GET',
      url: '/api/search',
      params: params
    })
    .then(resp => resp.data)
    .then(results => {
      dispatch({
        type: NEW_RESULTS,
        results
      })
    })
  }
}

export const CLEAR_RESULTS = 'CLEAR_RESULTS'
export function clearResults() {
  return {
    type: CLEAR_RESULTS
  }
}