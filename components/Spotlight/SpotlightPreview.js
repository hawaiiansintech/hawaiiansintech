import React from "react"; 
import styles from "./Spotlight.module.css"

class SpotlightPreview extends React.Component{
    render(){
        return (
            <table className="large tableContent" cellSpacing="0">
                <thead id="tableHeader" Test>
                    <tr><td></td><td></td></tr>
                </thead>
                <tbody>
                    {Object.keys(this.props.members).map(key => 
                        <tr onClick={() => this.props.selectMember(this.props.members[key])}>
                            <td><img className={styles.PreviewImage} src={this.props.members[key].image}></img></td>
                            <td className={styles.PreviewRow}>
                                <div className={styles.PreviewDescription}>
                                    <p className={styles.PreviewName}>{this.props.members[key].name}</p>
                                    <p className={styles.PreviewDate}>{this.props.members[key].date}</p>
                                    <p className={styles.PreviewDescriptionText}>
                                        {this.props.members[key].desc}
                                    </p>
                                </div>
                            </td>
                        </tr>
                        )
                    }
                </tbody>
            </table>
        )
    }
}

export default SpotlightPreview