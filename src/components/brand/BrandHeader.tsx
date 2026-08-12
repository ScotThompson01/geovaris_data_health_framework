import { GeoVarisLogo } from "@/components/brand/GeoVarisLogo";
import { GdhfLogo } from "@/components/brand/GdhfLogo";

type BrandHeaderProps = {
  variant?: "app" | "report";
};

export function BrandHeader({
  variant = "app",
}: BrandHeaderProps) {
  const isReport =
    variant === "report";

  return (
    <div
      className={
        isReport
          ? "flex flex-wrap items-start justify-between gap-8"
          : "flex items-center justify-between gap-6"
      }
    >
      <GeoVarisLogo
        width={isReport ? 420 : 210}
        height={isReport ? 145 : 72}
        priority
        className={
          isReport
            ? "h-auto w-[340px]"
            : "h-auto w-[170px]"
        }
      />

      <GdhfLogo
        width={isReport ? 380 : 220}
        height={isReport ? 125 : 72}
        priority
        className={
          isReport
            ? "h-auto w-[300px]"
            : "h-auto w-[180px]"
        }
      />
    </div>
  );
}