"use client"

import { useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import styles from "./page.module.css";
export default function Admin(){
    const router=useRouter();
    const D=useRef<HTMLDivElement>(null);
    useEffect(()=>{
        if(localStorage.getItem("token")===null){
            console.log(localStorage.getItem("tokin"))
            router.push('/login')
        }else{
                if(D.current){
                    D.current.innerHTML="";

                }
                const data={
                    token:localStorage.getItem("token")
                }
                fetch("/api/get_message",{
                    method:"POST",
                    headers:{
                        'Content-Type': 'application/json'
                                },
                    body:JSON.stringify(data)
                })       
                 .then(response => {
                    if (!response.ok) {
                        response.json().then(result=>{
                            alert(result.message);
                        })
                        throw new Error(`HTTP error! status: ${ response.status}`);
                    }
                    return response.json(); // Parse JSON response
                })
                .then(result => {
                    for (let i = 0; i < result.messages.length; i++) {
                        const element =document.createElement("div");
                        element.innerText=result.messages[i];
                        
                        
                        D.current?.appendChild(element);
                    }
                })
                .catch(error => {
                    console.log(error.message)
                });
        }
    })
    return (
        <div ref={D} className={styles.MSG}>

        </div>
    );
    
}