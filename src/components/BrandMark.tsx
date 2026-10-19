import brandMark from "../assets/barbearia-mark.png";

export function BrandMark({
  className = "brand-mark",
}: {
  className?: string;
}) {
  return (
    <img src={brandMark} alt="" className={className} width={40} height={40} />
  );
}
