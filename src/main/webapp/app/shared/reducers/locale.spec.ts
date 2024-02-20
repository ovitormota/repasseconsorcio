import axios from 'axios';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { TranslatorContext } from 'react-jhipster';

import locale, { setLocale, updateLocale } from 'app/shared/reducers/locale';

describe('Locale reducer tests', () => {
    it('should return the initial state', () => {
        const localeState = locale(undefined, { type: '' });
        expect(localeState).toMatchObject({
            currentLocale: '',
        });
    });

    it('should correctly set the first time locale', () => {
        const localeState = locale(undefined, updateLocale('pt-br'));
        expect(localeState).toMatchObject({
            currentLocale: 'pt-br',
        });
        expect(TranslatorContext.context.locale).toEqual('pt-br');
    });

    it('should correctly detect update in current locale state', () => {
        TranslatorContext.setLocale('pt-br');
        expect(TranslatorContext.context.locale).toEqual('pt-br');
        const localeState = locale({ currentLocale: 'pt-br' }, updateLocale('es'));
        expect(localeState).toMatchObject({
            currentLocale: 'es',
        });
        expect(TranslatorContext.context.locale).toEqual('es');
    });

    describe('Locale actions', () => {
        let store;
        beforeEach(() => {
            store = configureStore([thunk])({});
            axios.get = sinon.stub().returns(Promise.resolve({ key: 'value' }));
        });

        it('dispatches SET_LOCALE action for default locale', async () => {
            TranslatorContext.setDefaultLocale('pt-br');
            const defaultLocale = TranslatorContext.context.defaultLocale;
            expect(Object.keys(TranslatorContext.context.translations)).not.toContainEqual(defaultLocale);

            const expectedActions = [updateLocale(defaultLocale)];

            await store.dispatch(setLocale(defaultLocale));
            expect(store.getActions()).toEqual(expectedActions);
            expect(TranslatorContext.context.translations).toBeDefined();
            expect(Object.keys(TranslatorContext.context.translations)).toContainEqual(defaultLocale);
        });
    });
});
