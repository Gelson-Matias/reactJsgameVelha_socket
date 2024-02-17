
import React  ,{ useState } from 'react';
import { useEffect } from 'react';
import io  from 'socket.io-client';
import "./App.css";
const socket =io.connect("http://localhost:3001");


function App() {
  const[tela,setTela]=useState('menu');
  const [tabuleiro,setTabuleiro]=useState([]);
  const [jogadorAtual,setJogadorAtual]=useState('');
  const [jogadorAdiversario,setJogadorAdiversario]=useState(null);
  const [nomeAdiversario,setNomeAdiversario]=useState(null);
  const [jogadaRestante,setJogadaRestante]=useState(0);
  const [salaJogo,setSalaJogo]=useState('');
  const [nomeJogador,setNomeJogador]=useState('');
  const [ganhador,setGanhador]=useState('');
  let [permissaJogar, setPermissaJogar]=useState(true);


  const verSocket=()=>{
   
    socket.emit("join_roon",salaJogo)
    setJogadorAdiversario(null)
    setNomeAdiversario(null)
    setGanhador('')
    // setJogadorAtual()
    setJogadaRestante(9)
    setTabuleiro([
        ['','',''], 
        ['','',''], 
        ['','','']
    ]);
    setTela('telaJogo');
    setPermissaJogar(true)
  }
  const aplicaJogada= async(linha,coluna)=>{
    tabuleiro[linha][coluna]=jogadorAtual
    // setTabuleiro([...tabuleiro])
    // setJogadorAtual(jogadorAtual === 'X' ? 'O': 'X')
    verficarGanhador(tabuleiro,linha,coluna)
    const dadosJodas={
        salaJogo:salaJogo,
        jogadaAtual:jogadorAtual,
        tabuleiro:tabuleiro,
        nomeJogador:nomeJogador,
        linha:linha,
        coluna:coluna
    }

    await socket.emit('send_jogada',dadosJodas)
    setTabuleiro([...tabuleiro])
    setPermissaJogar(false)
    // console.log(permissaJogar)
    // console.log(dadosJodas)
  }

  function verficarGanhador(tabuleiro,linha,coluna) {
    if (tabuleiro[linha][0] !=='' && tabuleiro[linha][0] ===tabuleiro[linha][1] && tabuleiro[linha][1]===tabuleiro[linha][2]) {
      return finalizadorJogador(tabuleiro[linha][0])
    }
    if (tabuleiro[0][coluna] !=='' && tabuleiro[0][coluna] ===tabuleiro[1][coluna] && tabuleiro[1][coluna]===tabuleiro[2][coluna]) {
      return finalizadorJogador(tabuleiro[coluna][0])
    }
    if (tabuleiro[0][0] !=='' && tabuleiro[0][0] ===tabuleiro[1][1] && tabuleiro[1][1]===tabuleiro[2][2]) {
      return finalizadorJogador(tabuleiro[0][0])
    }
    if (tabuleiro[0][2] !=='' && tabuleiro[0][2] ===tabuleiro[1][1] && tabuleiro[1][1]===tabuleiro[2][0]) {
      return finalizadorJogador(tabuleiro[0][2])
    }
    if ((jogadaRestante -1) === 0) {
      return finalizadorJogador('')
      // console.log(1234);
    }
    setJogadaRestante((jogadaRestante -1))

  }

  useEffect(() => {
    socket.off("receberJodada").on("receberJodada", (data) => {
        console.log(data.jogadaAtual)
        setTabuleiro([...data.tabuleiro])
        verficarGanhador(data.tabuleiro,data.linha,data.coluna)
        // setPermissaJogar(true)
        console.log(permissaJogar)
        console.log(jogadorAtual)
        if (data.jogadaAtual!=jogadorAtual) {
          setPermissaJogar(true)
          setJogadorAdiversario(data.jogadaAtual)
          setNomeAdiversario(data.nomeJogador)

        }else{
          setPermissaJogar(false)
        }

        // setJogadorAtual(jogadorAtual === 'X' ? 'O': 'X')
    });

  //   socket.off("receberJodada").on("receberJodada", (data) => {
  //     console.log(data)
  // });
  
  }, [socket]);

  const telaMenu=()=>{
    return (
      <div className="App">
        <header className="App-header">
          {/* <input type='text' onChange={(event)=>{setNomeJogador(event.target.value)}} placeholder='Digite o seu nome'/>
          <input type='text' onChange={(event)=>{setSalaJogo(event.target.value)}} placeholder='Digite o campo de jogo'/>
          <input type='text' onChange={(event)=>{setJogadorAtual(event.target.value)}} placeholder='Digite a letra do seu jogador'/>

          <button onClick={()=>inicioJogo('X')}>Jogar</button>
          <button onClick={aplicaJogada}>Jogarsocke</button>
          <button onClick={verSocket}>Jogarcodsdsmsocke</button> */}
       
          <div className="container col-3"> 
            <div className="form-group col-12">
              <label for="exampleInputEmail1">Seu nome</label>
              <input type="text" onChange={(event)=>{setNomeJogador(event.target.value)}} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
            </div>
            <div className="form-group">
              <label for="exampleInputPassword1">Sala de jogo</label>
              <input type="number" onChange={(event)=>{setSalaJogo(event.target.value)}} className="form-control" id="exampleInputPassword1"/>
            </div>
            <div className="form-group">
              <label for="exampleInputPassword1">Qual é o seu jogar</label>
              <input type="text" onChange={(event)=>{setJogadorAtual(event.target.value)}} className="form-control" id="exampleInputPassword1"/>
            </div>
            <div className='col-12 pt-3'><button onClick={verSocket} className="btn btn-primary col-12">Jogar</button></div>
          </div>
        </header>
      </div>
    );
  }
  const telaJogo=()=>{
    return(
    <div>
      <header className="App-header">
        <div className='informacaoJodar container col-3 shadow-sm p-2 mb-5 bg-white rounded'>
            <div className=''>
              <div >
                <p style={{color:'black'}}>
                   Nome do adversario: {nomeAdiversario!=null ? nomeAdiversario : "" }
                </p>
                <p style={{color:'black'}} >
                   O jogador do adversario:  {jogadorAdiversario!=null ? jogadorAdiversario : "" }
                </p>
              </div>
              <div>
                <div><button onClick={()=>setTela('menu')} className="btn btn-primary col-12">Voltar ao menu</button></div>
                <div className='pt-3'><button onClick={verSocket} className="btn  btn-dark col-12">Voltar a jogar</button></div>
              </div>
            </div>
        </div>
        {
          tabuleiro.map((linha,numeroLinha)=>{
            return(
              <div className=''>
                  {
                    linha.map((coluna,numeroColuna)=>{
                      return(
                        <button style={{padding:50,fontSize:25}}  onClick= {()=> aplicaJogada(numeroLinha,numeroColuna)} disabled={coluna!=='' || permissaJogar==false} className="btn btn-primary  m-2"> {coluna}</button>      
                      )
                      // return(<button onClick= {()=> jogar(numeroLinha,numeroColuna)} disabled={coluna!==''}> {coluna}</button>)
                    })
                  }
              </div>
            )
            
          })
        }
        

      </header>
    </div>
    );
  }
  const vencedorJogo=()=>{
    return(
      <div>
        <header className="App-header">
        {/* <button  onClick={()=>setTela('menu')}>Voltar ao menu</button> */}
        <div>
          <h1>O vencedor é: {ganhador}</h1>
          <div className='pt-3'>
            <button onClick={()=>setTela('menu')} className="btn btn-primary col-12 ">Menu</button>
          </div>
          
          <div className='pt-3'>
          <button onClick={verSocket} className="btn  btn-dark col-12">Voltar a jogar</button>
          </div>
        </div>
        </header>
      </div>
      );
  }
   switch (tela) {
    case 'menu':
      return telaMenu();
      break;
    case 'telaJogo':
      return telaJogo();
    case 'ganhador':
      return vencedorJogo();
    default:
      break;
  }
  
  function inicioJogo(jagador) {
    setJogadorAtual(jagador)
    setJogadaRestante(9)

    console.log(23)
    setTabuleiro([
        ['','',''], 
        ['','',''], 
        ['','','']
    ]);
    setTela('telaJogo');
  }
  function jogar(linha,coluna) {
    tabuleiro[linha][coluna]=jogadorAtual
    setTabuleiro([...tabuleiro])
    setJogadorAtual(jogadorAtual === 'X' ? 'O': 'X')
    verficarGanhador(tabuleiro,linha,coluna)
  }
   
 
  function finalizadorJogador(jogador) {
    setGanhador(jogador)
    setTela('ganhador')
    console.log(jogador)
  }
 
}

export default App;