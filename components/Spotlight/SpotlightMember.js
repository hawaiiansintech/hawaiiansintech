import React from "react"; 

class SpotlightMember extends React.Component{
    render(){
        return (
            <React.Fragment>
                <img 
                    className="MemberPicture" 
                    src={"/images/DavidKalakaua.jpg"} 
                />
            </React.Fragment>
        )
    }
}

export default SpotlightMember