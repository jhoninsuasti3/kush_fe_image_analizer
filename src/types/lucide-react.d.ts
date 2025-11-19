// Type overrides for lucide-react to fix module resolution issues
declare module 'lucide-react' {
  import { ForwardRefExoticComponent, SVGProps } from 'react';

  export interface LucideProps extends Partial<Omit<SVGProps<SVGSVGElement>, 'ref'>> {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  }

  export type LucideIcon = ForwardRefExoticComponent<LucideProps>;

  // Export all the icons we use
  export const CircleAlert: LucideIcon;
  export const CircleCheck: LucideIcon;
  export const Info: LucideIcon;
  export const Loader: LucideIcon;
  export const Loader2: LucideIcon;
  export const LoaderCircle: LucideIcon;
  export const OctagonX: LucideIcon;
  export const RefreshCcw: LucideIcon;
  export const Sparkles: LucideIcon;
  export const TriangleAlert: LucideIcon;
}
export const CheckCircle2: LucideIcon;
export const Upload: LucideIcon;
export const X: LucideIcon;
export const Image: LucideIcon;
