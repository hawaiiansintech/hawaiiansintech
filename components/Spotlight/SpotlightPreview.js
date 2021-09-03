import React from "react"; 
import styles from "./Spotlight.module.css"

class SpotlightPreview extends React.Component{
    render(){
        return (
            <React.Fragment>
            <table className="large tableContent" cellSpacing="0">
                <thead id="tableHeader" Test>
                    <tr><td></td><td></td></tr>
                </thead>
                <tbody>
                    <tr>
                        <td><img className={styles.PreviewImage} src={"/images/DavidKalakaua.jpg"}></img></td>
                        <td style={{maxHeight: "300px"}}>
                            <div className={styles.PreviewDescription}>
                            <p className={styles.PreviewName}>David Kalākaua</p>
                            <p className={styles.PreviewDate}>August 29, 2021</p>
                            <p className={styles.PreviewDescriptionText}>
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
                        </td>
                    </tr>
                    <tr>
                        <td><img className={styles.PreviewImage} src={"/images/Emmit.png"}></img></td>
                        <td style={{maxHeight: "300px"}}>
                            <div className={styles.PreviewDescription}>
                            <p className={styles.PreviewName}>Emmit (Kamakani) Parubrub</p>
                            <p className={styles.PreviewDate}>September 2, 2021</p>
                            <p className={styles.PreviewDescriptionText}>
                                Software Engineer from Kahaluu
                            </p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td><img className={styles.PreviewImage} src={"/images/HitLogoMetatag.png"}></img></td>
                        <td style={{maxHeight: "300px"}}>
                            <div className={styles.PreviewDescription}>
                            <p className={styles.PreviewName}>Hawaiians in Technology</p>
                            <p className={styles.PreviewDate}>September 2, 2021</p>
                            <p className={styles.PreviewDescriptionText}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et 
                                dolore magna aliqua. Vehicula ipsum a arcu cursus vitae congue mauris rhoncus. Quis auctor elit sed 
                                vulputate mi sit amet mauris. Adipiscing elit ut aliquam purus sit. Donec ultrices tincidunt arcu non 
                                sodales neque. Vitae ultricies leo integer malesuada nunc vel risus commodo viverra. Ac turpis egestas
                                maecenas pharetra convallis. Tortor aliquam nulla facilisi cras fermentum odio eu. Dictum varius duis 
                                at consectetur lorem donec. A cras semper auctor neque vitae. Orci nulla pellentesque dignissim enim 
                                sit amet venenatis urna cursus.

                                Arcu dictum varius duis at consectetur lorem. Congue nisi vitae suscipit tellus mauris a. Amet facilisis 
                                magna etiam tempor orci eu lobortis elementum. Eget dolor morbi non arcu risus quis varius quam. 
                                Aenean sed adipiscing diam donec. Adipiscing elit pellentesque habitant morbi tristique senectus. 
                                Urna nunc id cursus metus aliquam eleifend mi in. Dictum fusce ut placerat orci nulla. Diam phasellus 
                                vestibulum lorem sed risus ultricies. Elit sed vulputate mi sit amet mauris commodo quis. Quis lectus 
                                nulla at volutpat diam. Gravida in fermentum et sollicitudin ac orci phasellus. Enim sit amet 
                                venenatis urna cursus eget. Elementum eu facilisis sed odio. Est ullamcorper eget nulla facilisi 
                                etiam dignissim.
                            </p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            </React.Fragment>
        )
    }
}

export default SpotlightPreview