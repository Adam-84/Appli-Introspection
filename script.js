const deck = document.getElementById("deck");
const remainingText = document.getElementById("remainingText");
const resetBtn = document.getElementById("resetBtn");
const questionModal = document.getElementById("questionModal");
const modalQuestion = document.getElementById("modalQuestion");
const CARDS_ON_TABLE = 16;

const questionBank = [
  "Qu'est-ce qui m'a vraiment fait sourire cette semaine ?",
  "A quel moment me suis-je senti pleinement vivant aujourd'hui ?",
  "Quelle emotion revient le plus souvent en ce moment ?",
  "Qu'est-ce que j'evite de regarder en face ?",
  "Quel besoin personnel n'est pas assez ecoute actuellement ?",
  "Quand ai-je dit oui alors que je voulais dire non ?",
  "Quelle situation me prend trop d'energie mentale ?",
  "Quel petit succes ai-je tendance a minimiser ?",
  "De quoi suis-je fier, meme en silence ?",
  "Quelle relation me nourrit sincerement ?",
  "Quelle relation merite une limite plus claire ?",
  "Quel pardon ai-je besoin de me donner ?",
  "Qu'est-ce que mon corps essaie de me dire ces jours-ci ?",
  "Quelle habitude me fait du bien sur la duree ?",
  "Quelle habitude m'eloigne de ce qui compte pour moi ?",
  "Qu'est-ce qui m'apaise rapidement quand je suis tendu ?",
  "Quel est mon plus grand declencheur de stress en ce moment ?",
  "Quelle pensee repetitive pourrais-je remettre en question ?",
  "Si je ralentissais aujourd'hui, qu'est-ce qui changerait ?",
  "Quelle decision reportee me pese encore ?",
  "Qu'est-ce que je controle trop et qui m'epuise ?",
  "Qu'est-ce que je ne controle pas et que je pourrais accepter ?",
  "Quel objectif est vraiment le mien, et pas celui des autres ?",
  "Qu'est-ce qui me motive profondement en ce moment ?",
  "A quoi ressemble une bonne journee pour moi ?",
  "Quelle peur guide certaines de mes decisions recentes ?",
  "Quand me suis-je senti aligne avec mes valeurs ?",
  "Quelle valeur personnelle ai-je negligee cette semaine ?",
  "Quel choix simple pourrait alleger ma charge mentale ?",
  "Qu'est-ce que je souhaite apprendre sur moi cette annee ?",
  "De quoi ai-je besoin pour me sentir en securite interieure ?",
  "Quel message interieur critique revient souvent ?",
  "Comment parlerais-je a un ami dans ma situation ?",
  "Quelle est ma definition actuelle de la reussite ?",
  "Qu'est-ce que je poursuis par habitude plutot que par desir ?",
  "Quel souvenir me rappelle ma force personnelle ?",
  "Quelle qualite personnelle m'aide le plus dans les moments difficiles ?",
  "Qu'est-ce que je peux simplifier des aujourd'hui ?",
  "Quelle conversation importante ai-je besoin d'avoir ?",
  "Que puis-je faire cette semaine pour me respecter davantage ?",
  "Quel engagement envers moi-meme est non negociable ?",
  "Qu'est-ce qui me fatigue plus que je ne l'admets ?",
  "A quel endroit ai-je besoin de plus de douceur ?",
  "Qu'est-ce qui me donne de l'elan le matin ?",
  "Quelle est la plus petite action utile que je peux faire maintenant ?",
  "De quoi ai-je peur si je reussis vraiment ?",
  "De quoi ai-je peur si j'echoue ?",
  "Quelle croyance limite mon potentiel actuel ?",
  "Quel risque sain ai-je envie de prendre ?",
  "A quoi ai-je dit oui trop vite cette semaine ?",
  "Qu'est-ce que je veux proteger dans ma vie aujourd'hui ?",
  "Qu'est-ce que je veux laisser derriere moi ?",
  "Quel mot decrit le mieux mon etat interieur actuel ?",
  "Quelle est ma priorite emotionnelle du moment ?",
  "Quand ai-je ignore mon intuition recemment ?",
  "Quand mon intuition m'a-t-elle bien guide ?",
  "Qu'est-ce que j'envie chez les autres et pourquoi ?",
  "Que m'apprend cette envie sur mes propres desirs ?",
  "Qu'est-ce que je tolererais moins si je m'aimais davantage ?",
  "Quelle limite claire puis-je poser cette semaine ?",
  "Qu'est-ce que je remets toujours a plus tard ?",
  "Quel premier pas concret me semble realiste ?",
  "Qu'est-ce qui m'aide a retrouver mon calme rapidement ?",
  "Que puis-je celebrer aujourd'hui, meme modestement ?",
  "Quelle part de moi a besoin d'etre entendue ?",
  "A quel moment me suis-je trahi pour plaire ?",
  "Qu'est-ce qui me manque le plus en ce moment ?",
  "Comment puis-je me l'offrir partiellement des maintenant ?",
  "Quel choix serait le plus coherent avec mes valeurs ?",
  "Qu'est-ce qui me donne le sentiment d'avancer ?",
  "Quand ai-je ressenti de la gratitude recemment ?",
  "Qu'est-ce que je veux nourrir davantage dans ma vie ?",
  "Quelle charge emotionnelle puis-je deposer aujourd'hui ?",
  "Quelle action me rapprocherait de ma paix interieure ?",
  "Quel domaine de ma vie appelle plus d'attention ?",
  "Qu'est-ce que je cache derriere le mot 'ca va' ?",
  "A qui pourrais-je demander de l'aide sans honte ?",
  "Qu'est-ce que je peux arreter de perfectionner ?",
  "Quel progres compte plus que la perfection ?",
  "Qu'est-ce qui me fait perdre mon centre ?",
  "Qu'est-ce qui me ramene a moi ?",
  "Quelle part de ma routine n'a plus de sens ?",
  "Qu'est-ce que je veux ressentir plus souvent ?",
  "Que puis-je faire pour favoriser ce ressenti ?",
  "Quels signes montrent que je suis sur la bonne voie ?",
  "Qu'est-ce que je veux vivre davantage dans mes relations ?",
  "Quelle attente irreelle me met sous pression ?",
  "Comment puis-je etre plus juste avec moi-meme ?",
  "Qu'est-ce que je peux accepter de ne pas savoir ?",
  "Quelle decision me ferait respirer plus librement ?",
  "Qu'est-ce qui me fait me sentir utile ?",
  "Comment puis-je proteger mon temps personnel ?",
  "Quel serait mon acte de courage de cette semaine ?",
  "Quelle intention veux-je poser pour les prochains jours ?",
  "De quoi ai-je besoin pour me sentir plus ancre ?",
  "Qu'est-ce qui me reconnecte a l'essentiel ?",
  "Quelle promesse ai-je envie de me faire aujourd'hui ?",
  "Quel petit rituel pourrait soutenir mon equilibre ?",
  "Quel message bienveillant ai-je besoin d'entendre maintenant ?",
  "Comment saurais-je que je prends mieux soin de moi ?"
];

let remainingQuestions = [];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function updateRemainingText() {
  remainingText.textContent = `Questions restantes : ${remainingQuestions.length}`;
}

function drawQuestion() {
  if (remainingQuestions.length === 0) {
    return "Le paquet est vide. Clique sur \"Reinitialiser le paquet\".";
  }

  const question = remainingQuestions.pop();
  updateRemainingText();
  return question;
}

function showModal(question) {
  modalQuestion.textContent = question;
  questionModal.classList.remove("hidden");
  questionModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  questionModal.classList.add("hidden");
  questionModal.setAttribute("aria-hidden", "true");
}

function revealCard(event) {
  const clickedCard = event.currentTarget;
  if (clickedCard.disabled) {
    return;
  }

  const question = drawQuestion();
  showModal(question);
  clickedCard.disabled = true;
  clickedCard.classList.add("used");
  clickedCard.innerHTML = "<span class=\"front-label\">Carte piochee</span><span class=\"hint\">Reinitialise pour rejouer</span>";
}

function renderDeck() {
  deck.innerHTML = "";

  for (let i = 0; i < CARDS_ON_TABLE; i += 1) {
    const cardButton = document.createElement("button");
    cardButton.type = "button";
    cardButton.className = "draw-card";
    cardButton.innerHTML = "<span class=\"front-label\">Carte a piocher</span><span class=\"hint\">Clique pour retourner</span>";
    cardButton.addEventListener("click", revealCard);
    deck.appendChild(cardButton);
  }
}

function resetSession() {
  remainingQuestions = [...questionBank];
  shuffle(remainingQuestions);
  renderDeck();
  updateRemainingText();
  closeModal();
}

questionModal.addEventListener("click", closeModal);
resetBtn.addEventListener("click", resetSession);
resetSession();
