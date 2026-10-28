import * as Dialog from '@radix-ui/react-dialog'

import { VehicleDetailContent } from '@/components/fleet/vehicle-detail/vehicle-detail-content'
import { VehicleDetailError } from '@/components/fleet/vehicle-detail/vehicle-detail-error'
import { VehicleMapHero } from '@/components/fleet/vehicle-detail/vehicle-detail-map'
import { VehicleDetailSkeleton } from '@/components/fleet/vehicle-detail/vehicle-detail-skeleton'
import { useVehicleDetail } from '@/hooks/use-vehicle-detail'

type VehicleDetailDialogProps = {
  vehicleId: string | null
  onClose: () => void
}

export function VehicleDetailDialog({
  vehicleId,
  onClose,
}: VehicleDetailDialogProps) {
  const query = useVehicleDetail(vehicleId)
  const detail = query.data

  return (
    <Dialog.Root
      open={Boolean(vehicleId)}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-[3px]" />

        <Dialog.Content
          aria-busy={query.isPending}
          className="fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh-1.25rem)] w-[calc(100vw-1.25rem)] max-w-205 -translate-x-1/2 -translate-y-1/2 overflow-x-hidden overflow-y-auto rounded-overlay bg-surface shadow-overlay focus:outline-none sm:max-h-[calc(100dvh-3rem)] sm:w-[calc(100vw-3rem)]"
        >
          <VehicleMapHero
            latitude={detail?.latitude ?? null}
            longitude={detail?.longitude ?? null}
            label={detail?.label}
            isPending={query.isPending}
            isError={query.isError}
          />

          {query.isPending ? (
            <>
              <VehicleDetailSkeleton />
            </>
          ) : query.isError ? (
            <>
              <VehicleDetailError
                message={
                  query.error instanceof Error
                    ? query.error.message
                    : 'Please try again.'
                }
                isRetrying={query.isFetching}
                onRetry={() => {
                  void query.refetch()
                }}
              />
            </>
          ) : detail ? (
            <VehicleDetailContent detail={detail} />
          ) : (
            <Dialog.Title className="sr-only">Vehicle details</Dialog.Title>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
