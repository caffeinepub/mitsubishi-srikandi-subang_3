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
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Reusable media picker field ────────────────────────────────────────────
interface MediaPickerFieldProps {
  label: string;
  assetId: bigint | undefined;
  onSelect: (id: bigint) => void;
  onClear: () => void;
  pickerOpen: boolean;
  setPickerOpen: (open: boolean) => void;
  buttonOcid: string;
  disabled?: boolean;
}

function MediaPickerField({
  label,
  assetId,
  onSelect,
  onClear,
  pickerOpen,
  setPickerOpen,
  buttonOcid,
  disabled,
}: MediaPickerFieldProps) {
  const { data: asset, isLoading } = useGetMediaAssetById(assetId ?? null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (asset?.data) {
      const url = createBlobUrlFromData(asset.data, asset.mimeType);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [asset]);

  return (
    <>
      <div className="space-y-2">
        <Label>{label}</Label>
        {isLoading ? (
          <Skeleton className="w-full h-32" />
        ) : previewUrl ? (
          <div className="border rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt={label}
              className="h-32 w-full object-cover"
            />
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-lg h-32 flex items-center justify-center text-muted-foreground text-sm">
            Belum ada media dipilih
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid={buttonOcid}
            onClick={() => setPickerOpen(true)}
            disabled={disabled}
          >
            Pilih Media
          </Button>
          {assetId && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={onClear}
              disabled={disabled}
            >
              Hapus
            </Button>
          )}
        </div>
        {assetId && (
          <p className="text-xs text-muted-foreground">
            ID: {assetId.toString()}
          </p>
        )}
      </div>

      <BannerImagePicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(imageId) => {
          onSelect(imageId);
          setPickerOpen(false);
        }}
        value={assetId}
        bannerType="main"
      />
    </>
  );
}

// ─── Section card wrapper ────────────────────────────────────────────────────
function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-5">
      <h2 className="text-lg font-semibold text-foreground tracking-tight">
        {title}
      </h2>
      {children}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function WebsiteSettingsPage() {
  const { identity } = useInternetIdentity();
  const { data: settings, isLoading } = useGetWebsiteSettings();
  const updateSettings = useUpdateWebsiteSettings();

  // Media picker open states
  const [videoBannerPickerOpen, setVideoBannerPickerOpen] = useState(false);
  const [mainBannerPickerOpen, setMainBannerPickerOpen] = useState(false);
  const [mainBanner2PickerOpen, setMainBanner2PickerOpen] = useState(false);
  const [ctaBannerPickerOpen, setCtaBannerPickerOpen] = useState(false);
  const [consultantPhotoPickerOpen, setConsultantPhotoPickerOpen] =
    useState(false);

  // Media asset IDs
  const [mainBannerVideoId, setMainBannerVideoId] = useState<
    bigint | undefined
  >(undefined);
  const [mainBannerImageId, setMainBannerImageId] = useState<
    bigint | undefined
  >(undefined);
  const [mainBannerImageId2, setMainBannerImageId2] = useState<
    bigint | undefined
  >(undefined);
  const [ctaBannerImageId, setCtaBannerImageId] = useState<bigint | undefined>(
    undefined,
  );
  const [salesConsultantPhotoId, setSalesConsultantPhotoId] = useState<
    bigint | undefined
  >(undefined);

  // Text fields
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

  // Populate from loaded settings
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
      setMainBannerVideoId(settings.mainBannerVideoId ?? undefined);
      setMainBannerImageId(settings.mainBannerImageId ?? undefined);
      setMainBannerImageId2(settings.mainBannerImageId2 ?? undefined);
      setCtaBannerImageId(settings.ctaBannerImageId ?? undefined);
      setSalesConsultantPhotoId(settings.salesConsultantPhotoId ?? undefined);
    }
  }, [settings]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
      mainBannerVideoId: mainBannerVideoId,
      mainBannerImageId: mainBannerImageId,
      mainBannerImageId2: mainBannerImageId2,
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  const isPending = updateSettings.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Pengaturan Website
        </h1>
      </div>

      {/* ── Section 1: MAIN BANNER ── */}
      <SectionCard title="Main Banner">
        <MediaPickerField
          label="Video Banner"
          assetId={mainBannerVideoId}
          onSelect={setMainBannerVideoId}
          onClear={() => setMainBannerVideoId(undefined)}
          pickerOpen={videoBannerPickerOpen}
          setPickerOpen={setVideoBannerPickerOpen}
          buttonOcid="settings.main_banner_video.button"
          disabled={isPending}
        />

        <div className="pt-1">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Image Banner
          </p>
          <div className="space-y-5">
            <MediaPickerField
              label="Image 1"
              assetId={mainBannerImageId}
              onSelect={setMainBannerImageId}
              onClear={() => setMainBannerImageId(undefined)}
              pickerOpen={mainBannerPickerOpen}
              setPickerOpen={setMainBannerPickerOpen}
              buttonOcid="settings.main_banner_image1.button"
              disabled={isPending}
            />
            <MediaPickerField
              label="Image 2"
              assetId={mainBannerImageId2}
              onSelect={setMainBannerImageId2}
              onClear={() => setMainBannerImageId2(undefined)}
              pickerOpen={mainBanner2PickerOpen}
              setPickerOpen={setMainBanner2PickerOpen}
              buttonOcid="settings.main_banner_image2.button"
              disabled={isPending}
            />
          </div>
        </div>
      </SectionCard>

      {/* ── Section 2: CTA BANNER ── */}
      <SectionCard title="CTA Banner">
        <MediaPickerField
          label="CTA Banner"
          assetId={ctaBannerImageId}
          onSelect={setCtaBannerImageId}
          onClear={() => setCtaBannerImageId(undefined)}
          pickerOpen={ctaBannerPickerOpen}
          setPickerOpen={setCtaBannerPickerOpen}
          buttonOcid="settings.cta_banner.button"
          disabled={isPending}
        />
      </SectionCard>

      {/* ── Section 3: SALES PROFILE ── */}
      <SectionCard title="Sales Profile">
        <MediaPickerField
          label="Foto Sales Consultant"
          assetId={salesConsultantPhotoId}
          onSelect={setSalesConsultantPhotoId}
          onClear={() => setSalesConsultantPhotoId(undefined)}
          pickerOpen={consultantPhotoPickerOpen}
          setPickerOpen={setConsultantPhotoPickerOpen}
          buttonOcid="settings.consultant_photo.button"
          disabled={isPending}
        />
        <div className="space-y-2">
          <Label htmlFor="salesConsultantName">Nama Sales Consultant</Label>
          <Input
            id="salesConsultantName"
            data-ocid="settings.sales_name.input"
            value={formData.salesConsultantName}
            onChange={(e) =>
              handleInputChange("salesConsultantName", e.target.value)
            }
            placeholder="Contoh: Budi Santoso"
            disabled={isPending}
          />
        </div>
      </SectionCard>

      {/* ── Section 4: INFORMASI SITUS ── */}
      <SectionCard title="Informasi Situs">
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
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="siteName">Nama Situs</Label>
          <Input
            id="siteName"
            data-ocid="settings.site_name.input"
            value={formData.siteName}
            onChange={(e) => handleInputChange("siteName", e.target.value)}
            placeholder="Contoh: Mitsubishi Srikandi Subang"
            disabled={isPending}
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
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Nomor Telepon</Label>
          <Input
            id="contactPhone"
            data-ocid="settings.contact_phone.input"
            value={formData.contactPhone}
            onChange={(e) => handleInputChange("contactPhone", e.target.value)}
            placeholder="Contoh: 0852-1234-0778"
            disabled={isPending}
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
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email</Label>
          <Input
            id="contactEmail"
            data-ocid="settings.contact_email.input"
            type="email"
            value={formData.contactEmail}
            onChange={(e) => handleInputChange("contactEmail", e.target.value)}
            placeholder="Contoh: info@mitsubishi-subang.com"
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dealerAddress">Alamat Dealer</Label>
          <Textarea
            id="dealerAddress"
            data-ocid="settings.dealer_address.textarea"
            value={formData.dealerAddress}
            onChange={(e) => handleInputChange("dealerAddress", e.target.value)}
            rows={3}
            placeholder="Contoh: Jl. Otto Iskandardinata No.314, Subang, Jawa Barat 41211"
            disabled={isPending}
          />
        </div>
      </SectionCard>

      {/* ── Section 5: MEDIA SOSIAL ── */}
      <SectionCard title="Media Sosial">
        <div className="space-y-2">
          <Label htmlFor="facebookUrl">Facebook Url</Label>
          <Input
            id="facebookUrl"
            data-ocid="settings.facebook_url.input"
            value={formData.facebookUrl}
            onChange={(e) => handleInputChange("facebookUrl", e.target.value)}
            placeholder="https://facebook.com/..."
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="instagramUrl">Instagram Url</Label>
          <Input
            id="instagramUrl"
            data-ocid="settings.instagram_url.input"
            value={formData.instagramUrl}
            onChange={(e) => handleInputChange("instagramUrl", e.target.value)}
            placeholder="https://instagram.com/..."
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tiktokUrl">Tiktok Url</Label>
          <Input
            id="tiktokUrl"
            data-ocid="settings.tiktok_url.input"
            value={formData.tiktokUrl}
            onChange={(e) => handleInputChange("tiktokUrl", e.target.value)}
            placeholder="https://tiktok.com/@..."
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="youtubeUrl">Youtube Url</Label>
          <Input
            id="youtubeUrl"
            data-ocid="settings.youtube_url.input"
            value={formData.youtubeUrl}
            onChange={(e) => handleInputChange("youtubeUrl", e.target.value)}
            placeholder="https://youtube.com/@..."
            disabled={isPending}
          />
        </div>
      </SectionCard>

      {/* ── Save button ── */}
      <div className="flex justify-end pb-8">
        <Button
          type="submit"
          data-ocid="settings.submit_button"
          disabled={isPending}
          className="min-w-[180px]"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan Pengaturan"
          )}
        </Button>
      </div>
    </form>
  );
}
