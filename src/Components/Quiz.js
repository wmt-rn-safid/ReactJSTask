import React from 'react';
import axios from 'axios';
import './Quiz.css';


export class Quiz extends React.Component {
            constructor(props) {
                super(props)

                this.state = {
                    results: [], queNo: 30, isLoading: true, errors: null,  
                    checked1: false, checked2: false, checked3: false, checked4: false,
                    wrong: [], btnName: 'Next', submit: false, time: {},
                    seconds: 59, attempt: 0, counter: 0, selectedAnswers: {},score:0,
                };
                this.handleChange = this.handleChange.bind(this);
                this.handleSubmit = this.handleSubmit.bind(this);
                this._TogglePrev = this._TogglePrev.bind(this);
                this._ToggleNext = this._ToggleNext.bind(this);
                this.timer = 0;
                this.startTimer = this.startTimer.bind(this);
                this.countDown = this.countDown.bind(this);
                this._ShowQue = this._ShowQue.bind(this);
                this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
                this.handleIncreaseScore = this.handleIncreaseScore.bind(this);
            }

            getQuestion(difficulty) {
                axios
                    .get(`https://opentdb.com/api.php?amount=30&difficulty=${difficulty}&type=multiple`)
                    .then(response => {
                        console.log(response.data.results, `${difficulty} call`);
                        let results = response.data.results
                        this.setState({
                            results,
                            queNo: 0,
                            isLoading: false
                        });
                        this.startTimer();
                    }
                    )
                    .catch(error => this.setState({ error, isLoading: false }));
            }

            componentDidMount() {
                this.getQuestion('easy');
                let timeLeftVar = this.secondsToTime(this.state.seconds);
                this.setState({ time: timeLeftVar });
            }

            handleChange(target) {
                if (target.value === this.state.results[this.state.queNo].correct_answer) {
                    this.handleIncreaseScore();
                }
                else {
                    this.state.wrong.push({ question: this.state.results[this.state.queNo].question, answer: this.state.results[this.state.queNo].correct_answer })
                    this.setState({ wrong: this.state.wrong })
                }
                // console.log("answer", this.state.results[this.state.queNo].correct_answer);
            }

            handleSubmit(event) {
                event.preventDefault();
            }
            
            handleIncreaseScore() {
                this.setState({
                    score: this.state.score + 1
                });
            }

            handleAnswerSelected(e) {
                if (e.target.value === this.state.results[this.state.queNo].correct_answer) {
                    this.handleIncreaseScore();
                }
                else {
                    this.state.wrong.push({ question: this.state.results[this.state.queNo].question, answer: this.state.results[this.state.queNo].correct_answer })
                    this.setState({ wrong: this.state.wrong })
                }
                var obj = this.state.selectedAnswers;
                var select = e.target.value
                console.log("for selected question number " + (this.state.queNo + 1) + " answer is " + select + " selected");
                var Qindex = (this.state.queNo)
                // create map and store all selecred answers with quiz Questions
                obj[Qindex] = e.target.value;
                this.setState({ selectedAnswers: obj })
            }

            secondsToTime(secs) {
                let hours = Math.floor(secs / (60 * 60));
                let divisor_for_minutes = secs % (60 * 60);
                let minutes = Math.floor(divisor_for_minutes / 60);
                let divisor_for_seconds = divisor_for_minutes % 60;
                let seconds = Math.ceil(divisor_for_seconds);
                let obj = {
                    "h": hours,
                    "m": minutes,
                    "s": seconds
                };
                return obj;
            }
            startTimer() {
                if (this.timer == 0 && this.state.seconds > 0) {
                    this.timer = setInterval(this.countDown, 1000);
                }
            }
            countDown() {
                let seconds = this.state.seconds - 1;
                this.setState({
                    time: this.secondsToTime(seconds),
                    seconds: seconds,
                });

                if (seconds == 0) {
                    clearInterval(this.timer);
                }
            }

    _ToggleNext() {
        console.log(this.state.score, 'score');
        console.log(this.state.wrong.length, 'wrong');

        // console.log("que no",this.state.queNo);
        if (this.state.queNo === this.state.results.length - 1) {
            this.setState({ btnName: 'Submit', submit: true })
            // if(this.state.score>=2){
            //     this.getQuestion('medium');
            //     console.log('call');
            //     } 
            return;
             
        }
        this.setState({
            queNo: this.state.queNo + 1,
            attempt: this.state.attempt + 1,
            checked1: false, checked2: false, checked3: false, checked4: false, seconds: 60
        }, this.startTimer())
    }

    _TogglePrev() {
        
        if (this.state.queNo === 0)
            return;
          
        this.setState({
            queNo: this.state.queNo - 1,
            btnName: 'Next',
           
        })
           this.handleAnswerSelected()
         
    }

    _ShowQue = (e) => {
        // this.handleAnswerSelected();
        if(this.state.counter<this.state.queNo){
            console.log("showQue")
        }
        this.setState({
            queNo:parseInt(e.target.textContent),
            // counter:this.state.queNo
        })
    }

    getButton = () => {
        console.log('getButton');
        let queNo = Array(this.state.queNo).fill(0);
        return queNo.map((val, index) => {
            return <button className="button" onClick={this._ShowQue} >{index}</button>
        })
    }

    render() {
        let { queNo, results } = this.state;
        return (
            <section>
                <div className="header">
                    <h1>Quiz Application</h1>
                </div>
                <div>
                    <label>Welcome {this.props.name}</label>
                </div>
                <div className="div-container">
                    {!this.state.isLoading ? (
                        <div className="body">

                            <p> Time:{`${this.state.time.s}s`}</p>
                            <p>Questions: {this.state.attempt}/{this.state.results.length}</p>

                            <div className="genButton">
                                <div className="genButton-in">   {this.getButton()} </div>
                            </div>

                            <p className="question">{(this.state.results[queNo].question.replace(/"/g, "").replace(/&#039;/g, "'").replace(/&quot;/g, " ").replace(/&shy;/gi, "").replace(/&rsquo;/gi, ""))} </p>
                            <div className="li">

                                <div>
                                    <input type="radio" checked={this.state.checked1} onChange={(e) => {
                                        this.handleAnswerSelected(e)
                                        this.setState({ checked1: true, checked2: false, checked3: false, checked4: false })
                                    }} name="option" value={results[queNo].correct_answer} />{results[queNo].correct_answer}
                                </div>

                                <div>
                                    <input type="radio" checked={this.state.checked2} onChange={(e) => {
                                        this.handleAnswerSelected(e)
                                        this.setState({ checked1: false, checked2: true, checked3: false, checked4: false })
                                    }} name="option" value={results[queNo].incorrect_answers[0]} />{results[queNo].incorrect_answers[0]}
                                </div>

                                <div>
                                    <input type="radio" checked={this.state.checked3} onChange={(e) => {
                                        this.handleAnswerSelected(e)
                                        this.setState({ checked1: false, checked2: false, checked3: true, checked4: false })
                                    }} name="option" value={results[queNo].incorrect_answers[1]} />{results[queNo].incorrect_answers[1]}
                                </div>

                                <div>
                                    <input type="radio" checked={this.state.checked4} onChange={(e) => {
                                        this.handleAnswerSelected(e)
                                        this.setState({ checked1: false, checked2: false, checked3: false, checked4: true })
                                    }} name="option" value={results[queNo].incorrect_answers[2]} />{results[queNo].incorrect_answers[2]}
                                </div>
                            </div>

                            <div className="btn-style">
                                <button className="button" onClick={this._TogglePrev}  > Prev</button>
                                <button className="button" onClick={this._ToggleNext}>{this.state.btnName}</button>
                            </div>

                            <div>
                                <h1>{this.state.submit ? `correct answer :${this.state.score} ` : ''}</h1>
                                <h2>{this.state.submit ? `incorrect answer :${this.state.wrong.length} ` : ''}</h2>
                            </div>
                        </div>
                    ) : (
                            <p>Loading...</p>
                        )
                    }
                </div>
            </section>
        );
    }
}