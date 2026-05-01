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
]
