let viewFields = [  
  { 
    field : 'policy_code',
    alias : 'Cust.',
    sortable :true,
    width : 70,
    align:'center',
    fixed_column :true,
    render : 'fmtbb'
  },
  { 
    field : 'basic_nocharge_eom',      
    alias : 'Basic No Chg EOM',
    sortable :true,
    width : 150,
    align:'right',
    fixed_column :false,
    render : 'fmtnumber,0,false,true'
  },
  { 
    field : 'basic_now_max',           
    alias : 'Basic Now',
    sortable :true,
    width : 100,
    align:'right',
    fixed_column :false,
    render : 'fmtnumber,0,false,true'
  },
  { 
    field : 'basic_rate_eom',          
    alias : 'Basic Rate EOM',
    sortable :true,
    width : 130,
    align:'right',
    fixed_column :false,
    render : 'fmtnumber,2,false,true'
  },
  { 
    field : 'standard_nocharge_eom',   
    alias : 'Std No Chg EOM',
    sortable :true,
    width : 150,
    align:'right',
    fixed_column :false,
    render : 'fmtnumber,0,false,true'
  },
  { 
    field : 'standard_now_max',        
    alias : 'Std Now',
    sortable :true,
    width : 100,
    align:'right',
    fixed_column :false,
    render : 'fmtnumber,0,false,true'
  },
  { 
    field : 'standard_rate_eom',       
    alias : 'Std Rate EOM',
    sortable :true,
    width : 130,
    align:'right',
    fixed_column :false,
    render : 'fmtnumber,2,false,true',
  },
  { 
    field : 'returntrak_nocharge_eom', 
    alias : 'RT No Chg EOM',
    sortable :true,
    width : 150,
    align:'right',
    fixed_column :false,
    render : 'fmtnumber,0,false,true'
  },
  { 
    field : 'returntrak_now_max',      
    alias : 'RT Now',
    sortable :true,
    width : 100,
    align:'right',
    fixed_column :false,
    render : 'fmtnumber,0,false,true'
  },
  { 
    field : 'returntrak_rate_eom',     
    alias : 'RT Rate EOM',
    sortable :true,
    width : 130,
    align:'right',
    fixed_column :false,
    render : 'fmtnumber,2,false,true'
  },
  { 
    field : 'basic_charge',            
    alias : 'Basic Chg',
    sortable :true,
    width : 85,
    align:'right',
    fixed_column :false,
    render : 'fmtnumber,2,false,true'
  },
  { 
    field : 'standard_charge',         
    alias : 'Std Chg',
    sortable :true,
    width : 85,
    align:'right',
    fixed_column :false,
    render : 'fmtnumber,2,false,true'
  },
  { 
    field : 'returntrak_charge',       
    alias : 'RT Chg',
    sortable :true,
    width : 85,
    align:'right',
    fixed_column :false,
    render : 'fmtnumber,2,false,true'
  },
  { 
    field : 'total_charge',            
    alias : 'Total Chg',
    sortable :true,
    width : 90,
    align:'right',
    fixed_column :true,
    render : 'fmtnumber,2,true,true'
  }
]

export default viewFields