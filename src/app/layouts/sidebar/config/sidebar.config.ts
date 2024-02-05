export function smartCardSidebar() {
  return [
    {
      id: 'admin',
      title: 'Administracion',
      allowed: ['HasAdministrationAccess'],
      options: [
        {
          id: 'configuration',
          title: 'configuracion',
          allowed: [],
          type: 'route',
          route: '/admin/configuration'
        },
        {
          id: 'manifest',
          title: 'Manifiestos',
          allowed: ['HasManifestAccess'],
          type: 'route',
          route: '/admin/manifest'
        }
      ]
    },
    {
      id: 'hostes',
      title: 'Hostes',
      allowed: ['HasHostessAccess'],
      options: [
        {
          id: 'create-client',
          title: 'Nuevo Cliente',
          allowed: ['CanCreateClient'],
          type: 'route',
          route: '/hostes/create-client'
        },
        {
          id: 'search-client',
          title: 'Buscar Cliente',
          allowed: ['HasHostessAccess'],
          type: 'route',
          route: '/hostes/search-client'
        },
        {
          id: 'search-new-contract',
          title: 'Generar contrato',
          allowed: ['CanCreateContract'],
          type: 'route',
          route: '/hostes/search-new-contract'
        },
        {
          id: 'search-contract',
          title: 'Buscar contrato',
          allowed: ['HasHostessAccess'],
          type: 'route',
          route: '/hostes/search-contract'
        },
        {
          id: 'scratch-game',
          title: 'Raspa y gana',
          allowed: ['HasHostessAccess'],
          type: 'route',
          route: '/scratch-game'
        }
      ]
    },
    {
      id: 'booking',
      title: 'Reservas',
      allowed: ['HasBookingsAccess'],
      options: [
        {
          id: 'search-contract-booking',
          title: 'Buscar contrato',
          allowed: ['HasBookingsAccess'],
          type: 'route',
          route: '/booking/search-contract-booking'
        }
      ]
    },
    {
      id: 'customer-service',
      title: 'Servicio al cliente',
      allowed: ['HasCustomerServiceAccess'],
      options: [
        {
          id: 'search-contract-customer-service',
          title: 'Buscar contrato',
          allowed: ['HasCustomerServiceAccess'],
          type: 'route',
          route: '/customer-service/search-contract-customer-service'
        }
      ]
    },
    {
      id: 'system',
      title: 'Sistema',
      allowed: ['CanLogOut'],
      options: [
        {
          id: 'log-out',
          title: 'Log Out',
          allowed: ['CanLogOut'],
          type: 'action',
          action: 'logOut'
        }
      ]
    },
  ];
}
