import { showToaster } from '../Settings/redux/global'

const showSpinner = () => ({
	type : 'SHOW_LOADING_SPINNER'
})
const hideSpinner = () => ({
	type : 'HIDE_LOADING_SPINNER'
})

export { showSpinner, hideSpinner, showToaster }