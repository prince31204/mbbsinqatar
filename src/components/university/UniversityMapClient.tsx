"use client";
import dynamic from "next/dynamic";
const UniversityMap = dynamic(
  () => import("@/components/homepage/UniversityMap"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF8F7",
          borderRadius: "16px",
        }}
      >
        {" "}
        <p style={{ color: "#6B7280", fontSize: "14px" }}>
          Loading map...
        </p>{" "}
      </div>
    ),
  },
);
interface Props {
  id: string;
  name: string;
  slug: string;
  city: string;
  latitude: number;
  longitude: number;
  thumbnailPath: string | null;
}
export default function UniversityMapClient(props: Props) {
  return <UniversityMap universities={[props]} />;
}
