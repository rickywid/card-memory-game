import { useEffect, useState } from 'react';
import GameContainer from './components/GameContainer';
import IntroMp3 from './audio/intro.mp3'
import RyuMp3 from './audio/ryu.mp3'
import GuileMp3 from './audio/guile.mp3'
import HondaMp3 from './audio/honda.mp3'
import Logo2 from './images/logo2.png'

function App() {

  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [music, setMusic] = useState<any>(IntroMp3)
  const [soundOn, setSoundOn] = useState<boolean>(true)
  const [difficulty, setdifficulty] = useState<string>('easy')

  useEffect(() => {

    const menuAudio = new Audio(music);

    if (!music) {
      menuAudio.pause()
      return
    }

    if (soundOn) {
      menuAudio.play();
      menuAudio.addEventListener('ended', () => {
        menuAudio.muted = true;
        menuAudio.currentTime = 0;
        menuAudio.play();
      })
    }

    return () => {
      menuAudio.pause();
    }
  }, [soundOn, music]);

  const stopMusic = () => {
    setSoundOn(!soundOn)
  }

  const endGame = () => {
    setMusic(IntroMp3)
    setGameStarted(false)
  }

  const changeSong = (song: any) => {
    if (song === 'ryu') {
      setMusic(RyuMp3)
    }
    if (song === 'guile') {
      setMusic(GuileMp3)
    }
    if (song === 'honda') {
      setMusic(HondaMp3)
    }

    if (song === null) {
      setMusic(null)
    }
  }

  return (
    <div className="App">
      {gameStarted ? (
        <GameContainer changeSong={changeSong} endGame={endGame} difficulty={difficulty} />
      ) : (
        <div className="menu">
          <img style={{ display: 'block' }} src={Logo2} alt="" />
          <div className="bottom">
            <button onClick={stopMusic}>{soundOn ? '🔊 Sound On' : '🔇 Sound Off'}</button>
            <small>Card Game Edition</small>
          </div>
          <div className="difficulty">
            <button className={difficulty === 'easy' ? 'selected' : ''} onClick={() => setdifficulty('easy')}>Easy</button>
            <button className={difficulty === 'medium' ? 'selected' : ''} onClick={() => setdifficulty('medium')}>Medium</button>
            <button className={difficulty === 'hard' ? 'selected' : ''} onClick={() => setdifficulty('hard')}>Hard</button>
          </div>
          <button className="start-btn" onClick={() => setGameStarted(true)}>Start</button>
          <p>Made in 🇨🇦</p>
        </div>
      )}
    </div>
  );
}

export default App;
