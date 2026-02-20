import { useGetAllVehicleCatalogs } from '@/hooks/usePublicData';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import VehicleCard from './VehicleCard';

export default function HighlightMobilNiaga() {
  const { data: catalogs, isLoading } = useGetAllVehicleCatalogs();

  const publishedVehicles = catalogs?.slice(0, 8) || [];

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Mobil Niaga</h2>
          <div className="text-center text-gray-500">Memuat...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#F1C40F]">Mobil Niaga</h2>
        <Carousel className="w-full">
          <CarouselContent>
            {publishedVehicles.map((catalog) => (
              <CarouselItem key={catalog.vehicle.id.toString()} className="md:basis-1/2 lg:basis-1/4">
                <VehicleCard vehicle={catalog.vehicle} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
    </section>
  );
}
