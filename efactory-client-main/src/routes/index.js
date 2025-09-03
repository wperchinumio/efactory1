import React, { useEffect } from 'react'
import CommonLayout from '../components/_Shared/Layout/CommonLayout'
import AdministrationTasks from './AdministrationTasks'
import Analytics from './Analytics'
import Documents from './Documents'
import Edi from './Edi'
import Items from './Items'
import OrderPoints from './OrderPoints'
import Orders from './Orders'
import Overview from './Overview'
import ReturnTrak from './ReturnTrak'
import Shared from './Shared'
import Transportation from './Transportation'
import { useIntercom } from 'react-use-intercom';
import { getUserData } from  '../util/storageHelperFuncs'

const Routes = () => {
  const {
    boot,
    update
  } = useIntercom();

  useEffect(
    () => {
      //var name = getUserData('name');
      var company_name = getUserData('company_name');
      var company_code = getUserData('company_code');

      boot({ name:'',
             customAttributes: { company_name, company_code },
      });

      // Need to call update() function to update the parameters otherwise on second eFactory login the component will show the attributes (like name) used on the first boot() call
      update({ name:'',
               customAttributes: { company_name, company_code },
      });

      var elems = document.getElementsByClassName('intercom-lightweight-app');
      if (elems && elems.length > 0) {
        elems[0].style.opacity="1";
      }
     // console.log(window.intercomSettings.is_open)
     if (document.getElementById('intercom-container')) {
      document.getElementById('intercom-container').style.opacity=(window.intercomSettings && window.intercomSettings.is_open === true)? "1": "0.6";
    }
    },
    []
  )

  return (
    <CommonLayout>
      <AdministrationTasks />
      <Analytics />
      <Documents />
      <Edi />
      <Items />
      <OrderPoints />
      <Orders />
      <Overview />
      <ReturnTrak />
      <Shared />
      <Transportation />
    </CommonLayout>
    )
}

export default Routes
