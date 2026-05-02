import Navbar from "@/components/Navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar variant="admin" />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-8">
        {children}
      </main>
    </>
  );
}
