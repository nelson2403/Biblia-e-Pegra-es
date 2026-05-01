export interface DictEntry {
  id: string
  lang: 'H' | 'G'
  word: string
  translit: string
  ptGloss: string
  definition: string
  verses: string[]
}

export const DICTIONARY: DictEntry[] = [
  // ── HEBRAICO ──────────────────────────────────────────────────────────────
  {
    id: 'H7965',
    lang: 'H',
    word: 'שָׁלוֹם',
    translit: 'shalom',
    ptGloss: 'paz, prosperidade',
    definition:
      'Shalom é muito mais do que a simples ausência de conflito; expressa plenitude, bem-estar e harmonia em todas as dimensões da vida. A palavra abrange prosperidade material, saúde, relacionamentos restaurados e comunhão plena com Deus. É o estado ideal que Deus desejou para a humanidade desde a criação, e que Cristo veio restaurar por meio de sua obra redentora.',
    verses: ['Nm 6:26', 'Is 26:3'],
  },
  {
    id: 'H2617',
    lang: 'H',
    word: 'חֶסֶד',
    translit: 'chesed',
    ptGloss: 'amor leal, misericórdia',
    definition:
      'Chesed descreve o amor comprometido e inabalável de Deus para com seu povo dentro de uma relação de aliança. É um amor que vai muito além do sentimento, implicando fidelidade, lealdade e ação concreta em favor do amado. Esse amor não é merecido, mas brota livremente do caráter divino, sendo renovado a cada manhã conforme Lamentações 3:22-23.',
    verses: ['Sl 136:1', 'Lm 3:22'],
  },
  {
    id: 'H530',
    lang: 'H',
    word: 'אֱמוּנָה',
    translit: 'emunah',
    ptGloss: 'fidelidade, firmeza',
    definition:
      'Emunah vem da raiz "aman", que significa ser firme e constante. Aplicada a Deus, expressa sua fidelidade absoluta às promessas e à aliança estabelecida com Israel. Quando aplicada ao ser humano, descreve a confiança e a fé leal que coloca toda a sua segurança em Deus. O profeta Habacuque declara que "o justo viverá pela sua emunah" (Hb 2:4).',
    verses: ['Hb 2:4', 'Sl 36:5'],
  },
  {
    id: 'H7307',
    lang: 'H',
    word: 'רוּחַ',
    translit: 'ruach',
    ptGloss: 'espírito, vento, fôlego',
    definition:
      'Ruach é uma das palavras mais ricas do hebraico bíblico, podendo significar vento, fôlego de vida ou o Espírito de Deus, dependendo do contexto. O Ruach Elohim pairava sobre as águas na criação (Gn 1:2), é o sopro vital que Deus infundiu no homem (Gn 2:7) e a força que capacita profetas, juízes e reis para cumprirem sua missão. No Novo Testamento, essa realidade é plenificada no Espírito Santo derramado em Pentecostes.',
    verses: ['Gn 1:2', 'Ez 37:14'],
  },
  {
    id: 'H3068',
    lang: 'H',
    word: 'יְהוָה',
    translit: 'YHWH',
    ptGloss: 'O SENHOR, Yahweh',
    definition:
      'YHWH é o nome pessoal e sagrado de Deus revelado a Moisés na sarça ardente (Êx 3:14). Derivado do verbo "hayah" (ser), significa "Eu Sou o que Sou" ou "Aquele que é, que era e que há de vir". Os judeus por reverência evitavam pronunciá-lo, substituindo-o por "Adonai" (Senhor). Esse nome revela a eternidade, a autoexistência e a imutabilidade de Deus, fundamento de toda a teologia bíblica.',
    verses: ['Êx 3:14', 'Sl 83:18'],
  },
  {
    id: 'H430',
    lang: 'H',
    word: 'אֱלֹהִים',
    translit: 'Elohim',
    ptGloss: 'Deus, deuses',
    definition:
      'Elohim é o nome genérico para Deus no hebraico, usado já na primeira linha da Bíblia (Gn 1:1). Sua forma é plural — "Elohim" —, mas normalmente acompanha verbos no singular quando se refere ao Deus de Israel, o que muitos teólogos veem como uma sugestão da pluralidade de pessoas na Trindade. Expressa o poder criador, a soberania absoluta e a majestade transcendente de Deus sobre toda a criação.',
    verses: ['Gn 1:1', 'Dt 6:4'],
  },
  {
    id: 'H8451',
    lang: 'H',
    word: 'תּוֹרָה',
    translit: 'Torah',
    ptGloss: 'lei, instrução, ensinamento',
    definition:
      'Torah deriva do verbo "yarah", que significa instruir ou apontar o caminho. É muito mais ampla do que "lei" no sentido jurídico; representa o conjunto de instruções, ensinamentos e orientações que Deus deu ao seu povo para que pudesse viver bem diante dele e em comunidade. No judaísmo, refere-se especialmente ao Pentateuco. Para os cristãos, a Torah é cumprida e transcendida em Cristo (Mt 5:17).',
    verses: ['Sl 119:97', 'Jo 1:17'],
  },
  {
    id: 'H1285',
    lang: 'H',
    word: 'בְּרִית',
    translit: 'berith',
    ptGloss: 'aliança, pacto',
    definition:
      'Berith é um dos conceitos centrais de toda a narrativa bíblica, descrevendo os acordos de aliança que Deus estabeleceu com Noé, Abraão, Moisés e Davi. Não se trata de um contrato igualitário, mas de uma aliança de graça iniciada pelo Soberano (Deus) em favor do mais fraco (o ser humano). Cada berith revela dimensões do grande plano redentor que culmina na nova aliança selada com o sangue de Cristo.',
    verses: ['Gn 15:18', 'Jr 31:31'],
  },
  {
    id: 'H1697',
    lang: 'H',
    word: 'דָּבָר',
    translit: 'dabbar',
    ptGloss: 'palavra, assunto, coisa',
    definition:
      'Dabbar não é apenas um som articulado; a palavra de Deus no Antigo Testamento é uma realidade dinâmica, criativa e poderosa. Por ela, Deus criou o universo (Sl 33:6), revelou sua vontade e efetua sua obra na história. A Palavra que foi "dada" aos profetas não retorna vazia, mas realiza o propósito para o qual foi enviada (Is 55:11). No Novo Testamento, o Logos encarnado é a expressão máxima do dabbar divino.',
    verses: ['Is 55:11', 'Sl 33:6'],
  },
  {
    id: 'H6944',
    lang: 'H',
    word: 'קֹדֶשׁ',
    translit: 'qodesh',
    ptGloss: 'santidade, consagração',
    definition:
      'Qodesh expressa a ideia de separação e distinção: o que é santo foi apartado do comum e dedicado a Deus. A santidade é antes de tudo um atributo essencial de Deus — "Santo, santo, santo é o SENHOR dos exércitos" (Is 6:3) —, e somente em segundo lugar uma qualidade derivada das coisas e pessoas que ele santifica. Israel era chamado a ser uma nação santa, refletindo o caráter de seu Deus.',
    verses: ['Is 6:3', 'Lv 11:44'],
  },
  {
    id: 'H160',
    lang: 'H',
    word: 'אַהֲבָה',
    translit: 'ahavah',
    ptGloss: 'amor, afeição',
    definition:
      'Ahavah é a palavra hebraica padrão para amor, abrangendo tanto o amor divino quanto o humano. O amor de Deus por Israel é descrito com ahavah em Deuteronômio 7:8, revelando que não foi por mérito de Israel, mas por puro amor soberano que Deus o escolheu. O Cântico dos Cânticos usa extensamente ahavah para descrever o amor apaixonado, que muitos intérpretes veem como alegoria do amor entre Deus e seu povo.',
    verses: ['Dt 7:8', 'Ct 8:6'],
  },
  {
    id: 'H8666',
    lang: 'H',
    word: 'תְּשׁוּבָה',
    translit: 'teshuvah',
    ptGloss: 'arrependimento, retorno',
    definition:
      'Teshuvah literalmente significa "retorno" — voltar-se de um caminho errado e retornar a Deus. É o conceito central de arrependimento no Antigo Testamento, implicando uma transformação radical de direção: deixar o pecado e os ídolos e reorientar toda a vida para Deus. Os profetas constantemente chamavam Israel à teshuvah como condição para a restauração da aliança e das bênçãos de Deus.',
    verses: ['Jr 31:18', 'Os 14:1'],
  },
  {
    id: 'H3722',
    lang: 'H',
    word: 'כָּפַר',
    translit: 'kaphar',
    ptGloss: 'expiar, cobrir, fazer propiciação',
    definition:
      'Kaphar é o verbo que descreve a ação expiatória de cobrir ou purgar o pecado mediante um sacrifício substitutivo. A tampa da Arca da Aliança em hebraico é "kapporeth" (propiciatório), o lugar onde o sangue era aspergido no Dia da Expiação (Yom Kippur). Todo o sistema sacrificial levítico apontava para o ato supremo de expiação realizado por Cristo, o verdadeiro Cordeiro de Deus que tira o pecado do mundo.',
    verses: ['Lv 17:11', 'Sl 78:38'],
  },
  {
    id: 'H5315',
    lang: 'H',
    word: 'נֶפֶשׁ',
    translit: 'nefesh',
    ptGloss: 'alma, ser vivo, vida',
    definition:
      'Nefesh designa o ser vivo em sua totalidade, especialmente em sua dimensão de vida e desejo. Ao soprar nas narinas do homem, Deus fez com que ele se tornasse uma "nefesh hayah" — alma vivente (Gn 2:7). A nefesh não é uma parte imaterial separada do corpo, mas o ser humano como criatura animada por Deus. A Bíblia hebraica tem uma visão holística do ser humano, e a nefesh representa essa unidade.',
    verses: ['Gn 2:7', 'Sl 42:1'],
  },
  {
    id: 'H3820',
    lang: 'H',
    word: 'לֵב',
    translit: 'lev',
    ptGloss: 'coração, mente, vontade',
    definition:
      'No pensamento hebraico, o coração (lev) é o centro da personalidade humana: sede do intelecto, da vontade, das emoções e da tomada de decisões. É muito mais do que o órgão físico ou o centro emocional como compreendemos hoje; o lev pensa, decide, planeja e deseja. Provérbios 4:23 exorta a guardar o lev acima de tudo, pois dele procedem as nascentes da vida.',
    verses: ['Pv 4:23', 'Jr 17:9'],
  },
  {
    id: 'H571',
    lang: 'H',
    word: 'אֱמֶת',
    translit: 'emet',
    ptGloss: 'verdade, fidelidade',
    definition:
      'Emet combina as ideias de veracidade, confiabilidade e fidelidade. A palavra compartilha a raiz com "amen" e "emunah", apontando para algo que é firme, estável e digno de confiança. A emet de Deus é o fundamento sobre o qual repousa toda a confiança humana. Adorar a Deus "em espírito e em verdade" (Jo 4:24) remete a essa realidade de um Deus que é emet em toda a sua essência.',
    verses: ['Sl 25:5', 'Jo 14:6'],
  },
  {
    id: 'H4941',
    lang: 'H',
    word: 'מִשְׁפָּט',
    translit: 'mishpat',
    ptGloss: 'justiça, julgamento, direito',
    definition:
      'Mishpat refere-se à justiça exercida concretamente, especialmente em favor dos vulneráveis. Os profetas clamavam por mishpat para órfãos, viúvas e estrangeiros (Is 1:17; Am 5:24). Não é apenas um conceito jurídico abstrato, mas uma ação de restauração dos direitos dos desfavorecidos. YHWH é o Juiz supremo que ama o mishpat (Sl 99:4) e chama seu povo a praticá-lo.',
    verses: ['Am 5:24', 'Mq 6:8'],
  },
  {
    id: 'H6666',
    lang: 'H',
    word: 'צְדָקָה',
    translit: 'tsedaqah',
    ptGloss: 'justiça, retidão',
    definition:
      'Tsedaqah é a retidão moral e relacional que Deus exige e que ele mesmo provê. No Antigo Testamento, tsedaqah frequentemente se expressa em atos de generosidade e cuidado com os pobres. No contexto da justificação, Abraham creu em Deus e isso lhe foi creditado como tsedaqah (Gn 15:6) — base da doutrina paulina da justificação pela fé. É uma das grandes palavras da teologia bíblica.',
    verses: ['Gn 15:6', 'Is 61:10'],
  },
  {
    id: 'H8085',
    lang: 'H',
    word: 'שָׁמַע',
    translit: 'shema',
    ptGloss: 'ouvir, escutar, obedecer',
    definition:
      'Shema em hebraico abrange ouvir, prestar atenção e obedecer — dimensões que o português separou em palavras distintas. O mais famoso uso está em Deuteronômio 6:4: "Shema, Israel" — Ouça, Israel! Essa abertura do credo judaico revela que verdadeiramente ouvir a Deus implica obedecê-lo. Ouvir sem obedecer não é realmente ouvir, no sentido bíblico pleno da palavra.',
    verses: ['Dt 6:4', '1Sm 15:22'],
  },
  {
    id: 'H2142',
    lang: 'H',
    word: 'זָכַר',
    translit: 'zakar',
    ptGloss: 'lembrar, recordar, celebrar',
    definition:
      'No hebraico bíblico, zakar não é uma ação passiva de recordação mental, mas uma memória ativa que move a ação. Quando Deus "se lembra" de seu povo (Gn 8:1; Êx 2:24), ele intervém em favor deles. O chamado a "lembrar" as obras de Deus nos Salmos é um convite à celebração litúrgica e à renovação da fé. Os rituais e festas do calendário israelita foram instituídos para que Israel realizasse esse zakar coletivo.',
    verses: ['Gn 8:1', 'Sl 105:5'],
  },
  {
    id: 'H5375',
    lang: 'H',
    word: 'נָשָׂא',
    translit: 'nasa',
    ptGloss: 'levantar, carregar, perdoar',
    definition:
      'Nasa tem um rico leque semântico: levantar, carregar um peso, suportar e perdoar. Quando aplicado ao perdão divino, a metáfora é poderosa — Deus "levanta" e "carrega" o peso da culpa, removendo-a do pecador. Isaías 53:4 usa nasa para descrever o Servo Sofredor que carrega as iniquidades do povo: "certamente ele tomou sobre si nossas enfermidades e as nossas dores ele as carregou".',
    verses: ['Is 53:4', 'Sl 32:1'],
  },
  {
    id: 'H539',
    lang: 'H',
    word: 'אָמַן',
    translit: 'aman',
    ptGloss: 'crer, confiar, ser fiel',
    definition:
      'Aman é a raiz da qual derivam "emunah" (fé) e "amen" (assim seja). O verbo expressa o ato de apoiar-se, encostar-se e confiar em algo ou alguém de forma total. Em Gênesis 15:6, Abraão "amou" (acreditou) em Deus, e Deus considerou isso como justiça. Essa é a fé que fundamenta toda a relação do ser humano com Deus — não um mero assentimento intelectual, mas uma confiança que sustenta toda a existência.',
    verses: ['Gn 15:6', 'Hb 11:1'],
  },
  {
    id: 'H3467',
    lang: 'H',
    word: 'יָשַׁע',
    translit: 'yasha',
    ptGloss: 'salvar, resgatar, libertar',
    definition:
      'Yasha é o verbo de onde derivam Yeshua (Jesus), Hosana e Isaías (YHWH salva). A salvação bíblica no Antigo Testamento tem dimensões concretas: livrar de inimigos, de enfermidades, da morte e do mal em sentido pleno. YHWH é o Yasha de Israel (Is 43:11). Toda a história da salvação do povo de Deus no Antigo Testamento prefigura a grande e definitiva obra de yasha que o Messias realizaria.',
    verses: ['Sl 3:8', 'Is 43:11'],
  },
  {
    id: 'H1254',
    lang: 'H',
    word: 'בָּרָא',
    translit: 'bara',
    ptGloss: 'criar (do nada)',
    definition:
      'Bara é o verbo exclusivamente usado para a atividade criadora de Deus — nunca de criaturas — e descreve uma criação que não parte de nenhuma matéria preexistente (creatio ex nihilo). Gênesis 1:1 usa bara para a criação do cosmos, afirmando que o universo não é coeterno com Deus nem uma emanação dele, mas uma obra soberana e livre de sua vontade. Esse termo teológico fundamental diferencia a visão bíblica de toda cosmogonia pagã.',
    verses: ['Gn 1:1', 'Is 40:28'],
  },
  {
    id: 'H5303',
    lang: 'H',
    word: 'נְפִילִים',
    translit: 'nephilim',
    ptGloss: 'gigantes, os caídos',
    definition:
      'Nephilim aparece em Gênesis 6:4 e Números 13:33 para descrever seres de estatura e força extraordinárias. A palavra relaciona-se ao verbo "nafal" (cair), podendo ser traduzida como "os caídos" ou "aqueles que fazem outros caírem". A identidade exata dos Nephilim é debatida — se filhos de anjos ou de uma linhagem humana específica —, mas o texto bíblico os associa à crescente corrupção da humanidade antes do dilúvio.',
    verses: ['Gn 6:4', 'Nm 13:33'],
  },
  {
    id: 'H4397',
    lang: 'H',
    word: 'מַלְאָךְ',
    translit: 'malak',
    ptGloss: 'anjo, mensageiro',
    definition:
      'Malak significa simplesmente "mensageiro", tanto humano quanto celestial. Quando usado para mensageiros divinos, refere-se aos anjos, seres criados que servem diante do trono de Deus e são enviados para cumprir suas ordens. O "Anjo do SENHOR" (Malak YHWH) tem um papel especial no Antigo Testamento, aparecendo como representante pleno e portador da presença divina, e muitos o identificam como uma teofania pré-encarnada do Filho.',
    verses: ['Sl 34:7', 'Gn 16:7'],
  },
  {
    id: 'H5769',
    lang: 'H',
    word: 'עוֹלָם',
    translit: 'olam',
    ptGloss: 'eternidade, para sempre',
    definition:
      'Olam expressa uma extensão de tempo tão vasta que ultrapassa a compreensão humana — o passado remoto ou o futuro interminável. Quando aplicado a Deus, aponta para sua existência sem início e sem fim: "desde a eternidade (olam) até a eternidade (olam), tu és Deus" (Sl 90:2). As promessas de Deus são "ad olam" — eternas —, especialmente a aliança abraâmica e a promessa do reino davídico.',
    verses: ['Sl 90:2', 'Is 40:28'],
  },
  {
    id: 'H3374',
    lang: 'H',
    word: 'יִרְאָה',
    translit: 'yirah',
    ptGloss: 'temor, reverência',
    definition:
      'Yirah designa o temor reverente que a criatura sente diante da majestade do Criador. Não é pavor de ser destruído, mas o reconhecimento da santidade, poder e glória infinita de Deus que humilha e maravilha ao mesmo tempo. "O temor do SENHOR" (yirah YHWH) é repetidamente apontado como o princípio da sabedoria (Pv 1:7), da vida e da proteção divina. É a postura fundamental da criatura em relação ao Criador.',
    verses: ['Pv 1:7', 'Sl 111:10'],
  },
  {
    id: 'H1984',
    lang: 'H',
    word: 'הָלַל',
    translit: 'halal',
    ptGloss: 'louvar, gloriar-se',
    definition:
      'Halal é o verbo do qual deriva "Hallelujah" — "Louvai ao SENHOR!". Expressa um louvor exuberante, exaltado e por vezes extravagante. O louvor não é uma obrigação fria, mas uma resposta de alegria transbordante ao caráter e às obras de Deus. Os Salmos são o livro do halal por excelência, ensinando ao povo de Deus como expressar adoração genuína em todas as circunstâncias da vida.',
    verses: ['Sl 22:22', 'Sl 150:6'],
  },
  {
    id: 'H5647',
    lang: 'H',
    word: 'עָבַד',
    translit: 'abad',
    ptGloss: 'servir, trabalhar, adorar',
    definition:
      'Abad abrange os sentidos de trabalhar, servir e adorar, revelando que no pensamento hebraico não há separação entre o serviço a Deus e o trabalho cotidiano. O mesmo verbo descreve os levitas ministrando no Tabernáculo e um servo trabalhando no campo. A vocação humana de "lavrar e guardar" o jardim (Gn 2:15) usa abad, conectando o trabalho à adoração. Todo trabalho fiel é uma forma de culto ao Criador.',
    verses: ['Gn 2:15', 'Dt 6:13'],
  },
  {
    id: 'H7121',
    lang: 'H',
    word: 'קָרָא',
    translit: 'qara',
    ptGloss: 'chamar, proclamar, convocar',
    definition:
      'Qara é o ato de chamar pelo nome, proclamar em voz alta ou convocar para um encontro. Quando Deus chama pelo nome de alguém — Abraão, Moisés, Samuel — é um ato de eleição e missão. Quando o ser humano "chama sobre o nome do SENHOR" (qara beshem YHWH), está invocando Deus em oração e fé, como fizeram Abraão (Gn 12:8) e os patriarcas. O chamado divino e a resposta humana formam o ritmo da relação de aliança.',
    verses: ['Gn 12:8', 'Jl 2:32'],
  },
  {
    id: 'H8034',
    lang: 'H',
    word: 'שֵׁם',
    translit: 'shem',
    ptGloss: 'nome, reputação, fama',
    definition:
      'No mundo bíblico, o nome (shem) não era apenas uma etiqueta identificadora, mas expressava a essência, o caráter e a reputação de quem o portava. O nome de Deus resume quem ele é: sua natureza, seus atributos, suas obras e sua presença. Fazer algo "em nome do SENHOR" é agir em representação plena de sua autoridade e caráter. Santificar o nome de Deus (Shem) é a primeira petição do Pai-Nosso.',
    verses: ['Êx 3:15', 'Sl 9:10'],
  },
  {
    id: 'H3519',
    lang: 'H',
    word: 'כָּבוֹד',
    translit: 'kabod',
    ptGloss: 'glória, honra, peso',
    definition:
      'Kabod deriva de uma raiz que significa "ser pesado" ou "ter peso". A glória de Deus é o "peso" de sua presença maravilhosa que preenche o espaço e maravilha os que a contemplam. No Tabernáculo e no Templo, o Kabod YHWH se manifestava como uma nuvem luminosa (Êx 40:34-35). O chamado da criação é glorificar a Deus — ou seja, reconhecer e proclamar o peso de quem ele é em toda a sua majestade.',
    verses: ['Êx 40:34', 'Is 6:3'],
  },
  {
    id: 'H7495',
    lang: 'H',
    word: 'רָפָא',
    translit: 'rapha',
    ptGloss: 'sarar, curar, restaurar',
    definition:
      'Rapha é o verbo de cura utilizado para descrever tanto a cura de doenças físicas quanto a restauração espiritual e emocional. Um dos nomes compostos de Deus é YHWH Rapha — "O SENHOR que te sara" (Êx 15:26). Isaías 53:5 usa rapha para declarar que "pelas feridas do Servo somos curados", conectando a obra expiatória de Cristo com a plenitude da cura em todas as dimensões do ser humano.',
    verses: ['Êx 15:26', 'Is 53:5'],
  },
  {
    id: 'H5341',
    lang: 'H',
    word: 'נָצַר',
    translit: 'natsar',
    ptGloss: 'guardar, proteger, vigiar',
    definition:
      'Natsar expressa a ideia de uma guarda vigilante e cuidadosa — preservar, proteger e manter. Usado para descrever tanto a guarda humana de um jardim ou de mandamentos quanto a proteção divina sobre seu povo. Salmos 91 é o grande poema de proteção divina, usando diferentes verbos de guarda para expressar o cuidado total de Deus sobre aquele que habita "no esconderijo do Altíssimo". Guardar a Torah é natsar seus caminhos.',
    verses: ['Sl 121:7', 'Pv 4:6'],
  },
  {
    id: 'H6419',
    lang: 'H',
    word: 'פָּלַל',
    translit: 'palal',
    ptGloss: 'orar, interceder, julgar',
    definition:
      'Palal é o verbo hebraico mais usado para oração, especialmente a oração intercessória. Tem como sentido de fundo mediar, intervir e interceder entre partes. A oração no Antigo Testamento não era um monólogo solitário, mas um diálogo de intercessão — o crente apresentando-se diante do Juiz soberano para pedir julgamento favorável em favor de si mesmo ou de outros. Moisés era o grande intercessor (palal) de Israel.',
    verses: ['1Sm 1:10', 'Sl 5:2'],
  },
  {
    id: 'H1696',
    lang: 'H',
    word: 'דָּבַר',
    translit: 'dabar',
    ptGloss: 'falar, declarar',
    definition:
      'Dabar (verbo) é o ato de falar com autoridade e propósito. Quando Deus "dabar" algo, não é uma comunicação informativa neutra, mas uma declaração criadora e eficaz — "Deus falou, e foi feito" (Sl 33:9). A fórmula profética "assim diz o SENHOR" (koh amar YHWH) usa a raiz de dabar, enfatizando que as palavras que se seguem não são do profeta, mas do próprio Deus que fala com autoridade plena.',
    verses: ['Sl 33:9', 'Hb 1:1'],
  },
  {
    id: 'H6662',
    lang: 'H',
    word: 'צַדִּיק',
    translit: 'tsaddiq',
    ptGloss: 'justo, reto',
    definition:
      'Tsaddiq é o adjetivo que descreve a pessoa que está em conformidade com o padrão de Deus e seus relacionamentos de aliança. Ser tsaddiq não é primariamente seguir regras, mas viver em fidelidade às responsabilidades da aliança — com Deus e com o próximo. Deus mesmo é o Tsaddiq por excelência (Sl 11:7). A declaração de que "o justo viverá pela fé" (Hb 2:4) usa o conceito de tsaddiq como ponto de partida.',
    verses: ['Sl 1:6', 'Pv 10:25'],
  },

  // ── GREGO ─────────────────────────────────────────────────────────────────
  {
    id: 'G26',
    lang: 'G',
    word: 'ἀγάπη',
    translit: 'agape',
    ptGloss: 'amor incondicional',
    definition:
      'Agape é a palavra grega que o Novo Testamento usa predominantemente para o amor divino — um amor que não depende da qualidade ou mérito do amado, mas brota da natureza do próprio Deus (1Jo 4:8: "Deus é agape"). É distinto do eros (amor romântico) e do philia (amor de amizade). O hino do amor de 1 Coríntios 13 é a mais famosa definição prática do agape, que inclui paciência, bondade, ausência de inveja e permanência além de tudo.',
    verses: ['1Jo 4:8', '1Co 13:13'],
  },
  {
    id: 'G3056',
    lang: 'G',
    word: 'λόγος',
    translit: 'logos',
    ptGloss: 'palavra, razão, o Verbo',
    definition:
      'Logos no mundo grego significava tanto "palavra" quanto "razão" — o princípio racional que ordenava o cosmos. João, ao abrir seu Evangelho com "No princípio era o Logos", faz uma afirmação revolucionária: o princípio ordenador do universo não é uma força abstrata, mas uma Pessoa divina que se tornou carne e habitou entre nós (Jo 1:14). Logos é ao mesmo tempo o discurso revelador de Deus e a segunda Pessoa da Trindade, Jesus Cristo.',
    verses: ['Jo 1:1', 'Jo 1:14'],
  },
  {
    id: 'G4102',
    lang: 'G',
    word: 'πίστις',
    translit: 'pistis',
    ptGloss: 'fé, confiança, fidelidade',
    definition:
      'Pistis abrange fé, confiança e fidelidade — tanto como dom de Deus quanto como resposta humana. A justificação pela pistis (fé) é o coração da teologia paulina: o ser humano é declarado justo diante de Deus não por obras, mas pela confiança depositada em Cristo e sua obra (Rm 3:22). A fé salvadora não é um esforço humano, mas é ela própria concedida por Deus (Ef 2:8). Hebreus 11 apresenta a galeria dos heróis da pistis.',
    verses: ['Rm 3:22', 'Hb 11:1'],
  },
  {
    id: 'G5485',
    lang: 'G',
    word: 'χάρις',
    translit: 'charis',
    ptGloss: 'graça, favor',
    definition:
      'Charis é a palavra grega para "graça" — o favor imerecido de Deus concedido ao pecador. Paulo usa charis como categoria central de sua teologia: somos salvos pela graça, chamados pela graça, sustentados pela graça (Ef 2:8-9; 1Co 15:10). A graça não é apenas perdão, mas o poder divino operante que transforma e capacita o crente para a vida cristã. É a base sobre a qual repousa toda a experiência de salvação no Novo Testamento.',
    verses: ['Ef 2:8', 'Rm 5:2'],
  },
  {
    id: 'G1515',
    lang: 'G',
    word: 'εἰρήνη',
    translit: 'eirene',
    ptGloss: 'paz, tranquilidade',
    definition:
      'Eirene é o equivalente grego do hebraico shalom, expressando harmonia, bem-estar e a cessação da hostilidade. No Novo Testamento, Cristo "é a nossa paz" (Ef 2:14) — ele destruiu o muro de separação entre judeus e gentios, e entre o ser humano e Deus. A eirene que Cristo concede "excede todo entendimento" (Fp 4:7), transcendendo as circunstâncias externas. As cartas apostólicas frequentemente abrem com a bênção "graça e paz" (charis kai eirene).',
    verses: ['Jo 14:27', 'Fp 4:7'],
  },
  {
    id: 'G4151',
    lang: 'G',
    word: 'πνεῦμα',
    translit: 'pneuma',
    ptGloss: 'espírito, vento, fôlego',
    definition:
      'Pneuma é o paralelo grego do hebraico ruach, cobrindo os sentidos de vento, fôlego e espírito. O Espírito Santo (Pneuma Hagion) é a terceira Pessoa da Trindade, prometido por Cristo (Jo 14:16) e derramado em Pentecostes (At 2:1-4). O Pneuma habita no crente (1Co 6:19), intercede por ele (Rm 8:26), o guia para toda a verdade (Jo 16:13) e produz os frutos da vida cristã (Gl 5:22-23).',
    verses: ['Jo 3:8', 'Rm 8:26'],
  },
  {
    id: 'G2222',
    lang: 'G',
    word: 'ζωή',
    translit: 'zoe',
    ptGloss: 'vida (verdadeira, eterna)',
    definition:
      'Zoe no Novo Testamento refere-se à vida em sua qualidade mais plena e genuína — a vida divina em oposição à mera existência biológica (bios). Cristo veio para que tenhamos zoe e a tenhamos em abundância (Jo 10:10). A "vida eterna" (zoe aionios) não é apenas vida que dura para sempre, mas a própria vida de Deus participada pelo crente já nesta era, inaugurada na nova criação. Quem tem o Filho tem a zoe (1Jo 5:12).',
    verses: ['Jo 10:10', '1Jo 5:12'],
  },
  {
    id: 'G2540',
    lang: 'G',
    word: 'καιρός',
    translit: 'kairos',
    ptGloss: 'tempo oportuno, momento decisivo',
    definition:
      'Kairos se distingue de "chronos" (tempo cronológico sequencial) por designar o momento certo, o tempo oportuno e decisivo. No Novo Testamento, o kairos está relacionado ao cumprimento dos propósitos divinos: "o tempo se cumpriu" (Mc 1:15) usa kairos para anunciar que o momento decisivo da irrupção do Reino de Deus chegou na pessoa de Jesus. O cristão deve resgatar o kairos, aproveitando com sabedoria as oportunidades que Deus providencia.',
    verses: ['Mc 1:15', 'Ef 5:16'],
  },
  {
    id: 'G3952',
    lang: 'G',
    word: 'παρουσία',
    translit: 'parousia',
    ptGloss: 'vinda, presença, chegada',
    definition:
      'Parousia significava no grego antigo a chegada oficial de um rei ou imperador a uma cidade. No Novo Testamento, tornou-se o termo técnico para a segunda vinda de Cristo em glória, poder e julgamento. Paulo descreve a parousia em 1 Tessalonicenses 4:15-17 como o momento em que os mortos em Cristo ressuscitarão e os vivos serão arrebatados para encontrá-lo. A parousia é a esperança que sustenta a igleja durante os tempos de provação.',
    verses: ['1Ts 4:15', 'Mt 24:27'],
  },
  {
    id: 'G4982',
    lang: 'G',
    word: 'σῴζω',
    translit: 'sozo',
    ptGloss: 'salvar, curar, libertar',
    definition:
      'Sozo abrange os sentidos de salvar de perigo, curar de doença e libertar de poderes malignos. A salvação bíblica é total: espiritual, física e social. O nome "Jesus" (Iesous) é a transliteração grega de Yeshua, que significa "YHWH salva" — seu próprio nome é a missão. Sozo é usado indiscriminadamente para a cura do cego Bartimeu (Mc 10:52), para o salvamento na tempestade e para a salvação da alma. A salvação em Cristo é plena e integral.',
    verses: ['Rm 10:13', 'Lc 19:10'],
  },
  {
    id: 'G1577',
    lang: 'G',
    word: 'ἐκκλησία',
    translit: 'ekklesia',
    ptGloss: 'igreja, assembleia, congregação',
    definition:
      'Ekklesia significa "assembleia dos chamados" — aqueles que foram convocados para fora e reunidos em conjunto. No mundo grego, designava a assembleia de cidadãos; no Novo Testamento, é o povo de Deus convocado por Jesus Cristo. A ekklesia não é um edifício nem uma instituição, mas o povo reunido em torno de Cristo, que é a sua cabeça (Ef 1:22-23). Cristo edificou sua ekklesia e as portas do inferno não prevalecerão contra ela (Mt 16:18).',
    verses: ['Mt 16:18', 'Ef 1:22'],
  },
  {
    id: 'G3341',
    lang: 'G',
    word: 'μετάνοια',
    translit: 'metanoia',
    ptGloss: 'arrependimento, mudança de mente',
    definition:
      'Metanoia literalmente significa "mudança de mente" — uma transformação radical na forma de pensar e, consequentemente, de agir. Não é apenas sentir-se mal pelo pecado (isso é metamelomai), mas uma reorientação completa da mente, da vontade e do coração em direção a Deus. João Batista, Jesus e os apóstolos iniciaram seu ministério com o chamado à metanoia (Mt 3:2; 4:17; At 2:38). É a porta de entrada para o reino de Deus.',
    verses: ['At 2:38', 'Lc 15:7'],
  },
  {
    id: 'G2842',
    lang: 'G',
    word: 'κοινωνία',
    translit: 'koinonia',
    ptGloss: 'comunhão, participação, parceria',
    definition:
      'Koinonia expressa o compartilhamento profundo de uma vida em comum. Na igreja primitiva, a koinonia era uma marca distintiva da comunidade cristã: compartilhavam a fé, as refeições, os bens e o sofrimento (At 2:42-44). É uma participação (koinonia) na vida divina — do Pai, do Filho e do Espírito Santo (2Co 13:14). A koinonia é ao mesmo tempo vertical (com Deus) e horizontal (com os irmãos), e as duas dimensões são inseparáveis.',
    verses: ['1Jo 1:3', 'At 2:42'],
  },
  {
    id: 'G3466',
    lang: 'G',
    word: 'μυστήριον',
    translit: 'mysterion',
    ptGloss: 'mistério, segredo revelado',
    definition:
      'Mysterion no Novo Testamento não é algo obscuro ou incompreensível, mas um segredo do propósito divino que estava oculto e foi agora revelado em Cristo. Paulo usa a palavra para descrever o grande mistério do Evangelho: que os gentios seriam co-herdeiros com Israel e que Cristo habitaria nos crentes pela fé (Ef 3:4-6; Cl 1:26-27). O mysterion é, portanto, uma revelação divina — um segredo que Deus abriu, não fechou.',
    verses: ['Ef 3:4', 'Cl 1:27'],
  },
  {
    id: 'G1343',
    lang: 'G',
    word: 'δικαιοσύνη',
    translit: 'dikaiosyne',
    ptGloss: 'justiça, retidão',
    definition:
      'Dikaiosyne é a "justiça" que Deus tanto exige quanto provê. Paulo desenvolve o conceito de "justiça de Deus" (dikaiosyne Theou) como a retidão divina que se manifesta no Evangelho: Deus declara justo o ímpio que crê em Jesus (Rm 3:21-22; 4:5). A justificação (dikaiosyne) é forense — uma declaração legal — mas suas implicações são transformadoras. Buscar primeiro o Reino de Deus e a sua dikaiosyne (Mt 6:33) é a orientação central da vida cristã.',
    verses: ['Rm 3:21', 'Mt 6:33'],
  },
  {
    id: 'G4991',
    lang: 'G',
    word: 'σωτηρία',
    translit: 'soteria',
    ptGloss: 'salvação, libertação',
    definition:
      'Soteria é o substantivo da salvação — o estado de quem foi salvo e o processo pelo qual isso ocorre. No Novo Testamento, a soteria tem dimensões passadas (fomos salvos — justificação), presentes (estamos sendo salvos — santificação) e futuras (seremos salvos — glorificação). É uma obra completa de Deus em Cristo, desde a eleição antes da fundação do mundo até a ressurreição final do corpo. "A soteria é do SENHOR" (Ap 7:10).',
    verses: ['Ef 2:8', 'Rm 1:16'],
  },
  {
    id: 'G266',
    lang: 'G',
    word: 'ἁμαρτία',
    translit: 'hamartia',
    ptGloss: 'pecado, erro, falha',
    definition:
      'Hamartia literalmente significa "errar o alvo" — falhar em atingir o padrão de Deus. É a palavra mais comum do Novo Testamento para pecado, abrangendo tanto atos específicos de transgressão quanto o estado de pecaminosidade inerente à natureza humana caída. "Todos pecaram" (pantes hemarton, Rm 3:23) — é a condição universal da humanidade. Cristo, que "não conheceu pecado" (hamartia), tornou-se pecado por nós (2Co 5:21) para que fôssemos sua dikaiosyne.',
    verses: ['Rm 3:23', 'Jo 1:29'],
  },
  {
    id: 'G1391',
    lang: 'G',
    word: 'δόξα',
    translit: 'doxa',
    ptGloss: 'glória, esplendor, honra',
    definition:
      'Doxa é a glória divina que se manifesta no Novo Testamento supremamente em Jesus Cristo, "o resplendor da glória de Deus" (Hb 1:3). Enquanto a gloria do Sinai era transitória, a doxa revelada em Cristo é permanente e transformadora: contemplando-a, somos transformados "de glória em glória" (2Co 3:18). O objetivo final da criação e da redenção é que toda a terra "se encha do conhecimento da glória do SENHOR" (Hc 2:14). A doxa é o fim para o qual todas as coisas convergem.',
    verses: ['Jo 17:24', '2Co 3:18'],
  },
  {
    id: 'G225',
    lang: 'G',
    word: 'ἀλήθεια',
    translit: 'aletheia',
    ptGloss: 'verdade, realidade',
    definition:
      'Aletheia em grego significa literalmente "o não-escondido" — o que é revelado, real e genuíno em oposição ao falso e ao ilusório. Jesus se autodenomina "a Aletheia" (Jo 14:6), afirmando ser a realidade definitiva da qual todas as outras verdades são sombras. O Espírito Santo é "o Espírito da aletheia" (Jo 16:13). Adorar a Deus "em aletheia" é adorá-lo com autenticidade e em conformidade com quem ele realmente é, revelado em Cristo.',
    verses: ['Jo 14:6', 'Jo 8:32'],
  },
  {
    id: 'G3107',
    lang: 'G',
    word: 'μακάριος',
    translit: 'makarios',
    ptGloss: 'bem-aventurado, feliz, abençoado',
    definition:
      'Makarios descreve o estado de felicidade plena e profunda que transcende as circunstâncias. Na cultura grega, era usado para descrever os deuses e os que participavam de sua vida feliz. Jesus usa makarios nas Bem-aventuranças (Mt 5:3-12) para inverter a expectativa de quem é realmente feliz: não os poderosos e ricos, mas os pobres de espírito, os mansos, os puros de coração. A makariotez (bem-aventurança) é um estado escatológico que começa agora e se completa no reino.',
    verses: ['Mt 5:3', 'Ap 14:13'],
  },

  // ── HEBRAICO (adicionais) ─────────────────────────────────────────────────
  {
    id: 'H113',
    lang: 'H',
    word: 'אָדוֹן',
    translit: 'Adon',
    ptGloss: 'Senhor, mestre, soberano',
    definition:
      'Adon designa autoridade e soberania sobre pessoas ou coisas. Na forma plural intensiva "Adonai" tornou-se o substituto oral mais comum para o nome sagrado YHWH. Chamar a Deus de Adonai implica total submissão e reconhecimento de sua señoria absoluta sobre todas as áreas da vida. O profeta Isaías usa Adonai de forma magistral na visão do trono celestial (Is 6:1), onde vê ao Adonai "assentado sobre um trono alto e exaltado".',
    verses: ['Is 6:1', 'Sl 110:1'],
  },
  {
    id: 'H2896',
    lang: 'H',
    word: 'טוֹב',
    translit: 'tov',
    ptGloss: 'bom, bondade, bem',
    definition:
      'Tov é a primeira avaliação que Deus faz de sua criação: "e viu Deus que era tov" (Gn 1:4). Abrange bondade moral, beleza estética, utilidade prática e bem-estar relacional. A bondade (tov) de Deus é o fundamento do Salmo 34:8 — "provai e vede que o SENHOR é bom" — um convite à experiência pessoal da generosidade divina. Tudo o que Deus faz é tov, e o ser humano criado à sua imagem é chamado a discernir e escolher o tov.',
    verses: ['Gn 1:31', 'Sl 34:8'],
  },
  {
    id: 'H6440',
    lang: 'H',
    word: 'פָּנִים',
    translit: 'panim',
    ptGloss: 'face, presença',
    definition:
      'Panim literalmente significa "rosto" ou "face", mas na teologia bíblica representa a presença pessoal e ativa de Deus. "Buscar o panim de Deus" é buscar sua presença e favor (Sl 27:8). "O SENHOR faça resplandecer seu panim sobre ti" (Nm 6:25) é a bênção sacerdotal que pede a presença favorável de Deus. O pecado separa o ser humano do panim de Deus; a redenção restaura essa comunhão face a face, prefiguração da visão beatífica na eternidade (Ap 22:4).',
    verses: ['Nm 6:25', 'Sl 27:8'],
  },
  {
    id: 'H3548',
    lang: 'H',
    word: 'כֹּהֵן',
    translit: 'kohen',
    ptGloss: 'sacerdote, mediador',
    definition:
      'O kohen era o mediador oficial entre Deus e o povo — o único autorizado a entrar nas áreas sagradas do Tabernáculo e a oferecer sacrifícios. Aaron e seus descendentes foram consagrados ao kohanim, mas Israel inteiro foi chamado a ser "reino de sacerdotes" (Êx 19:6). Cristo é o Sumo Sacerdote definitivo (Hb 4:14), que se ofereceu a si mesmo como sacrifício eterno. Por Cristo, todos os crentes são constituídos "sacerdócio real" (1Pe 2:9).',
    verses: ['Lv 1:7', 'Sl 110:4'],
  },
  {
    id: 'H5030',
    lang: 'H',
    word: 'נָבִיא',
    translit: 'navi',
    ptGloss: 'profeta, porta-voz',
    definition:
      'O navi não era primariamente um previsor do futuro, mas um porta-voz (o que é "chamado" ou "borbulha" as palavras divinas). Ele falava em nome de Deus para o povo, chamando-o à obediência, denunciando a injustiça e anunciando a redenção futura. O profetismo bíblico atingiu seu ápice em Jesus, o profeta definitivo anunciado por Moisés (Dt 18:15), que não apenas comunicou a Palavra de Deus, mas é ele mesmo a Palavra encarnada.',
    verses: ['Dt 18:15', 'Am 3:7'],
  },
  {
    id: 'H4428',
    lang: 'H',
    word: 'מֶלֶךְ',
    translit: 'melech',
    ptGloss: 'rei, governante',
    definition:
      'Melech é o rei, o governante soberano. No Antigo Testamento, YHWH é o Melech supremo de Israel — "o SENHOR é o nosso Rei" (Is 33:22). A monarquia humana foi estabelecida como concessão (1Sm 8), mas cada rei deveria ser um vice-rei que governava em nome de YHWH, mantendo a justiça e a fidelidade à aliança. O reino davídico apontava para o Messias, o Melech eterno cujo reino não terá fim (Lc 1:33).',
    verses: ['Sl 47:7', 'Lc 1:33'],
  },
  {
    id: 'H5650',
    lang: 'H',
    word: 'עֶבֶד',
    translit: 'eved',
    ptGloss: 'servo, escravo, ministro',
    definition:
      'Eved designa o servo ou escravo — alguém cuja existência está totalmente à disposição de seu senhor. No Antigo Testamento, ser chamado de "eved YHWH" (servo do SENHOR) é uma das maiores honras: Moisés, Davi, os profetas e o próprio Israel são chamados assim. Isaías 53 apresenta o Servo Sofredor, o eved por excelência, que carrega os pecados de muitos. Jesus inverteu os valores ao dizer que "quem quiser ser grande entre vós, que seja vosso eved" (Mt 20:27).',
    verses: ['Is 53:11', 'Mt 20:27'],
  },
  {
    id: 'H1293',
    lang: 'H',
    word: 'בְּרָכָה',
    translit: 'berakah',
    ptGloss: 'bênção, prosperidade',
    definition:
      'Berakah é o substantivo de bênção — a palavra de favor, poder e vida declarada sobre alguém por uma autoridade. Deus abençoa (barak) e a berakah que flui dessa ação é real e transformadora. A promessa abraâmica — "serei a tua grande berakah" (Gn 12:2) — é o motor de toda a história da redenção: Abraão é abençoado para ser canal de berakah para todas as nações. Em Cristo, "todos os que são da fé são abençoados com o fiel Abraão" (Gl 3:9).',
    verses: ['Gn 12:2', 'Gl 3:9'],
  },
  {
    id: 'H7812',
    lang: 'H',
    word: 'שָׁחָה',
    translit: 'shachah',
    ptGloss: 'prostrar-se, adorar, reverenciar',
    definition:
      'Shachah é o ato de prostrar-se com o rosto no chão — a postura corporal mais humilde de reverência diante de um superior. No Antigo Testamento, é a palavra mais usada para adoração a Deus, expressando total dependência e submissão ao Soberano. O mandamento "não te prostrarás (shachah) a outros deuses" (Êx 20:5) usa exatamente esse verbo. A adoração genuína começa com o reconhecimento de quem Deus é e do que somos diante dele.',
    verses: ['Êx 20:5', 'Sl 95:6'],
  },
  {
    id: 'H8104',
    lang: 'H',
    word: 'שָׁמַר',
    translit: 'shamar',
    ptGloss: 'guardar, obedecer, preservar',
    definition:
      'Shamar é uma palavra de vigilância cuidadosa — guardar algo precioso, proteger, manter intacto. Adão foi colocado no jardim para "lavrar e guardar" (shamar, Gn 2:15). Guardar os mandamentos de Deus (shamar mitzvot) é expressão central da aliança no Deuteronômio. O Salmo 121 afirma que YHWH é o shamar de Israel — o guardião que não dorme nem cochila, protegendo seu povo de todo o mal.',
    verses: ['Sl 121:4', 'Dt 5:12'],
  },
  {
    id: 'H1980',
    lang: 'H',
    word: 'הָלַךְ',
    translit: 'halak',
    ptGloss: 'andar, caminhar, viver',
    definition:
      'Halak é o verbo de movimento mais básico do hebraico — andar, ir — mas na linguagem bíblica tornou-se metáfora da vida moral e espiritual inteira. "Andar com Deus" (halak et-Elohim) é o testemunho de Enoque (Gn 5:24) e Noé (Gn 6:9) — uma vida de comunhão íntima com o Criador. O Salmo 1 contrasta os dois caminhos: o justo que não anda (halak) no conselho dos ímpios, e a via do bem que Deus conhece e abençoa.',
    verses: ['Mq 6:8', 'Sl 1:1'],
  },
  {
    id: 'H3034',
    lang: 'H',
    word: 'יָדָה',
    translit: 'yadah',
    ptGloss: 'louvar, agradecer, confessar',
    definition:
      'Yadah vem da raiz "yad" (mão) e literalmente evoca o ato de estender as mãos — seja em gesto de confissão humilde ou de louvor exuberante. O mesmo verbo serve tanto para "confessar os pecados" (Sl 32:5) quanto para "louvar o SENHOR com toda a minha vida" (Sl 146:2). Essa dupla dimensão revela que o louvor genuíno passa pela honestidade diante de Deus. "Toda a Judá" (Yehudah) tem seu nome derivado de yadah — o povo do louvor.',
    verses: ['Sl 107:1', 'Sl 32:5'],
  },
  {
    id: 'H2403',
    lang: 'H',
    word: 'חַטָּאת',
    translit: 'chattat',
    ptGloss: 'pecado, oferta pelo pecado',
    definition:
      'Chattat deriva do verbo "chata" — errar o alvo, desviar do caminho certo. Designa tanto o ato de pecar quanto o sacrifício exigido para expiá-lo (oferta pelo pecado). O sistema sacrificial levítico prescrevia a chattat como o meio de restauração da relação com Deus após a transgressão. A profecia do Servo Sofredor em Isaías 53:10 afirma que sua vida seria "oferta pelo pecado" (chattat) — cumprida supremamente em Cristo que "por nós, o fez pecado" (2Co 5:21).',
    verses: ['Lv 4:3', 'Is 53:10'],
  },
  {
    id: 'H4194',
    lang: 'H',
    word: 'מָוֶת',
    translit: 'mavet',
    ptGloss: 'morte, falecimento',
    definition:
      'Mavet é a morte em todas as suas dimensões: física, espiritual e como separação de Deus. O resultado do pecado no jardim é mavet (Gn 2:17), e a morte passou a todos os seres humanos por causa da Queda (Rm 5:12). Os profetas personificam mavet como uma força hostil que devora (Os 13:14; Is 25:8). O Novo Testamento anuncia que Cristo destruiu o poder do mavet pela ressurreição — "a morte foi tragada pela vitória" (1Co 15:54-55).',
    verses: ['Gn 2:17', 'Os 13:14'],
  },
  {
    id: 'H2416',
    lang: 'H',
    word: 'חַי',
    translit: 'chay',
    ptGloss: 'vida, vivo, vivente',
    definition:
      'Chay é a vida em sentido amplo — biológica, relacional e espiritual. "El Chay" — o Deus vivo — é o único ser que tem vida em si mesmo e a comunica a tudo o que existe. A bênção da aliança prometia chay abundante à comunidade obediente, enquanto a desobediência levava à morte. A "água viva" (mayim chayim) é símbolo frequente da vida espiritual que brota da presença de Deus, evocada por Jesus na conversa com a samaritana (Jo 4:10).',
    verses: ['Dt 30:19', 'Jo 4:10'],
  },
  {
    id: 'H4687',
    lang: 'H',
    word: 'מִצְוָה',
    translit: 'mitzvah',
    ptGloss: 'mandamento, preceito',
    definition:
      'Mitzvah é o mandamento ou preceito ordenado por Deus — cada uma das instruções específicas da Torah. Para Israel, as mitzvot não eram um fardo, mas um privilégio: sinalizavam a relação de aliança com Deus e distinguiam Israel das nações. O Salmo 119, o mais longo da Bíblia, é inteiramente dedicado ao amor pelas mitzvot divinas. Jesus resumiu todas as mitzvot no duplo mandamento do amor (Mt 22:37-40), cumprindo e transcendendo a Lei.',
    verses: ['Sl 119:10', 'Mt 22:38'],
  },
  {
    id: 'H1350',
    lang: 'H',
    word: 'גָּאַל',
    translit: 'gaal',
    ptGloss: 'remir, resgatar, parente-redentor',
    definition:
      'Gaal descreve o ato do "parente-redentor" (go\'el) — o familiar mais próximo obrigado por lei a resgatar um parente em dificuldade: comprar de volta terras vendidas, libertar da escravidão ou vingar o sangue. O livro de Rute apresenta Boaz como go\'el de Rute e Noemi. YHWH é o go\'el supremo de Israel (Is 41:14), que resgata seu povo da escravidão do Egito e do pecado. Cristo é o parente-redentor definitivo que pagou o preço de nossa liberdade.',
    verses: ['Is 41:14', 'Rt 4:14'],
  },
  {
    id: 'H5771',
    lang: 'H',
    word: 'עָוֺן',
    translit: 'avon',
    ptGloss: 'iniquidade, culpa, tortuosidade',
    definition:
      'Avon descreve a iniquidade como distorção ou tortuosidade moral — o desvio do caminho reto. Inclui tanto o ato pecaminoso quanto a culpa resultante. O Salmo 51, oração de arrependimento de Davi, usa avon para a profundidade de sua transgressão: "lava-me completamente da minha iniquidade" (v.2). Isaías 53:6 declara que YHWH fez recair sobre o Servo o avon de todos nós — base bíblica da doutrina da expiação substitutiva.',
    verses: ['Is 53:6', 'Sl 51:2'],
  },
  {
    id: 'H6588',
    lang: 'H',
    word: 'פֶּשַׁע',
    translit: 'pesha',
    ptGloss: 'transgressão, rebelião',
    definition:
      'Pesha é a palavra mais grave para pecado no hebraico bíblico — não um mero erro, mas uma rebelião deliberada e intencional contra a autoridade de Deus. Implica a ruptura consciente de uma relação de aliança. Isaías 53 usa pesha três vezes para descrever o que o Servo Sofredor carregou: "ele foi traspassado pelas nossas transgressões" (v.5). A expiação em Cristo trata do pesha em toda a sua gravidade — a rebelião do ser humano contra o Soberano.',
    verses: ['Is 53:5', 'Sl 32:1'],
  },
  {
    id: 'H6754',
    lang: 'H',
    word: 'צֶלֶם',
    translit: 'tselem',
    ptGloss: 'imagem, semelhança',
    definition:
      'Tselem é a palavra de "imagem" usada em Gênesis 1:26-27 — o ser humano criado à imagem (tselem) de Deus. No Antigo Oriente, o tselem do rei era erguido nos territórios conquistados para representar sua presença e autoridade. O ser humano, portanto, foi criado para ser a representação e o vice-regente de Deus na criação. O pecado danificou (mas não destruiu) esse tselem; a redenção em Cristo o restaura progressivamente à perfeita imagem divina (2Co 3:18; Cl 3:10).',
    verses: ['Gn 1:27', '2Co 3:18'],
  },
  {
    id: 'H7355',
    lang: 'H',
    word: 'רָחַם',
    translit: 'racham',
    ptGloss: 'ter compaixão, amar ternamente',
    definition:
      'Racham vem da raiz "rechem" — útero materno. É um amor visceral e protetor, como o de uma mãe por seu filho. YHWH descreve a si mesmo com esse amor visceral: "pode uma mulher esquecer o filho que ainda mama? ... mas eu nunca me esquecerei de ti" (Is 49:15). "YHWH Raum" — o SENHOR compassivo — revela um Deus que sente o sofrimento de seu povo e é movido a agir. O substantivo "rahamim" (misericórdias/compaixões) aparece frequentemente ao lado de chesed.',
    verses: ['Is 49:15', 'Sl 103:13'],
  },
  {
    id: 'H5162',
    lang: 'H',
    word: 'נָחַם',
    translit: 'nacham',
    ptGloss: 'consolar, confortar, arrepender-se',
    definition:
      'Nacham tem dois sentidos aparentemente opostos: consolar alguém em luto e arrepender-se de uma ação. Ambos compartilham a ideia de mudança emocional profunda. Quando Deus "se arrepende" (nacham) de algo, não é porque errou, mas porque as circunstâncias mudaram e ele age de forma diferente em resposta. O consolador por excelência é YHWH: "como alguém a quem sua mãe conforta, assim eu vos consolarei" (Is 66:13). "Naum" e "Menahem" são nomes derivados de nacham.',
    verses: ['Is 40:1', 'Is 66:13'],
  },
  {
    id: 'H7725',
    lang: 'H',
    word: 'שׁוּב',
    translit: 'shuv',
    ptGloss: 'retornar, voltar, arrepender-se',
    definition:
      'Shuv é o verbo do arrependimento por excelência no Antigo Testamento — não teshuvah (o conceito), mas o ato concreto de dar meia-volta e retornar ao ponto de partida. "Voltai para mim, e eu voltarei para vós" (Ml 3:7) usa shuv duas vezes, revelando que o arrependimento é correspondido pelo retorno de Deus. Os profetas chamavam Israel ao shuv a cada geração. A parábola do filho pródigo em Lucas 15 é a encarnação neotestamentária do shuv.',
    verses: ['Ml 3:7', 'Os 6:1'],
  },
  {
    id: 'H5459',
    lang: 'H',
    word: 'סְגֻלָּה',
    translit: 'segulah',
    ptGloss: 'tesouro particular, propriedade especial',
    definition:
      'Segulah descreve a propriedade pessoal mais valiosa de um rei — seu tesouro particular, distinto do erário público. Quando Deus chama Israel de sua segulah (Êx 19:5; Dt 7:6), está declarando que este povo não é apenas parte de uma posse genérica, mas seu bem mais precioso e inestimável. Pedro retoma essa imagem para a Igreja: "povo que é propriedade exclusiva de Deus" (1Pe 2:9). O crente é a segulah do Criador do universo.',
    verses: ['Êx 19:5', '1Pe 2:9'],
  },
  {
    id: 'H5971',
    lang: 'H',
    word: 'עַם',
    translit: 'am',
    ptGloss: 'povo, nação, comunidade',
    definition:
      'Am designa um povo unido por laços de família, história ou aliança — não apenas uma multidão, mas uma comunidade com identidade compartilhada. "Am Yisrael" — o povo de Israel — é a comunidade de aliança formada pelos doze filhos de Jacó. A promessa de aliança "vós sereis o meu povo e eu serei o vosso Deus" usa am para expressar a relação íntima e exclusiva entre YHWH e Israel. No Novo Testamento, essa identidade se expande para incluir todas as nações em Cristo.',
    verses: ['Lv 26:12', 'Jr 31:33'],
  },
  {
    id: 'H4467',
    lang: 'H',
    word: 'מַמְלָכָה',
    translit: 'mamlakah',
    ptGloss: 'reino, reinado',
    definition:
      'Mamlakah é o reino — o território e o povo sob a soberania de um melech (rei). O grande sonho dos profetas era a mamlakah de Deus se estabelecendo sobre toda a terra, substituindo todos os reinos humanos. Daniel vê uma pedra cortar uma grande estátua e tornar-se um monte que enche a terra inteira — símbolo da mamlakah divina que consumirá todos os impérios (Dn 2:44). Jesus proclamou a chegada dessa mamlakah como o coração de seu ministério (Mc 1:15).',
    verses: ['Dn 2:44', 'Sl 22:28'],
  },
  {
    id: 'H5797',
    lang: 'H',
    word: 'עֹז',
    translit: 'oz',
    ptGloss: 'força, poder, refúgio',
    definition:
      'Oz é a força robusta e protetora — não apenas poder físico, mas a força que provê segurança e estabilidade. YHWH é o oz de seu povo: "O SENHOR é a minha força (oz) e o meu escudo" (Sl 28:7). A Arca da Aliança é chamada de "oz de Deus" porque representava sua presença poderosa (Sl 78:61). A força humana é transitória; somente no oz divino o ser humano encontra sustentação permanente. Paulo ecoa isso ao dizer "tudo posso naquele que me fortalece".',
    verses: ['Sl 28:7', 'Sl 46:1'],
  },
  {
    id: 'H8416',
    lang: 'H',
    word: 'תְּהִלָּה',
    translit: 'tehillah',
    ptGloss: 'louvor, hino, celebração',
    definition:
      'Tehillah é o louvor exaltado e público — o hino cantado em honra de Deus. O livro dos Salmos em hebraico se chama "Tehillim" (louvores), revelando que a coleção inteira é uma escola de louvor. Deus "habita entre os louvores (tehillot) de Israel" (Sl 22:3) — a adoração cria o ambiente de sua presença manifesta. O ser humano foi criado para a tehillah: a existência humana encontra seu propósito mais profundo no louvor contínuo ao Criador.',
    verses: ['Sl 22:3', 'Is 60:18'],
  },
  {
    id: 'H7200',
    lang: 'H',
    word: 'רָאָה',
    translit: 'raah',
    ptGloss: 'ver, contemplar, perceber',
    definition:
      'Raah é o verbo de ver com todos os seus matizes: visão física, percepção espiritual e revelação profética. "El Roi" — o Deus que vê — é o nome que Hagar dá a Deus após ele ver sua aflição no deserto (Gn 16:13). O nome do profeta em hebraico antigo era "ro\'eh" (vidente) — aquele que raah com olhos espirituais o que outros não percebem. "No monte do SENHOR será provido (raah)" — YHWH Yireh — o Deus que provê porque vê a necessidade.',
    verses: ['Gn 22:14', 'Gn 16:13'],
  },
  {
    id: 'H6942',
    lang: 'H',
    word: 'קָדַשׁ',
    translit: 'qadash',
    ptGloss: 'santificar, consagrar, apartar',
    definition:
      'Qadash é o verbo de consagração — o ato de apartar algo do comum e dedicá-lo exclusivamente a Deus. Deus qadash o sétimo dia (Gn 2:3), o monte Sinai (Êx 19:23) e o tabernáculo. Ele também chama seu povo: "santificai-vos (qadash) e sede santos" (Lv 11:44). No Novo Testamento, Cristo, por sua obra, santifica (hagiazo) a Igreja, tornando-a seu corpo santo e sem mancha. A santificação progressiva é a obra do Espírito que qadash o crente ao longo de toda a vida.',
    verses: ['Lv 11:44', 'Jo 17:19'],
  },

  // ── GREGO (adicionais) ────────────────────────────────────────────────────
  {
    id: 'G2316',
    lang: 'G',
    word: 'θεός',
    translit: 'theos',
    ptGloss: 'Deus, divindade',
    definition:
      'Theos é o termo grego mais geral para Deus, equivalente ao hebraico Elohim. João 1:1 afirma de forma revolucionária que "o Logos era theos" — não um deus entre outros, mas o próprio Deus absoluto. O Novo Testamento usa theos predominantemente para o Pai, mas também o aplica ao Filho (Jo 20:28; Hb 1:8) e ao Espírito Santo. O monoteísmo cristão distingue-se ao afirmar que o único Theos subsiste em três Pessoas distintas mas em essência unificada.',
    verses: ['Jo 1:1', 'Jo 20:28'],
  },
  {
    id: 'G5547',
    lang: 'G',
    word: 'Χριστός',
    translit: 'Christos',
    ptGloss: 'Cristo, o Ungido',
    definition:
      'Christos é a tradução grega do hebraico "Mashiach" (Messias) — o Ungido. Na cultura israelita, a unção com óleo consagrava profetas, sacerdotes e reis para seus ofícios. Jesus é o Cristo porque recebeu a unção do Espírito sem medida (Jo 3:34) e é simultaneamente o Profeta definitivo, o Sumo Sacerdote eterno e o Rei dos reis. Confiar em Jesus como o Christos é reconhecer que ele cumpriu todas as esperanças messiânicas do Antigo Testamento.',
    verses: ['Jo 20:31', 'Mt 16:16'],
  },
  {
    id: 'G1680',
    lang: 'G',
    word: 'ἐλπίς',
    translit: 'elpis',
    ptGloss: 'esperança, expectativa confiante',
    definition:
      'Elpis no Novo Testamento não é uma esperança incerta ("espero que sim, mas não sei"), mas uma expectativa confiante e fundamentada nas promessas de Deus. A tríade fé, esperança e amor (1Co 13:13) coloca a elpis no centro da vida cristã. A elpis cristã está ancorada na ressurreição de Cristo: sem ela, nossa fé seria vã (1Co 15:19). Paulo descreve Abraão como aquele que "esperou contra toda a esperança" (Rm 4:18) — a elpis que persiste além de toda evidência contrária.',
    verses: ['Rm 8:24', 'Hb 6:19'],
  },
  {
    id: 'G2098',
    lang: 'G',
    word: 'εὐαγγέλιον',
    translit: 'euangelion',
    ptGloss: 'evangelho, boa notícia',
    definition:
      'Euangelion significa literalmente "boa notícia" — no mundo romano, era o anúncio de uma vitória militar ou do nascimento de um herdeiro imperial. Paulo usa a palavra para o anúncio da morte e ressurreição de Cristo como a notícia mais boa que o mundo já ouviu (1Co 15:1-4). O euangelion não é uma ideologia, uma moral ou uma filosofia, mas um fato histórico: Jesus morreu, foi sepultado e ressuscitou. Essa notícia é "poder de Deus para a salvação de todo aquele que crê" (Rm 1:16).',
    verses: ['Rm 1:16', 'Mc 1:1'],
  },
  {
    id: 'G932',
    lang: 'G',
    word: 'βασιλεία',
    translit: 'basileia',
    ptGloss: 'reino, reinado, soberania',
    definition:
      'Basileia é o reino ou reinado — não primariamente um território geográfico, mas o exercício soberano do governo de Deus. A "basileia de Deus" (ou "dos céus" em Mateus) é o tema central da pregação de Jesus: ela chegou na pessoa do próprio Jesus (Lc 17:21), é recebida como criança (Mc 10:15) e ainda virá em plenitude escatológica (Ap 11:15). A basileia é ao mesmo tempo presente e futura — já inaugurada, mas ainda não plenamente consumada.',
    verses: ['Mc 1:15', 'Mt 6:33'],
  },
  {
    id: 'G40',
    lang: 'G',
    word: 'ἅγιος',
    translit: 'hagios',
    ptGloss: 'santo, consagrado, separado',
    definition:
      'Hagios é o adjetivo "santo" — separado, dedicado a Deus, distinto do profano. Deus é o Hagios por excelência (Is 6:3; Ap 4:8). Os crentes são chamados de "hagioi" (santos) não por mérito pessoal, mas porque foram separados para Deus em Cristo (1Co 1:2). O Espírito Santo (Pneuma Hagion) é a fonte da santidade que flui para o crente. A hagiosyne (santidade) é o caráter que Deus produz em seu povo ao longo do processo de santificação.',
    verses: ['1Pe 1:16', '1Co 1:2'],
  },
  {
    id: 'G5479',
    lang: 'G',
    word: 'χαρά',
    translit: 'chara',
    ptGloss: 'alegria, júbilo',
    definition:
      'Chara é a alegria profunda que resulta da experiência de salvação e da presença de Deus — distinta do prazer circunstancial (hedone). É fruto do Espírito (Gl 5:22) e por isso transcende as dificuldades externas: Paulo escreve sobre a chara estando na prisão (Fp 4:4). "Regozijai-vos sempre no Senhor" (Fp 4:4) usa chara como mandamento, mostrando que a alegria cristã não depende das circunstâncias mas da realidade permanente de Cristo. A chara plena é promessa escatológica (Jo 16:24).',
    verses: ['Fp 4:4', 'Jo 15:11'],
  },
  {
    id: 'G5590',
    lang: 'G',
    word: 'ψυχή',
    translit: 'psyche',
    ptGloss: 'alma, vida, ser interior',
    definition:
      'Psyche no Novo Testamento corresponde ao hebraico nefesh — a vida ou o ser vivo em sua dimensão pessoal e interior. Jesus distingue psyche de corpo (Mt 10:28) e de pneuma (1Ts 5:23). "Não temais os que matam o corpo mas não podem matar a psyche" (Mt 10:28). O "curador de almas" (therapon psychon) era título honroso no mundo antigo. Cristo veio para dar sua psyche como resgate por muitos (Mt 20:28), e o crente é chamado a segui-lo mesmo ao custo de perder a própria psyche por ele.',
    verses: ['Mt 10:28', 'Mt 20:28'],
  },
  {
    id: 'G2288',
    lang: 'G',
    word: 'θάνατος',
    translit: 'thanatos',
    ptGloss: 'morte, separação',
    definition:
      'Thanatos é a morte como realidade universal — resultado do pecado (Rm 5:12) e "o último inimigo a ser destruído" (1Co 15:26). O Novo Testamento distingue a morte física da "segunda morte" (Ap 20:14) — a separação eterna de Deus. Cristo "padeceu a morte" (thanatos, Hb 2:9) para libertar todos os que, por medo do thanatos, estavam sujeitos à escravidão por toda a vida. Pela ressurreição, Cristo aboliu o thanatos e trouxe à luz a vida e a imortalidade pelo euangelion (2Tm 1:10).',
    verses: ['Rm 6:23', '1Co 15:26'],
  },
  {
    id: 'G386',
    lang: 'G',
    word: 'ἀνάστασις',
    translit: 'anastasis',
    ptGloss: 'ressurreição, levantamento',
    definition:
      'Anastasis significa "levantar-se" — a ressurreição dos mortos à vida corporal. É o coração do euangelion cristão: "se Cristo não ressuscitou (anastasis), vã é a nossa fé" (1Co 15:17). A anastasis de Jesus não foi uma ressuscitação (retorno ao mesmo corpo mortal), mas uma transformação em corpo glorificado e imperecível — primícias de nossa própria anastasis futura. Jesus se autodenomina "a Anastasis e a Vida" (Jo 11:25), afirmando ser em sua pessoa a fonte e a garantia da ressurreição.',
    verses: ['Jo 11:25', '1Co 15:20'],
  },
  {
    id: 'G3875',
    lang: 'G',
    word: 'παράκλητος',
    translit: 'parakletos',
    ptGloss: 'Consolador, Advogado, Intercessor',
    definition:
      'Parakletos vem de "para" (ao lado) + "kaleo" (chamar) — aquele chamado para ficar ao lado de alguém em necessidade. No âmbito jurídico, era o advogado de defesa. Jesus usa a palavra para o Espírito Santo (Jo 14:16; 16:7): o Parakletos ficará para sempre com os discípulos, ensinará todas as coisas e os guiará à verdade plena. João também chama Jesus de Parakletos (1Jo 2:1) — nosso advogado junto ao Pai. A Igreja nunca está desacompanhada; o Parakletos está sempre presente.',
    verses: ['Jo 14:16', '1Jo 2:1'],
  },
  {
    id: 'G3551',
    lang: 'G',
    word: 'νόμος',
    translit: 'nomos',
    ptGloss: 'lei, norma, princípio',
    definition:
      'Nomos no Novo Testamento refere-se principalmente à Torah hebraica — a Lei mosaica. Paulo desenvolve uma teologia complexa do nomos: a Lei é santa, justa e boa (Rm 7:12), mas não tem o poder de salvar porque o pecado usa seus mandamentos para despertar o desejo de transgredir (Rm 7:7-11). Cristo é o "fim do nomos para a justificação de todo aquele que crê" (Rm 10:4). O crente não está "sob o nomos" como sistema de justificação, mas a ama como expressão do caráter de Deus.',
    verses: ['Rm 3:31', 'Gl 3:24'],
  },
  {
    id: 'G129',
    lang: 'G',
    word: 'αἷμα',
    translit: 'haima',
    ptGloss: 'sangue, vida derramada',
    definition:
      'Haima no contexto bíblico representa a vida derramada — no Antigo Testamento o sangue do sacrifício expiava o pecado porque "a vida da carne está no sangue" (Lv 17:11). O Novo Testamento declara que sem haima não há remissão (Hb 9:22), e que o haima de Cristo é o sacrifício definitivo que purifica de todo pecado (1Jo 1:7). A Ceia do Senhor celebra o "haima da nova aliança" (Lc 22:20), lembrando que nossa redenção custou a vida do Filho de Deus.',
    verses: ['Hb 9:22', '1Jo 1:7'],
  },
  {
    id: 'G2435',
    lang: 'G',
    word: 'ἱλαστήριον',
    translit: 'hilasterion',
    ptGloss: 'propiciação, lugar de expiação',
    definition:
      'Hilasterion é o lugar ou o ato de aplacar a ira justa de Deus contra o pecado por meio de um sacrifício. Paulo usa o termo em Romanos 3:25 para descrever Cristo como o hilasterion — o propiciatório vivo que absorveu a ira divina em nosso lugar. Ao contrário das divindades pagãs que exigiam sacrifícios para ser apaziguadas, o Deus bíblico tomou a iniciativa: ele mesmo proveu o hilasterion em Cristo, demonstrando ao mesmo tempo sua justiça e seu amor (Rm 3:25-26).',
    verses: ['Rm 3:25', '1Jo 2:2'],
  },
  {
    id: 'G2920',
    lang: 'G',
    word: 'κρίσις',
    translit: 'krisis',
    ptGloss: 'julgamento, decisão, sentença',
    definition:
      'Krisis é o julgamento — o ato de distinguir, avaliar e proferir sentença. No Evangelho de João, a krisis já está em operação: "esta é a krisis, que a luz veio ao mundo, e os homens amaram as trevas mais do que a luz" (Jo 3:19). A presença de Jesus força uma decisão — uma krisis — entre a luz e as trevas. Há também a krisis futura e final (o Dia do Juízo), quando toda a humanidade prestará contas a Deus. Cristo, o Filho, recebeu do Pai toda a autoridade para executar a krisis (Jo 5:27).',
    verses: ['Jo 3:19', 'Jo 5:30'],
  },
  {
    id: 'G2537',
    lang: 'G',
    word: 'καινός',
    translit: 'kainos',
    ptGloss: 'novo (qualitativo), diferente',
    definition:
      'Kainos difere de "neos" (novo em sentido temporal) por indicar novidade qualitativa — algo que é de uma ordem superior, diferente por natureza, não apenas por idade. A "nova aliança" (kainos diatheke) de Hebreus não é apenas uma aliança mais recente, mas qualitativamente superior à mosaica. A "nova criação" (kainos ktisis, 2Co 5:17) em Cristo não é um remendo no velho, mas uma nova ordem de existência. "Eis que faço novas todas as coisas (kainos)" (Ap 21:5) anuncia a consumação escatológica.',
    verses: ['2Co 5:17', 'Ap 21:5'],
  },
  {
    id: 'G165',
    lang: 'G',
    word: 'αἰών',
    translit: 'aion',
    ptGloss: 'era, eternidade, século',
    definition:
      'Aion designa uma era ou período de tempo — mas também a qualidade da vida que pertence a essa era. "Vida eterna" (zoe aionios) é literalmente "vida da era vindoura" — a vida do Reino de Deus. O "deus deste aion" (2Co 4:4) é Satanás, que governa a ordem presente. Cristo inaugurou o "aion vindouro" em sua ressurreição, tornando possível que os crentes participem agora da vida do Reino futuro. "Ap aionon" (desde os séculos) descreve os propósitos eternos de Deus (Ef 3:11).',
    verses: ['Jo 17:3', 'Ef 3:11'],
  },
  {
    id: 'G4335',
    lang: 'G',
    word: 'προσευχή',
    translit: 'proseuche',
    ptGloss: 'oração, súplica',
    definition:
      'Proseuche é a palavra mais abrangente para oração no Novo Testamento — o diálogo da criatura com o Criador. Vem de "pros" (em direção a) + "euche" (voto/oração), expressando a ideia de orientar-se em direção a Deus. Paulo instrui à oração contínua: "perseverai na proseuche" (Rm 12:12; 1Ts 5:17). O modelo de proseuche dado por Jesus — o Pai-Nosso (Mt 6:9-13) — estrutura a oração em torno da glória de Deus, das necessidades diárias e do perdão mútuo. A proseuche é o pulso da vida espiritual.',
    verses: ['Fp 4:6', 'Mt 6:9'],
  },
  {
    id: 'G652',
    lang: 'G',
    word: 'ἀπόστολος',
    translit: 'apostolos',
    ptGloss: 'apóstolo, enviado',
    definition:
      'Apostolos vem de "apostellō" — enviar com autoridade e missão. No Novo Testamento, refere-se primariamente aos doze chamados por Jesus e a Paulo, que foram enviados como representantes plenos do Ressuscitado para lançar os fundamentos da Igreja (Ef 2:20). Em sentido mais amplo, todo crente é apostolado — enviado ao mundo com a mensagem do Evangelho. A Grande Comissão (Mt 28:19-20) é o mandado apostólico que a Igreja toda deve obedecer em cada geração.',
    verses: ['Ef 2:20', 'Lc 6:13'],
  },
  {
    id: 'G4396',
    lang: 'G',
    word: 'προφήτης',
    translit: 'prophetes',
    ptGloss: 'profeta, porta-voz',
    definition:
      'Prophetes significa literalmente "o que fala em frente" — o porta-voz que proclama a mensagem de Deus. No contexto do Antigo Testamento grego (LXX), traduzia o hebraico navi. No Novo Testamento, o ministério profético continua na Igreja como dom do Espírito (1Co 12:28; Ef 4:11): o prophetes edifica, exorta e consola a comunidade (1Co 14:3). Jesus é o Prophetes definitivo (At 3:22), e a revelação apostólica e profética é o fundamento sobre o qual a Igreja é edificada (Ef 2:20).',
    verses: ['1Co 14:3', 'At 3:22'],
  },
]
