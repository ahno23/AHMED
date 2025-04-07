import { useEffect, useRef, useState } from "react";
import styles from "./Main.module.css"
function Main(){
    const Text=useRef<HTMLTextAreaElement>(null)
    const [IsVisible,SetVisible]=useState(false);
    const Send=()=>{
      const url = '/api/send'; // Replace with your API endpoint
      const data = {
          msg:Text.current?.value
      };
      
      fetch(url, {
          method: 'POST', // HTTP method
          headers: {
              'Content-Type': 'application/json' // Specify JSON format
          },
          body: JSON.stringify(data) // Convert JavaScript object to JSON string
      })
          .then(response => {
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json(); // Parse JSON response
          })
          .then(result => {
              console.log('Success:', result);
              SetVisible(true);
          })
          .catch(error => {
              console.error('Error:', error);
          });
    }
    useEffect(()=>{
      if(IsVisible){
        setTimeout(()=>{
          Text.current.value = "";
          SetVisible(false);
        },2000)
      }
    },[IsVisible])
    return(
      <> 
        <textarea
            ref={Text}
            className={styles.TEXT}
            placeholder="Type your message here..."
        />
        <button onClick={Send} className={styles.SEND}>Send message</button>
      {IsVisible&& <div className={styles.BLUR}><div className={styles.BOX}><p>Thanks!</p></div></div>}
      <a className={styles.LINK} href="https://github.com/ahno23/AHMED" target="_blank" rel="noopener noreferrer">Source Code!</a>
      </>
    );
  }
export default Main;