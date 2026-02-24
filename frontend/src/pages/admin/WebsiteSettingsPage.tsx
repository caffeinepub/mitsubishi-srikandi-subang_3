import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useGetWebsiteSettings, useUpdateWebsiteSettings } from '@/hooks/useWebsiteSettings';
import { useGetMediaAssetById } from '@/hooks/useMediaAssets';
import type { WebsiteSettings } from '@/types/local';
import BannerImagePicker from '@/components/admin/BannerImagePicker';
import { Skeleton } from '@/components/ui/skeleton';
import { createBlobUrlFromData } from '@/utils/blobUrl';
import { validateDelegationIdentity } from '@/utils/validation';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { toast } from 'sonner';

export default function WebsiteSettingsPage() {
  const { identity } = useInternetIdentity();
  const { data: settings, isLoading, isFetched } = useGetWebsiteSettings();
  const updateSettings = useUpdateWebsiteSettings();
  const [mainBannerPickerOpen, setMainBannerPickerOpen] = useState(false);
  const [ctaBannerPickerOpen, setCtaBannerPickerOpen] = useState(false);

  const [mainBannerImageId, setMainBannerImageId] = useState<bigint | undefined>(undefined);
  const [ctaBannerImageId, setCtaBannerImageId] = useState<bigint | undefined>(undefined);

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
  });

  // Fetch banner images
  const { data: mainBannerAsset, isLoading: mainBannerLoading } = useGetMediaAssetById(mainBannerImageId);
  const { data: ctaBannerAsset, isLoading: ctaBannerLoading } = useGetMediaAssetById(ctaBannerImageId);

  // Create blob URLs for preview
  const [mainBannerUrl, setMainBannerUrl] = useState<string | null>(null);
  const [ctaBannerUrl, setCtaBannerUrl] = useState<string | null>(null);

  useEffect(() => {
    if (mainBannerAsset?.data) {
      const url = createBlobUrlFromData(mainBannerAsset.data, mainBannerAsset.mimeType);
      setMainBannerUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setMainBannerUrl(null);
    }
  }, [mainBannerAsset]);

  useEffect(() => {
    if (ctaBannerAsset?.data) {
      const url = createBlobUrlFromData(ctaBannerAsset.data, ctaBannerAsset.mimeType);
      setCtaBannerUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setCtaBannerUrl(null);
    }
  }, [ctaBannerAsset]);

  // Populate form when settings load
  useEffect(() => {
    if (settings) {
      console.log('[WebsiteSettingsPage] Loading settings:', settings);
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
      });
      setMainBannerImageId(settings.mainBannerImageId);
      setCtaBannerImageId(settings.ctaBannerImageId);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('[WebsiteSettingsPage] Form submitted');
    console.log('[WebsiteSettingsPage] mainBannerImageId:', mainBannerImageId);
    console.log('[WebsiteSettingsPage] ctaBannerImageId:', ctaBannerImageId);

    // Validate delegation identity
    const validationError = validateDelegationIdentity(identity);
    if (validationError) {
      console.error('[WebsiteSettingsPage] Validation error:', validationError);
      toast.error(validationError);
      return;
    }

    const settingsData: WebsiteSettings = {
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
      mainBannerImageId: mainBannerImageId,
      ctaBannerImageId: ctaBannerImageId,
      lastUpdated: BigInt(Date.now() * 1000000),
    };

    console.log('[WebsiteSettingsPage] Submitting settings:', settingsData);
    
    try {
      await updateSettings.mutateAsync(settingsData);
      console.log('[WebsiteSettingsPage] Settings saved successfully');
    } catch (error) {
      console.error('[WebsiteSettingsPage] Error saving settings:', error);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
              {mainBannerLoading ? (
                <Skeleton className="w-full h-32" />
              ) : mainBannerUrl ? (
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={mainBannerUrl}
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
              {mainBannerImageId && (
                <p className="text-xs text-gray-500">ID: {mainBannerImageId.toString()}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>CTA Banner (1920x400px)</Label>
              {ctaBannerLoading ? (
                <Skeleton className="w-full h-32" />
              ) : ctaBannerUrl ? (
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={ctaBannerUrl}
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
              {ctaBannerImageId && (
                <p className="text-xs text-gray-500">ID: {ctaBannerImageId.toString()}</p>
              )}
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
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                disabled={updateSettings.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Telepon</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
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
                onChange={(e) => handleInputChange('contactWhatsapp', e.target.value)}
                disabled={updateSettings.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                disabled={updateSettings.isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dealerAddress">Alamat Dealer</Label>
            <Textarea
              id="dealerAddress"
              value={formData.dealerAddress}
              onChange={(e) => handleInputChange('dealerAddress', e.target.value)}
              rows={3}
              disabled={updateSettings.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="operationalHours">Jam Operasional</Label>
            <Input
              id="operationalHours"
              value={formData.operationalHours}
              onChange={(e) => handleInputChange('operationalHours', e.target.value)}
              disabled={updateSettings.isPending}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebookUrl">Facebook URL</Label>
              <Input
                id="facebookUrl"
                value={formData.facebookUrl}
                onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
                disabled={updateSettings.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagramUrl">Instagram URL</Label>
              <Input
                id="instagramUrl"
                value={formData.instagramUrl}
                onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
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
                onChange={(e) => handleInputChange('tiktokUrl', e.target.value)}
                disabled={updateSettings.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtubeUrl">YouTube URL</Label>
              <Input
                id="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
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
        onSelect={(imageId) => {
          console.log('[WebsiteSettingsPage] Main banner selected:', imageId);
          setMainBannerImageId(imageId);
          setMainBannerPickerOpen(false);
        }}
        value={mainBannerImageId}
        bannerType="main"
      />

      <BannerImagePicker
        open={ctaBannerPickerOpen}
        onOpenChange={setCtaBannerPickerOpen}
        onSelect={(imageId) => {
          console.log('[WebsiteSettingsPage] CTA banner selected:', imageId);
          setCtaBannerImageId(imageId);
          setCtaBannerPickerOpen(false);
        }}
        value={ctaBannerImageId}
        bannerType="cta"
      />
    </div>
  );
}
