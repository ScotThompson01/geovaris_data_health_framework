import Image from "next/image";

type GeoVarisLogoProps = {
  width?: number;
  height?: number;
  variant?: "color" | "white";
  className?: string;
  priority?: boolean;
};

export function GeoVarisLogo({
  width = 180,
  height = 60,
  variant = "color",
  className,
  priority = false,
}: GeoVarisLogoProps) {
  const src =
    variant === "white"
      ? "/brand/geovaris/geovaris-logo-white.svg"
      : "/brand/geovaris/geovaris-logo.svg";

  return (
    <Image
      src={src}
      alt="GeoVaris"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}