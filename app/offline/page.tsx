import Link from 'next/link'

export const metadata = { title: 'Sem conexão' }

export default function OfflinePage() {
  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen px-8 text-center gap-4 text-white"
      style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 60%, #4F46E5 100%)' }}
    >
      <img src="/icons/icon-128.png" alt="" className="w-20 h-20 rounded-3xl mb-2" />

      <h1 className="text-2xl font-extrabold">Você está sem internet</h1>
      <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
        As páginas que você já visitou continuam disponíveis. Assim que a conexão voltar,
        tudo volta a sincronizar sozinho.
      </p>

      <blockquote className="mt-4 rounded-2xl px-5 py-4 max-w-xs"
        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
        <p className="text-sm italic leading-relaxed">
          &ldquo;Aquietai-vos e sabei que eu sou Deus.&rdquo;
        </p>
        <cite className="text-xs font-bold not-italic" style={{ color: 'var(--gold)' }}>Salmos 46:10</cite>
      </blockquote>

      <Link
        href="/dashboard"
        className="mt-4 px-6 py-3 rounded-xl bg-surface text-sm font-bold"
        style={{ color: 'var(--accent)' }}
      >
        Tentar novamente
      </Link>
    </main>
  )
}
