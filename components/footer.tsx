export function Footer() {
  return (
    <footer className="py-8 border-t">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Jonathan Franco. Desenvolvido com Next.js
          e Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
