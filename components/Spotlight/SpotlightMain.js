import React from "react"; 
import styles from "./Spotlight.module.css"

class SpotlightMain extends React.Component{
    render(){
        const {image, name, date, desc} = this.props.member
        return (
            <div className={styles.MainSpotlightWrapper}>
                <div className={styles.MainSpotlight}>
                    <div className={styles.MainCard}>
                        <p style={{marginTop: "-20px", fontSize: "2.2em"}}>Member Spotlight</p>
                        <div className={styles.Border}></div>
                        <img className={styles.MainImage} src={image}></img>
                    </div>
                    <div className={styles.MainDescription}>
                        <h2>{name}</h2>
                        <h3 style={{marginTop: "-17px"}}>{date}</h3>
                        <p className={styles.MainDescriptionText}>{desc}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default SpotlightMain