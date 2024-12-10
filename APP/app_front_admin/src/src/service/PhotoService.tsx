import { Prsy } from '@/src/types';

export const PhotoService = {
    getImages() {
        return fetch('/data/photos.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Prsy.Photo[]);
    }
};
