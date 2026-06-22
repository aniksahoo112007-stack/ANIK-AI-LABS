import {
  Boxes,
  BrainCircuit,
  LayoutDashboard,
  Store,
  LineChart,
  Globe,
  Workflow,
  Cpu,
  Bot,
  Database,
  Code,
  Smartphone,
  BarChart3,
  Rocket,
  Sparkles,
  Wrench,
  Zap,
  Cloud,
  ShoppingCart,
  PenTool,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Boxes,
  BrainCircuit,
  LayoutDashboard,
  Store,
  LineChart,
  Globe,
  Workflow,
  Cpu,
  Bot,
  Database,
  Code,
  Smartphone,
  BarChart3,
  Rocket,
  Sparkles,
  Wrench,
  Zap,
  Cloud,
  ShoppingCart,
  PenTool,
};

export const ICON_NAMES = Object.keys(ICONS);

/**
 * Renders a Lucide icon by name, or falls back to rendering the string itself
 * (handy for emoji icons set in the admin panel).
 */
export default function DynamicIcon({
  name,
  size = 22,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Cmp = ICONS[name];
  if (Cmp) return <Cmp size={size} className={className} />;
  return (
    <span className={className} style={{ fontSize: size, lineHeight: 1 }}>
      {name}
    </span>
  );
}
