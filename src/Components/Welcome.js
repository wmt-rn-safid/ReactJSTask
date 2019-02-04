import React from 'react';
import '../Screen/App.css';

export class Welcome extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName:''
        };
    }
    // handleChange = (e) => {
    //     this.setState({
    //         firstName: e.target.value,
    //         lastName: e.target.value
    //     });
    // }
    // handleClick() {
    //     localStorage.setItem("firstname", this.state.firstName)
    //     localStorage.setItem("lastname", this.state.lastName)
    //     console.log("Name",localStorage.getItem(this.state.lastName));
    // }

    render() {
        return (
            <div className="div-container">
                <form>
                    <div className="box-container">
                        <h1>Quiz Application</h1>

                        <label className="label">FirstName</label>

                        <input type="text" name="firstName"  onChange={(e) => { this.setState({firstName:e.target.value}) }} className="firstName" />

                        <label className="label">LastName</label>

                        <input type="text" name="lastName"  onChange={(e) => {this.setState({lastName:e.target.value})}} className="lastName" />
                        <button disabled={this.state.firstName===''||this.state.lastName===''} className="btn"  onClick={(e)=>{
                             e.preventDefault();
                            this.props.handleClick(this.state.firstName,this.state.lastName); }         
                        }>Start Quiz</button>
                    </div>
                </form>
            </div>
        );
    }
}