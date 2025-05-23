import axios from 'axios'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import sinon from 'sinon'
import { parseHeaderForLinks } from 'react-jhipster'

import reducer, { createEntity, deleteEntity, getEntities, getEntity, updateEntity, partialUpdateEntity, reset } from './consortium-administrator.reducer'
import { EntityState } from 'app/shared/reducers/reducer.utils'
import { IConsortiumAdministrator, defaultValue } from 'app/shared/model/consortium-administrator.model'

describe('Entities reducer tests', () => {
  function isEmpty(element): boolean {
    if (element instanceof Array) {
      return element.length === 0
    } else {
      return Object.keys(element).length === 0
    }
  }

  const initialState: EntityState<IConsortiumAdministrator> = {
    loading: false,
    errorMessage: null,
    entities: [],
    entity: defaultValue,
    links: {
      next: 0,
    },
    totalItems: 0,
    updating: false,
    updateSuccess: false,
  }

  function testInitialState(state) {
    expect(state).toMatchObject({
      loading: false,
      errorMessage: null,
      updating: false,
      updateSuccess: false,
    })
    expect(isEmpty(state.entities))
    expect(isEmpty(state.entity))
  }

  function testMultipleTypes(types, payload, testFunction, error?) {
    types.forEach((e) => {
      testFunction(reducer(undefined, { type: e, payload, error }))
    })
  }

  describe('Common', () => {
    it('should return the initial state', () => {
      testInitialState(reducer(undefined, { type: '' }))
    })
  })

  describe('Requests', () => {
    it('should set state to loading', () => {
      testMultipleTypes([getEntities.pending.type, getEntity.pending.type], {}, (state) => {
        expect(state).toMatchObject({
          errorMessage: null,
          updateSuccess: false,
          loading: true,
        })
      })
    })

    it('should set state to updating', () => {
      testMultipleTypes([createEntity.pending.type, updateEntity.pending.type, partialUpdateEntity.pending.type, deleteEntity.pending.type], {}, (state) => {
        expect(state).toMatchObject({
          errorMessage: null,
          updateSuccess: false,
          updating: true,
        })
      })
    })

    it('should reset the state', () => {
      expect(reducer({ ...initialState, loading: true }, reset())).toEqual({
        ...initialState,
      })
    })
  })

  describe('Failures', () => {
    it('should set a message in errorMessage', () => {
      testMultipleTypes(
        [getEntities.rejected.type, getEntity.rejected.type, createEntity.rejected.type, updateEntity.rejected.type, partialUpdateEntity.rejected.type, deleteEntity.rejected.type],
        'some message',
        (state) => {
          expect(state).toMatchObject({
            errorMessage: 'error message',
            updateSuccess: false,
            updating: false,
          })
        },
        {
          message: 'error message',
        }
      )
    })
  })

  describe('Successes', () => {
    it('should fetch all entities', () => {
      const payload = { data: [{ 1: 'fake1' }, { 2: 'fake2' }], headers: { 'x-total-count': 123, link: ';' } }
      const links = parseHeaderForLinks(payload.headers.link)
      expect(
        reducer(undefined, {
          type: getEntities.fulfilled.type,
          payload,
        })
      ).toEqual({
        ...initialState,
        links,
        loading: false,
        totalItems: payload.headers['x-total-count'],
        entities: payload.data,
      })
    })

    it('should fetch a single entity', () => {
      const payload = { data: { 1: 'fake1' } }
      expect(
        reducer(undefined, {
          type: getEntity.fulfilled.type,
          payload,
        })
      ).toEqual({
        ...initialState,
        loading: false,
        entity: payload.data,
      })
    })

    it('should create/update entity', () => {
      const payload = { data: 'fake payload' }
      expect(
        reducer(undefined, {
          type: createEntity.fulfilled.type,
          payload,
        })
      ).toEqual({
        ...initialState,
        updating: false,
        updateSuccess: true,
        entity: payload.data,
      })
    })

    it('should delete entity', () => {
      const payload = 'fake payload'
      const toTest = reducer(undefined, {
        type: deleteEntity.fulfilled.type,
        payload,
      })
      expect(toTest).toMatchObject({
        updating: false,
        updateSuccess: true,
      })
    })
  })

  describe('Actions', () => {
    let store

    const resolvedObject = { value: 'whatever' }
    beforeEach(() => {
      const mockStore = configureStore([thunk])
      store = mockStore({})
      axios.get = sinon.stub().returns(Promise.resolve(resolvedObject))
      axios.post = sinon.stub().returns(Promise.resolve(resolvedObject))
      axios.put = sinon.stub().returns(Promise.resolve(resolvedObject))
      axios.patch = sinon.stub().returns(Promise.resolve(resolvedObject))
      axios.delete = sinon.stub().returns(Promise.resolve(resolvedObject))
    })

    it('dispatches FETCH_CONSORTIUMADMINISTRATOR_LIST actions', async () => {
      const expectedActions = [
        {
          type: getEntities.pending.type,
        },
        {
          type: getEntities.fulfilled.type,
          payload: resolvedObject,
        },
      ]
      await store.dispatch(getEntities({}))
      expect(store.getActions()[0]).toMatchObject(expectedActions[0])
      expect(store.getActions()[1]).toMatchObject(expectedActions[1])
    })

    it('dispatches FETCH_CONSORTIUMADMINISTRATOR actions', async () => {
      const expectedActions = [
        {
          type: getEntity.pending.type,
        },
        {
          type: getEntity.fulfilled.type,
          payload: resolvedObject,
        },
      ]
      await store.dispatch(getEntity(42666))
      expect(store.getActions()[0]).toMatchObject(expectedActions[0])
      expect(store.getActions()[1]).toMatchObject(expectedActions[1])
    })

    it('dispatches CREATE_CONSORTIUMADMINISTRATOR actions', async () => {
      const expectedActions = [
        {
          type: createEntity.pending.type,
        },
        {
          type: createEntity.fulfilled.type,
          payload: resolvedObject,
        },
      ]
      await store.dispatch(createEntity({ id: 456 }))
      // expect(store.getActions()[0]).toMatchObject(expectedActions[0]);
      // expect(store.getActions()[1]).toMatchObject(expectedActions[1]);
      // expect(store.getActions()[2]).toMatchObject(expectedActions[2]);
      // expect(store.getActions()[3]).toMatchObject(expectedActions[3]);
    })

    it('dispatches UPDATE_CONSORTIUMADMINISTRATOR actions', async () => {
      const expectedActions = [
        {
          type: updateEntity.pending.type,
        },
        {
          type: updateEntity.fulfilled.type,
          payload: resolvedObject,
        },
      ]
      await store.dispatch(updateEntity({ id: 456 }))
      // expect(store.getActions()[0]).toMatchObject(expectedActions[0]);
      // expect(store.getActions()[1]).toMatchObject(expectedActions[1]);
      // expect(store.getActions()[2]).toMatchObject(expectedActions[2]);
      // expect(store.getActions()[3]).toMatchObject(expectedActions[3]);
    })

    it('dispatches PARTIAL_UPDATE_CONSORTIUMADMINISTRATOR actions', async () => {
      const expectedActions = [
        {
          type: partialUpdateEntity.pending.type,
        },
        {
          type: partialUpdateEntity.fulfilled.type,
          payload: resolvedObject,
        },
      ]
      await store.dispatch(partialUpdateEntity({ id: 123 }))
      // expect(store.getActions()[0]).toMatchObject(expectedActions[0]);
      // expect(store.getActions()[1]).toMatchObject(expectedActions[1]);
      // expect(store.getActions()[2]).toMatchObject(expectedActions[2]);
      // expect(store.getActions()[3]).toMatchObject(expectedActions[3]);
    })

    it('dispatches DELETE_CONSORTIUMADMINISTRATOR actions', async () => {
      const expectedActions = [
        {
          type: deleteEntity.pending.type,
        },
        {
          type: deleteEntity.fulfilled.type,
          payload: resolvedObject,
        },
      ]
      await store.dispatch(deleteEntity(42666))
      // expect(store.getActions()[0]).toMatchObject(expectedActions[0]);
      // expect(store.getActions()[1]).toMatchObject(expectedActions[1]);
      // expect(store.getActions()[2]).toMatchObject(expectedActions[2]);
      // expect(store.getActions()[3]).toMatchObject(expectedActions[3]);
    })

    it('dispatches RESET actions', async () => {
      const expectedActions = [reset()]
      await store.dispatch(reset())
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
