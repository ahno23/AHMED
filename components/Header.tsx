import styles from "./Header.module.css";

function Header(){
return(
    <>
        <div className={styles.header}></div>
        <img className={styles.Imeg} src="/images/my_photo.jpg" alt="myphoto"/>
    </>
);
}
export default Header;