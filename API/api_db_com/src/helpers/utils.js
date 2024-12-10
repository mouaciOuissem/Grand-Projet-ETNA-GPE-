'use strict';

class UtilsService {

    generateRandomString(length) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const separators = '-.';
        let bucketName = '';
    
        bucketName += chars.charAt(Math.floor(Math.random() * chars.length));
    
        for (let i = 1; i < length - 1; i++) {
            const charSet = Math.random() < 0.1 ? separators : chars;
            bucketName += charSet.charAt(Math.floor(Math.random() * charSet.length));
        }
    
        bucketName += chars.charAt(Math.floor(Math.random() * chars.length));
        bucketName = bucketName.replace(/[-.]{2,}/g, '-');
    
        if (bucketName.length < 3) {
            bucketName += chars.substring(0, 3 - bucketName.length);
        } else if (bucketName.length > 63) {
            bucketName = bucketName.substring(0, 63);
        }
        return bucketName;
    }
}

module.exports = new UtilsService();