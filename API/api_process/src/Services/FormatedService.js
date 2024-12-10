// Security.js (Tools)

'use strict';

class Formated {
    Input(data) {
        const validFields = [
            'type',
            'target',
            'css_target_id',
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

    Process(data) {
        const validFields = [
            'name',
            'url',
            'fixed_url',
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

    ProcessHasInput(data) {
        const validFields = [
            'ProcessId',
            'inputs',
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