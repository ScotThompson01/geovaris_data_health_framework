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

  if (isReport) {
    return (
      <div className="grid grid-cols-2 items-center gap-8 print:grid-cols-2 print:items-center">
        <div className="flex items-center justify-start">
          <GeoVarisLogo
            width={560}
            height={190}
            priority
            className="h-auto w-[420px] print:w-[300px]"
          />
        </div>

        <div className="flex items-center justify-end">
          <GdhfLogo
            width={380}
            height={125}
            priority
            className="h-auto w-[300px] print:w-[240px]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-6">
      <GeoVarisLogo
        width={560}
        height={190}
        priority
        className="h-auto w-[440px]"
      />

      <GdhfLogo
        width={620}
        height={200}
        priority
        className="h-auto w-[500px]"
      />
    </div>
  );
}