import BannerSettingsForm from "@/features/admin-banner/components/banner-settings-form";
import { getBannerSettings } from "@/features/admin-banner/server";

export default async function DashboardBannerPage() {
  const settings = await getBannerSettings();

  return <BannerSettingsForm settings={settings} />;
}
