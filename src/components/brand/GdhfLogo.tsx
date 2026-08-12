import Image from "next/image";

type GdhfLogoProps = {
  width?: number;
  height?: number;
  iconOnly?: boolean;
  className?: string;
  priority?: boolean;
};

export function GdhfLogo({
  width = 180,
  height = 60,
  iconOnly = false,
  className,
  priority = false,
}: GdhfLogoProps) {
  const src =
    iconOnly
      ? "/brand/gdhf/gdhf-icon.svg"
      : "/brand/gdhf/gdhf-logo.svg";

  return (
    <Image
      src={src}
      alt="GeoVaris Data Health Framework"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}