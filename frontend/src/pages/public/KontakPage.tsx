import { useState } from 'react';
import { useContactForm } from '@/hooks/useContactForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

export default function KontakPage() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    interestedVehicle: '',
    downPayment: '',
    tenor: '',
    message: '',
  });

  const contactMutation = useContactForm();

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
          toast.success('Pesan berhasil dikirim');
          setFormData({
            name: '',
            address: '',
            phone: '',
            email: '',
            interestedVehicle: '',
            downPayment: '',
            tenor: '',
            message: '',
          });
        },
        onError: () => {
          toast.error('Gagal mengirim pesan');
        },
      }
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Alamat *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">No HP *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="interestedVehicle">Unit Diminati</Label>
              <Input
                id="interestedVehicle"
                value={formData.interestedVehicle}
                onChange={(e) => setFormData({ ...formData, interestedVehicle: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="downPayment">DP</Label>
              <Input
                id="downPayment"
                value={formData.downPayment}
                onChange={(e) => setFormData({ ...formData, downPayment: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="tenor">Tenor</Label>
              <Input
                id="tenor"
                value={formData.tenor}
                onChange={(e) => setFormData({ ...formData, tenor: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="message">Pesan</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#C90010] hover:bg-[#A00008]"
              disabled={contactMutation.isPending}
            >
              {contactMutation.isPending ? 'Mengirim...' : 'Kirim Pesan'}
            </Button>
          </form>
        </div>

        {/* Dealer Info & Sales */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Info Dealer</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="text-[#C90010] mt-1" size={20} />
                <div>
                  <div className="font-medium">Telepon</div>
                  <div className="text-gray-600">0260-123456</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="text-[#C90010] mt-1" size={20} />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-gray-600">info@mitsubishisubang.com</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="text-[#C90010] mt-1" size={20} />
                <div>
                  <div className="font-medium">Alamat</div>
                  <div className="text-gray-600">Jl. Raya Subang No. 123, Subang, Jawa Barat</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="text-[#C90010] mt-1" size={20} />
                <div>
                  <div className="font-medium">Jam Operasional</div>
                  <div className="text-gray-600">Senin - Sabtu: 08:00 - 17:00</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Sales Consultant</h2>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <img
                src="/assets/generated/sales-consultant.dim_400x400.png"
                alt="Sales Consultant"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold mb-2">Budi Santoso</h3>
              <p className="text-gray-600 mb-4">Sales Consultant</p>
              <Button
                className="w-full bg-[#398E3D] hover:bg-[#2d7230]"
                onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
              >
                <MessageCircle className="mr-2" size={20} />
                Hubungi via WhatsApp
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Lokasi Kami</h2>
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-500">Google Maps Embed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
