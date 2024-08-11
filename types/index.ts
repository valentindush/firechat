import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};


export interface IUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoUrl: string | null;
}