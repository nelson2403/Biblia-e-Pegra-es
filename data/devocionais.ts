export interface DiaDevocional {
  titulo: string
  versiculo: string
  referencia: string
  reflexao: string
  oracao: string
  pergunta: string
}

export interface SerieDevocional {
  id: string
  titulo: string
  subtitulo: string
  descricao: string
  /** Nome do arquivo em public/fundos, sem extensão. */
  fundo: string
  dias: DiaDevocional[]
}

/**
 * Devocionais em série: jornadas de 7 dias sobre um tema.
 * Conteúdo curado e revisado — não é gerado por IA, justamente porque trata
 * de assuntos sensíveis e cita Escritura.
 */
export const SERIES_DEVOCIONAIS: SerieDevocional[] = [
  {
    id: 'ansiedade',
    titulo: 'Quando a ansiedade aperta',
    subtitulo: '7 dias para entregar o que você não consegue controlar',
    descricao:
      'Para quem acorda com o peito apertado e dorme fazendo contas. Sete dias aprendendo a devolver a Deus o peso que nunca foi nosso para carregar.',
    fundo: 'alvorada',
    dias: [
      {
        titulo: 'O convite de entregar',
        versiculo: 'Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.',
        referencia: '1 Pedro 5:7',
        reflexao:
          'Pedro não diz "administre" a ansiedade, nem "disfarce". Ele diz lançar — o mesmo verbo de quem joga um fardo pesado longe de si, com força. E dá o motivo: porque ele tem cuidado de vós. A entrega não é um exercício de positividade; é a conclusão lógica de saber quem está do outro lado. Você não está soltando o problema no vazio. Está colocando na mão de alguém que já demonstrou cuidado por você antes, muitas vezes, inclusive quando você nem percebeu.',
        oracao:
          'Senhor, hoje eu não vou fingir que está tudo bem. Estou entregando nas tuas mãos aquilo que me tira o sono. Cuida disso, porque eu já tentei e não consegui.',
        pergunta: 'Qual peso específico você está segurando hoje que já deveria ter entregado?',
      },
      {
        titulo: 'A paz que não faz sentido',
        versiculo:
          'E a paz de Deus, que excede todo o entendimento, guardará o vosso coração e a vossa mente em Cristo Jesus.',
        referencia: 'Filipenses 4:7',
        reflexao:
          'Paulo escreveu isso preso. Não era discurso de quem estava numa fase boa. A paz que ele descreve não vem de a situação ter melhorado — ela excede o entendimento justamente porque aparece quando, racionalmente, não deveria aparecer. O texto usa uma palavra militar: guardará, como sentinela que protege um portão. A paz de Deus não é ausência de tempestade; é uma guarda posta em volta do seu coração enquanto a tempestade passa.',
        oracao:
          'Pai, não peço que tudo se resolva hoje. Peço a tua paz mesmo antes da solução, aquela que guarda o coração quando a cabeça não entende.',
        pergunta: 'Você já viveu uma paz que não conseguiu explicar? O que ela mudou em você?',
      },
      {
        titulo: 'Um dia de cada vez',
        versiculo:
          'Portanto, não vos inquieteis com o dia de amanhã, pois o amanhã trará os seus cuidados; basta ao dia o seu próprio mal.',
        referencia: 'Mateus 6:34',
        reflexao:
          'Jesus não proíbe planejar. Ele proíbe sofrer antecipadamente. A ansiedade é quase sempre uma dívida que pagamos hoje por um problema que talvez nunca chegue. Repare na lógica da frase: basta ao dia o seu próprio mal. Hoje já tem o suficiente. Somar a isso o peso de amanhã é carregar duas cargas ao mesmo tempo, sendo que a segunda ainda é imaginária. A graça de Deus vem em porção diária, como o maná: suficiente para hoje, e não estocável.',
        oracao:
          'Senhor, me ajuda a viver hoje. Tira de mim o hábito de sofrer por antecipação e me dá a graça que basta para este dia.',
        pergunta: 'Quanto do que te preocupa hoje é sobre coisas que ainda nem aconteceram?',
      },
      {
        titulo: 'Olhe para as aves',
        versiculo:
          'Observai as aves do céu: não semeiam, não colhem, nem ajuntam em celeiros; contudo, vosso Pai celeste as sustenta.',
        referencia: 'Mateus 6:26',
        reflexao:
          'Jesus manda observar. É um convite a levantar os olhos da planilha e olhar pela janela. As aves trabalham — buscam alimento o dia inteiro — mas não acumulam por medo. Elas vivem no ritmo da provisão diária e não parecem angustiadas por isso. O argumento é comparativo: se Deus sustenta o que não foi feito à sua imagem, quanto mais você. A ansiedade muitas vezes nasce de esquecermos nosso valor diante de quem cuida de nós.',
        oracao:
          'Deus, obrigado porque tu me sustentas. Me ajuda a trabalhar sem desespero e a confiar que aquilo que me falta está no teu controle.',
        pergunta: 'O que a natureza ao seu redor te ensina sobre confiar?',
      },
      {
        titulo: 'Quando o corpo também cansa',
        versiculo: 'Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.',
        referencia: 'Mateus 11:28',
        reflexao:
          'A ansiedade não mora só na cabeça. Ela aperta o peito, tira o sono, embrulha o estômago. Jesus fala com quem está cansado e sobrecarregado — palavras físicas, de quem carrega peso demais. Vale lembrar que Elias, esgotado, foi socorrido por Deus primeiro com comida e sono, e só depois com uma conversa. Cuidar do corpo é parte de cuidar da alma. Descansar não é falta de fé; às vezes é o ato de obediência mais difícil.',
        oracao:
          'Senhor, estou cansado. Vou a ti como estou. Alivia o meu corpo e a minha mente, e me ensina a descansar sem culpa.',
        pergunta: 'Você tem dormido e descansado, ou tem tratado o descanso como luxo?',
      },
      {
        titulo: 'Ore em vez de ruminar',
        versiculo:
          'Não andeis ansiosos de coisa alguma; em tudo, porém, sejam conhecidas, diante de Deus, as vossas petições, pela oração e pela súplica, com ações de graças.',
        referencia: 'Filipenses 4:6',
        reflexao:
          'Ruminar é repassar o problema na cabeça mil vezes sem sair do lugar. Orar é levar o mesmo problema para fora de você. Paulo dá um detalhe fácil de pular: com ações de graças. Não é ignorar a dor — é lembrar, no meio dela, do que Deus já fez. Isso muda a proporção das coisas. O problema continua do mesmo tamanho, mas deixa de ser a única coisa na tela. Quem só olha para a falta esquece o histórico de fidelidade.',
        oracao:
          'Pai, em vez de repassar isso na cabeça de novo, eu trago a ti. E antes de pedir, agradeço pelo que já fizeste na minha vida.',
        pergunta: 'Liste três coisas que Deus já resolveu e que você tinha certeza de que não teriam solução.',
      },
      {
        titulo: 'Aquietai-vos',
        versiculo: 'Aquietai-vos e sabei que eu sou Deus.',
        referencia: 'Salmos 46:10',
        reflexao:
          'O salmo 46 fala de terra tremendo e montes desabando no mar. É nesse cenário que vem a ordem: aquietai-vos. Não é o silêncio de quem não tem problema; é o silêncio de quem parou de tentar resolver no grito. E a quietude tem um propósito: saber que ele é Deus. A ansiedade quase sempre carrega a ilusão de que tudo depende de nós. Aquietar-se é devolver a Deus o lugar que é dele — e sair, enfim, de um cargo que você nunca teve condições de ocupar.',
        oracao:
          'Deus, eu me aquieto diante de ti. Tu és Deus e eu não sou. Descanso nisso hoje.',
        pergunta: 'Em que área você tem agido como se tudo dependesse só de você?',
      },
    ],
  },

  {
    id: 'perdao',
    titulo: 'Aprendendo a perdoar',
    subtitulo: '7 dias para soltar o que está te prendendo',
    descricao:
      'Perdoar não é dizer que o que fizeram com você foi pequeno. É recusar-se a carregar aquilo pelo resto da vida. Sete dias sobre a ferida, a decisão e a liberdade.',
    fundo: 'oliveira',
    dias: [
      {
        titulo: 'Perdoados para perdoar',
        versiculo:
          'Sede, antes, uns para com os outros, benignos, compassivos, perdoando-vos uns aos outros, como também Deus, em Cristo, vos perdoou.',
        referencia: 'Efésios 4:32',
        reflexao:
          'A ordem da frase importa: perdoem como Deus perdoou vocês. O perdão cristão não começa com força de vontade, começa com memória. Quem se lembra do tamanho da própria dívida perdoada tem mais facilidade de olhar a dívida alheia com outros olhos. Isso não diminui a dor do que te fizeram. Só coloca você no lugar de quem já recebeu aquilo que agora precisa oferecer.',
        oracao:
          'Senhor, antes de eu falar de quem me feriu, me lembra de tudo o que tu já me perdoaste. Amolece meu coração a partir daí.',
        pergunta: 'Você consegue lembrar do que Deus já te perdoou sem minimizar?',
      },
      {
        titulo: 'A conta que não fecha',
        versiculo:
          'Não te digo que até sete vezes, mas até setenta vezes sete.',
        referencia: 'Mateus 18:22',
        reflexao:
          'Pedro achou generoso oferecer sete. Jesus responde com um número que ninguém consegue contabilizar — e é esse o ponto. Quem conta ainda não perdoou; está apenas adiando a cobrança. O perdão que Jesus ensina não é uma cota que se esgota, é uma postura. Isso não significa aceitar abuso repetido nem abrir mão de limites. Significa que a sua disposição de perdoar não pode ter um teto menor que a de Deus.',
        oracao:
          'Pai, eu tenho contado. Perdoa a minha contabilidade e me dá um coração que solta em vez de registrar.',
        pergunta: 'Existe alguma ofensa que você ainda consegue numerar em detalhes?',
      },
      {
        titulo: 'Perdoar não é esquecer',
        versiculo:
          'Vós, na verdade, intentastes o mal contra mim; porém Deus o tornou em bem.',
        referencia: 'Gênesis 50:20',
        reflexao:
          'José olha para os irmãos que o venderam como escravo e nomeia o que aconteceu: vocês quiseram me fazer mal. Ele não fingiu que foi um mal-entendido. Perdoar não é reescrever a história nem chamar de bom o que foi ruim. É reconhecer o tamanho real do dano e ainda assim recusar-se à vingança, confiando que Deus é capaz de transformar até isso. José chorou. E depois sustentou os mesmos irmãos.',
        oracao:
          'Deus, me ajuda a ser honesto sobre o que doeu, sem usar essa honestidade como desculpa para guardar rancor.',
        pergunta: 'Você tem minimizado a ofensa em vez de encará-la e perdoá-la de fato?',
      },
      {
        titulo: 'O veneno que fica em você',
        versiculo:
          'Não se ponha o sol sobre a vossa ira, nem deis lugar ao diabo.',
        referencia: 'Efésios 4:26-27',
        reflexao:
          'Paulo não proíbe sentir raiva. Proíbe hospedá-la. A raiva que dorme com a gente vira amargura, e a amargura muda a pessoa por dentro — o rancor faz mais estrago em quem o carrega do que em quem o causou. A imagem de dar lugar é a de abrir espaço, ceder um cômodo. Toda ofensa guardada é um quarto alugado na sua cabeça para alguém que talvez nem se lembre de você.',
        oracao:
          'Senhor, não deixa a amargura criar raiz em mim. Prefiro a dor de perdoar hoje ao veneno de carregar isso por anos.',
        pergunta: 'Quem tem morado de graça na sua cabeça?',
      },
      {
        titulo: 'Orar por quem te feriu',
        versiculo: 'Amai os vossos inimigos e orai pelos que vos perseguem.',
        referencia: 'Mateus 5:44',
        reflexao:
          'É o mandamento mais difícil do Sermão do Monte. Note que Jesus não manda sentir carinho — manda orar. E orar por alguém muda a maneira como enxergamos essa pessoa; é quase impossível continuar desumanizando quem você leva diante de Deus. Comece simples: peça que Deus a abençoe. Talvez as primeiras vezes saiam pela obediência, não pelo sentimento. Tudo bem. O sentimento costuma vir depois da decisão, não antes.',
        oracao:
          'Pai, hoje eu oro por quem me feriu. Abençoa essa pessoa. Não porque eu esteja sentindo isso, mas porque tu mandaste.',
        pergunta: 'Você consegue orar pelo nome dessa pessoa hoje, mesmo sem vontade?',
      },
      {
        titulo: 'Quando não dá para reconciliar',
        versiculo:
          'Se possível, quanto depender de vós, tende paz com todos os homens.',
        referencia: 'Romanos 12:18',
        reflexao:
          'Paulo coloca duas condições: se possível e quanto depender de vós. Perdão é decisão individual; reconciliação exige duas pessoas. Há relações que não devem ser retomadas, seja porque a outra parte não quer, seja porque voltar seria se expor a mais dano. Você pode perdoar alguém e ainda assim manter distância. Perdoar liberta o seu coração; não obriga você a devolver a chave da sua casa.',
        oracao:
          'Deus, me dá sabedoria para saber a diferença entre perdoar e me expor de novo. Cura o meu coração mesmo onde a relação não pode voltar.',
        pergunta: 'Você está confundindo perdão com obrigação de reatar?',
      },
      {
        titulo: 'A liberdade do outro lado',
        versiculo: 'Se, pois, o Filho vos libertar, verdadeiramente sereis livres.',
        referencia: 'João 8:36',
        reflexao:
          'Rancor é uma corrente com duas pontas: uma no ofensor e outra em você. Enquanto ela existe, você continua ligado à pessoa que mais queria esquecer. Perdoar é soltar a sua ponta. Não é um favor que você faz a quem te feriu; é a porta pela qual você sai. Muita gente descobre, depois de perdoar, que estava presa havia anos numa cela cuja chave sempre esteve na própria mão.',
        oracao:
          'Senhor, eu solto. Não porque a pessoa mereça, mas porque eu quero ser livre e tu já pagaste esse preço por mim.',
        pergunta: 'O que você faria com a energia que hoje gasta alimentando essa mágoa?',
      },
    ],
  },

  {
    id: 'gratidao',
    titulo: 'Gratidão que transforma',
    subtitulo: '7 dias para enxergar o que já está aqui',
    descricao:
      'A gratidão não nega os problemas; ela devolve as coisas ao tamanho real. Sete dias treinando o olhar para ver o que a reclamação esconde.',
    fundo: 'trigo',
    dias: [
      {
        titulo: 'Em tudo, e não por tudo',
        versiculo:
          'Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.',
        referencia: '1 Tessalonicenses 5:18',
        reflexao:
          'Paulo escreve em tudo, não por tudo. A diferença é enorme. Ninguém precisa agradecer pela doença, pela perda ou pela injustiça. O chamado é para encontrar motivo de gratidão mesmo estando dentro delas. É a diferença entre fingir que a dor é boa e reconhecer que, mesmo na dor, Deus não sumiu. Gratidão assim não é ingenuidade; é teimosia de quem se recusa a acreditar que só existe o que está doendo.',
        oracao:
          'Senhor, não vou agradecer pelo que dói, mas quero te agradecer no meio disso. Abre meus olhos para o que ainda está de pé.',
        pergunta: 'O que continua de pé na sua vida, mesmo com o que está difícil?',
      },
      {
        titulo: 'Não te esqueças',
        versiculo:
          'Bendize, ó minha alma, ao Senhor, e não te esqueças de nem um só de seus benefícios.',
        referencia: 'Salmos 103:2',
        reflexao:
          'Davi conversa com a própria alma, e o verbo é uma ordem: não te esqueças. Ele sabia que esquecer é o estado natural do coração humano. A memória guarda com facilidade a ofensa e deixa escapar o favor. Por isso a gratidão precisa ser exercitada de propósito — anotada, dita em voz alta, repetida. Não é sentimento que aparece; é disciplina que se constrói.',
        oracao:
          'Deus, minha memória é curta para o bem. Me ajuda a lembrar hoje, com nomes e detalhes, do que tu já fizeste.',
        pergunta: 'Que benefício de Deus na sua vida você já parou de mencionar?',
      },
      {
        titulo: 'Os nove que não voltaram',
        versiculo:
          'Não foram dez os limpos? Onde estão os nove?',
        referencia: 'Lucas 17:17',
        reflexao:
          'Dez leprosos curados. Um só voltou para agradecer. A pergunta de Jesus tem um tom de tristeza — não porque ele precisasse do agradecimento, mas porque nove perderam o encontro. Eles ganharam a cura e perderam a comunhão. É possível receber tudo de Deus e nunca parar diante dele. O samaritano que voltou ouviu algo que os outros não ouviram: a tua fé te salvou. A gratidão levou a bênção mais fundo.',
        oracao:
          'Pai, não quero ser dos nove. Recebo o que me dás e volto para te agradecer, porque quero a ti, e não só os teus presentes.',
        pergunta: 'Quando foi a última vez que você voltou só para agradecer?',
      },
      {
        titulo: 'Contentamento se aprende',
        versiculo:
          'Aprendi a viver contente em toda e qualquer situação.',
        referencia: 'Filipenses 4:11',
        reflexao:
          'Aprendi. Paulo não nasceu assim. O contentamento dele foi construído em naufrágio, prisão, fome e abundância. Isso é uma boa notícia: se é aprendido, você também pode aprender. E o método parece ser este — passar por pouco e por muito, descobrindo em cada um que a fonte da alegria não era a circunstância. Quem só experimentou abundância ainda não sabe se é contente ou apenas confortável.',
        oracao:
          'Senhor, me ensina o contentamento. Que a minha alegria não dependa de quanto eu tenho, mas de quem tu és.',
        pergunta: 'Sua paz de hoje depende de quanto você tem ou de quem Deus é?',
      },
      {
        titulo: 'Gratidão que se vê',
        versiculo: 'Dai, e dar-se-vos-á.',
        referencia: 'Lucas 6:38',
        reflexao:
          'Gratidão que fica só no pensamento tende a evaporar. Ela se firma quando vira gesto: um agradecimento dito na cara da pessoa, uma ajuda oferecida, um dinheiro que sai da mão. Quem reconhece que recebeu de graça tem menos dificuldade de abrir a mão. E o contrário também é verdade: mão fechada costuma ser sinal de coração que se esqueceu do quanto recebeu.',
        oracao:
          'Deus, que a minha gratidão não morra em pensamento. Me mostra hoje alguém para quem eu possa transformar isso em gesto.',
        pergunta: 'A quem você pode agradecer hoje, pessoalmente?',
      },
      {
        titulo: 'Misericórdias todas as manhãs',
        versiculo:
          'As misericórdias do Senhor são a causa de não sermos consumidos, porque as suas misericórdias não têm fim; renovam-se cada manhã.',
        referencia: 'Lamentações 3:22-23',
        reflexao:
          'O livro se chama Lamentações. O autor está diante de uma cidade destruída, e é dali que ele escreve sobre misericórdias que se renovam toda manhã. Não é gratidão de quem está bem; é gratidão de quem está no escombro e ainda assim reconhece que amanheceu. Cada manhã que você abre os olhos é uma remessa nova de misericórdia — não sobra da de ontem, nem adiantamento da de amanhã.',
        oracao:
          'Senhor, obrigado por mais uma manhã. Obrigado porque a tua misericórdia chegou de novo hoje, sem eu ter feito nada para merecer.',
        pergunta: 'O que mudaria no seu dia se você começasse cada manhã assim?',
      },
      {
        titulo: 'Pense nestas coisas',
        versiculo:
          'Tudo o que é verdadeiro, tudo o que é respeitável, tudo o que é justo, tudo o que é puro, tudo o que é amável... nisto pensai.',
        referencia: 'Filipenses 4:8',
        reflexao:
          'Paulo termina a carta com uma instrução prática sobre para onde apontar a atenção. Gratidão é, no fundo, uma escolha de foco. A mesma vida rende uma lista de reclamações ou uma lista de gratidões, dependendo de onde você mira. Isso não é ilusão: as duas listas são verdadeiras. A questão é qual delas você lê todos os dias, porque é ela que vai formando o seu jeito de ver o mundo.',
        oracao:
          'Pai, guia os meus pensamentos hoje. Que eu não fique fixado no que falta e deixe de ver o que abunda.',
        pergunta: 'Qual das duas listas você tem lido mais?',
      },
    ],
  },

  {
    id: 'primeiros-passos',
    titulo: 'Primeiros passos na fé',
    subtitulo: '7 dias para quem está começando',
    descricao:
      'Sem jargão de igreja e sem pressupor que você já sabe. Sete dias explicando o essencial: quem é Deus, o que Jesus fez, e como isso muda a sua vida a partir de hoje.',
    fundo: 'mar',
    dias: [
      {
        titulo: 'Você foi ideia de alguém',
        versiculo:
          'Eu te louvo, porque de um modo assombrosamente maravilhoso me formaste.',
        referencia: 'Salmos 139:14',
        reflexao:
          'A fé cristã começa aqui: você não é acidente. Antes de qualquer coisa que você tenha feito de bom ou de ruim, existe um Deus que te quis. Isso muda a pergunta fundamental da vida. Em vez de "eu preciso provar que valho alguma coisa", passa a ser "eu já sou valioso porque fui feito por alguém que me quis". Todo o resto do caminho parte desse chão.',
        oracao:
          'Deus, se tu me criaste, então eu tenho valor mesmo quando não sinto isso. Obrigado por essa verdade que não depende do que eu sinto hoje.',
        pergunta: 'Como seria seu dia se você acreditasse mesmo que foi querido por Deus?',
      },
      {
        titulo: 'O problema que todos temos',
        versiculo: 'Porque todos pecaram e carecem da glória de Deus.',
        referencia: 'Romanos 3:23',
        reflexao:
          'Pecado não é uma lista de coisas que a igreja proíbe. É a distância entre quem fomos feitos para ser e quem de fato somos. Todos, diz Paulo — não existe categoria de gente boa que dispensa isso. Reconhecer o problema não é para te esmagar; é o passo sem o qual não existe solução. Ninguém procura remédio antes de admitir que está doente.',
        oracao:
          'Senhor, não quero fingir que está tudo certo. Reconheço que estou longe de quem tu me criaste para ser.',
        pergunta: 'O que em você mais te distancia de quem você gostaria de ser?',
      },
      {
        titulo: 'O que Jesus fez',
        versiculo:
          'Mas Deus prova o seu próprio amor para conosco pelo fato de ter Cristo morrido por nós, sendo nós ainda pecadores.',
        referencia: 'Romanos 5:8',
        reflexao:
          'Esta é a frase central do cristianismo. Repare no tempo: sendo nós ainda pecadores. Deus não esperou você melhorar. A cruz aconteceu antes de qualquer mudança sua, e é isso que a torna amor de verdade e não recompensa. Você não precisa se arrumar para vir. Você vem como está — e a mudança é consequência do encontro, nunca a condição para ele.',
        oracao:
          'Jesus, obrigado por não teres esperado eu melhorar. Eu venho como estou e confio no que tu fizeste por mim.',
        pergunta: 'Você tem tentado se arrumar antes de se aproximar de Deus?',
      },
      {
        titulo: 'Como responder',
        versiculo:
          'Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar os pecados e nos purificar de toda injustiça.',
        referencia: '1 João 1:9',
        reflexao:
          'A resposta é simples a ponto de causar desconfiança: confessar. Dizer a Deus, com suas palavras, o que você já sabe sobre si. Não existe fórmula, oração decorada ou intermediário necessário. O texto chama Deus de fiel e justo — ou seja, perdoar não é um favor de humor variável, é o compromisso dele. Você não fica torcendo para que ele esteja num dia bom.',
        oracao:
          'Deus, eu confesso. Não vou esconder de ti o que tu já conheces. Recebo o teu perdão, porque tu prometeste.',
        pergunta: 'Existe algo que você ainda não disse a Deus com todas as letras?',
      },
      {
        titulo: 'Nova criatura',
        versiculo:
          'Se alguém está em Cristo, é nova criatura; as coisas antigas já passaram; eis que se fizeram novas.',
        referencia: '2 Coríntios 5:17',
        reflexao:
          'Nova criatura não significa que você acorda perfeito no dia seguinte. Significa que a identidade mudou antes do comportamento. Você passa a ser tratado por Deus como filho, e é a partir dessa nova identidade que a transformação começa a acontecer — de dentro para fora, e devagar. Vai haver recaída. Recaída não anula filiação; nenhum filho deixa de ser filho por cair.',
        oracao:
          'Pai, obrigado por me chamares de teu filho antes mesmo de eu me parecer com isso. Me transforma no teu tempo.',
        pergunta: 'Você tem se cobrado uma perfeição que Deus não te cobrou?',
      },
      {
        titulo: 'Não caminhe sozinho',
        versiculo:
          'Onde estiverem dois ou três reunidos em meu nome, ali estou no meio deles.',
        referencia: 'Mateus 18:20',
        reflexao:
          'A fé cristã não foi desenhada para ser vivida sozinho. Não porque a igreja seja perfeita — ela é feita de gente, com todos os defeitos que isso implica —, mas porque crescemos no contato. Alguém para tirar dúvida, para orar junto, para perceber quando você sumiu. Procure uma comunidade onde a Bíblia seja levada a sério e as pessoas sejam tratadas com respeito. Vale a busca.',
        oracao:
          'Senhor, me leva a pessoas que caminhem comigo. E me ajuda a ser essa pessoa para alguém também.',
        pergunta: 'Quem poderia caminhar com você nessa fase?',
      },
      {
        titulo: 'Como continuar',
        versiculo: 'Lâmpada para os meus pés é a tua palavra e luz para os meus caminhos.',
        referencia: 'Salmos 119:105',
        reflexao:
          'A imagem é de uma lamparina de mão, das antigas: ilumina o próximo passo, não a estrada inteira. Deus raramente mostra o mapa completo. Ele ilumina o suficiente para você dar o passo de hoje — e é assim que a caminhada se faz. Leia um pouco por dia, sem pressa e sem culpa quando falhar. O objetivo não é terminar a Bíblia; é conhecer quem a inspirou.',
        oracao:
          'Deus, me dá fome da tua Palavra. Não para eu saber mais, mas para eu te conhecer melhor. Ilumina o próximo passo.',
        pergunta: 'Que horário do seu dia poderia ser o seu momento com Deus?',
      },
    ],
  },
]

export function serieDevocional(id: string): SerieDevocional | undefined {
  return SERIES_DEVOCIONAIS.find(s => s.id === id)
}
