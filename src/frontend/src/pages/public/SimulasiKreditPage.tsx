import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreditSimulationForm } from "@/hooks/useCreditSimulationForm";
import { useGetAllVehicleCatalogs } from "@/hooks/usePublicData";
import { calculateInstallment } from "@/utils/creditCalculation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SimulasiKreditPage() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    vehicleId: "",
    downPayment: "",
    tenor: "",
    message: "",
  });

  const [selectedVehiclePrice, setSelectedVehiclePrice] = useState<bigint>(
    BigInt(0),
  );
  const [estimatedInstallment, setEstimatedInstallment] = useState<number>(0);

  const { data: catalogs } = useGetAllVehicleCatalogs();
  const creditMutation = useCreditSimulationForm();

  useEffect(() => {
    if (formData.vehicleId && formData.downPayment && formData.tenor) {
      const installment = calculateInstallment(
        Number(selectedVehiclePrice),
        Number(formData.downPayment),
        Number(formData.tenor),
      );
      setEstimatedInstallment(installment);
    } else {
      setEstimatedInstallment(0);
    }
  }, [
    formData.vehicleId,
    formData.downPayment,
    formData.tenor,
    selectedVehiclePrice,
  ]);

  const handleVehicleChange = (vehicleId: string) => {
    setFormData({ ...formData, vehicleId });
    const catalog = catalogs?.find(
      (c) => c.vehicle.id.toString() === vehicleId,
    );
    if (catalog) {
      setSelectedVehiclePrice(catalog.vehicle.basePrice);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    creditMutation.mutate(
      {
        vehicleId: BigInt(formData.vehicleId),
        amount: BigInt(formData.downPayment),
        term: BigInt(formData.tenor),
      },
      {
        onSuccess: () => {
          toast.success("Simulasi kredit berhasil dikirim");
          setFormData({
            name: "",
            address: "",
            phone: "",
            email: "",
            vehicleId: "",
            downPayment: "",
            tenor: "",
            message: "",
          });
          setEstimatedInstallment(0);
        },
        onError: () => {
          toast.error("Gagal mengirim simulasi kredit");
        },
      },
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-12 pb-20 md:pb-12">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Simulasi Kredit</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nama *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="address">Alamat *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">No HP *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="vehicleId">Unit Diminati *</Label>
            <Select
              value={formData.vehicleId}
              onValueChange={handleVehicleChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kendaraan" />
              </SelectTrigger>
              <SelectContent>
                {catalogs?.map((catalog) => (
                  <SelectItem
                    key={catalog.vehicle.id.toString()}
                    value={catalog.vehicle.id.toString()}
                  >
                    {catalog.vehicle.vehicleName} -{" "}
                    {formatPrice(Number(catalog.vehicle.basePrice))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="downPayment">DP (Down Payment) *</Label>
            <Input
              id="downPayment"
              type="number"
              value={formData.downPayment}
              onChange={(e) =>
                setFormData({ ...formData, downPayment: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="tenor">Tenor (Bulan) *</Label>
            <Select
              value={formData.tenor}
              onValueChange={(value) =>
                setFormData({ ...formData, tenor: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tenor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12 Bulan</SelectItem>
                <SelectItem value="24">24 Bulan</SelectItem>
                <SelectItem value="36">36 Bulan</SelectItem>
                <SelectItem value="48">48 Bulan</SelectItem>
                <SelectItem value="60">60 Bulan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {estimatedInstallment > 0 && (
            <div className="bg-[#C90010] text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">
                Estimasi Cicilan Per Bulan
              </h3>
              <p className="text-3xl font-bold">
                {formatPrice(estimatedInstallment)}
              </p>
              <p className="text-sm mt-2 opacity-90">
                *Estimasi ini bersifat sementara dan dapat berubah
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="message">Pesan</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={4}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#C90010] hover:bg-[#A00008]"
            disabled={creditMutation.isPending}
          >
            {creditMutation.isPending ? "Mengirim..." : "Kirim Data"}
          </Button>
        </form>
      </div>
    </div>
  );
}
