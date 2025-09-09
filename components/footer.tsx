"use client";

export function Footer() {
  return (
    <footer className="border-t border-rule py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 md:flex-row md:items-center md:justify-between md:px-10">
        <p className="mono-label text-muted-foreground">
          © {new Date().getFullYear()} Jonathan Franco
        </p>
        <p className="mono-label text-muted-foreground">
          Next.js · Tailwind CSS · three.js
        </p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="link-draw mono-label self-start text-foreground md:self-auto"
        >
          Voltar ao topo ↑
        </button>
      </div>
    </footer>
  );
}
