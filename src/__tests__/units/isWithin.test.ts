import { isWithin } from "../../services/imovelServices"

test("isWithin should return true when point is within the radius", () => {
    const point = { latitude: 40.7128, longitude: 40.7116 }
    const center = { latitude: 40.7125, longitude: 40.711 }
    const radiusKm = 10

    const result = isWithin(point, center, radiusKm)

    expect(result).toBe(true)
})

test("isWithin should return false when point is outside the radius", () => {
    const point = { latitude: 40.7128, longitude: 40.7128 }
    const center = { latitude: 41.7128, longitude: 40.7128 }
    const radiusKm = 100

    const result = isWithin(point, center, radiusKm)

    expect(result).toBe(false)
})
