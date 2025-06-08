class LocationStrategy {
    constructor(api) {
        this.api = api;
    }

    async fromCity(city) {
        if (!city || typeof city !== 'string') {
            throw new Error('Nome da cidade inválido.');
        }
        return this.api.fetchCoordsFromCity(city.trim());
    }

    async fromCoords(lat, lon) {
        if (!lat || !lon) {
            throw new Error('Coordenadas inválidas');
        }
        return { lat, lon };
    }
}

export default LocationStrategy;
