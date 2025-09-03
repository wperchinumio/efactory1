import {
  getUserData
}                      from '../../../../util/storageHelperFuncs';


const createTreeViewData = ( apps = [], is_master = false ) => {
  let is_local_admin = !!getUserData('is_local_admin')

  let menus = [

  {
      text: "Overview Menu",
  	  children: [{
        text: "Overview",
        id: '1',
        state: {
          selected: apps.includes( '1' )
        },
        icon: "icon-home"
      },
      // {
      //     text: "Announcements",
      //     id: '2',
      //     state: {
      //       selected: apps.includes( '2' )
      //     },
      //     icon: "icon-badge"
      // },
      {
          text: "Personal notes",
          id: '3',
          state: {
            selected: apps.includes( '3' )
          },
          icon : "icon-pencil",
      }
    ]
  },



  {
    text: "Orders Menu",
    children: [{
      text: "Orders",
      icon: "icon-book-open",
      children: [
        {
          text: "Open",
          id: '5',
          state: {
            selected: apps.includes( '5' )
          },
          icon: false
        },
        {
          text: "On Hold",
          id: '6',
          state: {
            selected: apps.includes( '6' )
          },
          icon: false
        },
        {
          text: "Back Orders",
          id: '7',
          state: {
            selected: apps.includes( '7' )
          },
          icon: false
        },
        {
          text: "Pre-Release",
          id: '8',
          state: {
            selected: apps.includes( '8' )
          },
          icon: false
        },
        {
          text: "Shipped",
          id: '9',
          state: {
            selected: apps.includes( '9' )
          },
          icon: false
        },
        {
          text: "Canceled",
          id: '10',
          state: {
            selected: apps.includes( '10' )
          },
          icon: false
        },
        {
          text: "All",
          id: '11',
          state: {
            selected: apps.includes( '11' )
          },
          icon: false
        }
      ]
    },
    {
      text: "Order Lines",
      icon: "icon-tag",
      children: [
        {
          text: "Open",
          id: '12',
          state: {
            selected: apps.includes( '12' )
          },
          icon: false
        },
        {
          text: "On Hold",
          id: '13',
          state: {
            selected: apps.includes( '13' )
          },
          icon: false
        },
        {
          text: "Back Orders",
          id: '14',
          state: {
            selected: apps.includes( '14' )
          },
          icon: false
        },
        {
          text: "Pre-Release",
          id: '15',
          state: {
            selected: apps.includes( '15' )
          },
          icon: false
        },
        {
          text: "Shipped",
          id: '16',
          state: {
            selected: apps.includes( '16' )
          },
          icon: false
        },
        {
          text: "Canceled",
          id: '17',
          state: {
            selected: apps.includes( '17' )
          },
          icon: false
        },
        {
          text: "All",
          id: '18',
          state: {
            selected: apps.includes( '18' )
          },
          icon: false
        }
      ]
    },
    {
      text: "Order Items",
      icon: "icon-tag",
      children: [
        {
          text: "Backlog Items",
          id: '19',
          state: {
            selected: apps.includes( '19' )
          },
          icon: false
        },
        {
          text: "Shipped Items",
          id: '20',
          state: {
            selected: apps.includes( '20' )
          },
          icon: false
        },
        {
          text: "All Items",
          id: '61',
          state: {
            selected: apps.includes( '61' )
          },
          icon: false
        }
      ]
    },
    {
      text: "Ship Detail",
      icon: "icon-share",
      children: [
        {
          text: "Freight",
          id: '21',
          state: {
            selected: apps.includes( '21' )
          },
          icon: false
        },
        {
          text: "Package",
          id: '22',
          state: {
            selected: apps.includes( '22' )
          },
          icon: false
        },
        {
          text: "Serial/Lot #",
          id: '23',
          state: {
            selected: apps.includes( '23' )
          },
          icon: false
        }
      ]
    },
    {
        text: "Customer Docs.",
        id: '72',
        state: {
          selected: apps.includes( '72' )
        },
        icon: "fa fa-th-large"
    },
    {
        text: "Help",
        id: '25',
        state: {
          selected: apps.includes( '25' )
        },
        icon: "icon-info"
    }]
},



{
  text: "Items Menu",
  children: [{
    text: "Items",
    icon: "icon-tag",
    children: [
      {
        text: "Status",
        id: '26',
        state: {
          selected: apps.includes( '26' )
        },
        icon: false
      },
      /*{
        text: "Received",
        id: '27',
        state: {
          selected: apps.includes( '27' )
        },
        icon: false
      },*/
      {
        text: "Receiving",
        id: '27',
        state: {
          selected: apps.includes( '27' )
        },
        icon: false
      },
      {
        text: "On Hold",
        id: '28',
        state: {
          selected: apps.includes( '28' )
        },
        icon: false
      },
      {
        text: "Transactions",
        id: '29',
        state: {
          selected: apps.includes( '29' )
        },
        icon: false
      },
      /*{
        text: "To Receive",
        id: '30',
        state: {
          selected: apps.includes( '30' )
        },
        icon: false
      },*/
      {
        text: "Lot Master",
        id: '31',
        state: {
          selected: apps.includes( '31' )
        },
        icon: false
      },
      {
        text: "As of a Date",
        id: '32',
        state: {
          selected: apps.includes( '32' )
        },
        icon: false
      },
      {
        text: "Transaction Summary",
        id: '33',
        state: {
          selected: apps.includes( '33' )
        },
        icon: false
      },
      {
        text: "Cycle Count",
        id: '34',
        state: {
          selected: apps.includes( '34' )
        },
        icon: false
      },
      {
        text: "DG Data",
        id: '39',
        state: {
          selected: apps.includes( '39' )
        },
        icon: false
      },
      {
        text: "Bundles",
        id: '206',
        state: {
          selected: apps.includes( '206' )
        },
        icon: false
      }
    ]
  },
  {
    text: "Receipts",
    icon: "icon-arrow-down",
    children: [
      {
        text: "PO Notifications (ASN)",
        id: '36',
        state: {
          selected: apps.includes( '36' )
        },
        icon: false
      },
      {
        text: "Ext. PO Receipt",
        id: '37',
        state: {
          selected: apps.includes( '37' )
        },
        icon: false
      },
      {
        text: "Ext. RMA Receipt",
        id: '38',
        state: {
          selected: apps.includes( '38' )
        },
        icon: false
      }
    ]
  },
	{
    text: "Assembly",
    id: '40',
    state: {
      selected: apps.includes( '40' )
    },
    icon: "fa fa-cubes"
  },
  {
    text: "Returns",
    id: '41',
    state: {
      selected: apps.includes( '41' )
    },
    icon: "fa fa-exchange"
  },
  {
    text: "Customer Docs.",
    id: '73',
    state: {
      selected: apps.includes( '73' )
    },
    icon: "fa fa-th-large"
  }
]
},

{
  text: "ReturnTrak",
  children: [
  {
      text: "RMA Entry",
      id: '55',
      state: {
        selected: apps.includes( '55' )
      },
      icon: "fa fa-opencart"
  },
  {
      text: "Drafts",
      id: '56',
      state: {
        selected: apps.includes( '56' )
      },
      icon: "fa fa-cubes"
  },
  {
      text: "RMAs",
      icon: "fa fa-exchange",
      children: [
        {
          text: "Open",
          id: '57',
          state: {
            selected: apps.includes( '57' )
          },
          icon: false
        },
        {
          text: "All",
          id: '58',
          state: {
            selected: apps.includes( '58' )
          },
          icon: false
        },
        {
          text: "Items",
          id: '59',
          state: {
            selected: apps.includes( '59' )
          },
          icon: false
        }
      ]
  },
  {
    text: "Shipped Orders",
    id: '54',
    state: {
      selected: apps.includes( '54' )
    },
    icon: "icon-book-open"
  },
  {
    text: "Customer Docs.",
    id: '75',
    state: {
      selected: apps.includes( '75' )
    },
    icon: "fa fa-th-large"
  }
]
},

{
    text: "OrderPoints",
    children: [
    {
        text: "Order Entry",
        id: '47',
        state: {
          selected: apps.includes( '47' )
        },
        icon: "fa fa-opencart"
    },
    {
        text: "Drafts",
        id: '48',
        state: {
          selected: apps.includes( '48' )
        },
        icon: "fa fa-cubes"
    },
    {
        text: "Address Book",
        id: '49',
        state: {
          selected: apps.includes( '49' )
        },
        icon: "fa fa-location-arrow"
    },
    {
        text: "Mass Upload",
        id: '50',
        state: {
          selected: apps.includes( '50' )
        },
        icon: "fa fa-file-excel-o"
    },
    {
        text: "FTP Batches",
        id: '76',
        state: {
          selected: apps.includes( '76' )
        },
        icon: "fa fa-calendar"
    },
    {
      text: "Shipping Cost Estimator",
      id: '51',
      state: {
        selected: apps.includes( '51' )
      },
      icon: "fa fa-calculator"
    },
    {
      text: "Customer Docs.",
      id: '74',
      state: {
        selected: apps.includes( '74' )
      },
      icon: "fa fa-th-large"
    },
    {
        text: "Help",
        id: '53',
        state: {
          selected: apps.includes( '53' )
        },
        icon: "icon-info"
    }]
  },

  {
    text: "EDI Central",
    children: [
      {
        text: "Overview",
        id: '52',
        state: {
          selected: apps.includes( '52' )
        },
        icon: "icon-home"
      },
      {
        text: "Documents",
        icon: "fa fa-th-large",
        children: [
          {
            text: "Orders to Resolve",
            id: '82',
            state: {
              selected: apps.includes( '82' )
            },
            icon: false
          },
          {
            text: "Orders to Approve",
            id: '83',
            state: {
              selected: apps.includes( '83' )
            },
            icon: false
          },
          {
            text: "Orders to Ship",
            id: '84',
            state: {
              selected: apps.includes( '84' )
            },
            icon: false
          },
          {
            text: "Order History",
            id: '85',
            state: {
              selected: apps.includes( '85' )
            },
            icon: false
          },
          {
            text: "ASN",
            id: '86',
            state: {
              selected: apps.includes( '86' )
            },
            icon: false
          },
          {
            text: "Invoice",
            id: '87',
            state: {
              selected: apps.includes( '87' )
            },
            icon: false
          },
          {
            text: "Remittance",
            id: '88',
            state: {
              selected: apps.includes( '88' )
            },
            icon: false
          },
          {
            text: "Product Activity",
            id: '89',
            state: {
              selected: apps.includes( '89' )
            },
            icon: false
          },
          {
            text: "Planning Schedule",
            id: '90',
            state: {
              selected: apps.includes( '90' )
            },
            icon: false
          }
        ]
      },
      {
        text: "Trading Partners",
        icon: "fa fa-industry",
        children: [
          {
            text: "TP Activity",
            id: '91',
            state: {
              selected: apps.includes( '91' )
            },
            icon: false
          },
          {
            text: "TP Items",
            id: '92',
            state: {
              selected: apps.includes( '92' )
            },
            icon: false
          },
          {
            text: "TP Addresses",
            id: '93',
            state: {
              selected: apps.includes( '93' )
            },
            icon: false
          },
          {
            text: "TP S. Ship Methods",
            id: '94',
            state: {
              selected: apps.includes( '94' )
            },
            icon: false
          },
          {
            text: "TP Status",
            id: '95',
            state: {
              selected: apps.includes( '95' )
            },
            icon: false
          },
          {
            text: "Basic Profile",
            id: '96',
            state: {
              selected: apps.includes( '96' )
            },
            icon: false
          },
          {
            text: "Invoicing Profile",
            id: '97',
            state: {
              selected: apps.includes( '97' )
            },
            icon: false
          },
          {
            text: "DCL Partners",
            id: '98',
            state: {
              selected: apps.includes( '98' )
            },
            icon: false
          }
        ]
      },
      {
        text: "Ext. Shipments",
        icon: "fa fa-truck",
        children: [
          {
            text: "Shipment Entry",
            id: '99',
            state: {
              selected: apps.includes( '99' )
            },
            icon: false
          },
          {
            text: "Drafts",
            id: '100',
            state: {
              selected: apps.includes( '100' )
            },
            icon: false
          }
        ]
      }
    ]
},



{
  text: "Analytics",
  children: [
  {
      text: "Domestic",
      id: '42',
      state: {
        selected: apps.includes( '42' )
      },
      icon: "fa fa-map-marker"
  },
  {
      text: "International",
      id: '43',
      state: {
        selected: apps.includes( '43' )
      },
      icon: "fa fa-globe"
  },
  {
       text: "By Time",
       id: '201',
       state: {
         selected: apps.includes( '201' )
       },
       icon: "fa fa-calendar"
  },
  {
    text: "By Item",
    id: '203',
    state: {
      selected: apps.includes( '203' )
    },
    icon: "fa fa-tag"
  },
  {
    text: "By Customer",
    id: '202',
    state: {
      selected: apps.includes( '202' )
    },
    icon: "fa fa-building"
  },
  {
    text: "By Ship Service",
    id: '204',
    state: {
      selected: apps.includes( '204' )
    },
    icon: "fa fa-truck"
  },
  {
    text: "By Channel",
    id: '205',
    state: {
      selected: apps.includes( '205' )
    },
    icon: "fa fa-cloud"
  },
  /*{
    text: "Incident Reports",
    id: '208',
    state: {
      selected: apps.includes( '208' )
    },
    icon: "fa fa-bolt"
  },*/
  {
    text: "Shipment Times",
    id: '46',
    state: {
      selected: apps.includes( '46' )
    },
    icon: "fa fa-calendar-check-o"
  },
  {
    text: "RMA Receive Times",
    id: '63',
    state: {
      selected: apps.includes( '63' )
    },
    icon: "fa fa-calendar-check-o"
  },
  {
    text: "Delivery Times",
    id: '211',
    state: {
      selected: apps.includes( '211' )
    },
    icon: "fa fa-calendar-check-o"
  },
  {
    text: "Cycle Count",
    id: '70',
    state: {
      selected: apps.includes( '70' )
    },
    icon: "icon-tag"
  },
  {
    text: "Replenishment",
    id: '44',
    state: {
      selected: apps.includes( '44' )
    },
    icon: "icon-tag"
  },
  {
    text: "Slow Moving",
    id: '45',
    state: {
      selected: apps.includes( '45' )
    },
    icon: "icon-tag"
  },
  {
    text: "Scheduled Reports",
    id: '64',
    state: {
      selected: apps.includes( '64' )
    },
    icon: "icon-calendar"
  },
  {
    text: "Standard Reports",
    id: '35',
    state: {
      selected: apps.includes( '35' )
    },
    icon: "fa fa-th-large"
  },
  {
    text: "Custom Reports",
    id: '71',
    state: {
      selected: apps.includes( '71' )
    },
    icon: "fa fa-th"
  }
]
},

{
  text: "Transportation",
  children: [
  {
      text: "By Time",
      id: '209',
      state: {
        selected: apps.includes( '209' )
      },
      icon: "fa fa-calendar"
  },
  {
    text: "By Service",
    id: '210',
    state: {
      selected: apps.includes( '210' )
    },
    icon: "fa fa-truck"
  },
  {
      text: "Analyzer",
      id: '207',
      state: {
        selected: apps.includes( '207' )
      },
      icon: "fa fa-truck"
  },
  {
    text: "Shipping Detail",
    id: '212',
    state: {
      selected: apps.includes( '212' )
    },
    icon: "fa fa-truck"
  },
  {
    text: "Cost Estimator",
    id: '51',
    state: {
      selected: apps.includes( '51' )
    },
    icon: "fa fa-calculator"
  },
]
},

{
  text: "Services",
  state: {
    disabled : is_master ? true : false
  },
  children: [
    {
      text: "Documents",
      id: '62',
      state: {
        selected: apps.includes( '62' )
      },
      icon: "icon-folder-alt"
    },
    {
      text: "Administration Tasks",
      icon: "icon-lock",
      state: {
        disabled : is_master ? true : false
      },
      children: [
        {
          text: "Users",
          icon: false,
          id: '67',
          state: {
            selected : is_master ? true : apps.includes( '67' ),
            disabled : is_master ? true : false
          }
        },
        {
          text: "OrderPoints Settings",
          id: '65',
	        state: {
	          selected: apps.includes( '65' )
	        },
          icon: false
        },
        {
          text: "ReturnTrak Settings",
          id: '66',
	        state: {
	          selected: apps.includes( '66' )
	        },
          icon: false
        },
        {
          text: "Email Notifications",
          icon: "fa fa-envelope",
          children: [
            {
              text: "Ship Confirmation",
              id: '77',
              state: {
                selected: apps.includes( '77' )
              },
              icon: false
            },
            {
              text: "Order Receipt",
              id: '78',
              state: {
                selected: apps.includes( '78' )
              },
              icon: false
            },
            {
              text: "PO Receipt",
              id: '79',
              state: {
                selected: apps.includes( '79' )
              },
              icon: false
            },
            {
              text: "RMA Receipt",
              id: '80',
              state: {
                selected: apps.includes( '80' )
              },
              icon: false
            },
            {
              text: "Un-planned Receipt",
              id: '81',
              state: {
                selected: apps.includes( '81' )
              },
              icon: false
            },
          ]
        },
        {
          text: "Invoices",
          icon: "fa fa-exchange",
          children: [
            {
              text: "Open",
              id: '68',
			        state: {
			          selected: apps.includes( '68' )
			        },
              icon: false
            },
            {
              text: "All",
              id: '69',
			        state: {
			          selected: apps.includes( '69' )
			        },
              icon: false
            },
            {
              //text: "Freight Charges / Rate Cards",
              text: "Freight Charges",
              id: '214',
			        state: {
			          selected: apps.includes( '214' )
			        },
              icon: false
            }
          ]
        }
	    ]
	  }]
	},
  {
  text: "Web Services",
  state: {
    disabled : false
  },
  children: [
    {
      text: "GET Orders",
      id: '1001',
      state: {
        selected: apps.includes( '1001' )
      },
      icon: "fa fa-code"
    },
    {
      text: "POST Orders",
      id: '1002',
      state: {
        selected: apps.includes( '1002' )
      },
      icon: "fa fa-code"
    },

    /*
     // NO NEED
     {
      text: "PUT Orders",
      id: '1011',
      state: {
        selected: apps.includes( '1011' )
      },
      icon: "fa fa-code"
    },*/

    {
      text: "GET RMAs",
      id: '1003',
      state: {
        selected: apps.includes( '1003' )
      },
      icon: "fa fa-code"
    },
    {
      text: "POST RMAs",
      id: '1004',
      state: {
        selected: apps.includes( '1004' )
      },
      icon: "fa fa-code"
    },

    {
      text: "GET Items",
      id: '1005',
      state: {
        selected: apps.includes( '1005' )
      },
      icon: "fa fa-code"
    },
    {
      text: "POST Items",
      id: '1006',
      state: {
        selected: apps.includes( '1006' )
      },
      icon: "fa fa-code"
    },

    {
      text: "GET Work Orders",
      id: '1007',
      state: {
        selected: apps.includes( '1007' )
      },
      icon: "fa fa-code"
    },
    {
      text: "POST Work Orders",
      id: '1008',
      state: {
        selected: apps.includes( '1008' )
      },
      icon: "fa fa-code"
    },

    {
      text: "GET Documents",
      id: '1009',
      state: {
        selected: apps.includes( '1009' )
      },
      icon: "fa fa-code"
    },
    {
      text: "POST Documents",
      id: '1010',
      state: {
        selected: apps.includes( '1010' )
      },
      icon: "fa fa-code"
    },

    ]
  }]

  if (!is_local_admin) {
    menus = menus.filter(m => m.text !== 'Transportation');
  }
  return menus;
}


export default createTreeViewData
