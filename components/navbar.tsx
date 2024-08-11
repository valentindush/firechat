import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {

  return (
    <div className="px-8 pt-8 flex items-center gap-2">
      <h2 className="text-xl font-bold">Chat</h2>
      <ThemeSwitch />
    </div>
  );
};
