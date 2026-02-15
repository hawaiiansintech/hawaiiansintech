import { cn } from "@/lib/utils";
import React, { ReactElement } from "react";

export enum IconColor {
  Brand = "var(--color-brand)",
  Black = "var(--color-text-alt)",
  Inherit = "inherit",
}

export enum IconSize {
  Small = "small",
  Default = "default",
  Large = "large",
}

export enum IconAsset {
  Cap = "cap",
  CaretLeft = "caret-left",
  CaretRight = "caret-right",
  Network = "network",
  ArrowRight = "arrow-right",
  Close = "close",
}

interface IconProps {
  asset: IconAsset;
  color?: IconColor;
  size?: IconSize;
  alpha?: boolean;
}

export function Icon({
  alpha,
  asset,
  color = IconColor.Black,
  size = IconSize.Default,
}: IconProps) {
  const getAsset = (): ReactElement => {
    switch (asset) {
      case IconAsset.CaretLeft:
        return (
          <path
            className={getBaseClassNames()}
            d="M26.768 9.914a1.5 1.5 0 1 0-2.122-2.121l2.122 2.121Zm-2.122 22.293a1.5 1.5 0 1 0 2.122-2.121l-2.122 2.121Zm0-24.414-9.732 9.732 2.121 2.121 9.733-9.732-2.122-2.121Zm2.122 22.293-9.733-9.732-2.12 2.12 9.731 9.733 2.122-2.121Zm-11.854-12.56a3.5 3.5 0 0 0 0 4.949l2.121-2.122a.5.5 0 0 1 0-.707l-2.12-2.12Z"
          />
        );
      case IconAsset.CaretRight:
        return (
          <path
            className={getBaseClassNames()}
            d="M13.94 9.914a1.5 1.5 0 0 1 2.12-2.121l-2.12 2.121Zm2.12 22.293a1.5 1.5 0 0 1-2.12-2.121l2.12 2.121Zm0-24.414 9.733 9.732-2.121 2.121-9.733-9.732 2.122-2.121Zm-2.12 22.293 9.732-9.732 2.12 2.12-9.731 9.733-2.122-2.121Zm11.853-12.56a3.5 3.5 0 0 1 0 4.949l-2.121-2.122a.5.5 0 0 0 0-.707l2.12-2.12Z"
          />
        );
      case IconAsset.Cap:
        return (
          <>
            <g className={getAccentClassNames()}>
              <path d="M2 15a1 1 0 0 1 1-1h17a1 1 0 1 1 0 2H4v19a1 1 0 1 1-2 0V15Z" />
              <path d="m2.083 28.942 1.923-.551 1.804 6.293a1 1 0 1 1-1.922.551l-1.805-6.293Z" />
            </g>
            <path
              className={getBaseClassNames()}
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 25.451v-8.75H8v8.818c0 .642.328 1.239.87 1.584a20.732 20.732 0 0 0 22.26 0c.542-.345.87-.942.87-1.584V16.7h-2v8.751a18.733 18.733 0 0 1-20 0Z"
            />
            <path
              className={getBaseClassNames()}
              fillRule="evenodd"
              clipRule="evenodd"
              d="M33.946 15 20.66 10.35a2 2 0 0 0-1.322 0L6.054 15l13.285 4.65a2 2 0 0 0 1.322 0L33.946 15ZM21.32 8.463a4 4 0 0 0-2.642 0L2.697 14.057c-.893.312-.893 1.575 0 1.887l15.982 5.594a4 4 0 0 0 2.642 0l15.982-5.594c.893-.312.893-1.575 0-1.888L21.321 8.463Z"
            />
          </>
        );
      case IconAsset.Network:
        return (
          <>
            <g className={getAccentClassNames()}>
              <path d="m24.2 14.387 7.093-7.094 1.414 1.414-7.094 7.094-1.414-1.414ZM7.387 31.2l7.093-7.095 1.415 1.415L8.8 32.613 7.387 31.2ZM11.145 9.73l4.875 4.876-1.415 1.414-4.875-4.875 1.415-1.414ZM25.582 24.168l4.688 4.688-1.415 1.414-4.687-4.688 1.414-1.414ZM27 19h6v2h-6v-2Z" />
            </g>
            <path
              className={getBaseClassNames()}
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20 26a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 2a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM35 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm0 2a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM31 32a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm0 2a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM9 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm0 2a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM34 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 2a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM6 36a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 2a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
            />
          </>
        );
      case IconAsset.ArrowRight:
        return (
          <>
            <g className={getAccentClassNames()}>
              <path d="m29 20.143-1.414 1.414L17.15 11.122a1 1 0 1 1 1.414-1.414L29 20.143Z" />
              <path d="M29 20.143 18.565 30.578a1 1 0 1 1-1.414-1.414l10.435-10.436L29 20.143Z" />
            </g>
          </>
        );
      case IconAsset.Close:
        return (
          <g className={getAccentClassNames()}>
            <path d="M12.707 13.707a1 1 0 0 1 1.414-1.414l13.435 13.435a1 1 0 1 1-1.414 1.414L12.707 13.707Z" />
            <path d="M27.556 13.708a1 1 0 0 0-1.414-1.414L12.707 25.729a1 1 0 0 0 1.414 1.414l13.435-13.435Z" />
          </g>
        );
    }
  };

  const getSize = (): "30" | "40" | "50" => {
    switch (size) {
      case IconSize.Large:
        return "50";
      case IconSize.Small:
        return "30";
      case IconSize.Default:
      default:
        return "40";
    }
  };

  const getBaseClassNames = () => {
    if (color === IconColor.Inherit) {
      return "fill-current";
    }
    return "fill-[var(--color-text-alt)]";
  };

  const getAccentClassNames = () => {
    const baseClasses = "fill-[var(--color-text-alt)]";
    const brandClasses =
      color === IconColor.Brand ? "fill-[var(--color-brand)]" : "";
    const alphaClasses = alpha ? "opacity-50" : "";

    return cn(baseClasses, brandClasses, alphaClasses);
  };

  return (
    <svg
      width={getSize()}
      height={getSize()}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {getAsset()}
    </svg>
  );
}
