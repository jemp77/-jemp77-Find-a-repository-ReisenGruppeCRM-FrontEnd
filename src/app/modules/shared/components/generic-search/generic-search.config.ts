export function genericSearchConfig(searchType: string) {

  switch (searchType) {
    case 'search-client':
      return [
        {
          id: 'clientActions',
          title: 'Acciones'
        },
        {
          id: 'clientDocumentType',
          title: 'Tipo doc.',
          field: 'documentType'
        },
        {
          id: 'clientDocumentNumber',
          title: 'Numero doc.',
          field: 'documentNumber'
        },
        {
          id: 'clientName',
          title: 'Nombre',
          field: 'name'
        },
        {
          id: 'clientLastName',
          title: 'Apellido',
          field: 'lastName'
        },
        {
          id: 'clientEmail',
          title: 'Correo',
          field: 'email'
        },
        {
          id: 'clientPhoneNumber',
          title: 'Telefono',
          field: 'phoneNumber'
        },
      ]
    case 'search-new-contract':
      return [
        {
          id: 'newContractActions',
          title: 'Acciones'
        },
        {
          id: 'newContractDocumentType',
          title: 'Tipo doc.',
          field: 'documentType'
        },
        {
          id: 'newContractDocumentNumber',
          title: 'Numero doc.',
          field: 'documentNumber'
        },
        {
          id: 'newContractName',
          title: 'Nombre',
          field: 'name'
        },
        {
          id: 'newContractLastName',
          title: 'Apellido',
          field: 'lastName'
        },
        {
          id: 'newContractEmail',
          title: 'Correo',
          field: 'email'
        },
        {
          id: 'newContractPhoneNumber',
          title: 'Telefono',
          field: 'phoneNumber'
        },
      ]
    case 'search-contract':
      return [
        {
          id: 'contractActions',
          title: 'Acciones'
        },
        {
          id: 'contractNumber',
          title: 'Numero contrato.',
          field: 'contractNumber'
        },
        {
          id: 'contractDocumentType',
          title: 'Tipo doc.',
          field: 'documentType'
        },
        {
          id: 'contractDocumentNumber',
          title: 'Numero doc.',
          field: 'documentNumber'
        },
        {
          id: 'contractName',
          title: 'Nombre',
          field: 'name'
        },
        {
          id: 'contractLastName',
          title: 'Apellido',
          field: 'lastName'
        },
        {
          id: 'contractEmail',
          title: 'Correo',
          field: 'email'
        },
        {
          id: 'contractPhoneNumber',
          title: 'Telefono',
          field: 'phoneNumber'
        },
      ]
    case 'search-contract-booking':
    case 'search-contract-customer-service':
      return [
        {
          id: 'bookingContractActions',
          title: 'Acciones'
        },
        {
          id: 'contractNumber',
          title: 'Numero contrato.',
          field: 'contractNumber'
        },
        {
          id: 'contractDocumentType',
          title: 'Tipo doc.',
          field: 'documentType'
        },
        {
          id: 'contractDocumentNumber',
          title: 'Numero doc.',
          field: 'documentNumber'
        },
        {
          id: 'contractName',
          title: 'Nombre',
          field: 'name'
        },
        {
          id: 'contractLastName',
          title: 'Apellido',
          field: 'lastName'
        },
        {
          id: 'contractEmail',
          title: 'Correo',
          field: 'email'
        },
        {
          id: 'contractPhoneNumber',
          title: 'Telefono',
          field: 'phoneNumber'
        },
      ]
  }
}
