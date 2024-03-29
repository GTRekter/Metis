import React, { Component } from 'react';
import ReportCard from '../components/ReportCard';
import ReportCardFilter from '../components/ReportCardFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'react-bootstrap';
import { faFlag, faExclamationTriangle, faTags, faMicrophone, faMicrophoneSlash, faEye, faVolumeUp, faVolumeMute, faGlassCheers, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import SpeechService from '../services/SpeechService';
import WordService from '../services/WordService';
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import { PolarArea } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export default class Pronunciation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            words: [],
            analyzedWords: [],
            errors: [],
            correct: [],
            wordTypes: [],
            languages: [],
            assessmentScores: [0,0,0,0],
            currentWord: "",
            currentWordType: "",
            viewTranslation: false,
            isAnswerProvided: false,
            isPlaying: false,
            isAnswerCorrect: false,
            isRecordingMicrophone: false,
            congratulationsModalVisible: false
        }
        this.onRecognizing = this.onRecognizing.bind(this);
        this.onRecognized = this.onRecognized.bind(this);
        this.onClickToggleMicrophone = this.onClickToggleMicrophone.bind(this);
        this.onClickToggleTranslation = this.onClickToggleTranslation.bind(this);
        this.onClickPlayTranslation = this.onClickPlayTranslation.bind(this);
        this.onClickHideCongratulationsModal = this.onClickHideCongratulationsModal.bind(this);
        this.onClickUpdateWordsByWordType = this.onClickUpdateWordsByWordType.bind(this);
        this.onClickUpdateWordsByAll = this.onClickUpdateWordsByAll.bind(this);
    }
    componentDidMount() {
        let languages = WordService.getLanguages();
        let wordTypes = WordService.getAllWordTypes();
        let words = WordService.getAllWords();
        let shuffledWords = this.shuffle(words);
        this.setState({
            words: words,
            languages: languages,
            wordTypes: wordTypes,
            analyzedWords: shuffledWords,
            currentWord: shuffledWords[0]
        });
    }
    onRecognizing = () => {
        this.setState({
            isRecordingMicrophone: true
        });
    }
    onRecognized = (data) => {
        let isAnswerCorrect = this.state.isAnswerProvided;
        let assessmentScores = this.state.viewTranslation;
        if(data !== null) {
            isAnswerCorrect = (data.accuracyScore + data.completenessScore + data.fluencyScore + data.pronunciationScore) / 4 >= 0.75;
            assessmentScores = [data.accuracyScore, data.completenessScore, data.fluencyScore, data.pronunciationScore];
        } else {
            isAnswerCorrect = false;
            assessmentScores = [0, 0, 0, 0];
        }
        this.setState({
            isRecordingMicrophone: false,
            viewTranslation: true,
            isAnswerProvided: true,
            isAnswerCorrect: isAnswerCorrect,
            assessmentScores: assessmentScores
        });
        let self = this; 
        setTimeout(() => {
            self.updateCounters();
        }, 4000);
    }
    onClickHideCongratulationsModal = () => {
        this.setState({
            congratulationsModalVisible: false
        });
    }
    onClickToggleTranslation = () => {
        this.setState({
            viewTranslation: !this.state.viewTranslation
        })
    };
    onClickPlayTranslation = () => {
        let self = this;
        this.setState({
            isPlaying: true
        });
        // var language = this.state.languages.filter(d => d.id === this.state.currentWord.languageId);
        // SpeechService.synthesizeSpeech(this.state.currentWord.text, language[0].code);
        SpeechService.synthesizeSpeech(this.state.currentWord.text, this.state.currentWord.language);
        setTimeout(function () {
            self.setState({
                isPlaying: false
            })
        }, 2000);
    };
    onClickToggleMicrophone = () => {
        if(this.state.isRecordingMicrophone) {
            SpeechService.stopAssessSpeech();
        } else {
            // var language = this.state.languages.filter(d => d.id === this.state.currentWord.languageId);
            // SpeechService.startAssessSpeech(this.state.currentWord.text, language[0].code, this.onRecognizing, this.onRecognized);
            SpeechService.startAssessSpeech(this.state.currentWord.text, this.state.currentWord.language, this.onRecognizing, this.onRecognized);
        }
        this.setState({
            isRecordingMicrophone: !this.state.isRecordingMicrophone
        });
    }
    onClickUpdateWordsByAll = () => {
        let words = WordService.getAllWords();
        let shuffledWords = this.shuffle(words);
        this.setState({
            words: shuffledWords,
            analyzedWords: shuffledWords,
            currentWord: shuffledWords[0],
            errors: [],
            correct: [],
            topic: "",
            isAnswerProvided: false,
            isAnswerCorrect: false
        });
    };
    onClickUpdateWordsByWordType = (value) => {
        if (value === "" || value === "All") {
            let words = WordService.getAllWords();
            let shuffledWords = this.shuffle(words);
            this.setState({
                words: words,
                analyzedWords: shuffledWords,
                currentWord: shuffledWords[0],
                currentWordType: value,
                errors: [],
                correct: [],
                topic: "",
                isAnswerProvided: false,
                isAnswerCorrect: false
            });
        } else {
            let wordType = this.state.wordTypes.filter((wordType) => wordType.name === value);
            let words = WordService.getAllWordsByWordType(wordType[0].name);
            let shuffledWords = this.shuffle(words);
            this.setState({
                words: words,
                analyzedWords: shuffledWords,
                currentWord: shuffledWords[0],
                currentWordType: value,
                errors: [],
                correct: [],
                topic: "",
                isAnswerProvided: false,
                isAnswerCorrect: false
            });
        }
    };
    updateCounters = () => {
        let errors = this.state.errors;
        let correct = this.state.correct;
        let currentWord = this.state.currentWord;
        let analyzedWords = this.state.analyzedWords;
        let congratulationsModalVisible = this.state.congratulationsModalVisible;
        if (!this.state.isAnswerCorrect) {
            errors.push(currentWord);
        } else {
            correct.push(currentWord);
        }
        let isLastWord = analyzedWords.length <= (errors.length + correct.length);
        if (!isLastWord) {
            currentWord = analyzedWords[errors.length + correct.length];
        } else {
            if (errors.length > 0) {
                var shuffledWords = this.shuffle(this.state.errors);
                analyzedWords = shuffledWords;
                currentWord = shuffledWords[0];
                errors = [];
                correct = [];
            } else {
                analyzedWords = this.shuffle(this.state.words);
                currentWord = analyzedWords[0];
                errors = [];
                correct = [];
                congratulationsModalVisible = true;
            }
        }
        this.setState({
            analyzedWords: analyzedWords,
            currentWord: currentWord,
            errors: errors,
            correct: correct,
            viewTranslation: false,
            isAnswerProvided: false,
            isAnswerCorrect: false,
            assessmentScores: [0, 0, 0, 0],
            congratulationsModalVisible: congratulationsModalVisible
        })
    };
    shuffle = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };
    capitalizeFirstLetter = (string) => {
        if (string !== undefined && string.length > 0) {
            return string.replace(/^\w/, (c) => c.toUpperCase());
        }
    }
    render() {
        let backgroundClass = "bg-gradient-info shadow-info";
        let playIcon = <FontAwesomeIcon className="link-light" icon={faVolumeUp} />;
        if (this.state.isPlaying) {
            playIcon = <FontAwesomeIcon className="link-light" icon={faVolumeMute} />
        }
        let microphoneIcon = <FontAwesomeIcon className="link-light" icon={faMicrophone} />;
        if (this.state.isRecordingMicrophone) {
            microphoneIcon = <FontAwesomeIcon className="link-light" icon={faMicrophoneSlash} />
        }
        let viewIcon = <FontAwesomeIcon className="link-light" icon={faEye} />;
        if (this.state.viewTranslation) {
            viewIcon = <FontAwesomeIcon className="link-light" icon={faEyeSlash} />
        }
        let buttons = <div>
            <button className="btn btn-secondary mx-3 mb-0 text-white" disabled={this.state.isPlaying} onClick={() => this.onClickToggleMicrophone()}>
                {microphoneIcon}
            </button>
            <button className="btn btn-secondary mx-3 mb-0 text-white" disabled={this.state.isRecordingMicrophone} onClick={() => this.onClickPlayTranslation()}>
                {playIcon}
            </button>
            <button className="btn btn-secondary mx-3 mb-0 text-white" onClick={() => this.onClickToggleTranslation()}>
                {viewIcon}
            </button>
        </div>
        if (this.state.isAnswerProvided) {
            if (this.state.isAnswerCorrect) {
                backgroundClass = "bg-gradient-success shadow-success";
            } else {
                backgroundClass = "bg-gradient-danger shadow-danger";
            }
        }
        let text = '';
        let translation = '';
        // let example = '';
        // let description = '';
        if (this.state.currentWord !== undefined && this.state.currentWord.translations !== undefined) {
            if(this.state.currentWord.romanization !== null && this.state.currentWord.romanization !== "") {
                text = <span> {this.state.currentWord.text} <br/> ({this.state.currentWord.romanization})</span>;
            } else {
                text = <span> {this.state.currentWord.text} <br/></span>;
            }
            translation = this.state.currentWord.translations[0].text;
            // example = this.state.currentWord.translations[0].example;
            // description = this.state.currentWord.translations[0].description;
        }
        let chartData = {
            labels: ['Accuracy', 'Completeness', 'Fluency', 'Pronunciation'],
            datasets: [
                {
                    label: 'Assessment score',
                    data: this.state.assessmentScores,
                    backgroundColor:  ['#17c1e8', '#e3316e', '#3A416F', '#a8b8d8']
                },
            ],
        }
        let options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'left'
                }
            }
        }
        let wordTypes = this.state.wordTypes.map((wordType) => wordType.name);
        let pronunciation = <div>
        <div className="row">
            <div className="col-12 col-sm-4 py-4">
                <ReportCardFilter title="Type" icon={faTags} color="dark" value={this.state.currentWordType === "" ? "All" : this.capitalizeFirstLetter(this.state.currentWordType)} options={wordTypes} onOptionChangeCallback={this.onClickUpdateWordsByWordType} />
            </div>
            <div className="col-12 col-sm-4 py-4">
                <ReportCard title="Remaining" icon={faFlag} color="primary" value={this.state.errors.length + this.state.correct.length + "/" + this.state.analyzedWords.length} footer="Number of remaining words" />
            </div>
            <div className="col-12 col-sm-4 py-4">
                <ReportCard title="errors" icon={faExclamationTriangle} color="info" value={this.state.errors.length} footer="Number of errors" />
            </div>
        </div>
        <div className="row pt-4">
            <div className="col-12 col-sm-6 py-4 d-flex">
                <div className="card z-index-2 flex-fill">
                    <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent">
                        <div className={`border-radius-lg py-3 pe-1 py-5 text-center ${backgroundClass}`}>
                            <h1 className="display-4 fst-italic text-white">{translation}</h1>
                            <h2 className={`text-white ${!this.state.viewTranslation ? "invisible" : ""}`}>{text}</h2>
                        </div>
                    </div>
                    <div className={`card-body ${this.state.analyzedWords.length > 0 ? 'visible' : `invisible`}`}>
                        <hr className="dark horizontal" />
                        <div className="text-center">
                            {buttons}
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 col-sm-6 py-4 d-flex">
                <div className="card z-index-2 flex-fill">
                    <div className={`card-body ${this.state.analyzedWords.length > 0 ? 'visible' : `invisible`}`}>
                        <p>Results</p>
                        <div className="chart">
                            <PolarArea className='flex-fill' data={chartData} options={options} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Modal show={this.state.congratulationsModalVisible} onHide={this.onClickHideCongratulationsModal}>
            <div className="modal-content">
                <div className="modal-body">
                    <div className="py-3 text-center">
                        <FontAwesomeIcon className='h1 text-success' icon={faGlassCheers} />
                        <h4 className="text-gradient text-success mt-4">Congratulations!</h4>
                        <p>You have reviewed all your cards.</p>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
        return (
            <div>
                {pronunciation}
            </div>
        )
    }
}