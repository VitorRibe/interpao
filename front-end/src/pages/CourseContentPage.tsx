import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  LinearProgress,
  useTheme,
  useMediaQuery,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useSpring, animated } from '@react-spring/web';

// ─── Theme ────────────────────────────────────────────────────────────────────
const courseTheme = createTheme({
  palette: {
    primary: { main: '#2c1a0e', contrastText: '#fff' },
    secondary: { main: '#c9883d', light: '#e8b96d', contrastText: '#fff' },
    background: { default: '#faf6f0', paper: '#f0e8db' },
    text: { primary: '#2c1a0e', secondary: '#7a6a5a' },
    divider: '#e8ddd0',
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h2: { fontFamily: '"Playfair Display", serif', fontWeight: 900 },
    h4: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h5: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', fontSize: '0.6rem', height: 24 },
      },
    },
  },
});

// ─── Reusable sub-components ──────────────────────────────────────────────────
const Quote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ bgcolor: 'background.paper', borderLeft: '3px solid', borderColor: 'secondary.main', borderRadius: '0 8px 8px 0', p: 3, my: 3 }}>
    <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'primary.main', lineHeight: 1.75 }}>{children}</Typography>
  </Box>
);

const InfoCard: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <Paper elevation={0} sx={{ p: 2.5, height: '100%', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', borderRadius: 3 }}>
    <Typography variant="caption" sx={{ fontWeight: 800, color: 'secondary.main', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', mb: 1 }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{children}</Typography>
  </Paper>
);

const StepBox: React.FC<{ step: string; title: string; children: React.ReactNode }> = ({ step, title, children }) => (
  <Box sx={{ display: 'flex', gap: 2.5, mb: 3 }}>
    <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'secondary.main', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.25 }}>
      <Typography variant="caption" sx={{ fontWeight: 900, fontSize: '0.7rem' }}>{step}</Typography>
    </Box>
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', mb: 0.5 }}>{title}</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>{children}</Typography>
    </Box>
  </Box>
);

const HighlightBox: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Box sx={{ bgcolor: 'rgba(201,136,61,0.07)', border: '1px solid', borderColor: 'rgba(201,136,61,0.25)', borderRadius: 3, p: 3, my: 3 }}>
    <Typography variant="caption" sx={{ fontWeight: 900, color: 'secondary.main', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', mb: 1 }}>
      {title}
    </Typography>
    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>{children}</Typography>
  </Box>
);

// ─── Chapter data ─────────────────────────────────────────────────────────────
const chapters = [
  {
    id: 'capitulo-1',
    number: '01',
    title: 'História e Origem do Trigo',
    time: '20 min',
    type: 'Teoria',
    content: (
      <>
        <Typography variant="body1" sx={{ mb: 2.5, color: 'text.secondary', lineHeight: 1.85, fontSize: '1rem' }}>
          A jornada do pão começa há mais de 10.000 anos, no Crescente Fértil — a região que hoje abrange o sul da Turquia, o Líbano, Israel e o Iraque. Foi nesse berço da civilização que os primeiros agricultores domesticaram o trigo selvagem <i>einkorn</i> (<em>Triticum monococcum</em>) e o <i>emmer</i> (<em>Triticum dicoccum</em>), dando início a uma das maiores revoluções alimentares da história humana.
        </Typography>
        <Quote>"O pão não é apenas alimento; é a síntese da civilização, do solo e do tempo."</Quote>
        <Typography variant="body1" sx={{ mb: 2.5, color: 'text.secondary', lineHeight: 1.85 }}>
          A domesticação do trigo foi um processo gradual de seleção: os primeiros agricultores escolhiam as espigas mais cheias, as que não se desprendiam facilmente com o vento — uma mutação que tornava a colheita mais eficiente, mas que tornava o grão dependente do homem para se reproduzir. Essa co-evolução milenar entre humano e planta moldou profundamente as culturas do Mediterrâneo, do Oriente Médio e da Europa.
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <InfoCard label="Einkorn (T. monococcum)">
              O mais antigo trigo cultivado. Baixo teor de glúten, sabor adocicado e amendoado. Ainda cultivado em regiões montanhosas da Itália e Turquia. Ideal para massas de longa fermentação.
            </InfoCard>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoCard label="Emmer (T. dicoccum)">
              Predecessor do trigo durum moderno. Mais robusto e produtivo que o einkorn. Base da alimentação egípcia antiga — os trabalhadores que construíram as pirâmides eram pagos em pão de emmer.
            </InfoCard>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoCard label="Spelt (T. spelta)">
              Híbrido natural entre emmer e uma gramínea selvagem. Casca protetora preserva o grão por mais tempo. Voltando à popularidade em padarias artesanais europeias pela sua complexidade de sabor.
            </InfoCard>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoCard label="Trigo moderno (T. aestivum)">
              Resultado de décadas de melhoramento genético. Alto teor de glúten para produção industrial massiva. Representa mais de 95% do trigo consumido no mundo, mas perdeu muito da complexidade nutritiva e de sabor dos seus ancestrais.
            </InfoCard>
          </Grid>
        </Grid>
        <Typography variant="body1" sx={{ mb: 2.5, color: 'text.secondary', lineHeight: 1.85 }}>
          A Revolução Verde dos anos 1960 e 70 transformou radicalmente o perfil genético do trigo. Pesquisadores como Norman Borlaug — vencedor do Nobel da Paz — desenvolveram variedades anãs de alto rendimento que salvaram milhões de pessoas da fome, mas que também homogeneizaram drasticamente a biodiversidade dos grãos. O trigo perdeu altura (para não tombar com o peso das espigas grandes), perdeu a casca protetora, e acumulou variantes de glúten mais elásticas e resistentes — características ótimas para a panificação industrial, mas que alguns pesquisadores associam ao aumento das sensibilidades alimentares modernas.
        </Typography>
        <HighlightBox title="Por que isso importa para o padeiro artesanal">
          Trabalhar com farinhas de grãos antigos ou de moagem a pedra significa lidar com um glúten estruturalmente diferente — mais frágil, menos elástico, mas com uma riqueza de sabor e aroma impossível de replicar com farinha industrial. A panificação artesanal é, acima de tudo, um ato de arqueologia gastronômica.
        </HighlightBox>
        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.85 }}>
          Compreender essa genealogia não é um exercício acadêmico: ela determina a hidratação ideal da sua massa, o tempo de autólise necessário, a força do seu fermento e até o perfil de acidez que vai emergir na fermentação. Cada grão carrega em si uma história — e o padeiro artesanal é o seu tradutor.
        </Typography>
      </>
    ),
  },
  {
    id: 'capitulo-2',
    number: '02',
    title: 'Biologia do Fermento Natural',
    time: '30 min',
    type: 'Ciência',
    content: (
      <>
        <Typography variant="body1" sx={{ mb: 2.5, color: 'text.secondary', lineHeight: 1.85, fontSize: '1rem' }}>
          O fermento natural — chamado de <i>levain</i> em francês, <i>sourdough starter</i> em inglês ou simplesmente "massa madre" em português e espanhol — é muito mais do que uma mistura de farinha e água. É um ecossistema vivo, um bioma em miniatura onde centenas de espécies de microrganismos competem, colaboram e se especializam em função das condições que o padeiro oferece.
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <InfoCard label="Leveduras Selvagens">
              Principalmente <em>Saccharomyces cerevisiae</em> e <em>Kazachstania humilis</em> (antes chamada de <em>Candida humilis</em>). Fermentam açúcares simples produzindo CO₂ — responsável pelo crescimento da massa — e etanol, que contribui para o aroma.
            </InfoCard>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoCard label="Bactérias Ácido-Láticas (BAL)">
              Dois grupos principais: <em>homofermentativas</em> (produzem apenas ácido lático — sabor suave e iogurtado) e <em>heterofermentativas</em> (produzem ácido lático + acético + CO₂ — sabor mais pronunciado e vinagrado). O equilíbrio entre elas define o perfil de acidez do seu pão.
            </InfoCard>
          </Grid>
        </Grid>
        <Typography variant="body1" sx={{ mb: 2.5, color: 'text.secondary', lineHeight: 1.85 }}>
          A simbiose entre leveduras e bactérias é uma das relações mais fascinantes da microbiologia alimentar. As BAL produzem ácidos que inibem o crescimento de fungos indesejáveis (incluindo bolores), criando um ambiente protegido onde as leveduras prosperam. Em troca, as leveduras produzem nutrientes que as bactérias utilizam. É uma parceria de milhares de anos, muito anterior ao surgimento da ciência que a descreve.
        </Typography>
        <Quote>"Um levain saudável não é criado pelo padeiro — ele é cultivado. A diferença é filosófica e técnica ao mesmo tempo."</Quote>
        <Typography variant="h4" sx={{ fontSize: '1.1rem', fontWeight: 700, color: 'primary.main', mb: 2, mt: 3 }}>
          Os três pilares do controle do levain
        </Typography>
        <StepBox step="1" title="Temperatura">
          Entre 24°C e 28°C é a zona ideal para a maioria dos fermentos. Abaixo de 20°C, as BAL heterofermentativas dominam, produzindo mais ácido acético e um sabor mais pronunciado. Acima de 30°C, as leveduras aceleram mas o equilíbrio microbiano se desfaz.
        </StepBox>
        <StepBox step="2" title="Hidratação">
          Fermentos mais líquidos (100% de hidratação ou mais) favorecem as BAL homofermentativas e produzem pães com acidez mais suave. Fermentos mais firmes (60–65% de hidratação) favorecem as heterofermentativas e geram sabores mais complexos e pronunciados.
        </StepBox>
        <StepBox step="3" title="Frequência de alimentação">
          Alimentar com mais frequência (a cada 8–12h) mantém o fermento jovem e mais ativo — ideal para pães de fermentação rápida. Alimentações espaçadas (24–36h) desenvolvem mais acidez e complexidade, perfeitas para pães rústicos de longa fermentação.
        </StepBox>
        <HighlightBox title="Como identificar um levain no pico">
          O levain está pronto para usar quando dobrou de volume, apresenta bolhas visíveis nas laterais do pote, tem aroma levemente ácido e adocicado (como iogurte com frutas), e passa no teste da flutuação: uma colher de levain jogada em água fria deve flutuar.
        </HighlightBox>
        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.85 }}>
          Cada fermento natural é único — um reflexo da farinha usada, da água local, do ambiente e do padeiro que o cuida. Os fermentos de padarias famosas como a Boudin Bakery em San Francisco ou a Tartine Bakery carregam uma identidade microbiana que os torna irreproduzíveis em outros lugares. O seu fermento é, literalmente, seu.
        </Typography>
      </>
    ),
  },
  {
    id: 'capitulo-3',
    number: '03',
    title: 'Autólise e Desenvolvimento do Glúten',
    time: '35 min',
    type: 'Técnica',
    content: (
      <>
        <Typography variant="body1" sx={{ mb: 2.5, color: 'text.secondary', lineHeight: 1.85, fontSize: '1rem' }}>
          A autólise é um dos conceitos mais transformadores da panificação moderna — e também um dos mais mal compreendidos. Desenvolvida pelo professor Raymond Calvel na década de 1970, a técnica consiste em misturar apenas a farinha e a água (sem sal, sem fermento) e deixar descansar por 20 a 60 minutos antes de prosseguir com o restante da receita.
        </Typography>
        <Typography variant="body1" sx={{ mb: 2.5, color: 'text.secondary', lineHeight: 1.85 }}>
          Durante esse repouso, as enzimas naturalmente presentes na farinha — principalmente proteases e amilases — começam a trabalhar. As proteases quebram parcialmente as cadeias de proteína, tornando a massa mais extensível e fácil de trabalhar. As amilases convertem amidos danificados em maltose, criando mais alimento para as leveduras e contribuindo para a cor da casca durante o forno.
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <InfoCard label="Sem autólise">
              Massa resistente e elástica. Requer amassadura intensa e prolongada para desenvolver o glúten. Maior risco de superaquecer a massa e oxidar os carotenóides responsáveis pelo aroma.
            </InfoCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <InfoCard label="Autólise 20–30 min">
              Ideal para farinhas de força média (W 200–280). Melhora a extensibilidade sem comprometer a estrutura. Suficiente para a maioria dos pães de fermentação natural.
            </InfoCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <InfoCard label="Autólise 45–60 min">
              Recomendada para farinhas integrais ou com alto teor de farelo, que absorvem água mais lentamente. Também útil com farinhas de grãos antigos, que têm glúten mais frágil e precisam de mais tempo.
            </InfoCard>
          </Grid>
        </Grid>
        <Typography variant="h4" sx={{ fontSize: '1.1rem', fontWeight: 700, color: 'primary.main', mb: 2 }}>
          Técnicas de amassadura manual
        </Typography>
        <StepBox step="A" title="Slap and Fold (Bassinage)">
          Técnica francesa de alta energia. A massa é levantada com uma mão, batida contra a bancada e dobrada sobre si mesma em um movimento contínuo. Desenvolve o glúten rapidamente e incorpora ar. Ideal para massas com 70–80% de hidratação no início do processo.
        </StepBox>
        <StepBox step="B" title="Rubaud">
          Técnica desenvolvida por Gerard Rubaud, lendário padeiro de Vermont. A massa é trabalhada dentro da tigela com movimentos circulares e de scoop. Mais gentil que o slap and fold, preserva mais a estrutura do glúten. Excelente para massas de alta hidratação (80%+).
        </StepBox>
        <StepBox step="C" title="Coil Fold">
          Técnica de dobras durante a fermentação em bloco. A massa é levantada pelo centro, permitindo que as pontas caiam e se dobrem sob ela. Fortalece gradualmente a estrutura sem desgasar. Cada série de 4 dobras espaçadas de 30 minutos substitui minutos de amassadura.
        </StepBox>
        <Quote>"A amassadura perfeita não é a mais intensa — é a que chega ao ponto correto de desenvolvimento do glúten com o menor dano possível à estrutura da massa."</Quote>
        <HighlightBox title="Como testar o ponto do glúten: o Teste do Véu">
          Pegue uma pequena porção de massa e estique-a devagar entre os dedos. Se ela formar uma membrana translúcida, fina como papel de seda, sem rasgar — o glúten está desenvolvido. Se rasgar imediatamente, continue amassando. Se a membrana for opaca e grossa, a massa ainda está sub-desenvolvida.
        </HighlightBox>
      </>
    ),
  },
  {
    id: 'capitulo-4',
    number: '04',
    title: 'Fermentação em Bloco',
    time: '40 min',
    type: 'Gestão',
    content: (
      <>
        <Typography variant="body1" sx={{ mb: 2.5, color: 'text.secondary', lineHeight: 1.85, fontSize: '1rem' }}>
          A fermentação em bloco — ou <i>bulk fermentation</i> — é o coração do processo de panificação com levain. É a fase mais longa, mais variável e, sem dúvida, a mais difícil de dominar. Começa no momento em que o fermento é incorporado à massa e termina quando a massa está pronta para ser dividida e pré-moldada.
        </Typography>
        <Typography variant="body1" sx={{ mb: 2.5, color: 'text.secondary', lineHeight: 1.85 }}>
          Durante esse período, três processos acontecem simultaneamente: a fermentação alcoólica (leveduras convertendo açúcares em CO₂ e etanol), a fermentação lática (bactérias produzindo ácidos que desenvolvem sabor e conservação) e o desenvolvimento estrutural da massa (o glúten se fortalecendo progressivamente a cada dobra).
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <InfoCard label="Temperatura e tempo">
              A 24°C, uma fermentação típica leva de 4 a 5 horas. A 18°C, pode levar 8 a 12 horas. A 4°C (geladeira), 12 a 24 horas ou mais. Não existe um tempo fixo — existe uma temperatura e uma observação.
            </InfoCard>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoCard label="Percentual de crescimento">
              Para a maioria dos pães de levain, a massa deve crescer entre 50% e 75% durante o bulk. Crescimento além de 80–100% indica superfermentação — a estrutura do glúten começa a se degradar e o pão perderá altura no forno.
            </InfoCard>
          </Grid>
        </Grid>
        <Typography variant="h4" sx={{ fontSize: '1.1rem', fontWeight: 700, color: 'primary.main', mb: 2 }}>
          Como identificar o ponto de prova
        </Typography>
        <StepBox step="1" title="Visual: crescimento e bolhas">
          A massa deve ter crescido visivelmente (use um elástico ou marcação no pote para monitorar). A superfície apresenta bolhas pequenas e a estrutura interna, quando vista pelas laterais transparentes do recipiente, mostra uma alveolatura regular — sinal de glúten forte e fermentação equilibrada.
        </StepBox>
        <StepBox step="2" title="Tátil: a prova do dedo (poke test)">
          Pressione suavemente a superfície da massa com a ponta de um dedo enfarinhado. Se voltar imediatamente e completamente — ainda está jovem. Se voltar lentamente, deixando uma ligeira marca — está no ponto. Se não voltar — passou do ponto.
        </StepBox>
        <StepBox step="3" title="Estrutural: a superfície abaulada">
          Uma massa no ponto de prova apresenta uma superfície levemente abaulada no centro, com bordas que começam a se desprender das laterais do recipiente. O glúten está suficientemente relaxado para a moldagem, mas ainda tem força para sustentar a estrutura no forno.
        </StepBox>
        <Quote>"A habilidade de reconhecer o ponto de prova não se aprende com um cronômetro. Aprende-se com as mãos, com os olhos e com a repetição honesta do erro."</Quote>
        <HighlightBox title="Fermentação retardada na geladeira">
          Uma das técnicas mais poderosas do arsenal do padeiro artesanal: após o bulk, molde o pão e coloque-o na geladeira entre 8 e 18 horas. A fermentação lenta a frio desenvolve ácido acético (mais sabor, mais pronunciado), facilita a pontuação (o pão frio é mais firme) e permite que você asse no horário que quiser. A maioria dos grandes pães de levain passa por esse processo.
        </HighlightBox>
        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.85 }}>
          Dominar a fermentação em bloco é dominar o tempo. É aprender a ler os sinais biológicos de uma massa viva e responder a eles com ajustes — de temperatura, de hidratação, de quantidade de fermento. É, acima de tudo, desenvolver uma relação de confiança com o processo. O pão perfeito não acontece apesar da imprevisibilidade do levain — ele acontece através dela.
        </Typography>
      </>
    ),
  },
  {
    id: 'capitulo-5',
    number: '05',
    title: 'Moldagem e Pontuação',
    time: '25 min',
    type: 'Prática',
    content: (
      <>
        <Typography variant="body1" sx={{ mb: 2.5, color: 'text.secondary', lineHeight: 1.85, fontSize: '1rem' }}>
          A moldagem é o momento em que o padeiro imprime sua intenção sobre a massa. É uma dança entre tensão e gentileza: tensão suficiente para criar a estrutura que vai sustentar o pão no forno; gentileza suficiente para não destruir as bolhas de CO₂ que levaram horas para se formar.
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <InfoCard label="Pré-moldagem">
              Após o bulk, a massa é dividida e recebe uma moldagem leve — apenas o suficiente para criar uma tensão superficial inicial. Descansa de 20 a 40 minutos (banco) coberta, permitindo que o glúten relaxe antes da moldagem final.
            </InfoCard>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoCard label="Moldagem final">
              O pão recebe sua forma definitiva — <em>bâtard</em> (oval), <em>boule</em> (redondo) ou <em>baguette</em>. A tensão superficial criada nesse momento é o que permite ao pão crescer para cima (e não para os lados) durante o forno.
            </InfoCard>
          </Grid>
        </Grid>
        <Typography variant="body1" sx={{ mb: 2.5, color: 'text.secondary', lineHeight: 1.85 }}>
          A pontuação — o corte feito na superfície do pão momentos antes de entrar no forno — não é apenas decorativa. É uma válvula de controle: ela direciona para onde o pão vai crescer durante os primeiros minutos no forno (o chamado <em>oven spring</em>), evitando que ele rache de forma aleatória e controlando a expansão da crosta.
        </Typography>
        <StepBox step="1" title="O ângulo do corte">
          Cortes feitos em ângulo (30–45° em relação à superfície) criam a famosa "orelha" do pão artesanal — aquela aba levantada que é sinal de boa fermentação e técnica apurada. Cortes perpendiculares criam aberturas mais largas, ideais para baguetes.
        </StepBox>
        <StepBox step="2" title="A profundidade">
          Entre 0,5cm e 1cm é o ideal para a maioria dos pães. Cortes rasos demais não abrem no forno. Cortes profundos demais enfraquecem a estrutura. A velocidade do movimento é tão importante quanto a profundidade — o lame deve deslizar como uma cirurgia, não rasgar.
        </StepBox>
        <StepBox step="3" title="O momento certo">
          Pões que vêm direto da geladeira são muito mais fáceis de pontuar — a massa fria é firme e o lame desliza limpo. Pões em temperatura ambiente requerem mais precisão e velocidade.
        </StepBox>
        <Quote>"A pontuação revela o estado interior da massa. Um pão bem fermentado se abre com elegância — como uma flor que já estava pronta para desabrochar."</Quote>
        <HighlightBox title="Ferramentas essenciais">
          O <em>lame</em> (lâmina curva francesa) é a ferramenta tradicional, mas uma gilete convencional presa a um palito funciona perfeitamente. Mantenha a lâmina sempre bem afiada — uma lâmina romba rasga a massa em vez de cortá-la. Mergulhe a lâmina em água gelada entre os cortes para evitar que a massa grude.
        </HighlightBox>
      </>
    ),
  },
  {
    id: 'capitulo-6',
    number: '06',
    title: 'O Forno: Vapor, Temperatura e Cocção',
    time: '30 min',
    type: 'Ciência',
    content: (
      <>
        <Typography variant="body1" sx={{ mb: 2.5, color: 'text.secondary', lineHeight: 1.85, fontSize: '1rem' }}>
          O forno é onde toda a preparação encontra sua conclusão. Mas para o padeiro artesanal, o forno não é uma caixa que simplesmente aquece — é um ambiente que precisa ser controlado com a mesma precisão que a fermentação. Dois fatores são absolutamente críticos: a temperatura e o vapor.
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <InfoCard label="Fase 1 – Oven Spring (0–15 min)">
              O vapor é essencial. Mantém a crosta úmida e extensível, permitindo que o pão expanda ao máximo. Sem vapor, a crosta forma uma película rígida cedo demais, sufocando o crescimento. Temperatura: 240–260°C.
            </InfoCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <InfoCard label="Fase 2 – Caramelização (15–30 min)">
              O vapor é removido. A crosta começa a dourar através da Reação de Maillard (proteínas + açúcares em alta temperatura) e da caramelização. A cor vai do dourado ao âmbar profundo — cada tonalidade carrega um perfil de sabor diferente.
            </InfoCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <InfoCard label="Fase 3 – Finalização (30–45 min)">
              Temperatura pode ser reduzida para 220°C. O calor penetra até o centro, garantindo que o miolo esteja completamente cozido. O pão está pronto quando bater no fundo produzir um som oco — sinal de que o miolo está seco e estruturado.
            </InfoCard>
          </Grid>
        </Grid>
        <Typography variant="body1" sx={{ mb: 2.5, color: 'text.secondary', lineHeight: 1.85 }}>
          A <em>dutch oven</em> (panela de ferro fundido com tampa) revolucionou a panificação doméstica porque resolve o problema do vapor de forma elegante: o pão assa dentro da panela tampada, e a própria umidade que escapa da massa cria o ambiente de vapor necessário. Ao remover a tampa na segunda fase, o pão recebe o calor direto para dourar a crosta.
        </Typography>
        <StepBox step="1" title="Pré-aqueça a dutch oven por pelo menos 45 minutos">
          Uma panela fria resulta em um pão com base pálida e sem crocância. A base precisa de contato imediato com uma superfície em temperatura máxima para criar a caramelização inferior característica do pão artesanal.
        </StepBox>
        <StepBox step="2" title="Transfira rápido e pontue dentro da panela">
          O pão gelado sai do banneton direto para a panela quente. Pontue imediatamente, tampe e leve ao forno. A velocidade importa — cada segundo sem a tampa é vapor perdido.
        </StepBox>
        <StepBox step="3" title="Deixe esfriar completamente antes de cortar">
          A cocção continua dentro do pão após sair do forno, através do calor residual. Cortar cedo demais libera o vapor interno e resulta em um miolo gomoso. Espere pelo menos 1 hora para pães menores, 2 horas para pães maiores.
        </StepBox>
        <Quote>"Um pão bem assado canta quando sai do forno. Você vai ouvir o estalo da crosta se contraindo enquanto esfria — é o pão contando a história da sua fermentação."</Quote>
        <HighlightBox title="Temperatura interna como guia">
          Um termômetro de sonda é um dos investimentos mais valiosos para o padeiro artesanal. Um pão de levain está completamente assado quando a temperatura interna atingir entre 96°C e 98°C. Abaixo disso, o miolo estará úmido. Acima de 99°C, a crosta terá perdido umidade em excesso e ficará dura demais.
        </HighlightBox>
      </>
    ),
  },
];

// ─── Smooth scroll using rAF + easing (100% reliable, no stale state issues) ──
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothScrollTo(container: HTMLElement, targetY: number, duration = 700, onDone?: () => void) {
  const startY = container.scrollTop;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    container.scrollTop = startY + distance * easeInOutCubic(progress);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      onDone?.();
    }
  }

  requestAnimationFrame(step);
}

// ─── Animated sidebar nav item ────────────────────────────────────────────────
const NavItem: React.FC<{
  chapter: (typeof chapters)[0];
  isActive: boolean;
  onClick: () => void;
}> = ({ chapter, isActive, onClick }) => {
  const spring = useSpring({
    backgroundColor: isActive ? '#f0e8db' : 'rgba(250,246,240,0)',
    borderLeftColor: isActive ? '#c9883d' : 'rgba(201,136,61,0)',
    config: { tension: 300, friction: 30 },
  });
  const numSpring = useSpring({
    opacity: isActive ? 1 : 0.22,
    config: { tension: 300, friction: 30 },
  });

  return (
    <animated.div
      onClick={onClick}
      style={{
        ...spring,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '11px 14px',
        marginBottom: 2,
        borderRadius: 8,
        borderLeft: '3px solid',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <animated.span
        style={{
          ...numSpring,
          fontFamily: '"Playfair Display", serif',
          fontWeight: 700,
          color: '#c9883d',
          fontSize: '0.78rem',
          minWidth: 20,
          paddingTop: 2,
          flexShrink: 0,
        }}
      >
        {chapter.number}
      </animated.span>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: isActive ? 800 : 600, lineHeight: 1.3, mb: 0.3, fontSize: '0.8rem' }}>
          {chapter.title}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.52, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.57rem' }}>
          {chapter.time} · {chapter.type}
        </Typography>
      </Box>
    </animated.div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const CourseContentPage: React.FC = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeId, setActiveId] = useState(chapters[0].id);
  const isAnimating = useRef(false);

  // ── IntersectionObserver: update active as user scrolls ──
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const obs: IntersectionObserver[] = [];
    chapters.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const o = new IntersectionObserver(
        ([entry]) => { if (!isAnimating.current && entry.isIntersecting) setActiveId(id); },
        { root, rootMargin: '-8% 0px -60% 0px', threshold: 0 }
      );
      o.observe(el);
      obs.push(o);
    });
    return () => obs.forEach((o) => o.disconnect());
  }, []);

  // ── Click nav item → smooth scroll ──
  const scrollToChapter = useCallback((id: string) => {
    const container = scrollRef.current;
    const target = sectionRefs.current[id];
    if (!container || !target) return;

    setActiveId(id);
    isAnimating.current = true;

    // Position of target relative to the scroll container
    const containerTop = container.getBoundingClientRect().top;
    const targetTop = target.getBoundingClientRect().top;
    const to = Math.max(0, container.scrollTop + (targetTop - containerTop) - 40);

    smoothScrollTo(container, to, 700, () => { isAnimating.current = false; });
  }, []);

  const activeIndex = chapters.findIndex((c) => c.id === activeId);
  const progressPct = ((activeIndex + 1) / chapters.length) * 100;

  return (
    <ThemeProvider theme={courseTheme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          bgcolor: 'background.default',
          m: '0 !important',
          p: '0 !important',
        }}
      >
        {/* ── Hero ── */}
        <Box sx={{ position: 'relative', height: { xs: 220, md: 340 }, flexShrink: 0 }}>
          <Box
            component="img"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAimTOmjwW-r9XVjb5AVosuHXuUWZigtEnPcZhJAPBIaXhQAjgljOFeKeWk_K3GpfIoGY9qbYD6R364NS2ITY7SN8By3q5HxE7iVutGcFou1071dHPL9lycbGlsBm8YOeF5wnrhJCmdneEoK-37gID0RqVqQCy9K-OY3L1JM4kFicOFA-6Z9fwQppQhU6K19XtEAmuzgdMESzmCVDZ4ZTOpjg0Fj4tgrOncAIxPTbgFdIuEmUkFnYpnNyD7raSkTjN9er_lN1ogJEA"
            alt="Fermentação Natural"
            sx={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.62) saturate(0.85)', display: 'block' }}
          />
          <Box sx={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(120deg, rgba(44,26,14,0.95) 0%, rgba(44,26,14,0.45) 50%, transparent 100%)',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            px: { xs: 4, md: 6 }, py: { xs: 4, md: 5 },
          }}>
            <Chip label="Nível Especialista" size="small" sx={{ bgcolor: 'secondary.main', color: '#fff', width: 'fit-content', mb: 2, fontWeight: 900, fontSize: '0.58rem', letterSpacing: '0.16em' }} />
            <Typography variant="h2" sx={{ color: '#fff', fontSize: { xs: '1.7rem', md: '2.5rem' }, lineHeight: 1.1, mb: 1.5, maxWidth: 520 }}>
              A Arte da Fermentação Natural
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: 460, lineHeight: 1.65, fontSize: '0.9rem' }}>
              Domine as técnicas milenares do levain, compreenda a biologia do trigo e transforme sua produção artesanal em uma ciência exata.
            </Typography>
          </Box>
        </Box>

        {/* ── Progress strip ── */}
        <Box sx={{ bgcolor: 'primary.main', display: 'flex', alignItems: 'center', gap: 3, px: { xs: 4, md: 6 }, py: 1.25, flexShrink: 0 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.38)', letterSpacing: '0.13em', textTransform: 'uppercase', whiteSpace: 'nowrap', fontSize: '0.57rem' }}>
            Seu Progresso
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progressPct}
            sx={{
              flex: 1, height: 3, borderRadius: 99,
              bgcolor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': { bgcolor: 'secondary.main', borderRadius: 99, transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)' },
            }}
          />
          <Typography variant="caption" sx={{ color: 'secondary.light', fontWeight: 600, whiteSpace: 'nowrap', fontSize: '0.72rem' }}>
            {activeIndex + 1} de {chapters.length} capítulos
          </Typography>
        </Box>

        {/* ── Body row ── */}
        <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>

          {/* ── Scrollable content column ── */}
          <Box
            ref={scrollRef}
            sx={{
              flex: 1,
              minWidth: 0,
              overflowY: 'scroll',
              bgcolor: '#ffffff',
              borderRight: isLargeScreen ? '1px solid' : 'none',
              borderColor: 'divider',
              // Hide scrollbar in all browsers
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            <Box sx={{ px: { xs: 4, md: 6, xl: 10 }, py: { xs: 5, md: 7 } }}>
              {chapters.map((chapter, index) => (
                <Box
                  key={chapter.id}
                  ref={(el: HTMLDivElement | null) => { sectionRefs.current[chapter.id] = el; }}
                  sx={{
                    mb: index < chapters.length - 1 ? 10 : 0,
                    pb: index < chapters.length - 1 ? 10 : 0,
                    borderBottom: index < chapters.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 3 }}>
                    <Typography sx={{ fontFamily: '"Playfair Display", serif', fontSize: '3rem', fontWeight: 900, color: 'secondary.main', opacity: 0.12, lineHeight: 1, userSelect: 'none', minWidth: 52, textAlign: 'right', mt: 0.3, flexShrink: 0 }}>
                      {chapter.number}
                    </Typography>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="h5" sx={{ color: 'primary.main', lineHeight: 1.2, mb: 1.25 }}>
                        {chapter.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={`⏱ ${chapter.time}`} size="small" variant="outlined" sx={{ borderColor: 'secondary.main', color: 'secondary.main', bgcolor: 'rgba(201,136,61,0.05)' }} />
                        <Chip label={chapter.type} size="small" variant="outlined" sx={{ borderColor: 'divider', color: 'text.secondary', bgcolor: 'background.default' }} />
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ pl: { xs: 0, sm: '76px' } }}>
                    {chapter.content}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* ── Fixed sidebar — no scroll ever ── */}
          {isLargeScreen && (
            <Box
              sx={{
                width: 284,
                flexShrink: 0,
                bgcolor: 'background.default',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'text.secondary', opacity: 0.36, display: 'block', mb: 2, pb: 1.5, borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
                  Conteúdo do Curso
                </Typography>

                <Box component="nav" sx={{ flexShrink: 0 }}>
                  {chapters.map((chapter) => (
                    <NavItem
                      key={chapter.id}
                      chapter={chapter}
                      isActive={activeId === chapter.id}
                      onClick={() => scrollToChapter(chapter.id)}
                    />
                  ))}
                </Box>

                <Box sx={{ flex: 1 }} />

                <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'primary.main', color: '#fff', borderRadius: 3, boxShadow: '0 8px 20px rgba(44,26,14,0.15)', mb: 1.5, flexShrink: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <DownloadForOfflineIcon sx={{ fontSize: 17, color: 'secondary.light' }} />
                    <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.13em', color: 'secondary.light', fontSize: '0.61rem' }}>
                      Recursos Extras
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.65, mb: 2, lineHeight: 1.6, fontSize: '0.76rem' }}>
                    Baixe o material de apoio e as planilhas de cálculo de hidratação.
                  </Typography>
                  <Button fullWidth variant="outlined" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.22)', textTransform: 'none', fontSize: '0.71rem', py: 0.9, borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.55)' } }}>
                    PDF: Manual do Padeiro v2.0
                  </Button>
                </Paper>

                <Box sx={{ p: 2.5, borderRadius: 3, border: '2px dashed', borderColor: 'divider', textAlign: 'center', flexShrink: 0 }}>
                  <WorkspacePremiumIcon sx={{ fontSize: 26, color: 'secondary.main', opacity: 0.3, mb: 0.75, display: 'block', mx: 'auto' }} />
                  <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', color: 'primary.main', mb: 0.5, fontSize: '0.64rem' }}>
                    Certificado Disponível
                  </Typography>
                  <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary', opacity: 0.62, fontSize: '0.66rem', lineHeight: 1.5 }}>
                    Conclua todos os tópicos e realize o exame final para emitir seu selo de mestria.
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default CourseContentPage;