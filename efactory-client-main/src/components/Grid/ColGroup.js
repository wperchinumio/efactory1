import 	React 						from 'react';
import { GridCol } 					from './Commons';

const TableColGroup = ({
  viewFields = [],
  lastColFixScroll = false,
  orderTypeColumnVisible = false,
  invoiceAllColumnVisible = false,
  flagsColumnVisible = false
}) => {
	let getCols = (fields) => {
		let cols = [];
		cols.push(<GridCol width={50} key='colgroup-index'/>);
    if( orderTypeColumnVisible ){
      cols.push(<GridCol width={75} key='colgroup-fixedSecond'/>);
    }
    if( flagsColumnVisible ){
      cols.push(<GridCol width={50} key='colgroup-flags'/>);
    }
    if( invoiceAllColumnVisible ){
      cols.push(<GridCol width={50} key='colgroup-fixedSecond'/>);
    }
		fields.forEach((field) => {
			cols.push(<GridCol width={field.sortable ? field.width + 20 : field.width} key={`${field.field}-colgroup`}/>);
		});
    if(lastColFixScroll){
      cols.push(<GridCol width={7} key='colgroup-lastColFixScroll'/>);
    }
		return cols;
	}
	return <colgroup>{getCols(viewFields)}</colgroup>
}

export default TableColGroup;
