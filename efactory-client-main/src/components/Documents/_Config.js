const Config = {
  "" : {
    listId : 1,
    title : 'Document Submission'
  },
  "/general/approvals" : {
    listId : 2,
    title : 'Approvals'
  },
  "/general/assembly" : {
    listId : 27,
    title : 'Assembly'
  },
  "/general/bill" : {
    listId : 3,
    title : 'Bill Of Ladings'
  },
  "/general/dangerousgoods" : {
    listId : 16,
    title : 'DG Data'
  },
  "/general/general" : {
    listId : 7,
    title : 'General Documents'
  },
  "/general/labels" : {
    listId : 9,
    title : 'Items and Labels'
  },
  "/general/consigned" : {
    listId : 4,
    title : 'Material Receipts'
  },
  "/general/purchase" : {
    listId : 10,
    title : 'Purchase Orders'
  },
  "/general/etags" : {
    listId : 28,
    title : 'Return eTags'
  },
  "/general/return" : {
    listId : 11,
    title : 'Returned Items'
  },
  "/general/routing" : {
    listId : 14,
    title : 'Routing Instructions'
  },
  "/general/serial" : {
    listId : 15,
    title : 'Serial Numbers'
  },
  "/reference" : {
    listId : 29,
    title : 'Resources'
  },

  //orders listID temp TODO
  "/orders/documents/bill" : {
    listId : 3,
    title : 'Bill Of Ladings'
  },
  "/orders/documents/etags" : {
    listId : 28,
    title : 'Return eTags'
  },
  "/orders/documents/routing" : {
    listId : 14,
    title : 'Routing Instructions'
  },
  "/orders/documents/reference" : {
    listId : 29,
    title : 'Resources'
  },

  //items listID temp TODO
  '/inventory/documents/assembly' : {
    listId : 27,
    title : 'Assembly'
  },
  '/inventory/documents/labels' : {
    listId : 9,
    title : 'Items and Labels'
  },
  '/inventory/documents/consigned' : {
    listId : 4,
    title : 'Material Receipts'
  },
  '/inventory/documents/return' : {
    listId : 28,
    title : 'Return eTags'
  },
  '/inventory/documents/serial' : {
    listId : 15,
    title : 'Serial Numbers'
  },
  "/inventory/documents/reference" : {
    listId : 29,
    title : 'Resources'
  },

  //orderpoints listID temp TODO
  "/orderpoints/documents/reference" : {
    listId : 29,
    title : 'Resources'
  },

  //returntrak listID temp TODO
  '/returntrak/documents/return' : {
    listId : 11,
    title : 'Returned Items'
  },
  "/returntrak/documents/reference" : {
    listId : 29,
    title : 'Resources'
  },

  // ftp folders
  '/orderpoints/documents/ftp-folders-send' : {
    listId : -1,
    title : 'Send'
  },
  "/orderpoints/documents/ftp-folders-get" : {
    listId : -2,
    title : 'Get'
  },
  '/ftp-folders/send' : {
    listId : -1,
    title : 'Send'
  },
  '/ftp-folders/get' : {
    listId : -2,
    title : 'Get'
  },

  // special docs
  '/special-docs/token-incoming-po'  : {
    listId : 101,
    title : 'Token Incoming PO'
  },
  '/special-docs/token-incoming-sn'  : {
    listId : 102,
    title : 'Token Incoming Serial No'
  },
  '/special-docs/token-sn-binding'  : {
    listId : 103,
    title : 'Token SN Binding'
  },
  '/special-docs/token-sn-unbinding'  : {
    listId : 104,
    title : 'Token SN Unbinding'
  },
  '/special-docs/token-cycle-count-info'  : {
    listId : 105,
    title : 'Token Cycle Count Info'
  },


}
const TreeviewConfig = {
  'Documents' : [ Config[''] ],
  'Customer Docs.' : []
}

const TreeviewConfig_SpecialDocs = {
  'Special Docs.' : [],
}

const TreeviewConfig_Orders = {
  'Customer Docs.' : []
}

const TreeviewConfig_Items = {
  'Customer Docs.' : []
}

const TreeviewConfig_Returntrak = {
  'Customer Docs.' : []
}

const TreeviewConfig_Orderpoints = {
  'Customer Docs.' : []
}

const TreeviewConfig_FtpFolders = { //FTP Folders
  'FTP Folders' : []
}

Object.keys(Config).forEach( configKey => {
  switch(true){
    case configKey.startsWith('/documents'):
      TreeviewConfig['Documents'].push( Config[ configKey ] )
      break;
    case configKey.startsWith('/general'):
      TreeviewConfig['Customer Docs.'].push( Config[ configKey ] )
      break;
    case configKey.startsWith('/special-docs/'):
      TreeviewConfig_SpecialDocs['Special Docs.'].push( Config[ configKey ] )
      break;
    case configKey.startsWith('/orders'):
      TreeviewConfig_Orders['Customer Docs.'].push( Config[ configKey ] )
      break;
    case configKey.startsWith('/inventory'):
      TreeviewConfig_Items['Customer Docs.'].push( Config[ configKey ] )
      break;
    case configKey.startsWith('/returntrak'):
      TreeviewConfig_Returntrak['Customer Docs.'].push( Config[ configKey ] )
      break;
    case configKey.startsWith('/orderpoints/documents/ftp-folders'):
      TreeviewConfig_FtpFolders['FTP Folders'].push( Config[ configKey ] )
      break;
    case configKey.startsWith('/orderpoints'):
      TreeviewConfig_Orderpoints['Customer Docs.'].push( Config[ configKey ] )
      break;
    case configKey.startsWith('/ftp-folders'):
      TreeviewConfig_FtpFolders['FTP Folders'].push( Config[ configKey ] )
      break;

    default:
      break;
  }
})

export default Config

export {
  TreeviewConfig,
  TreeviewConfig_Orders,
  TreeviewConfig_Items,
  TreeviewConfig_Returntrak,
  TreeviewConfig_Orderpoints,
  TreeviewConfig_FtpFolders,
  TreeviewConfig_SpecialDocs
}