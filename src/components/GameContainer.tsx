import { useEffect, useState } from "react"
import RyuPNG from '../images/ryu.png'
import KenPNG from '../images/ken.png'
import ChunliPNG from '../images/chunli.png'
import SagatPNG from '../images/sagat.png'
import BisonPNG from '../images/bison.png'
import DhalsimPNG from '../images/dhalsim.png'
import BalrogPNG from '../images/balrog.png'
import HondaPNG from '../images/honda.png'
import GuilePNG from '../images/guile.png'
import ZangiefPNG from '../images/zangief.png'
import Logo from '../images/logo.png'
import PerfectMp3 from '../audio/perfect.mp3'
import VictoryMp3 from '../audio/victory.mp3'
import useInterval from "../hooks/userInterval"
import Countdown from "./countdown"

const images = [
    RyuPNG,
    KenPNG,
    ChunliPNG,
    SagatPNG,
    BisonPNG,
    DhalsimPNG,
    BalrogPNG,
    HondaPNG,
    GuilePNG,
    ZangiefPNG,
]

interface Props {
    difficulty: string;
    endGame: () => void;
    changeSong: (song: string | null) => void;
}

interface Card {
    value: number;
    img: string;
    show: boolean;
    hide: boolean;
}

interface Data {
    idx: number;
    value: number
}

const songs = ['ryu', 'guile', 'honda']

const GameContainer = ({ difficulty, endGame, changeSong }: Props) => {

    const [deck, setDeck] = useState<Card[]>([])
    const [cardIndex, setCardIndex] = useState<Data[]>([])
    const [isChecking, setIsChecking] = useState<boolean>(false)
    const [removedCards, setRemovedCards] = useState<Data[]>([])
    const [gameOver, setGameOver] = useState<boolean>(false)
    const [correct, setCorrect] = useState<number>(1)
    const [attempts, setAttempts] = useState<number>(1)
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(25);

    useEffect(() => {
        const min = Math.ceil(0);
        const max = Math.floor(3);
        const num = Math.floor(Math.random() * (max - min + 1)) + min;

        changeSong(songs[num])
    }, [])

    useEffect(() => {
        const deck = []
        for (let i = 0; i < 10; i++) {
            deck.push(
                {
                    value: i,
                    img: images[i],
                    show: false,
                    hide: false
                },
                {
                    value: i,
                    img: images[i],
                    show: false,
                    hide: false
                }
            )
        }

        if (difficulty === "easy") {
            setMinutes(5)
        }
        if (difficulty === "medium") {
            setMinutes(2)
        }
        if (difficulty === "hard") {
            setMinutes(1)
        }

        setDeck(shuffle(deck))
    }, [])

    useEffect(() => {
        if (cardIndex.length === 2) {
            setAttempts(attempts + 1)

            if (cardIndex[0].value === cardIndex[1].value) {
                const menuAudio = new Audio(PerfectMp3);
                menuAudio.play();

                setTimeout(() => {
                    deck[cardIndex[0].idx].hide = true
                    deck[cardIndex[1].idx].hide = true
                    setCardIndex([])
                    setDeck([...deck])
                    setIsChecking(false)
                    setCorrect(correct + 1)
                    setRemovedCards([...removedCards, cardIndex[0], cardIndex[1]])

                    if (removedCards.length + 2 === deck.length) {
                        gameFinished()
                    }
                }, 1500);
            } else {
                setTimeout(() => {
                    deck[cardIndex[0].idx].show = false
                    deck[cardIndex[1].idx].show = false
                    setCardIndex([])
                    setDeck([...deck])
                    setIsChecking(false)
                }, 1500);
            }
        }
    }, [cardIndex])

    useEffect(() => {

        if (seconds === 0 && minutes === 0) {
            console.log('called')
            gameFinished()
            return
        }
    }, [seconds, minutes])

    // How to use setInterval w/ React
    // https://overreacted.io/making-setinterval-declarative-with-react-hooks/

    useInterval(() => {

        if (seconds === 0) {
            if (minutes !== 0) {
                setSeconds(59);
                setMinutes(minutes - 1)
            } else {
                setMinutes(25);
                setSeconds(0);
            }
        } else {
            setSeconds(seconds - 1);
        }
    }, 1000);

    const shuffle = (array: Card[]) => {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    const displayCards = () => {
        return deck.map((card: Card, i: number) => {
            return (
                card.show ?
                    (
                        <div
                            key={`${i}-${card.value}`}
                            className={`card inside animate__animated animate__flipInX ${card.hide ? 'hide' : ''} ${isChecking ? 'checking' : ''}`}
                        >
                            <img src={card.img} alt="" />
                        </div>
                    ) :
                    (
                        <div
                            key={i}
                            className={`card animate__animated animate__flipInX${card.hide ? 'hide' : ''} ${isChecking ? 'checking' : ''}`}
                            onClick={() => addCard(i, card.value)}
                        >
                            <img src={Logo} alt="" />
                        </div>
                    )
            )

        })
    }

    const addCard = (i: number, value: number) => {


        // if no cards selected 
        if (!cardIndex.length) {
            // reveal card
            // add card to set
            deck[i].show = true
            setCardIndex([{ idx: i, value }])
        }

        // if 1 card selected
        if (cardIndex.length) {
            // reveal second card
            deck[i].show = true
            setIsChecking(true)
            setCardIndex([...cardIndex, { idx: i, value }])
        }

        setDeck([...deck])
    }

    const gameFinished = () => {
        setGameOver(true)
        changeSong(null)
        const menuAudio = new Audio(VictoryMp3);
        menuAudio.play();
    }

    const getAccuracy = () => {

        if (correct === 0) { return 0 }

        return Math.round((correct / attempts) * 100)
    }

    const secondsTimer = seconds < 10 ? `0${seconds}` : seconds;
    const minutesTimer = minutes < 10 ? `0${minutes}` : minutes;

    return gameOver ? <div className="gameover">
        <h1>Game Over</h1>
        <p>Accuracy: {getAccuracy()}%</p>
        <button onClick={() => endGame()}>End Game</button>
    </div> : (
        <div>
            <div className="game-container">
                {displayCards()}
            </div>
            <footer>
                <button onClick={() => endGame()}>End Game</button>
                <p>Made in 🇨🇦</p>
                <Countdown seconds={secondsTimer} minutes={minutesTimer} />
            </footer>
        </div>
    )
}

export default GameContainer