import type { WebsiteSettings } from "@/backend";
import BannerImagePicker from "@/components/admin/BannerImagePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useGetMediaAssetById } from "@/hooks/useMediaAssets";
import {
  useGetWebsiteSettings,
  useUpdateWebsiteSettings,
} from "@/hooks/useWebsiteSettings";
import { createBlobUrlFromData } from "@/utils/blobUrl";
import { validateDelegationIdentity } from "@/utils/validation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function WebsiteSettingsPage() {
  const { identity } = useInternetIdentity();
  const { data: settings, isLoading } = useGetWebsiteSettings();
  const updateSettings = useUpdateWebsiteSettings();

  const [mainBannerPickerOpen, setMainBannerPickerOpen] = useState(false);
  const [ctaBannerPickerOpen, setCtaBannerPickerOpen] = useState(false);
  const [consultantPhotoPickerOpen, setConsultantPhotoPickerOpen] =
    useState(false);

  const [mainBannerImageId, setMainBannerImageId] = useState<
    bigint | undefined
  >(undefined);
  const [ctaBannerImageId, setCtaBannerImageId] = useState<bigint | undefined>(
    undefined,
  );
  const [salesConsultantPhotoId, setSalesConsultantPhotoId] = useState<
    bigint | undefined
  >(undefined);

  const [formData, setFormData] = useState({
    siteName: "",
    contactPhone: "",
    contactWhatsapp: "",
    contactEmail: "",
    dealerAddress: "",
    operationalHours: "",
    facebookUrl: "",
    instagramUrl: "",
    tiktokUrl: "",
    youtubeUrl: "",
    salesConsultantName: "",
    footerAboutText: "",
  });

  const mainBannerIdForQuery = mainBannerImageId ?? null;
  const ctaBannerIdForQuery = ctaBannerImageId ?? null;
  const consultantPhotoIdForQuery = salesConsultantPhotoId ?? null;

  const { data: mainBannerAsset, isLoading: mainBannerLoading } =
    useGetMediaAssetById(mainBannerIdForQuery);
  const { data: ctaBannerAsset, isLoading: ctaBannerLoading } =
    useGetMediaAssetById(ctaBannerIdForQuery);
  const { data: consultantPhotoAsset, isLoading: consultantPhotoLoading } =
    useGetMediaAssetById(consultantPhotoIdForQuery);

  const [mainBannerUrl, setMainBannerUrl] = useState<string | null>(null);
  const [ctaBannerUrl, setCtaBannerUrl] = useState<string | null>(null);
  const [consultantPhotoUrl, setConsultantPhotoUrl] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (mainBannerAsset?.data) {
      const url = createBlobUrlFromData(
        mainBannerAsset.data,
        mainBannerAsset.mimeType,
      );
      setMainBannerUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setMainBannerUrl(null);
  }, [mainBannerAsset]);

  useEffect(() => {
    if (ctaBannerAsset?.data) {
      const url = createBlobUrlFromData(
        ctaBannerAsset.data,
        ctaBannerAsset.mimeType,
      );
      setCtaBannerUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setCtaBannerUrl(null);
  }, [ctaBannerAsset]);

  useEffect(() => {
    if (consultantPhotoAsset?.data) {
      const url = createBlobUrlFromData(
        consultantPhotoAsset.data,
        consultantPhotoAsset.mimeType,
      );
      setConsultantPhotoUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setConsultantPhotoUrl(null);
  }, [consultantPhotoAsset]);

  useEffect(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName ?? "",
        contactPhone: settings.contactPhone ?? "",
        contactWhatsapp: settings.contactWhatsapp ?? "",
        contactEmail: settings.contactEmail ?? "",
        dealerAddress: settings.dealerAddress ?? "",
        operationalHours: settings.operationalHours ?? "",
        facebookUrl: settings.facebookUrl ?? "",
        instagramUrl: settings.instagramUrl ?? "",
        tiktokUrl: settings.tiktokUrl ?? "",
        youtubeUrl: settings.youtubeUrl ?? "",
        salesConsultantName: settings.salesConsultantName ?? "",
        footerAboutText: settings.footerAboutText ?? "",
      });
      setMainBannerImageId(settings.mainBannerImageId ?? undefined);
      setCtaBannerImageId(settings.ctaBannerImageId ?? undefined);
      setSalesConsultantPhotoId(settings.salesConsultantPhotoId ?? undefined);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateDelegationIdentity(identity);
    if (validationError) {
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
      lastUpdated: BigInt(Date.now()) * BigInt(1_000_000),
      salesConsultantName: formData.salesConsultantName || undefined,
      salesConsultantPhotoId: salesConsultantPhotoId,
      footerAboutText: formData.footerAboutText || undefined,
    };

    try {
      await updateSettings.mutateAsync(settingsData);
      toast.success("Pengaturan berhasil disimpan!");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error(`Gagal menyimpan: ${message}`);
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
        {/* Banner Images Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Banner Images</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Main Banner */}
            <div className="space-y-2">
              <Label>Main Banner</Label>
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
                <div className="border-2 border-dashed rounded-lg h-32 flex items-center justify-center text-gray-400 text-sm">
                  Belum ada banner dipilih
                </div>
              )}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  data-ocid="settings.main_banner.button"
                  onClick={() => setMainBannerPickerOpen(true)}
                >
                  Pilih Banner
                </Button>
                {mainBannerImageId && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => setMainBannerImageId(undefined)}
                  >
                    Hapus
                  </Button>
                )}
              </div>
              {mainBannerImageId && (
                <p className="text-xs text-gray-500">
                  ID: {mainBannerImageId.toString()}
                </p>
              )}
            </div>

            {/* CTA Banner */}
            <div className="space-y-2">
              <Label>CTA Banner</Label>
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
                <div className="border-2 border-dashed rounded-lg h-32 flex items-center justify-center text-gray-400 text-sm">
                  Belum ada banner dipilih
                </div>
              )}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  data-ocid="settings.cta_banner.button"
                  onClick={() => setCtaBannerPickerOpen(true)}
                >
                  Pilih Banner
                </Button>
                {ctaBannerImageId && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => setCtaBannerImageId(undefined)}
                  >
                    Hapus
                  </Button>
                )}
              </div>
              {ctaBannerImageId && (
                <p className="text-xs text-gray-500">
                  ID: {ctaBannerImageId.toString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Site Info */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Informasi Situs</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nama Situs</Label>
                <Input
                  id="siteName"
                  data-ocid="settings.site_name.input"
                  value={formData.siteName}
                  onChange={(e) =>
                    handleInputChange("siteName", e.target.value)
                  }
                  placeholder="Contoh: Mitsubishi Srikandi Subang"
                  disabled={updateSettings.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="operationalHours">Jam Operasional</Label>
                <Input
                  id="operationalHours"
                  data-ocid="settings.operational_hours.input"
                  value={formData.operationalHours}
                  onChange={(e) =>
                    handleInputChange("operationalHours", e.target.value)
                  }
                  placeholder="Contoh: Senin - Sabtu: 08:30 - 16:00"
                  disabled={updateSettings.isPending}
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Informasi Kontak</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Nomor Telepon</Label>
                <Input
                  id="contactPhone"
                  data-ocid="settings.contact_phone.input"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    handleInputChange("contactPhone", e.target.value)
                  }
                  placeholder="Contoh: 0852-1234-0778"
                  disabled={updateSettings.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactWhatsapp">Nomor WhatsApp</Label>
                <Input
                  id="contactWhatsapp"
                  data-ocid="settings.contact_whatsapp.input"
                  value={formData.contactWhatsapp}
                  onChange={(e) =>
                    handleInputChange("contactWhatsapp", e.target.value)
                  }
                  placeholder="Contoh: 6285212340778"
                  disabled={updateSettings.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  data-ocid="settings.contact_email.input"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    handleInputChange("contactEmail", e.target.value)
                  }
                  placeholder="Contoh: info@mitsubishi-subang.com"
                  disabled={updateSettings.isPending}
                />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="dealerAddress">Alamat Dealer</Label>
              <Textarea
                id="dealerAddress"
                data-ocid="settings.dealer_address.textarea"
                value={formData.dealerAddress}
                onChange={(e) =>
                  handleInputChange("dealerAddress", e.target.value)
                }
                rows={3}
                placeholder="Contoh: Jl. Otto Iskandardinata No.314, Subang, Jawa Barat 41211"
                disabled={updateSettings.isPending}
              />
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Media Sosial</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebookUrl">Facebook URL</Label>
                <Input
                  id="facebookUrl"
                  data-ocid="settings.facebook_url.input"
                  value={formData.facebookUrl}
                  onChange={(e) =>
                    handleInputChange("facebookUrl", e.target.value)
                  }
                  placeholder="https://facebook.com/..."
                  disabled={updateSettings.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagramUrl">Instagram URL</Label>
                <Input
                  id="instagramUrl"
                  data-ocid="settings.instagram_url.input"
                  value={formData.instagramUrl}
                  onChange={(e) =>
                    handleInputChange("instagramUrl", e.target.value)
                  }
                  placeholder="https://instagram.com/..."
                  disabled={updateSettings.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiktokUrl">TikTok URL</Label>
                <Input
                  id="tiktokUrl"
                  data-ocid="settings.tiktok_url.input"
                  value={formData.tiktokUrl}
                  onChange={(e) =>
                    handleInputChange("tiktokUrl", e.target.value)
                  }
                  placeholder="https://tiktok.com/@..."
                  disabled={updateSettings.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtubeUrl">YouTube URL</Label>
                <Input
                  id="youtubeUrl"
                  data-ocid="settings.youtube_url.input"
                  value={formData.youtubeUrl}
                  onChange={(e) =>
                    handleInputChange("youtubeUrl", e.target.value)
                  }
                  placeholder="https://youtube.com/@..."
                  disabled={updateSettings.isPending}
                />
              </div>
            </div>
          </div>

          {/* Sales Consultant & Footer */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Konten Tambahan</h2>
            <div className="space-y-6">
              {/* Sales Consultant Name */}
              <div className="space-y-2">
                <Label htmlFor="salesConsultantName">
                  Nama Sales Consultant
                </Label>
                <Input
                  id="salesConsultantName"
                  data-ocid="settings.sales_consultant_name.input"
                  value={formData.salesConsultantName}
                  onChange={(e) =>
                    handleInputChange("salesConsultantName", e.target.value)
                  }
                  placeholder="Contoh: Budi Santoso"
                  disabled={updateSettings.isPending}
                />
              </div>

              {/* Sales Consultant Photo */}
              <div className="space-y-2">
                <Label>Foto Sales Consultant</Label>
                {consultantPhotoLoading ? (
                  <Skeleton className="w-24 h-24" />
                ) : consultantPhotoUrl ? (
                  <div className="border rounded-lg overflow-hidden w-24 h-24">
                    <img
                      src={consultantPhotoUrl}
                      alt="Foto Sales Consultant"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg w-24 h-24 flex items-center justify-center text-gray-400 text-xs text-center p-2">
                    Belum ada foto
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    data-ocid="settings.consultant_photo.button"
                    onClick={() => setConsultantPhotoPickerOpen(true)}
                  >
                    Pilih Foto
                  </Button>
                  {salesConsultantPhotoId && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => setSalesConsultantPhotoId(undefined)}
                    >
                      Hapus
                    </Button>
                  )}
                </div>
                {salesConsultantPhotoId && (
                  <p className="text-xs text-gray-500">
                    ID: {salesConsultantPhotoId.toString()}
                  </p>
                )}
              </div>

              {/* Footer About Text */}
              <div className="space-y-2">
                <Label htmlFor="footerAboutText">
                  Deskripsi Tentang Kami (Footer)
                </Label>
                <Textarea
                  id="footerAboutText"
                  data-ocid="settings.footer_about.textarea"
                  value={formData.footerAboutText}
                  onChange={(e) =>
                    handleInputChange("footerAboutText", e.target.value)
                  }
                  rows={4}
                  placeholder="Tulis deskripsi singkat tentang dealer untuk ditampilkan di footer..."
                  disabled={updateSettings.isPending}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              data-ocid="settings.submit_button"
              disabled={updateSettings.isPending}
              className="min-w-[160px]"
            >
              {updateSettings.isPending ? "Menyimpan..." : "Simpan Pengaturan"}
            </Button>
          </div>
        </form>
      </div>

      {/* Banner Pickers */}
      <BannerImagePicker
        open={mainBannerPickerOpen}
        onOpenChange={setMainBannerPickerOpen}
        onSelect={(imageId) => {
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
          setCtaBannerImageId(imageId);
          setCtaBannerPickerOpen(false);
        }}
        value={ctaBannerImageId}
        bannerType="cta"
      />

      {/* Consultant Photo Picker */}
      <BannerImagePicker
        open={consultantPhotoPickerOpen}
        onOpenChange={setConsultantPhotoPickerOpen}
        onSelect={(imageId) => {
          setSalesConsultantPhotoId(imageId);
          setConsultantPhotoPickerOpen(false);
        }}
        value={salesConsultantPhotoId}
        bannerType="main"
      />
    </div>
  );
}
