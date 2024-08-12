import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {

  return (
    <div className="p-8 flex items-center gap-2 shadow-md">
      <h2 className="text-xl font-bold">🔥Chat</h2>
      <ThemeSwitch />
    </div>
  );
};
