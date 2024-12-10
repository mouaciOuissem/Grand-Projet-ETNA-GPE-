// Security.js (Tools)

'use strict';

class Formated {
    Status(data) {
        const validFields = [
            'name'
        ];
    
        // Filtrer les champs valides
        const formattedData = {};
        for (let field of validFields) {
            if (data.hasOwnProperty(field)) {
                formattedData[field] = data[field];
            }
        }
        return formattedData;
    }
}


module.exports = new Formated();