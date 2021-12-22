import { storageService } from './storage.service.js'

export const locService = {
    getLocs,
    createLocation
}

const STORAGE_KEY = 'locsDB'
const locs = storageService.loadFromStorage(STORAGE_KEY) || []

function createLocation(name, pos) {
    const { lat, lng } = pos
    const loc = {
        name,
        lat,
        lng,
        createdAt: Date.now(),
        wheather: 'Sunny',
        updatedAt: 0
    }
    locs.push(loc)
    storageService.saveToStorage(STORAGE_KEY, locs)
}

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}


