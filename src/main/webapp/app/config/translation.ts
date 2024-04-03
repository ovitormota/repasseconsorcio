import { TranslatorContext, Storage } from 'react-jhipster'

import { setLocale } from 'app/shared/reducers/locale'

TranslatorContext.setDefaultLocale('pt-br')
TranslatorContext.setRenderInnerTextForMissingKeys(false)

export const languages: any = {
  'pt-br': { name: 'Português (Brasil)' },
}

export const locales = Object.keys(languages).sort()

export const registerLocale = (store) => {
  store.dispatch(setLocale(Storage.local.get('locale', 'pt-br')))
}
