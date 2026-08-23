<footer className="relative z-10 mt-auto mb-16 md:mb-0 overflow-hidden border-t border-white/[0.08] bg-[#07100c]/60 px-5 py-5 backdrop-blur-xl">
  {/* Subtle green glow */}
  <div className="pointer-events-none absolute -top-20 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-green-500/10 blur-3xl" />

  <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
    
    {/* Copyright */}
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <Leaf
        size={14}
        className="text-green-500/70"
      />

      <span>
        © 2026 <span className="font-medium text-gray-400">VerdantX</span>.
        All rights reserved.
      </span>
    </div>

    {/* Made with */}
    <div className="flex items-center gap-1.5 text-xs text-gray-500">
      <span>Made with</span>

      <span
        className="inline-flex animate-pulse text-red-500"
        aria-label="love"
      >
        ❤
      </span>

      <span>for the</span>

      <span className="font-medium text-green-400">
        VerdantX Team
      </span>

      <span className="text-base">🌱</span>
    </div>

  </div>

  {/* Bottom accent line */}
  <div className="absolute bottom-0 left-1/2 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
</footer>