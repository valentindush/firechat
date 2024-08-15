import { Timestamp } from "firebase/firestore";
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

export interface IMessage{
  id: string
  text: string
  sender: string
  receiver: string
  chatId: string
  timestamp: Timestamp,
  fileUrls?: string[]
  audioUrl?: string
}