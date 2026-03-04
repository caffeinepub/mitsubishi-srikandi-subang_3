import type { Vehicle } from "@/types/local";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(vehicle.basePrice));

  // Generate slug from vehicle name
  const slug = vehicle.vehicleName.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[4/3] bg-gray-200">
        <img
          src="/assets/generated/vehicle-placeholder.dim_800x600.png"
          alt={vehicle.vehicleName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {vehicle.vehicleName}
        </h3>
        <p className="text-sm text-gray-600 mb-3">Harga Mulai</p>
        <p className="text-xl font-bold text-red-600 mb-4">{formattedPrice}</p>
        <a
          href={`/mobil-keluarga/${slug}`}
          className="block w-full bg-red-600 hover:bg-red-700 text-white text-center py-2 rounded-md transition-colors"
        >
          Lihat Detail
        </a>
      </div>
    </div>
  );
}
