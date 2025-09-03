const createTreeview = (customers,  selected_customers) => {
  return [
    {
      text: 'All',
      id: '*',
      state: {
        selected: selected_customers.includes('*')
      }
    },
    {
      text: 'Customers',
      children: customers.map(
        customer => {
          return {
            text: customer,
            id: customer,
            multiple: true,
            state: {
              selected: selected_customers.includes( customer )
            }
          }
        }
      )
    }
  ]
}

export default createTreeview