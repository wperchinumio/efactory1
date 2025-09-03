import { useEffect } from 'react';

function useBlockUi(loading) {  
  useEffect(
    () => {
      if( loading ){
        global.App.blockUI({ animate: true })
      }else{
        global.App.unblockUI();
      }
    },
    [loading] 
  )
}

export default useBlockUi