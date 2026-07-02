import { Nav } from "@/components/nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-100">
      <Nav />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
