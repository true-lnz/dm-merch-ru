"use client";

import { cn } from "@/shared/lib/cn";
import { PageSubheading } from "@/shared/ui/page-subheading";
import type { CatalogProductsLandingCategory } from "@/widgets/catalog-products/model/types";
import Link from "next/link";
import { type CSSProperties, useState } from "react";

type CatalogProductsCategoriesProps = {
  items: CatalogProductsLandingCategory[];
};

export function CatalogCategoryIcon({ iconId, className, monochrome = false }: { iconId?: string; className?: string; monochrome?: boolean }) {
  if (!iconId) {
    return null;
  }

  const iconClassName = cn("w-9 shrink-0 text-[var(--accent)] md:h-[45px] md:w-[108px]", className);
  const sharedStyle = {
    "--catalog-icon-fill": "transparent",
    "--color-print": monochrome ? "transparent" : "rgba(2, 82, 197, 0.5)",
    "--color-print-second": monochrome ? "transparent" : "rgba(2, 82, 197, 0.32)",
  } as CSSProperties;

  switch (iconId) {
    case "cloth":
      return (
        <svg className={iconClassName} viewBox="0 0 60 50" fill="none" preserveAspectRatio="xMinYMid meet" aria-hidden="true" style={sharedStyle}>
          <path
            fill="var(--catalog-icon-fill)"
            stroke="currentColor"
            strokeWidth="3"
            d="M16.516 2.913a3.5 3.5 0 0 1 1.65-.413h22.572c.48 0 .947.096 1.36.274.373.153.684.338.972.58L56.093 14.28a3.5 3.5 0 0 1 .431 4.93l-3.214 3.83a3.506 3.506 0 0 1-4.954.413l-3.856-3.37V44c0 2.03-2.485 3.5-4.5 3.5H19c-2.015 0-4.5-1.47-4.5-3.5V20.067l-3.957 3.406a3.5 3.5 0 0 1-4.93-.431l-3.215-3.83a3.5 3.5 0 0 1 .432-4.931L15.852 3.353c.202-.169.412-.308.664-.44Z"
          />
          <rect fill="var(--color-print)" x="21" y="10" width="17" height="24" rx="4" />
        </svg>
      );
    case "cup":
      return (
        <svg className={iconClassName} viewBox="0 0 55 50" fill="none" preserveAspectRatio="xMinYMid meet" aria-hidden="true" style={sharedStyle}>
          <path
            stroke="currentColor"
            strokeWidth="3"
            d="M38.5 34.681a8.9 8.9 0 0 0 3.732.819c5.621 0 10.268-5.33 10.268-12s-4.647-12-10.268-12a8.9 8.9 0 0 0-3.71.809z"
          />
          <path
            fill="var(--catalog-icon-fill)"
            stroke="currentColor"
            strokeWidth="3"
            d="M3.5 5.5V42A5.5 5.5 0 0 0 9 47.5h24a5.5 5.5 0 0 0 5.5-5.5V5.5z"
          />
          <rect fill="var(--color-print)" x="10" y="19" width="22" height="22" rx="4" />
        </svg>
      );
    case "note":
      return (
        <svg className={iconClassName} viewBox="0 0 50 50" fill="none" preserveAspectRatio="xMinYMid meet" aria-hidden="true" style={sharedStyle}>
          <rect fill="var(--catalog-icon-fill)" width="38" height="45" x="5.5" y="2.5" rx="7" stroke="currentColor" strokeWidth="3" />
          <path stroke="currentColor" strokeWidth="3" strokeLinecap="round" d="M2.5 33.5h7m-7-9h7M35.5 3.106v43.592M2.5 15.5h7" />
          <rect fill="var(--color-print)" x="14" y="8" width="17" height="34" rx="4" />
        </svg>
      );
    case "pen":
      return (
        <svg className={iconClassName} viewBox="0 0 80 50" fill="none" preserveAspectRatio="xMinYMid meet" aria-hidden="true" style={sharedStyle}>
          <path
            fill="var(--catalog-icon-fill)"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            d="M39.723 9.501a4.95 4.95 0 0 0-7.09.205L5.024 39.749a3.22 3.22 0 0 0 .147 4.509 3.4 3.4 0 0 0 4.671.028l29.816-27.828a4.8 4.8 0 0 0 .066-6.957ZM71.72 9.504a4.95 4.95 0 0 0-7.089.204L37.024 39.75a3.22 3.22 0 0 0 .146 4.509 3.4 3.4 0 0 0 4.671.028L71.654 16.46a4.8 4.8 0 0 0 .067-6.957Z"
          />
          <path
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            d="m3 46.828 2.121-2.12M17 20.809 26.978 10M49 20.809 58.978 10M35 46.882l2.121-2.121"
          />
          <path
            fill="var(--color-print)"
            d="M38.65 10.626a3.195 3.195 0 0 1-.053 4.638L24.623 28.213c-.97.9-2.474.887-3.43-.027a2.41 2.41 0 0 1-.112-3.366l12.871-14.054a3.277 3.277 0 0 1 4.697-.14M70.631 10.644a3.194 3.194 0 0 1-.052 4.637L56.623 28.212c-.971.9-2.475.888-3.431-.027a2.41 2.41 0 0 1-.112-3.366l12.854-14.035a3.277 3.277 0 0 1 4.697-.14"
          />
        </svg>
      );
    case "bag":
      return (
        <svg className={iconClassName} viewBox="0 0 60 50" fill="none" preserveAspectRatio="xMinYMid meet" aria-hidden="true" style={sharedStyle}>
          <path stroke="currentColor" strokeWidth="3" d="M41.399 14c-.732-5.366-5.333-9.5-10.899-9.5S20.333 8.634 19.601 14z" />
          <rect x="3.5" y="14.5" width="53" height="33" rx="7" fill="var(--catalog-icon-fill)" stroke="currentColor" strokeWidth="3" />
          <rect fill="var(--color-print)" x="11" y="26" width="38" height="14" rx="4" />
        </svg>
      );
    case "umbrella":
      return (
        <svg className={iconClassName} viewBox="0 0 60 50" fill="none" preserveAspectRatio="xMinYMid meet" aria-hidden="true" style={sharedStyle}>
          <path stroke="currentColor" strokeWidth="3" strokeLinecap="round" d="M13.5 43.5c0 2.567 2.5 5 5.5 5s6.5-1.508 6.5-5V25.315" />
          <path
            fill="var(--catalog-icon-fill)"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            d="M47.448 23.5c-.3-4.396-1.907-9.052-4.696-13.043C39.73 6.13 35.531 2.5 30.5 2.5c-5.03 0-9.23 3.63-12.252 7.957C15.459 14.448 13.852 19.104 13.552 23.5z"
          />
          <path
            fill="var(--color-print)"
            d="M22 15c2.105 0 4.223 1.503 4.223 4.7V31H15.988c-.08-1.016-.117-2.115-.117-3.3 0-3.728.373-7.163 1.015-10.18C17.427 15.978 19.31 15 22 15m17 0c2.105 0 4.223 1.503 4.223 4.7V31H32.988c-.08-1.016-.117-2.115-.117-3.3 0-3.728.373-7.163 1.015-10.18C34.427 15.978 36.31 15 39 15"
          />
        </svg>
      );
    case "electronics":
      return (
        <svg className={iconClassName} viewBox="0 0 70 50" fill="none" preserveAspectRatio="xMinYMid meet" aria-hidden="true" style={sharedStyle}>
          <rect fill="var(--catalog-icon-fill)" stroke="currentColor" strokeWidth="3" width="44" height="30" x="2.5" y="10.5" rx="7" />
          <path stroke="currentColor" strokeWidth="3" strokeLinecap="round" d="M46.5 14.5h20v21h-20zM60.319 21.319h-2M60.319 29.319h-2" />
          <rect width="26" height="18" x="9" y="17" fill="var(--color-print)" rx="4" />
        </svg>
      );
    case "set":
      return (
        <svg className={iconClassName} viewBox="0 0 60 50" fill="none" preserveAspectRatio="xMinYMid meet" aria-hidden="true" style={sharedStyle}>
          <rect fill="var(--catalog-icon-fill)" stroke="currentColor" strokeWidth="3" width="34" height="43" x="3.5" y="4.5" rx="7" />
          <path stroke="currentColor" strokeWidth="3" strokeLinecap="round" d="M12.5 9V3m8 6V3m8 6V3" />
          <rect width="23" height="19" x="9" y="22" fill="var(--color-print)" rx="4" />
          <rect width="6" height="22" x="49" y="5" fill="var(--color-print)" rx="3" />
          <path
            fill="var(--catalog-icon-fill)"
            stroke="currentColor"
            strokeWidth="3"
            d="M52 4.5a4.233 4.233 0 0 0-4.229 4.426l1.546 33.94a2.75 2.75 0 0 0 2.706 2.626 2.623 2.623 0 0 0 2.66-2.504l1.546-34.062A4.234 4.234 0 0 0 52 4.5Z"
          />
          <path stroke="currentColor" strokeWidth="1.5" d="M52 48.067v-2M44.6 22.5 43.96 9.514" />
        </svg>
      );
    case "home":
      return (
        <svg className={iconClassName} viewBox="0 0 60 50" fill="none" preserveAspectRatio="xMinYMid meet" aria-hidden="true" style={sharedStyle}>
          <path stroke="currentColor" strokeWidth="3" strokeLinecap="round" d="M38 13h18M7 31h28.58M1.46 13h4" />
          <path
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M39.2 10.212Q36.148 14.252 37.4 34a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V13C6 7.477 10.477 3 16 3l24.384.03a9 9 0 0 1 8.992 9l.008 32.384a3 3 0 0 1-3 3H21a3 3 0 0 1-3-3V39"
          />
          <rect fill="var(--color-print)" x="12" y="10" width="19" height="16" rx="4" />
        </svg>
      );
    case "holiday":
      return (
        <svg className={iconClassName} viewBox="0 0 55 50" fill="none" preserveAspectRatio="xMinYMid meet" aria-hidden="true" style={sharedStyle}>
          <path
            stroke="currentColor"
            strokeWidth="3"
            d="M15.473 44.844c7.177 5.408 23.235-.072 31.446-10.969 7.461-9.9 5.904-21.609-2.26-27.761-7.64-5.756-18.795-3.042-26.6 7.316C9.681 24.55 8.45 39.552 15.473 44.844Z"
          />
          <path
            fill="var(--color-print)"
            d="M19.47 27.115c-3.004-4.808 1.177-12.908 7.965-17.15s13.613-3.019 16.617 1.79c3.005 4.808 2.108 11.966-4.68 16.208s-16.897 3.96-19.901-.848"
          />
          <path stroke="currentColor" strokeWidth="3" d="M13.256 44.921c-5.73 5.808-10.58.718-7.827-5.807 1.99-4.72 4.096-17.03-3.603-11.311" />
        </svg>
      );
    case "compas":
      return (
        <svg className={iconClassName} viewBox="0 0 50 50" fill="none" preserveAspectRatio="xMinYMid meet" aria-hidden="true" style={sharedStyle}>
          <circle cx="25" cy="25" r="23.5" stroke="currentColor" strokeWidth="3" />
          <path
            fill="var(--color-print)"
            d="M34.16 11.602c4.268 2.924 7.068 7.834 7.068 13.398 0 8.963-7.265 16.228-16.228 16.228-2.539 0-4.942-.583-7.082-1.622L31.062 28.5ZM25 8.772c2.573 0 5.006.598 7.167 1.664L18.937 21.5l-2.963 16.989C11.631 35.577 8.772 30.622 8.772 25c0-8.963 7.265-16.228 16.228-16.228"
          />
          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M34.5 8.546 18.938 21.5 15.5 41.454 31.062 28.5z" />
          <path fill="currentColor" d="m30.161 16.29-8.108 6.75 6.317 3.646z" />
        </svg>
      );
    case "awards":
      return (
        <svg className={iconClassName} viewBox="0 0 50 50" fill="none" preserveAspectRatio="xMinYMid meet" aria-hidden="true" style={sharedStyle}>
          <path stroke="currentColor" strokeWidth="3" d="M12 40.5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h24a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5z" />
          <path
            fill="var(--catalog-icon-fill)"
            stroke="currentColor"
            strokeWidth="3"
            d="M35.5 1.5h-23V18c0 6.351 5.149 11.5 11.5 11.5S35.5 24.351 35.5 18z"
          />
          <path stroke="currentColor" strokeWidth="3" d="M21.5 30v10M26.5 30v10M11 3.5H3.5V12q0 8 9.5 8.5M37 3.5h7.5V12q0 8-9.5 8.5" />
          <path fill="var(--color-print)" d="M19.95 7h8.1a3 3 0 0 1 2.996 3.15l-.374 7.502a6.68 6.68 0 0 1-13.344 0l-.374-7.503A3 3 0 0 1 19.95 7" />
        </svg>
      );
    case "tree":
      return (
        <svg className={iconClassName} viewBox="0 0 50 50" fill="none" preserveAspectRatio="xMinYMid meet" aria-hidden="true" style={sharedStyle}>
          <path
            fill="var(--catalog-icon-fill)"
            stroke="currentColor"
            strokeWidth="3"
            d="M15.887 33.5H9l10.667-15H14l11-16 11 16h-5.667L41 33.5h-6.887L46 48.5H4z"
          />
          <path fill="var(--color-print)" d="m21 15 4-6 4 6zm-3 14 7-10 7 10zm-5 15 12-12 12 12z" />
        </svg>
      );
    case "promo":
      return (
        <svg className={iconClassName} viewBox="0 0 80 50" fill="none" preserveAspectRatio="xMinYMid meet" aria-hidden="true" style={sharedStyle}>
          <path
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            d="M53.33 8.474a3.5 3.5 0 0 0-4.521-2.013L3.997 23.662a3.5 3.5 0 0 0-2.013 4.522l6.809 17.738a3.5 3.5 0 0 0 4.521 2.013l44.812-17.201a3.5 3.5 0 0 0 2.014-4.522zM59.644 15.155a9.5 9.5 0 1 0 17.738-6.809 9.5 9.5 0 0 0-17.738 6.81ZM61.69 14.905l-3.734 1.434z"
          />
          <path
            fill="var(--color-print)"
            d="m48.711 17.816 1.792 4.668a4 4 0 0 1-2.3 5.168l-29.84 11.454a4 4 0 0 1-5.168-2.3l-1.792-4.668a4 4 0 0 1 2.301-5.168l29.84-11.455a4 4 0 0 1 5.167 2.301"
          />
        </svg>
      );
    case "111":
      return (
        <svg className={iconClassName} viewBox="0 0 60 50" fill="none" preserveAspectRatio="xMinYMid meet" aria-hidden="true" style={sharedStyle}>
          <path
            fill="transparent"
            stroke="currentColor"
            strokeWidth="3"
            d="m51.822 10.66-8.466 6.103c2.678 0 3.371.638 2.987 2.085-1.458 5.385-7.932 29.616-7.932 29.616h7.747L56.5 10.603l-4.678.057Zm-17.702.003-8.47 6.104c2.678 0 3.376.634 2.99 2.08-1.456 5.386-7.932 29.617-7.932 29.617h7.742L38.8 10.6l-4.68.063Zm-17.706-.003-8.472 6.103c2.679 0 3.374.638 2.986 2.085C9.477 24.233 3 48.464 3 48.464h7.745l10.341-37.861-4.672.057Z"
          />
          <path
            fill="var(--color-print)"
            d="M18.28 12.854A7865 7865 0 0 0 8.68 46.038H6.147q2.57-11.377 7.781-30.12c.284-1.021 2.19-3.064 4.352-3.064m17.537 0a7865 7865 0 0 0-9.602 33.184h-2.532q2.57-11.377 7.782-30.12c.284-1.021 2.19-3.064 4.352-3.064m17.536 0a7865 7865 0 0 0-9.601 33.184H41.22q2.57-11.377 7.781-30.12c.284-1.021 2.19-3.064 4.352-3.064"
          />
        </svg>
      );
    case "box":
      return (
        <svg className={iconClassName} viewBox="0 0 60 50" fill="none" preserveAspectRatio="xMinYMid meet" aria-hidden="true" style={sharedStyle}>
          <path
            fill="var(--catalog-icon-fill)"
            stroke="currentColor"
            strokeWidth="3"
            d="M8.5 17.5V44a3.5 3.5 0 0 0 3.5 3.5h36a3.5 3.5 0 0 0 3.5-3.5V17.5z"
          />
          <rect fill="var(--catalog-icon-fill)" stroke="currentColor" strokeWidth="3" x="4.5" y="5.5" width="51" height="12" rx="2" />
          <rect fill="var(--color-print)" x="16" y="23" width="28" height="14" rx="4" />
        </svg>
      );
    case "eat":
      return (
        <svg className={iconClassName} viewBox="0 0 70 50" fill="none" preserveAspectRatio="xMinYMid meet" aria-hidden="true" style={sharedStyle}>
          <path
            fill="var(--color-print)"
            d="M16.531 25.246H27.47a6 6 0 0 1 5.38 3.346q1.42 2.876 1.42 5.58 0 2.47-1.184 4.796a6 6 0 0 1-5.348 3.278H16.263a6 6 0 0 1-5.348-3.279q-1.183-2.326-1.183-4.796 0-2.703 1.418-5.58a6 6 0 0 1 5.381-3.345"
          />
          <path
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="square"
            d="m6 17 1.47 1.102a4 4 0 0 0 4.96-.127l1.01-.841a4 4 0 0 1 5.12 0l.88.732a4 4 0 0 0 5.12 0l.88-.732a4 4 0 0 1 5.12 0l1.01.84a4 4 0 0 0 4.96.128L38 17"
          />
          <path
            fill="var(--catalog-icon-fill)"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            d="M63 24.5v1.757a4.5 4.5 0 0 0 1.318 3.182l.371.372c.52.519.811 1.223.811 1.957V45c0 .966-.392 1.841-1.025 2.475A3.5 3.5 0 0 1 62 48.5h-10a3.5 3.5 0 0 1-2.475-1.025A3.5 3.5 0 0 1 48.5 45V31.768c0-.734.292-1.438.81-1.957l.372-.372A4.5 4.5 0 0 0 51 26.257V24.5zm0-5c.69 0 1.315.28 1.768.732.452.453.732 1.078.732 1.768s-.28 1.315-.732 1.768A2.5 2.5 0 0 1 63 24.5h-12c-.69 0-1.315-.28-1.768-.732A2.5 2.5 0 0 1 48.5 22c0-.69.28-1.315.732-1.768A2.5 2.5 0 0 1 51 19.5Z"
          />
          <path fill="var(--color-print)" d="M56 29h2a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3" />
          <path
            fill="var(--catalog-icon-fill)"
            stroke="currentColor"
            strokeWidth="3"
            d="m35.197 8.5 4.772 7.158-1.632 1.24C40.423 23.563 41.5 28.262 41.5 31c0 5.265-1.31 10.312-3.922 15.14a4.5 4.5 0 0 1-3.958 2.36H10.38a4.5 4.5 0 0 1-3.958-2.36Q2.502 38.898 2.5 31c0-2.73 1.071-7.415 3.147-14.057L4.02 15.674 8.803 8.5zm-1.556-7.001c1.146 0 2.216.397 3.06 1.074a4.9 4.9 0 0 1 1.717 2.753c.163.727.04 1.435-.306 2a2.44 2.44 0 0 1-1.56 1.112 2.5 2.5 0 0 1-.545.06H7.993c-.69 0-1.316-.28-1.768-.732a2.49 2.49 0 0 1-.672-2.313 5.1 5.1 0 0 1 1.739-2.861 4.83 4.83 0 0 1 3.067-1.093Z"
          />
        </svg>
      );
    case "sport":
      return (
        <svg className={iconClassName} viewBox="0 0 50 50" fill="none" preserveAspectRatio="xMinYMid meet" aria-hidden="true" style={sharedStyle}>
          <path
            stroke="currentColor"
            d="m8.831 34.184 9.176 1.325 3.823 8.248-4.675 2.743-9.35-6.937zm33.227 0 1.036 4.392-10.097 7.539-3.978-2.509 3.978-8.239zM25.27 16.76l8.633 6.077-3.332 9.76H20.199l-3.044-9.76zm14.029-4.506 4.894.41 3.201 12.015q-2.974 2.586-3.201 2.735-.228.15-6.696-6.298zm-27.7 0q1.951 8.751 1.709 8.898-.243.147-6.679 6.265l-4.021-3.132 3.382-11.396zM31.953 3.5q1.447 4.2 1.425 4.377-.021.176-8.109 4.376l-7.752-4.56L19.239 3.5Z"
            fill="var(--color-print)"
          />
          <circle stroke="currentColor" strokeWidth="3" fill="var(--catalog-icon-fill)" cx="25" cy="25" r="23.5" />
        </svg>
      );
    case "label":
      return (
        <svg className={iconClassName} viewBox="0 0 50 50" fill="none" preserveAspectRatio="xMinYMid meet" aria-hidden="true" style={sharedStyle}>
          <path
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            d="m19.069 47.704-16.65-16.65a2 2 0 0 1 0-2.829l24.49-24.501a2 2 0 0 1 1.282-.582L44.896 2.03a3 3 0 0 1 3.193 3.192l-1.114 16.705a2 2 0 0 1-.581 1.281L21.897 47.704a2 2 0 0 1-2.828 0Z"
          />
          <circle stroke="currentColor" strokeWidth="3" cx="37.183" cy="12.934" r="3.936" transform="rotate(-135 37.183 12.934)" />
          <rect width="18.05" height="24.666" x="13.456" y="15.435" fill="var(--color-print)" rx="4" transform="rotate(45 22.481 27.768)" />
        </svg>
      );
    case "unikum":
      return (
        <svg className={iconClassName} viewBox="0 0 60 50" fill="none" preserveAspectRatio="xMinYMid meet" aria-hidden="true" style={sharedStyle}>
          <path stroke="currentColor" strokeWidth="3" fill="var(--catalog-icon-fill)" d="M9.94 5h39.803l5.256 8.747-19.431 34.176H24.472L5 13.747z" />
          <path fill="var(--color-print)" d="M53.073 13.892H25.116l5.339 6.556-5.462 8.742L10.868 6.492h37.965z" />
          <path fill="var(--color-print-second)" d="m10.942 6.682 14.077 22.499 5.546-8.736 10.225-.062-15.4 26.34L6.835 13.855z" />
        </svg>
      );
    default:
      return null;
  }
}

export function CatalogProductsCategories({ items }: CatalogProductsCategoriesProps) {
  const [expandedMobileCategoryIds, setExpandedMobileCategoryIds] = useState<string[]>([]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mt-[35px] md:mt-[45px] md:mb-[45px]">
      <PageSubheading title="Мерч и корпоративные подарки" />

      <div className="mt-6 grid grid-cols-1 items-stretch md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
        {items.map((category) => {
          const isExpandedMobile = expandedMobileCategoryIds.includes(category.id);

          return (
            <div key={category.id} className="group relative z-0 h-full overflow-visible md:hover:z-28">
              <div aria-hidden="true" className="pointer-events-none hidden md:block md:invisible">
                <div className="px-5 py-5 xl:px-6 xl:py-6">
                  <div className="h-[54px] w-[108px]" />
                  <div className="mt-4 h-[52px] w-full max-w-[160px]" />
                  <div className="mt-5 space-y-2">
                    <div className="h-7 w-full rounded-[9px]" />
                    <div className="h-7 w-[88%] rounded-[9px]" />
                    <div className="h-7 w-[76%] rounded-[9px]" />
                  </div>
                </div>
              </div>

              <article className="flex flex-col transition-[width,transform] duration-200 md:absolute md:left-0 md:top-0 md:h-full md:w-full md:overflow-visible md:group-hover:z-20 md:group-hover:h-auto md:group-hover:w-max">
                <div className="relative flex h-full min-h-0 flex-col rounded-[22px] bg-transparent px-0 py-0 transition-[background-color,box-shadow,height,width] duration-200 md:min-w-full md:px-5 md:py-5 xl:px-6 xl:py-6 md:group-hover:h-auto md:group-hover:min-h-full md:group-hover:bg-white md:group-hover:shadow-[0_24px_60px_rgba(42,42,42,0.16)]">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedMobileCategoryIds((currentIds) =>
                        currentIds.includes(category.id) ? currentIds.filter((id) => id !== category.id) : [...currentIds, category.id],
                      )
                    }
                    className="flex w-full items-center justify-between gap-3 py-2 text-left md:hidden"
                    aria-expanded={isExpandedMobile}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative shrink-0">
                        <CatalogCategoryIcon iconId={category.iconId} />
                      </div>

                      <h3 className="overflow-hidden text-base font-medium leading-[1.25] tracking-[-0.03em] text-[var(--heading)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1] md:text-xl md:leading-[1.15]">
                        <Link
                          href={category.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-[var(--accent)]"
                          onClick={(event) => {
                            event.stopPropagation();
                          }}
                        >
                          {category.title}
                        </Link>
                      </h3>
                    </div>

                    <span className="relative mt-0.5 block h-4 w-4 shrink-0 text-[var(--field-border)]">
                      <span className="absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 rounded-full bg-current" />
                      <span
                        className="absolute left-1/2 top-0 h-4 w-[1.5px] -translate-x-1/2 rounded-full bg-current transition-transform duration-200"
                        style={{ transform: `translateX(-50%) scaleY(${isExpandedMobile ? 0 : 1})` }}
                      />
                    </span>
                  </button>

                  <div className="hidden md:block">
                    <div className="relative shrink-0">
                      <CatalogCategoryIcon iconId={category.iconId} />
                    </div>

                    <h3 className="mt-4 overflow-hidden text-xl font-medium leading-[1.15] tracking-[-0.03em] text-[var(--heading)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1] md:group-hover:block md:group-hover:overflow-visible md:group-hover:[-webkit-line-clamp:unset]">
                      <Link href={category.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--accent)]">
                        {category.title}
                      </Link>
                    </h3>
                  </div>

                  <div
                    className={[
                      "-ml-3 flex-col items-start gap-2 md:mt-5 md:mb-0 md:flex md:max-h-none md:overflow-visible md:opacity-100",
                      isExpandedMobile ? "mt-4 mb-4 flex" : "hidden",
                    ].join(" ")}
                  >
                    {category.subcategories.map((subcategory, index) => (
                      <Link
                        key={subcategory.id}
                        href={subcategory.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={[
                          "max-w-full rounded-[9px] px-3 py-[7px] text-base leading-[1.25] tracking-[-0.03em] text-[var(--heading)] transition-[background-color,color,box-shadow,max-width] duration-150 md:group-hover:max-w-none",
                          "hover:bg-[var(--card-bg)]",
                          index >= 3 ? "inline-flex md:hidden md:group-hover:inline-flex" : "inline-flex",
                        ].join(" ")}
                        title={subcategory.title}
                      >
                        <span className="truncate md:group-hover:whitespace-normal md:group-hover:overflow-visible md:group-hover:text-clip">
                          {subcategory.title}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-28 rounded-b-[22px] bg-linear-to-b from-transparent from-[0%] via-[rgba(245,244,239,1)] via-[30%] to-[rgba(245,244,239,0.5)] to-[100%] opacity-100 transition-opacity duration-200 md:block md:group-hover:opacity-0"
                  />
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
