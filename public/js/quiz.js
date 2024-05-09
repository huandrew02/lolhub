const quizData=[
    {
        question:"When did league of Legends come out?",
        a:"2009",
        b:"2006",
        c:"2011",
        d:"2004",
        correct:'a'
    },
    {
        question:"Who created League of Legends",
        a:"Epic Games",
        b:"Electronic Arts",
        c:"Blizzard",
        d:"Riot Games",
        correct:'d'
    },
    {
        question:"What team won the League of Legends World Championship in 2023",
        a:"Cloud 9",
        b:"T1",
        c:"Invictus Gaming",
        d:"DRX",
        correct:'b'
    },
    {
        question:"Who was not one of the original 17 Champions when the game first released",
        a:"Jax",
        b:"Annie",
        c:"Zilean",
        d:"Twisted Fate",
        correct:'c'
    },
    {
        question:"What game inspired League of Legends?",
        a:"StarCraft",
        b:"Final Fantasy 7",
        c:"Dota 2",
        d:"Warcraft III",
        correct:'d'
    },
]

const quiz = document.getElementById('quiz')
const answerEls = document.querySelectorAll('.answer')
const questionEl = document.getElementById('question')
const a_text = document.getElementById('a_text')
const b_text = document.getElementById('b_text')
const c_text = document.getElementById('c_text')
const d_text = document.getElementById('d_text')
const submitBtn = document.getElementById('submit')

let currentQuiz = 0
let score = 0

loadQuiz()

function loadQuiz(){
    deselectAnswers()
    const currentQuizData = quizData[currentQuiz]

    questionEl.innerText = currentQuizData.question
    a_text.innerText = currentQuizData.a
    b_text.innerText = currentQuizData.b
    c_text.innerText = currentQuizData.c
    d_text.innerText = currentQuizData.d
}

function deselectAnswers(){
    answerEls.forEach(answerEl => answerEl.checked = false)
}

function getSelected(){
    let answer

    answerEls.forEach(answerEl => {
        if(answerEl.checked){
            answer = answerEl.id
        }
    })
    return answer
}

submitBtn.addEventListener('click', () => {
    const answer = getSelected()
    
    if(answer){
        if(answer === quizData[currentQuiz].correct){
            score++
        }
        currentQuiz++

        if(currentQuiz<quizData.length){
            loadQuiz()
        } else{
            quiz.innerHTML=`
                <h2>YOu answered correctly at ${score}
                /${quizData.length} questions </h2>

                <button onclick="location.reload()">Reload</button>
            `
        }
    }
})