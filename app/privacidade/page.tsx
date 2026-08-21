import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Política de Privacidade',
  description: 'Como o Bíblia & Pregações trata os seus dados.',
}

const ATUALIZADO_EM = '5 de agosto de 2026'
const CONTATO = 'financeiropedradopombal@gmail.com'

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-extrabold text-conteudo mt-4">{titulo}</h2>
      <div className="flex flex-col gap-2 text-[15px] text-conteudo-muted leading-relaxed">
        {children}
      </div>
    </section>
  )
}

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-bg">
      <header className="px-5 pt-6 pb-4">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-primary mb-4">
          <ArrowLeft size={16} /> Voltar
        </Link>
        <h1 className="text-2xl font-extrabold text-conteudo">Política de Privacidade</h1>
        <p className="text-sm text-conteudo-muted mt-1">
          Bíblia &amp; Pregações · Atualizada em {ATUALIZADO_EM}
        </p>
      </header>

      <div className="px-5 py-6 max-w-2xl mx-auto pb-16">
        <p className="text-[15px] text-conteudo leading-relaxed">
          Esta política explica, em linguagem simples, quais dados o aplicativo Bíblia &amp; Pregações
          coleta, para que servem e o que você pode fazer a respeito. Não vendemos os seus dados,
          não exibimos anúncios e não usamos o seu conteúdo para treinar modelos de inteligência
          artificial.
        </p>

        <Secao titulo="1. Quais dados coletamos">
          <p><strong className="text-conteudo">Dados de conta:</strong> nome e e-mail, informados por você no cadastro.
          Se enviar uma foto de perfil, ela também fica guardada.</p>

          <p><strong className="text-conteudo">Conteúdo que você cria:</strong> anotações, estudos, pregações,
          versículos favoritos, histórico de leitura e pedidos de oração.</p>

          <p><strong className="text-conteudo">Preferências:</strong> horário das notificações, tema, tamanho da fonte,
          velocidade e voz do leitor de áudio.</p>

          <p><strong className="text-conteudo">Notificações:</strong> um identificador do seu aparelho fornecido pelo
          navegador, usado apenas para entregar a mensagem diária.</p>

          <p>Não coletamos localização, contatos, fotos da galeria nem dados de outros aplicativos.</p>
        </Secao>

        <Secao titulo="2. Microfone">
          <p>
            O microfone é acessado <strong className="text-conteudo">somente enquanto você toca no botão de gravar</strong>{' '}
            dentro das anotações. Não há gravação em segundo plano nem escuta contínua.
          </p>
          <p>
            O áudio é enviado ao serviço de transcrição (Groq) apenas para virar texto e{' '}
            <strong className="text-conteudo">não é armazenado</strong> — nem por nós, nem pelo serviço.
            O que fica salvo é apenas o texto resultante, na sua anotação.
          </p>
        </Secao>

        <Secao titulo="3. Inteligência artificial">
          <p>
            Alguns recursos enviam texto para a Groq, que processa e devolve a resposta:
            o conselheiro bíblico, a geração de pregações, a organização de anotações e o estudo do dia.
          </p>
          <p>
            O conselheiro é uma ferramenta de apoio espiritual e{' '}
            <strong className="text-conteudo">não substitui atendimento profissional</strong> de saúde
            mental, jurídico ou médico. Em situação de crise, procure ajuda: CVV, telefone 188, 24 horas.
          </p>
        </Secao>

        <Secao titulo="4. Vídeos de terceiros">
          <p>
            O estudo do dia pode exibir um vídeo do YouTube. O vídeo só é carregado depois que você
            toca para assistir — antes disso, o YouTube não recebe nenhuma informação sua. Ao assistir,
            valem os termos e a política de privacidade do Google.
          </p>
          <p>
            Os vídeos são de terceiros e sugeridos automaticamente pelo tema do dia. Não representam
            necessariamente a posição dos responsáveis por este aplicativo.
          </p>
        </Secao>

        <Secao titulo="5. Onde os dados ficam">
          <p>
            Os dados são guardados no Supabase e o aplicativo é servido pela Vercel, ambos com
            transmissão criptografada (HTTPS). Cada usuário só acessa o próprio conteúdo — a única
            exceção é o mural de oração, cujos pedidos são visíveis a quem está logado, como é a
            finalidade dele. Você escolhe publicar de forma identificada ou anônima.
          </p>
        </Secao>

        <Secao titulo="6. Seus direitos">
          <p>
            Conforme a Lei Geral de Proteção de Dados (LGPD), você pode a qualquer momento
            acessar, corrigir ou apagar os seus dados, e retirar o consentimento.
          </p>
          <p>
            Nome, e-mail e senha podem ser alterados direto em <strong className="text-conteudo">Perfil</strong>.
            As notificações podem ser desligadas em <strong className="text-conteudo">Perfil → Palavra do dia</strong>.
          </p>
        </Secao>

        <Secao titulo="7. Exclusão da conta">
          <p>
            Para apagar a sua conta e todo o conteúdo associado, envie um e-mail para{' '}
            <a href={`mailto:${CONTATO}?subject=Exclus%C3%A3o%20de%20conta`} className="font-bold text-primary">
              {CONTATO}
            </a>{' '}
            a partir do endereço cadastrado, com o assunto &ldquo;Exclusão de conta&rdquo;.
          </p>
          <p>
            A exclusão é feita em até 30 dias e remove anotações, estudos, pregações, favoritos,
            histórico de leitura, preferências e inscrições de notificação. A ação é definitiva e
            não há como recuperar o conteúdo depois.
          </p>
        </Secao>

        <Secao titulo="8. Crianças">
          <p>
            O aplicativo não é direcionado a menores de 13 anos e não coletamos dados de forma
            consciente dessa faixa etária.
          </p>
        </Secao>

        <Secao titulo="9. Mudanças nesta política">
          <p>
            Se algo mudar, atualizamos esta página e a data no topo. Mudanças relevantes serão
            avisadas dentro do aplicativo.
          </p>
        </Secao>

        <Secao titulo="10. Contato">
          <p>
            Dúvidas sobre privacidade ou sobre os seus dados:{' '}
            <a href={`mailto:${CONTATO}`} className="font-bold text-primary">{CONTATO}</a>
          </p>
        </Secao>
      </div>
    </main>
  )
}
