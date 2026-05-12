"use client";

import dynamic from "next/dynamic";
import type { UIFieldClientComponent } from "payload";

const CatalogProductsTaxonomyOrderFieldClient = dynamic(
  () => import("./CatalogProductsTaxonomyOrderField.client.tsx").then((mod) => mod.default),
  {
    loading: () => <div style={{ minHeight: "120px" }} />,
    ssr: false,
  },
);

const CatalogProductsTaxonomyOrderField: UIFieldClientComponent = (props) => {
  return <CatalogProductsTaxonomyOrderFieldClient {...props} />;
};

export default CatalogProductsTaxonomyOrderField;
