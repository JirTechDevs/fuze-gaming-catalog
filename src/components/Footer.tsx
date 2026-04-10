const Footer = () => (
  <footer className="border-t border-border/20 bg-background py-10">
    <div className="container mx-auto flex flex-col items-center gap-3 px-4 text-center">
      <img src="/images/logo.png" alt="Fuzevalo" className="h-7 w-7 opacity-40" />
      <p className="font-display text-[10px] tracking-[0.3em] text-muted-foreground/40">
        © 2026 FUZEVALO — ALL RIGHTS RESERVED
      </p>
      <p className="text-[10px] text-muted-foreground/25">
        Not affiliated with Riot Games.
      </p>
    </div>
  </footer>
);

export default Footer;
