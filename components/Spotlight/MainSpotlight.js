import React from "react"; 
import styles from "./Spotlight.module.css"

class BigSpotlight extends React.Component{
    render(){
        return (
            <div className={styles.MainSpotlight}>
                <h2 className={styles.Header}>Member Spotlight</h2>
            </div>
        )
    }
}

export default BigSpotlight