import Link from "next/link";

export default function Temp(){
    return(
        <div> 
            <h1>Acessos a telas</h1>
            <Link href={'/Sobre'} >Sobre</Link>
        </div>
    )
}
