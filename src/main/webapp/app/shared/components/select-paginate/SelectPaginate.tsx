import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { FormControl, InputLabel, ThemeProvider, Typography } from '@mui/material'
import axios from 'axios'
import PropTypes from 'prop-types'
import React from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import { defaultTheme } from 'app/shared/layout/themes'
import { style } from '@mui/system'
import { translate } from 'react-jhipster'

interface Props {
  value: any
  apiUrl: string
  valueName: string
  isRequired?: boolean
  searchName?: string
  placeholder?: string
  onChange: (value: any) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void
}

const SelectPaginate: React.FC<Props> = ({ value, apiUrl, placeholder = '', onChange, valueName, searchName = 'search', isRequired = false, onKeyDown }) => {
  const [hasValue, setHasValue] = React.useState<boolean>(false)

  const loadOptions = async (searchQuery: string, loadedOptions: any, { page }: { page: number }) => {
    try {
      const { data } = await axios.get(`${apiUrl}`, {
        params: {
          page: page - 1,
          size: 10,
          sort: valueName,
          [searchName]: searchQuery,
          cacheBuster: new Date().getTime(),
        },
      })

      if (page === 1 && !searchQuery && !isRequired) {
        data.unshift({ id: null })
      }

      return {
        options: data,
        hasMore: data.length >= 1,
        additional: {
          page: page + 1,
        },
      }
    } catch (error) {
      throw new Error(`Falha ao carregar as opções: ${error}`)
    }
  }

  const getOptionValue = (option: any) => option?.id
  const getOptionLabel = (option: any) => option?.[valueName]

  const handleChange = (selectedOption: any) => {
    onChange(selectedOption?.id ? selectedOption : null)
    setHasValue(!!selectedOption)
  }

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: `${state.isFocused ? '2px' : '1px'} solid ${state.isFocused ? defaultTheme.palette.secondary.main : 'rgba(184, 186, 185, 1)'}`,
      backgroundColor: defaultTheme.palette.background.paper,
      padding: '8px 5px',
      borderRadius: '8px',
      marginTop: '24px',
      color: defaultTheme.palette.text.primary,
      boxShadow: 'none',
      '&:hover': {
        borderColor: defaultTheme.palette.secondary.main,
      },
      '&:focus': {
        borderColor: defaultTheme.palette.secondary.main,
        outline: 'none',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? defaultTheme.palette.action.selected : '#F4F4F4',
      color: state.isSelected || state.isFocused ? defaultTheme.palette.text.primary : defaultTheme.palette.text.primary,
      cursor: 'pointer',

      '&:hover': {
        backgroundColor: state.isSelected ? '#F4F4F4' : defaultTheme.palette.action.hover,
      },
    }),

    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      backgroundColor: '#F4F4F4',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'rgb(96,97,96)',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: defaultTheme.palette.text.primary,
    }),
    input: (provided) => ({
      ...provided,
      color: defaultTheme.palette.text.primary,
    }),
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <FormControl fullWidth>
        {hasValue && (
          <InputLabel
            id='consortium-segmentType-label'
            sx={{
              transform: 'translate(10px, 16px) scale(0.75)',
              background: defaultTheme.palette.background.paper,
              px: '5px',
              color: defaultTheme.palette.secondary.main,
            }}
          >
            {translate('repasseconsorcioApp.consortium.consortiumAdministrator') + ' *'}
          </InputLabel>
        )}
        <AsyncPaginate
          onKeyDown={onKeyDown}
          loadingMessage={() => 'Carregando...'}
          noOptionsMessage={() => 'Nenhum resultado encontrado'}
          styles={customStyles}
          value={value || ''}
          loadOptions={loadOptions}
          getOptionValue={getOptionValue}
          getOptionLabel={getOptionLabel}
          onChange={handleChange}
          onMenuOpen={() => setHasValue(true)}
          onMenuClose={() => setHasValue(!!value)}
          components={{
            DropdownIndicator: () => (hasValue && !value ? <ArrowDropUp color='secondary' /> : <ArrowDropDown color='secondary' />),
            IndicatorSeparator: () => null,
          }}
          isSearchable
          placeholder={!hasValue ? placeholder : null}
          additional={{
            page: 1,
          }}
          required={isRequired}
        />
      </FormControl>
    </ThemeProvider>
  )
}

SelectPaginate.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
}

export default SelectPaginate
