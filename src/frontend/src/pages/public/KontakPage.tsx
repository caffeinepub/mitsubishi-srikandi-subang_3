import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useContactForm } from "@/hooks/useContactForm";
import { useGetWebsiteSettings } from "@/hooks/useWebsiteSettings";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function KontakPage() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    interestedVehicle: "",
    downPayment: "",
    tenor: "",
    message: "",
  });

  const contactMutation = useContactForm();
  const { data: settings } = useGetWebsiteSettings();
  const { actor } = useActor();
  const [consultantPhotoUrl, setConsultantPhotoUrl] = useState<string | null>(
    null,
  );

  const phone = settings?.contactPhone || "0852-1234-0778";
  const email = settings?.contactEmail || "fuadmitsubishi2025@gmail.com";
  const address =
    settings?.dealerAddress ||
    "Jl. Otto Iskandardinata No.314, Subang Jawa Barat 41211";
  const operationalHours =
    settings?.operationalHours || "Senin - Sabtu, 08:30 - 16:00";
  const waNumber = settings?.contactWhatsapp
    ? settings.contactWhatsapp.replace(/\D/g, "")
    : "6285212340778";
  const waLink = `https://wa.me/${waNumber}?text=Hai..%20Saya%20tertarik%20dengan%20produk%20mobil%20Mitsubishi..`;

  const consultantName = settings?.salesConsultantName || "Sales Consultant";
  const consultantPhotoId = settings?.salesConsultantPhotoId ?? null;
  const consultantInitial = consultantName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!consultantPhotoId || !actor) {
      setConsultantPhotoUrl(null);
      return;
    }
    let cancelled = false;
    actor
      .getPublicMediaAssetById(consultantPhotoId)
      .then((asset) => {
        if (cancelled) return;
        setConsultantPhotoUrl(asset?.storageUrl ?? null);
      })
      .catch(() => {
        if (!cancelled) setConsultantPhotoUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [consultantPhotoId, actor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(
      {
        name: formData.name,
        email: formData.email,
        message: `Alamat: ${formData.address}\nNo HP: ${formData.phone}\nUnit Diminati: ${formData.interestedVehicle}\nDP: ${formData.downPayment}\nTenor: ${formData.tenor}\nPesan: ${formData.message}`,
      },
      {
        onSuccess: () => {
          toast.success("Pesan berhasil dikirim");
          setFormData({
            name: "",
            address: "",
            phone: "",
            email: "",
            interestedVehicle: "",
            downPayment: "",
            tenor: "",
            message: "",
          });
        },
        onError: () => {
          toast.error("Gagal mengirim pesan");
        },
      },
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 pb-20 md:pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Form Kontak</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nama *</Label>
              <Input
                id="name"
                data-ocid="kontak.input"
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
              <Label htmlFor="interestedVehicle">Unit Diminati</Label>
              <Input
                id="interestedVehicle"
                value={formData.interestedVehicle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    interestedVehicle: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="downPayment">DP</Label>
              <Input
                id="downPayment"
                value={formData.downPayment}
                onChange={(e) =>
                  setFormData({ ...formData, downPayment: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="tenor">Tenor</Label>
              <Input
                id="tenor"
                value={formData.tenor}
                onChange={(e) =>
                  setFormData({ ...formData, tenor: e.target.value })
                }
              />
            </div>
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
              data-ocid="kontak.submit_button"
              className="w-full bg-[#C90010] hover:bg-[#A00008]"
              disabled={contactMutation.isPending}
            >
              {contactMutation.isPending ? "Mengirim..." : "Kirim Pesan"}
            </Button>
          </form>
        </div>

        {/* Dealer Info & Sales */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Info Dealer</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="text-[#C90010] mt-1 shrink-0" size={20} />
                <div>
                  <div className="font-medium">Telepon</div>
                  <a
                    href={`tel:${phone}`}
                    className="text-gray-600 hover:text-[#C90010] transition-colors"
                  >
                    {phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="text-[#C90010] mt-1 shrink-0" size={20} />
                <div>
                  <div className="font-medium">Email</div>
                  <a
                    href={`mailto:${email}`}
                    className="text-gray-600 hover:text-[#C90010] transition-colors break-all"
                  >
                    {email}
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="text-[#C90010] mt-1 shrink-0" size={20} />
                <div>
                  <div className="font-medium">Alamat</div>
                  <div className="text-gray-600">{address}</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="text-[#C90010] mt-1 shrink-0" size={20} />
                <div>
                  <div className="font-medium">Jam Operasional</div>
                  <div className="text-gray-600">{operationalHours}</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Sales Consultant</h2>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden">
                {consultantPhotoUrl ? (
                  <img
                    src={consultantPhotoUrl}
                    alt={consultantName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#C90010] flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      {consultantInitial}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{consultantName}</h3>
              <p className="text-gray-600 mb-4">Sales Consultant</p>
              <Button
                data-ocid="kontak.primary_button"
                className="w-full bg-[#398E3D] hover:bg-[#2d7230]"
                onClick={() => window.open(waLink, "_blank")}
              >
                <MessageCircle className="mr-2" size={20} />
                Hubungi via WhatsApp
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Lokasi Kami</h2>
            <div className="rounded-lg overflow-hidden h-64 w-full">
              <iframe
                src="https://www.google.com/maps?q=-6.5518470,107.7754491&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Mitsubishi Srikandi Subang"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
