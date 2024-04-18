import { TextField } from '@mui/material'
import React from 'react'
import InputMask from 'react-input-mask'

const PhoneInput = ({ value, onChange }) => {
  const isPhoneValid = () => {
    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/ // Padrão para telefone: (99) 99999-9999
    return phoneRegex.test(value)
  }

  return (
    <InputMask mask='(99) 99999-9999' value={value} onChange={onChange}>
      {(inputProps) => (
        <TextField
          {...inputProps}
          label='Celular'
          required
          name='telephone'
          type='text'
          variant='outlined'
          fullWidth
          color='secondary'
          data-cy='telephone'
          helperText={!isPhoneValid() && 'Seu número é inválido'}
          InputProps={{
            style: { borderRadius: '10px' },
          }}
          sx={{ mt: 2, mb: 1 }}
        />
      )}
    </InputMask>
  )
}

export default PhoneInput
