import {Client} from "@googlemaps/google-maps-services-js";

const env = {
  GOOGLE_MAPS_API_KEY: 'AIzaSyDG_plt7BvOFJdO-WH-SlHSwdAJ8Vv42KU',
};

const init = function () {
  const client = new Client({});

  client
    .elevation({
      params: {
        locations: [{ lat: 45, lng: -110 }],
        key: env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 1000, // milliseconds
    })
    .then((r) => {
      console.log(r.data.results[0].elevation);
    })
    .catch((e) => {
      console.log(e.response.data.error_message);
    });
}
init()

class GeoLib {
  // public 
  // public getAddressFromCoordinates(
  //   coordinates: [number, number] | { lat: number; lng: number },
  // ): Promise<string> {
  //   return Promise.reject(new Error('Not implemented'));
  // }

  // public getCoordinatesFromAddress(address: string): Promise<{ lat: number; lng: number }> {
  //   return Promise.reject(new Error('Not implemented'));
  // }
}

export default new GeoLib();
