interface FooterProps {
  compact?: boolean;
}

export default function Footer({ compact = false }: FooterProps) {
  return (
    <footer className={`border-t border-border/20 bg-background ${compact ? "py-5 sm:py-6" : "py-8 sm:py-10"}`}>
      <div className={`container mx-auto flex flex-col items-center px-4 text-center ${compact ? "gap-2" : "gap-3 sm:gap-4"}`}>
        <img
          src="/images/logo.png"
          alt="Fuzevalo"
          className={`${compact ? "h-6 w-6" : "h-7 w-7 sm:h-8 sm:w-8"} opacity-40`}
        />
        <p className="font-display text-[9px] tracking-[0.24em] text-muted-foreground/40 sm:text-[10px] sm:tracking-[0.3em]">
          © 2026 FUZEVALO — ALL RIGHTS RESERVED
        </p>
        <p className="max-w-xs text-[10px] leading-5 text-muted-foreground/25 sm:max-w-none">
          Not affiliated with Riot Games.
        </p>
      </div>
    </footer>
  );
}
