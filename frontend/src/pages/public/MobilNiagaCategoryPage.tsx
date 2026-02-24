import { useParams } from '@tanstack/react-router';
import { useGetAllVehicleCatalogs } from '@/hooks/usePublicData';
import VehicleCard from '@/components/public/VehicleCard';

export default function MobilNiagaCategoryPage() {
  const { kategori } = useParams({ strict: false });
  const { data: catalogs, isLoading } = useGetAllVehicleCatalogs();

  const publishedVehicles = catalogs?.slice(0, 8) || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 pb-20 md:pb-12">
        <div className="text-center text-gray-500">Memuat data kendaraan...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 pb-20 md:pb-12">
      <h2 className="text-3xl font-bold mb-8 capitalize">{kategori?.replace('-', ' ')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {publishedVehicles.map((catalog) => (
          <VehicleCard
            key={catalog.vehicle.id.toString()}
            vehicle={catalog.vehicle}
          />
        ))}
      </div>
    </div>
  );
}
