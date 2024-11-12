import { ComponentType } from "react";
import { IconProps } from "@radix-ui/react-icons/dist/types";

/**
 * Interface for a sidebar item.
 */
export interface SidebarItem {
  text: string;
  icon: ComponentType<IconProps & React.RefAttributes<SVGSVGElement>>;
  path: string;
}
