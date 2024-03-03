import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit'
import axios from 'axios'
import { loadMoreDataWhenScrolled, parseHeaderForLinks } from 'react-jhipster'

import { IConsortium, defaultValue } from 'app/shared/model/consortium.model'
import { SegmentType } from 'app/shared/model/enumerations/segment-type.model'
import { EntityState, IQueryParams, createEntitySlice } from 'app/shared/reducers/reducer.utils'

const initialState: EntityState<IConsortium> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
}

const myProposalsUrl = 'api/my-proposals'

// Actions

interface IGetEntities extends IQueryParams {
  filterSegmentType?: SegmentType
}

export const getEntities = createAsyncThunk('my-proposals/fetch_entity_list', async ({ page, size, sort, filterSegmentType }: IGetEntities) => {
  const requestUrl = `${myProposalsUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}&filterSegmentType=${filterSegmentType}&` : '?'}cacheBuster=${new Date().getTime()}`
  return axios.get<IConsortium[]>(requestUrl)
})

// slice

export const MyProposals = createEntitySlice({
  name: 'my-proposals',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const links = parseHeaderForLinks(action.payload.headers.link)
        return {
          ...state,
          loading: false,
          links,
          entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, links),
          totalItems: parseInt(action.payload.headers['x-total-count'], 10),
        }
      })
      .addMatcher(isPending(getEntities), (state) => {
        state.errorMessage = null
        state.updateSuccess = false
        state.loading = true
      })
  },
})

export const { reset } = MyProposals.actions

// Reducer
export default MyProposals.reducer
