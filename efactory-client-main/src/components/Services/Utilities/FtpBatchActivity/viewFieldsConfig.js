let viewFields = [
  {
    field: 'row_id',
    alias: '#',
    sortable:false,
    width: 30,
    align:'right',
    fixed_column:false,
    notFixable: true,
    notResizable: true,
    render: 'notfixedindex',
  },
  {
    field: 'account_number',
    alias: 'ACCT #',
    sortable:true,
    width: 55,
    align:'left',
    fixed_column:false,
    notFixable: true
  },
  {
    field: 'location',
    alias: 'Warehouse',
    sortable:true,
    width: 100,
    align:'center',
    fixed_column:false,
    notFixable: true
  },
  {
    field: 'received_date',
    alias: 'Received Date',
    sortable:true,
    width: 120,
    align:'left',
    fixed_column:false,
    render: 'fmtdatetime',
    notFixable: true
  },
  {
    field: 'name',
    alias: 'Batch Name',
    sortable:true,
    width: 130,
    align:'left',
    fixed_column:false,
    notFixable: true
    // render: 'fmtnumber,0,false,true'
  },
  {
    field: 'filename',
    alias: 'Batch File',
    sortable:false,
    width: 180,
    align:'left',
    fixed_column:false,
    render: 'downloadbatch',
    notFixable: true
  },
  {
    field: 'ack_filename',
    alias: 'Ack File',
    sortable:false,
    width: 150,
    align:'left',
    fixed_column:false,
    render: 'downloadackfile',
    notFixable: true
  },
  {
    field: 'total_orders',
    alias: 'Tot Orders',
    sortable:true,
    width: 100,
    align:'right',
    fixed_column:false,
    render: 'fmtnumber,0,false,true',
    notFixable: true
  },
  {
    field: 'total_imported',
    alias: 'Tot Imported',
    sortable:true,
    width: 115,
    align:'right',
    fixed_column:false,
    render: 'totalimported',
    notFixable: true
  },
  {
    field: 'error_message',
    alias: 'Error Message',
    sortable:false,
    width: 285,
    align:'left',
    fixed_column:false,
    render: 'errormessage',
    notFixable: true
  },
  {
    field: 'has_email',
    alias: 'View Report',
    sortable: false,
    width: 120,
    align:'center',
    fixed_column:false,
    render: 'hasemail',
    notFixable: true
  }
]

export default viewFields
