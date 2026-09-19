import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CreativeNav } from "./creative-nav";

type CreativeShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function CreativeShell({ children, className }: CreativeShellProps) {
  return (
    <>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <SiteHeader />
      <CreativeNav />
      <main className={["creative-main", className].filter(Boolean).join(" ")} id="main-content">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
