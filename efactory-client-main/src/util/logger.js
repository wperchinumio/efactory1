import config 						from './config';

const log = console.log;

const logger = (message = '', ...variables) => {
	if(config.loggerActive){
		log("#########################################");

		log(message.toUpperCase());

		variables.forEach((item)=>{
			log(item);
		})

		log("#########################################");
	}
}

export default logger;