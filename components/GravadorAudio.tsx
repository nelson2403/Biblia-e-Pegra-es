'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Mic, Square, Loader2, Upload, X, Trash2, Pause, Play } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

/** Duração máxima por gravação — mantém o arquivo dentro do limite de envio. */
const MAX_SEGUNDOS = 10 * 60
const MAX_BYTES = 4 * 1024 * 1024

/** Escolhe um formato que o navegador grave e que o Whisper aceite. */
function escolherMime(): string {
  if (typeof MediaRecorder === 'undefined') return ''
  const candidatos = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ]
  return candidatos.find(m => MediaRecorder.isTypeSupported(m)) ?? ''
}

function formatarTempo(s: number) {
  const m = Math.floor(s / 60)
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

interface Props {
  /** Recebe o texto transcrito para inserir na anotação. */
  onTranscrito: (texto: string) => void
}

type Fase = 'ocioso' | 'gravando' | 'pausado' | 'transcrevendo'

export function GravadorAudio({ onTranscrito }: Props) {
  const { session } = useAuth()
  const [aberto, setAberto] = useState(false)
  const [fase, setFase] = useState<Fase>('ocioso')
  const [segundos, setSegundos] = useState(0)
  const [nivel, setNivel] = useState(0)
  const [erro, setErro] = useState<string | null>(null)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const pedacosRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const rafRef = useRef<number | null>(null)
  const segundosRef = useRef(0)
  // Um "stop" pode ser para transcrever ou para descartar — o handler precisa saber.
  const descartarRef = useRef(false)

  const limpar = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    audioCtxRef.current?.close().catch(() => {})
    audioCtxRef.current = null
    recorderRef.current = null
    setNivel(0)
  }, [])

  useEffect(() => () => limpar(), [limpar])

  const transcrever = useCallback(
    async (blob: Blob, nomeArquivo: string) => {
      const token = session?.access_token
      if (!token) { setErro('Sessão expirada. Entre novamente.'); setFase('ocioso'); return }

      if (blob.size === 0) { setErro('A gravação ficou vazia. Tente de novo.'); setFase('ocioso'); return }
      if (blob.size > MAX_BYTES) {
        setErro('Áudio muito grande. Grave trechos menores (até 10 minutos).')
        setFase('ocioso')
        return
      }

      setFase('transcrevendo')
      setErro(null)
      try {
        const form = new FormData()
        form.append('audio', blob, nomeArquivo)
        form.append('nome', nomeArquivo)

        const res = await fetch('/api/transcrever', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error ?? 'Erro ao transcrever.')

        onTranscrito(data.texto)
        setAberto(false)
      } catch (e: any) {
        setErro(e?.message ?? 'Não foi possível transcrever o áudio.')
      } finally {
        setFase('ocioso')
        setSegundos(0)
      }
    },
    [session, onTranscrito]
  )

  const pararGravacao = useCallback((descartar = false) => {
    descartarRef.current = descartar
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop()
    }
  }, [])

  const iniciar = useCallback(async () => {
    setErro(null)

    if (typeof MediaRecorder === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setErro('Seu navegador não permite gravar áudio. Tente pelo Chrome.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      })
      streamRef.current = stream

      const mime = escolherMime()
      const rec = new MediaRecorder(stream, {
        ...(mime ? { mimeType: mime } : {}),
        audioBitsPerSecond: 32000,
      })
      recorderRef.current = rec
      pedacosRef.current = []
      descartarRef.current = false

      rec.ondataavailable = e => { if (e.data.size > 0) pedacosRef.current.push(e.data) }
      rec.onstop = () => {
        const pedacos = pedacosRef.current
        limpar()
        if (descartarRef.current) { setFase('ocioso'); setSegundos(0); return }
        const tipo = mime || 'audio/webm'
        const extensao = tipo.includes('mp4') ? 'm4a' : tipo.includes('ogg') ? 'ogg' : 'webm'
        transcrever(new Blob(pedacos, { type: tipo }), `anotacao.${extensao}`)
      }

      rec.start(1000)
      setFase('gravando')
      setSegundos(0)
      segundosRef.current = 0

      timerRef.current = setInterval(() => {
        segundosRef.current += 1
        setSegundos(segundosRef.current)
        // No limite, encerra sozinho e transcreve o que já foi gravado.
        if (segundosRef.current >= MAX_SEGUNDOS) pararGravacao(false)
      }, 1000)

      // Medidor de volume — dá o retorno visual de que o microfone está captando.
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioCtxRef.current = ctx
      const analisador = ctx.createAnalyser()
      analisador.fftSize = 256
      ctx.createMediaStreamSource(stream).connect(analisador)
      const dados = new Uint8Array(analisador.frequencyBinCount)

      const medir = () => {
        analisador.getByteFrequencyData(dados)
        const media = dados.reduce((a, b) => a + b, 0) / dados.length
        setNivel(Math.min(1, media / 90))
        rafRef.current = requestAnimationFrame(medir)
      }
      medir()
    } catch (e: any) {
      limpar()
      setErro(
        e?.name === 'NotAllowedError'
          ? 'Permissão do microfone negada. Libere o microfone para este site.'
          : 'Não foi possível acessar o microfone.'
      )
    }
  }, [limpar, transcrever, pararGravacao])

  const alternarPausa = () => {
    const rec = recorderRef.current
    if (!rec) return
    if (rec.state === 'recording') {
      rec.pause()
      setFase('pausado')
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    } else if (rec.state === 'paused') {
      rec.resume()
      setFase('gravando')
      timerRef.current = setInterval(() => {
        segundosRef.current += 1
        setSegundos(segundosRef.current)
        if (segundosRef.current >= MAX_SEGUNDOS) pararGravacao(false)
      }, 1000)
    }
  }

  const enviarArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0]
    e.target.value = ''
    if (!arquivo) return
    transcrever(arquivo, arquivo.name)
  }

  const fechar = () => {
    if (fase === 'gravando' || fase === 'pausado') pararGravacao(true)
    limpar()
    setFase('ocioso')
    setSegundos(0)
    setErro(null)
    setAberto(false)
  }

  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-label="Ditar anotação por voz"
        className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-colors"
        style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
      >
        <Mic size={17} aria-hidden="true" />
        Ditar por voz
      </button>
    )
  }

  const gravando = fase === 'gravando'
  const transcrevendo = fase === 'transcrevendo'

  return (
    <div className="rounded-2xl p-4 border-2" style={{ borderColor: 'var(--accent-soft)', backgroundColor: 'var(--surface-2)' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-extrabold text-conteudo">
          {transcrevendo ? 'Transcrevendo com IA...' : gravando ? 'Gravando' : fase === 'pausado' ? 'Pausado' : 'Ditar anotação'}
        </p>
        <button type="button" onClick={fechar} aria-label="Fechar gravador" className="p-1 text-conteudo-faint">
          <X size={18} />
        </button>
      </div>

      {transcrevendo ? (
        <div className="flex flex-col items-center gap-2 py-5">
          <Loader2 size={30} className="animate-spin" color="var(--accent)" aria-hidden="true" />
          <p className="text-sm text-conteudo-muted">Convertendo a sua voz em texto…</p>
          <p className="text-xs text-conteudo-faint">Pode levar alguns segundos.</p>
        </div>
      ) : fase === 'ocioso' ? (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-conteudo-muted leading-relaxed">
            Fale à vontade — a IA transcreve em português e o texto entra direto na anotação.
            Gravações de até 10 minutos.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={iniciar}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-bold text-sm active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
            >
              <Mic size={18} aria-hidden="true" /> Começar a gravar
            </button>
            <label
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm cursor-pointer"
              style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              <Upload size={17} aria-hidden="true" />
              <span className="sr-only">Enviar arquivo de áudio</span>
              <input type="file" accept="audio/*" onChange={enviarArquivo} className="hidden" />
            </label>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Medidor de volume */}
          <div className="flex items-center justify-center gap-1 h-12" aria-hidden="true">
            {Array.from({ length: 20 }).map((_, i) => {
              const centro = Math.abs(i - 9.5) / 9.5
              const altura = gravando ? Math.max(4, nivel * 44 * (1 - centro * 0.6)) : 4
              return (
                <span
                  key={i}
                  className="w-1.5 rounded-full transition-all duration-75"
                  style={{ height: altura, backgroundColor: gravando ? 'var(--accent)' : 'var(--accent-soft)' }}
                />
              )
            })}
          </div>

          <p className="text-center text-2xl font-extrabold tabular-nums text-conteudo" role="timer" aria-live="off">
            {formatarTempo(segundos)}
          </p>
          <p className="text-center text-xs text-conteudo-faint">
            máximo {formatarTempo(MAX_SEGUNDOS)}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => pararGravacao(true)}
              aria-label="Descartar gravação"
              className="px-4 py-3 rounded-2xl font-bold text-sm"
              style={{ backgroundColor: 'var(--danger-soft)', color: 'var(--danger)' }}
            >
              <Trash2 size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={alternarPausa}
              aria-label={gravando ? 'Pausar gravação' : 'Continuar gravação'}
              className="px-4 py-3 rounded-2xl font-bold text-sm"
              style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-muted)' }}
            >
              {gravando ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={() => pararGravacao(false)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-bold text-sm active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #059669, #10B981)' }}
            >
              <Square size={16} fill="#fff" aria-hidden="true" /> Concluir e transcrever
            </button>
          </div>
        </div>
      )}

      {erro && (
        <p role="alert" className="mt-3 text-xs font-semibold px-3 py-2 rounded-2xl"
          style={{ backgroundColor: 'var(--danger-soft)', color: 'var(--danger)' }}>
          {erro}
        </p>
      )}
    </div>
  )
}
