import { VehicleCard } from '@/components/fleet/vehicle-card'
import type { Vehicle } from '@/types/vehicle'

export function VehicleGrid({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <ul
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label="Vehicle list"
    >
      {vehicles.map((vehicle) => (
        <li key={vehicle.id} className="min-w-0">
          <VehicleCard vehicle={vehicle} />
        </li>
      ))}
    </ul>
  )
}
