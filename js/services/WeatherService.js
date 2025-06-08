export default class WeatherService {
  static async fetchByCity(city) {
    const response = await fetch(`/weather?city=${encodeURIComponent(city)}`);
    if (!response.ok) throw new Error('Erro na requisição por cidade');
    return await response.json();
  }

  static async fetchByGeo() {
    const position = await new Promise((res, rej) =>
      navigator.geolocation.getCurrentPosition(res, rej)
    );
    const { latitude: lat, longitude: lon } = position.coords;
    const response = await fetch(`/weather?lat=${lat}&lon=${lon}`);
    if (!response.ok) throw new Error('Erro na requisição por geolocalização');
    return await response.json();
  }
}
