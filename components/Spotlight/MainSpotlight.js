import React from "react"; 
import styles from "./Spotlight.module.css"

class MainSpotlight extends React.Component{
    render(){
        return (
            <div className={styles.MainSpotlightWrapper}>
                <div className={styles.MainSpotlight}>
                    <div className={styles.MainCard}>
                        <p style={{marginTop: "-20px", fontSize: "2.2em"}}>Member Spotlight</p>
                        <div className={styles.Border}></div>
                        <img className={styles.MainImage} src={"/images/DavidKalakaua.jpg"}></img>
                    </div>
                    <div className={styles.MainDescription}>
                        <h2>David Kalākaua</h2>
                        <h3 style={{marginTop: "-17px"}}>August 29, 2021</h3>
                        <p className={styles.MainDescriptionText}>
                            Kalākaua (David Laʻamea Kamananakapu Mahinulani Naloiaehuokalani Lumialani Kalākaua;[2] 
                            November 16, 1836 – January 20, 1891), sometimes called The Merrie Monarch, was the last king 
                            and penultimate monarch of the Kingdom of Hawaiʻi, reigning from February 12, 1874, until 
                            his death. Succeeding Lunalilo, he was elected to the vacant throne of Hawaiʻi against Queen Emma. 
                            Kalākaua had a convivial personality and enjoyed entertaining guests with his singing and ukulele 
                            playing. At his coronation and his birthday jubilee, the hula that had been banned from public in 
                            the kingdom became a celebration of Hawaiian culture. During his reign, the Reciprocity Treaty 
                            of 1875 brought great prosperity to the kingdom. Its renewal continued the prosperity but allowed 
                            the United States to have exclusive use of Pearl Harbor. In 1881, he took a trip around the world 
                            to encourage the immigration of contract sugar plantation workers. Kalākaua wanted Hawaiians to 
                            broaden their education beyond their nation. He instituted a government-financed program to sponsor 
                            qualified students to be sent abroad to further their education. Two of Kalākaua's projects, the 
                            statue of Kamehameha I and the rebuilding of ʻIolani Palace, were expensive endeavors but are popular 
                            tourist attractions today.
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}

export default MainSpotlight