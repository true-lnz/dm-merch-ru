import Image from "next/image";

export default function AdminIcon() {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        height: 32,
        justifyContent: "center",
        width: "auto",
      }}
    >
      <Image
        alt="DM Merch"
        height={32}
        width={32}
        priority
        src="/logo-dm-minimized.svg"
        style={{ height: "100%", objectFit: "contain", width: "100%" }}
      />
    </div>
  );
}
