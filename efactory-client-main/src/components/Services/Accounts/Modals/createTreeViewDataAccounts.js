export default function createTreeViewDataAccounts (accounts_availability,  accounts_visibility) {
  return accounts_availability.map( account => {
    let {  
      account_number,
      regions
    } = account
    return {
      text: account_number,
      children: regions.map( region => {
        let nodeId = `${account_number}-${region}`
        return {
          text: region,
          id: nodeId,
          state: {
            selected: accounts_visibility.includes( nodeId )
          }
        }
      })
    }
  })
}