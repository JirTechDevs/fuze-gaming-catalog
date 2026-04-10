const Footer = () => (
  <footer className="border-t border-border/30 bg-background py-8">
    <div className="container mx-auto flex flex-col items-center gap-2 px-4 text-center">
      <img src="/images/logo.png" alt="Fuzevalo" className="h-8 w-8 opacity-60" />
      <p className="font-display text-xs tracking-widest text-muted-foreground">
        © 2026 FUZEVALO — ALL RIGHTS RESERVED
      </p>
      <p className="text-xs text-muted-foreground/60">
        This is not affiliated with Riot Games.
      </p>
    </div>
  </footer>
);

export default Footer;
