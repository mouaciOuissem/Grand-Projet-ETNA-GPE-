// Security.js (Tools)

'use strict';

class Formated {
    UserDetails(data) {
        const validFields = [
            'firstname',
            'lastname',
            'address',
            'city',
            'post_code',
            'country',
            'phone_number',
            'pronouns',
            'profile_picture',
            'birthday',
            'last_connection',
            'fiscal_details',
            'social_categorie'
        ];
    
        // Filtrer les champs valides
        const formattedData = {};
        for (let field of validFields) {
            if (data.hasOwnProperty(field)) {
                formattedData[field] = data[field];
            }
        }

        if (formattedData.birthday && isNaN(Date.parse(formattedData.birthday))) {
            throw new Error('Invalid date format for birthday');
        }
    
        if (formattedData.last_connection && isNaN(Date.parse(formattedData.last_connection))) {
            throw new Error('Invalid date format for last_connection');
        }
        return formattedData;
    }
}


module.exports = new Formated();