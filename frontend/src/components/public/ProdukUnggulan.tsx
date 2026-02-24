import { useGetAllVehicleCatalogs } from '@/hooks/usePublicData';
import VehicleCard from './VehicleCard';

export default function ProdukUnggulan() {
  const { data: catalogs, isLoading } = useGetAllVehicleCatalogs();

  const featuredVehicles = catalogs?.slice(0, 4) || [];

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Produk Unggulan</h2>
          <div className="text-center text-gray-500">Memuat...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#C90010]">Produk Unggulan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVehicles.map((catalog) => (
            <VehicleCard
              key={catalog.vehicle.id.toString()}
              vehicle={catalog.vehicle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
