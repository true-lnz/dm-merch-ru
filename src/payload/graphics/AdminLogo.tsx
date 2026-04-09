import Image from "next/image";

export default function AdminLogo() {
  return (
    <div className="graphic-logo">
      <Image
        alt="DM Merch"
        className="graphic-logo__image"
        height={36}
        priority
        src="/logo-dm.svg"
        style={{ minHeight: "36px" }}
        width={220}
      />
    </div>
  );
}
