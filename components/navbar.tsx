import {
  Navbar as NextUINavbar,
} from "@nextui-org/navbar";

import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <ThemeSwitch />
    </NextUINavbar>
  );
};
