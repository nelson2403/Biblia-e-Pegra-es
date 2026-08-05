# Guia de publicação — Bíblia & Pregações

Da configuração das novas funcionalidades até o app na Google Play.

---

## 1. Banco de dados (Supabase)

No **SQL Editor** do Supabase, execute nesta ordem:

1. `supabase/schema.sql` (se ainda não rodou)
2. `supabase/schema_v2.sql` ← **novo**

O `schema_v2.sql` cria:

| Tabela | Para quê |
|---|---|
| `push_subscriptions` | Aparelhos inscritos para receber notificações |
| `conteudo_diario` | Versículo + estudo do dia (uma linha por data, igual para todos) |
| `preferencias` | Horário da notificação, voz, velocidade, fonte grande, alto contraste |
| `devocionais_lidos` | Sequência de dias seguidos no devocional |

Também adiciona a coluna `origem` em `anotacoes` (marca as que vieram de voz).

---

## 2. Variáveis de ambiente

Copie de `.env.example`. As **novas** são:

```bash
SUPABASE_SERVICE_ROLE_KEY=...   # Supabase → Settings → API → service_role
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:seu@email.com
CRON_SECRET=...                 # frase aleatória longa
NEXT_PUBLIC_SITE_URL=https://seu-app.vercel.app
```

> ⚠️ As chaves VAPID já foram geradas e estão no seu `.env.local`.
> O `SUPABASE_SERVICE_ROLE_KEY` está com um valor de exemplo — **você precisa colar a chave real**.
> Sem ela, o versículo do dia e as notificações não funcionam.

Para gerar um novo par VAPID (só se precisar trocar):

```bash
npm run vapid
```

Cadastre **todas** essas variáveis também na Vercel (Settings → Environment Variables).

---

## 3. Notificações diárias (cron)

O `vercel.json` já agenda `/api/cron/diario` **de hora em hora**. A cada execução ele:

1. garante que o conteúdo do dia exista (gera com a Groq se ainda não existir);
2. envia o push para quem escolheu **aquela** hora no perfil.

**Plano Hobby da Vercel permite apenas 1 execução por dia.** Se for o seu caso, troque em `vercel.json`:

```json
"crons": [{ "path": "/api/cron/diario?todos=1", "schedule": "0 10 * * *" }]
```

`10 * * * *` em UTC = 07:00 em Brasília. O `?todos=1` ignora a preferência de horário e envia para todo mundo.

Testar manualmente:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://seu-app.vercel.app/api/cron/diario?todos=1
```

---

## 4. Ícones

Já gerados em `public/icons/`. Para regerar depois de mudar a arte:

```bash
npm run icones
```

Saída:
- `icon-48…512.png` — ícones normais
- `icon-maskable-192/512.png` — recorte adaptativo do Android
- `badge-96.png` — ícone monocromático da barra de notificação
- `playstore-icon-512.png` — ícone da ficha da loja
- `playstore-banner-1024x500.png` — banner (feature graphic) da ficha

---

## 5. Publicar na Google Play (TWA)

O app vai para a Play Store como **Trusted Web Activity**: um invólucro Android que abre o seu PWA em tela cheia, sem barra de navegador.

> **Por que TWA e não Capacitor?** O Capacitor roda dentro do *Android System WebView*,
> que não expõe `PushManager` nem faz `speechSynthesis` falar. As notificações diárias e o
> leitor de áudio simplesmente não funcionariam. O TWA usa o Chrome de verdade, então tudo
> que funciona no navegador funciona no app — sem escrever código nativo.

### 5.1 Pré-requisitos

- Conta de desenvolvedor Google Play (US$ 25, pagamento único)
- Node 18+
- O app já publicado em HTTPS: **https://biblia-e-pegra-es.vercel.app**

O Bubblewrap baixa sozinho o JDK 17 e o Android SDK na primeira execução (~1 GB).
Não precisa instalar Android Studio nem se preocupar com a versão do Java da máquina.

### 5.2 Gerar o projeto Android

Rode **fora** da pasta do projeto web, para não misturar os arquivos:

```bash
npm install -g @bubblewrap/cli
mkdir ~/biblia-twa && cd ~/biblia-twa
bubblewrap init --manifest https://biblia-e-pegra-es.vercel.app/manifest.json
```

Responda:

| Pergunta | Resposta |
|---|---|
| Domain | `biblia-e-pegra-es.vercel.app` |
| Application ID | `com.bibliaepregacoes.app` |
| App name | Bíblia & Pregações |
| Short name | Bíblia |
| Start URL | `/dashboard?origem=pwa` |
| Theme color / Background | `#1E1B4B` |
| Include support for Play Billing | Não |
| Request geolocation permission | Não |

Na sequência ele pede para **criar um keystore** (a chave que assina o app).
Guarde o arquivo `android.keystore` e as senhas em lugar seguro — **se perder, você nunca mais
consegue atualizar o app na Play Store**. Não dá para recuperar.

Depois:

```bash
bubblewrap build
```

Gera `app-release-bundle.aab` (o arquivo que sobe para a Play) e `app-release-signed.apk` (para testar no celular).

### 5.3 ⚠️ Passo crítico: assetlinks.json

**Sem isso o app abre com a barra de endereço do Chrome aparecendo** — e a Google reprova.

O arquivo `public/.well-known/assetlinks.json` já existe com o `package_name` certo, mas com
**duas impressões digitais de exemplo** que você precisa substituir:

**Impressão 1 — a sua chave.** O `bubblewrap build` a imprime no fim. Ou obtenha com:

```bash
bubblewrap fingerprint list
```

**Impressão 2 — a do Google.** Como o Play App Signing é obrigatório para apps novos, a Google
reassina seu app com outra chave. Suba o primeiro release (mesmo em teste interno) e pegue em
**Play Console → Configuração → Integridade do app → Certificado de assinatura do app**.

As **duas** precisam estar no array. Depois de colar, faça o deploy e confirme:

```
https://biblia-e-pegra-es.vercel.app/.well-known/assetlinks.json
```

Para validar se a Google enxerga o vínculo:

```
https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://biblia-e-pegra-es.vercel.app&relation=delegate_permission/common.handle_all_urls
```

> **Como saber se deu certo:** instale o APK e abra o app. Se aparecer uma barra de endereço
> do Chrome no topo por 2 segundos, o assetlinks está errado. Se abrir em tela cheia limpa,
> está tudo certo.

### 5.4 Ficha da loja

| Item | Onde está |
|---|---|
| Ícone 512×512 | `public/icons/playstore-icon-512.png` |
| Banner 1024×500 | `public/icons/playstore-banner-1024x500.png` |
| Capturas de tela | Tire 2 a 8 no celular (mínimo 320px, máximo 3840px) |

**Descrição curta (até 80 caracteres):**
> Bíblia em áudio, versículo e estudo novos todo dia, e pregações com IA.

**Descrição completa (rascunho):**
> Bíblia & Pregações reúne tudo o que você precisa para se alimentar da Palavra e servir melhor.
>
> 📖 Bíblia completa em português, em três traduções (AA, NVI, ARC)
> 🔊 Ouça a Bíblia, os estudos e as pregações em voz alta — acessível para pessoas com deficiência visual
> ☀️ Versículo do dia com reflexão e oração, e um estudo bíblico novo a cada manhã
> 🔔 Notificação diária no horário que você escolher
> 🎙️ Anotações por voz: fale e a IA transcreve e organiza
> ✍️ Monte pregações com ajuda de IA
> 🙏 Mural de oração e conselheiro bíblico
> ❤️ Favoritos, plano de leitura e busca

### 5.5 Formulários obrigatórios

- **Segurança dos dados**: declare que coleta e-mail e nome (conta), e que os dados são
  criptografados em trânsito. O microfone é usado apenas para a transcrição solicitada pelo usuário.
- **Política de privacidade**: a Google exige uma URL pública. É o único item ainda pendente —
  publique uma página de privacidade e informe o link.
- **Classificação de conteúdo**: responda o questionário (o app se enquadra em Livre).

---

## 6. Checklist antes de publicar

- [x] `schema_v2.sql` executado no Supabase
- [x] `SUPABASE_SERVICE_ROLE_KEY` e `GROQ_API_KEY` preenchidas no `.env.local`
- [ ] **As 6 variáveis novas cadastradas na Vercel** ← pendente
- [ ] `/diario` carrega o versículo e o estudo do dia em produção
- [ ] Notificação de teste chega (Perfil → Palavra do dia → Enviar teste)
- [ ] Botão "Ouvir" lê a Bíblia em voz alta no celular
- [ ] Ditado por voz transcreve corretamente
- [ ] `assetlinks.json` com as duas impressões digitais no ar
- [ ] Política de privacidade publicada

---

## 7. Observações técnicas

**Vozes do leitor de áudio** — vêm do próprio aparelho (Web Speech API): funciona offline,
sem custo e sem limite. Se o celular tiver poucas vozes em português, dá para instalar mais em
*Configurações → Idiomas → Conversão de texto em voz*. No iPhone o recurso existe, mas as vozes
são mais limitadas que no Android.

**Precisão da Escritura** — o texto dos versículos do dia vem de uma lista curada em
`data/versiculosDiarios.ts`, nunca da IA. A IA escreve apenas a reflexão, a oração e o estudo.
Isso evita que uma alucinação do modelo apareça como se fosse a Palavra.

**Custo da Groq** — o estudo do dia é gerado **uma vez por dia para todos os usuários**
(uma chamada, cerca de 4 mil tokens). A transcrição usa `whisper-large-v3`, cobrada por hora
de áudio. O conselheiro e as pregações continuam sendo por uso.

**Limite de upload de áudio** — funções serverless da Vercel aceitam ~4,5 MB por requisição.
O gravador limita a 10 minutos com bitrate de 32 kbps, o que fica bem dentro do limite.
