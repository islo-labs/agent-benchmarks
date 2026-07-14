export function GraderFooter() {
  return (
    <footer className="mx-auto w-full max-w-4xl px-6 pb-10 pt-8">
      <a
        href="https://islo.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2.5 text-sm text-ink-4 transition-opacity hover:opacity-80"
      >
        <img src={`${import.meta.env.BASE_URL}islo-logo.png`} alt="" className="h-6 w-6 shrink-0" aria-hidden="true" />
        <span>
          Built by <span className="font-semibold text-ink">islo</span>
        </span>
      </a>
    </footer>
  )
}
