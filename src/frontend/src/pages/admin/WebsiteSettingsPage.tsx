import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useGetWebsiteSettings, useUpdateWebsiteSettings } from '@/hooks/useWebsiteSettings';
import type { WebsiteSettings } from '@/types/local';
import BannerImagePicker from '@/components/admin/BannerImagePicker';
import { Skeleton } from '@/components/ui/skeleton';

export default function WebsiteSettingsPage() {
  const { data: settings, isLoading, refetch } = useGetWebsiteSettings();
  const updateSettings = useUpdateWebsiteSettings();
  const [mainBannerPickerOpen, setMainBannerPickerOpen] = useState(false);
  const [ctaBannerPickerOpen, setCtaBannerPickerOpen] = useState(false);

  const [formData, setFormData] = useState({
    siteName: '',
    contactPhone: '',
    contactWhatsapp: '',
    contactEmail: '',
    dealerAddress: '',
    operationalHours: '',
    facebookUrl: '',
    instagramUrl: '',
    tiktokUrl: '',
    youtubeUrl: '',
    mainBannerImageId: '',
    ctaBannerImageId: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName || '',
        contactPhone: settings.contactPhone || '',
        contactWhatsapp: settings.contactWhatsapp || '',
        contactEmail: settings.contactEmail || '',
        dealerAddress: settings.dealerAddress || '',
        operationalHours: settings.operationalHours || '',
        facebookUrl: settings.facebookUrl || '',
        instagramUrl: settings.instagramUrl || '',
        tiktokUrl: settings.tiktokUrl || '',
        youtubeUrl: settings.youtubeUrl || '',
        mainBannerImageId: settings.mainBannerImageId || '',
        ctaBannerImageId: settings.ctaBannerImageId || '',
      });
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const settingsData: WebsiteSettings = {
      id: settings?.id || BigInt(1),
      siteName: formData.siteName,
      contactPhone: formData.contactPhone,
      contactWhatsapp: formData.contactWhatsapp,
      contactEmail: formData.contactEmail,
      dealerAddress: formData.dealerAddress,
      operationalHours: formData.operationalHours,
      facebookUrl: formData.facebookUrl,
      instagramUrl: formData.instagramUrl,
      tiktokUrl: formData.tiktokUrl,
      youtubeUrl: formData.youtubeUrl,
      mainBannerImageId: formData.mainBannerImageId || undefined,
      ctaBannerImageId: formData.ctaBannerImageId || undefined,
      lastUpdated: BigInt(Date.now() * 1000000),
    };

    updateSettings.mutate(settingsData, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pengaturan Website</h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Banner Images</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Main Banner (1920x600px)</Label>
              {formData.mainBannerImageId ? (
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={`/api/media/${formData.mainBannerImageId}`}
                    alt="Main Banner Preview"
                    className="w-full h-32 object-cover"
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg h-32 flex items-center justify-center text-gray-400">
                  Belum ada banner
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setMainBannerPickerOpen(true)}
              >
                Pilih Banner
              </Button>
            </div>

            <div className="space-y-2">
              <Label>CTA Banner (1920x400px)</Label>
              {formData.ctaBannerImageId ? (
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={`/api/media/${formData.ctaBannerImageId}`}
                    alt="CTA Banner Preview"
                    className="w-full h-32 object-cover"
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg h-32 flex items-center justify-center text-gray-400">
                  Belum ada banner
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setCtaBannerPickerOpen(true)}
              >
                Pilih Banner
              </Button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Nama Situs</Label>
              <Input
                id="siteName"
                value={formData.siteName}
                onChange={(e) =>
                  setFormData({ ...formData, siteName: e.target.value })
                }
                disabled={updateSettings.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Telepon</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) =>
                  setFormData({ ...formData, contactPhone: e.target.value })
                }
                disabled={updateSettings.isPending}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactWhatsapp">WhatsApp</Label>
              <Input
                id="contactWhatsapp"
                value={formData.contactWhatsapp}
                onChange={(e) =>
                  setFormData({ ...formData, contactWhatsapp: e.target.value })
                }
                disabled={updateSettings.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
                disabled={updateSettings.isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dealerAddress">Alamat Dealer</Label>
            <Textarea
              id="dealerAddress"
              value={formData.dealerAddress}
              onChange={(e) =>
                setFormData({ ...formData, dealerAddress: e.target.value })
              }
              rows={3}
              disabled={updateSettings.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="operationalHours">Jam Operasional</Label>
            <Input
              id="operationalHours"
              value={formData.operationalHours}
              onChange={(e) =>
                setFormData({ ...formData, operationalHours: e.target.value })
              }
              disabled={updateSettings.isPending}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebookUrl">Facebook URL</Label>
              <Input
                id="facebookUrl"
                value={formData.facebookUrl}
                onChange={(e) =>
                  setFormData({ ...formData, facebookUrl: e.target.value })
                }
                disabled={updateSettings.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagramUrl">Instagram URL</Label>
              <Input
                id="instagramUrl"
                value={formData.instagramUrl}
                onChange={(e) =>
                  setFormData({ ...formData, instagramUrl: e.target.value })
                }
                disabled={updateSettings.isPending}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tiktokUrl">TikTok URL</Label>
              <Input
                id="tiktokUrl"
                value={formData.tiktokUrl}
                onChange={(e) =>
                  setFormData({ ...formData, tiktokUrl: e.target.value })
                }
                disabled={updateSettings.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtubeUrl">YouTube URL</Label>
              <Input
                id="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={(e) =>
                  setFormData({ ...formData, youtubeUrl: e.target.value })
                }
                disabled={updateSettings.isPending}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={updateSettings.isPending}>
              {updateSettings.isPending ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </Button>
          </div>
        </form>
      </div>

      <BannerImagePicker
        open={mainBannerPickerOpen}
        onOpenChange={setMainBannerPickerOpen}
        onSelect={(imageId) =>
          setFormData({ ...formData, mainBannerImageId: imageId })
        }
        currentImageId={formData.mainBannerImageId}
        bannerType="main"
      />

      <BannerImagePicker
        open={ctaBannerPickerOpen}
        onOpenChange={setCtaBannerPickerOpen}
        onSelect={(imageId) =>
          setFormData({ ...formData, ctaBannerImageId: imageId })
        }
        currentImageId={formData.ctaBannerImageId}
        bannerType="cta"
      />
    </div>
  );
}
