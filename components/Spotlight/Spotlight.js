import SpotlightMain from "./SpotlightMain.js";
import SpotlightPreview from "./SpotlightPreview";
import members from "./spotlight-members.js";
import React from "react"; 

class Spotlight extends React.Component{
    state = {
        // get the lastest entry from the spotlight members
        mainMember: members[Object.keys(members).pop()],
    };
    selectMember = member => {
        this.setState({mainMember: member});
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    render(){
        return (
            <React.Fragment>
                <SpotlightMain member={this.state.mainMember}/>
                <SpotlightPreview members={members} selectMember={this.selectMember}/>
            </React.Fragment>
        )
    };
}

export default Spotlight
