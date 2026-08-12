import { GeoVarisLogo } from "@/components/brand/GeoVarisLogo";

type BrandFooterProps = {
  variant?: "app" | "report";
};

export function BrandFooter({
  variant = "app",
}: BrandFooterProps) {
  const isReport = variant === "report";

  return (
    <footer
      className={
        isReport
          ? "border-t border-brand-border bg-brand-background px-8 py-5"
          : "border-t border-brand-border bg-brand-background px-6 py-4"
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-6">
        <GeoVarisLogo
          width={isReport ? 260 : 105}
          height={isReport ? 88 : 36}
          className={
            isReport
              ? "h-auto w-[260px]"
              : "h-auto w-[300px]"
          }
        />

        <div className="text-right">
          <p className="text-sm font-semibold text-brand-text">
            Clean data. Confident results.
          </p>

          {isReport && (
            <p className="mt-1 text-xs text-brand-muted">
              GeoVaris Data Health Framework™
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}