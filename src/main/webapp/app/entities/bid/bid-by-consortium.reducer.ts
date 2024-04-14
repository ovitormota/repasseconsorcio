import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit'
import axios from 'axios'
import { loadMoreDataWhenScrolled, parseHeaderForLinks } from 'react-jhipster'

import { IBid, defaultValue } from 'app/shared/model/bid.model'
import { EntityState, IQueryParams, createEntitySlice } from 'app/shared/reducers/reducer.utils'

const initialState: EntityState<IBid> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
}

const apiUrl = 'api/bids'

// Actions

interface IBidByConsortium extends IQueryParams {
  consortiumId: string | number
}

export const getEntitiesByConsortium = createAsyncThunk('bid/fetch_entity_list_by_consortium', async ({ consortiumId, page, size, sort }: IBidByConsortium) => {
  const requestUrl = `${apiUrl}/consortium/${consortiumId}${sort ? `?page=${page}&size=${size}&sort=${sort}&` : '?'}cacheBuster=${new Date().getTime()}`
  return axios.get<IBid[]>(requestUrl)
})

// slice

export const BidByConsortiumSlice = createEntitySlice({
  name: 'bid-by-consortium',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getEntitiesByConsortium), (state, action) => {
        const linksByConsortium = parseHeaderForLinks(action.payload.headers.link)

        return {
          ...state,
          loading: false,
          linksByConsortium,
          entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, linksByConsortium),
          totalItems: parseInt(action.payload.headers['x-total-count'], 10),
        }
      })
      .addMatcher(isPending(getEntitiesByConsortium), (state) => {
        state.errorMessage = null
        state.updateSuccess = false
        state.loading = true
      })
  },
})

export const { reset, updateSuccess } = BidByConsortiumSlice.actions

// Reducer
export default BidByConsortiumSlice.reducer
