import { formatDate }         from './FormatDate';

const
    stageClass = (stage) => {
        stage = parseInt(stage, 10);
        if (stage === 2) {
            return "dark";
        }
        else if (stage > 2 && stage < 10) {
            return "red-thunderbird";
        }
        else if (stage === 10) {
            return "red";
        }
        else if (stage === 20) {
            return "yellow-gold";
        }
        else if (stage === 40) {
            return "yellow-haze";
        }
        else if (stage > 40 && stage < 60) {
            return "yellow-mint";
        }
        else if (stage >= 60) {
            return "green-soft";
        }
        else return "yellow-gold";
    },


    orderStatusClass = (order_status) => {
      switch (order_status) {
        case 0:
          return "order_type bg-red-soft font-white";
        case 2:
          return "order_type bg-purple-plum font-white";
        default:
          return "";
      }
    },

    orderTypeClass = (order_type) => {
        switch (order_type) {
            case "EDE":
                return "order_type bg-purple-plum font-white";
            case "EDI":
                return "order_type bg-red-soft font-white";
            case "REST":
            case "SOAP":
            case "RTRE":
            case "RTSO":
                return "order_type bg-dark font-white";
            case "AMZN":
            case "BIGP":
            case "CHAD":
            case "MAGP":
            case "MAGS":
            case "SHOP":
            case "SHST":
            case "STLS":
            case "WOOP":
                return "order_type bg-blue-steel font-white";
            case "OPEF":
            case "RTEF":
                return "order_type bg-green-haze font-white";
            default:
                return "order_type bg-grey-cascade font-white";
        }
    },
    orderStatus = (value) => {
        switch(value) {
            case 0: return 'On Hold';
            case 2: return 'Rush';
            case undefined: return ''
            default: return 'Normal';
        }
    },
    range = (input, total) => {
        total = parseInt(total, 10);

        for (var i=0; i<total; i++) {
            input.push(i);
        }

        return input;
    },
    nozero = (value) => {
        return value === 0? '': value;
    },
    numberize = (number, figures) => {
        // let result = [],
        //     stringResult = "",
        //     number2 = number.toString() ;
        // for(let i = 0; i < Math.ceil(number2.length / 3); i++){
        //     result.push(","+number2.slice((i+1)* -3).slice(0,-3) );
        // }
        // result = result.reverse();
        // stringResult = result.join("").slice(1);
        // return stringResult + (figures === 2 ? ",00" : ",0");
    }


export {
    stageClass,
    orderStatusClass,
    orderTypeClass,
    orderStatus,
    range,
    nozero,
    formatDate,
    numberize
};









