'use client';
import Botao from '@/componentes/botao';
import {useState} from 'react';


export default function Sobre(){
const [numero, setNumero] = useState(0);
    return(
        <div className="container"> 
            <h1>Sobre</h1>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi, in. Quis, minus! Minus explicabo, sed quidem, quasi ut minima
             odit id officiis dolorum voluptatem veritatis ipsam et laboriosam. Quas, iure.</p>
        <br /> 
        <label>{numero}</label>
        <br />
        <button 
        type="button"
        onClick={() => setNumero(numero+1)}
        >Contar</button>    

        <Botao label={'Mais um'} acao={() => setNumero(numero + 1)} />
        <Botao label={'Alerta'} acao={() => alert()} />
    </div>
    );
}
