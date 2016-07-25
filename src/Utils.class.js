class Utils {
  static getCoordFromQueryString (coordsQuery) {
    let coords = coordsQuery.split(',')
    return {
      lat: parseFloat(coords[0], 10),
      lon: parseFloat(coords[1], 10)
    }
  }
}

module.exports = Utils
