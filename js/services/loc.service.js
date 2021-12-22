import { storageService } from './storage.service.js';
import { utilsService } from './utils.service.js';

export const locService = {
    getLocs,
    createLocation,
    deleteLoc
}

const STORAGE_KEY = 'locsDB'
const locs = storageService.loadFromStorage(STORAGE_KEY) || []

function createLocation(name, pos) {
    const { lat, lng } = pos
    const loc = {
        id: utilsService.makeId(),
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
        }, 100)
    });
}

function deleteLoc(locId) {
    const locIdx = locs.findIndex(loc => loc.id === locId)
    locs.splice(locIdx, 1)
    storageService.saveToStorage(STORAGE_KEY, locs)
}
