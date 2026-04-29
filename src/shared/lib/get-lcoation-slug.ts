import type { Location } from "@/entities/location/types"

export function getLocationSlug(location: Location) {
    return `${location.id}/${location.name.toLowerCase().replace(/[ ,]+/g, "-")}`
}
