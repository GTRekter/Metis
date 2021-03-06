import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faTrash, faEdit, faBell, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Collapse, Modal } from 'react-bootstrap';
import ReportCard from '../components/ReportCard';
import Pagination from '../components/Pagination';
import WordCreationForm from '../components/WordCreationForm';
import WordEditForm from '../components/WordEditForm';
import WordService from '../services/WordService';
import LanguageService from '../services/LanguageService';

export default class WordsManagement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            languages: [],
            displayedWords: [],
            words: 0,
            activeWords: 0,
            page: 0,
            pages: undefined,
            wordsPerPage: 10,
            searchQuery: '',
            selectedWordId: undefined,

            fileToImport: undefined,

            creationFormVisible: false,
            editFormVisible: false,
            deleteModalVisible: false,
            importModalVisible: false
        }
        this.onClickToggleCreationForm = this.onClickToggleCreationForm.bind(this);
        this.onClickHideCreationForm = this.onClickHideCreationForm.bind(this);
        this.onSubmitCreationWord = this.onSubmitCreationWord.bind(this);

        this.onClickShowEditForm = this.onClickShowEditForm.bind(this);
        this.onClickHideEditForm = this.onClickHideEditForm.bind(this);
        this.onSubmitEditWord = this.onSubmitEditWord.bind(this);

        this.onClickShowDeleteModal = this.onClickShowDeleteModal.bind(this);
        this.onClickHideDeleteModal = this.onClickHideDeleteModal.bind(this);
        this.onClickConfirmDelete = this.onClickConfirmDelete.bind(this);

        this.onClickUpdateWordsByPage = this.onClickUpdateWordsByPage.bind(this);
        this.onChangeQueryString = this.onChangeQueryString.bind(this);
        this.onClickChangePage = this.onClickChangePage.bind(this);

        this.onClickShowImportModal = this.onClickShowImportModal.bind(this);
        this.onClickHideImportModal = this.onClickHideImportModal.bind(this);

        this.onChangeFileToImport = this.onChangeFileToImport.bind(this);
        this.onClickConfirmImport = this.onClickConfirmImport.bind(this);
        this.OnClickDownloadImportTemplate = this.OnClickDownloadImportTemplate.bind(this);
    }
    componentDidMount() {
        WordService
            .getWordsByPage(this.state.page, this.state.wordsPerPage)
            .then(response => {
                this.setState({
                    displayedWords: response
                });
            })
        WordService
            .getWordsCount()
            .then(response => {
                this.setState({
                    words: response,
                    pages: Math.floor(response / this.state.wordsPerPage) + 1
                });
            })
        LanguageService
            .getLanguages()
            .then((data) => {
                this.setState({
                    languages: data,
                })
            })
    }
    onClickShowImportModal() {
        this.setState({
            importModalVisible: true
        })
    }
    onClickHideImportModal() {
        this.setState({
            importModalVisible: false
        })
    }
    onClickToggleCreationForm() {
        this.setState({
            creationFormVisible: !this.state.creationFormVisible,
            editFormVisible: false,
            deleteModalVisible: false
        })
    }
    onClickHideCreationForm() {
        this.setState({
            creationFormVisible: false,
            editFormVisible: false,
            deleteModalVisible: false
        })
    }
    onSubmitCreationWord() {
        WordService
            .getWordsByPage(this.state.page, this.state.wordsPerPage)
            .then(response => {
                this.setState({
                    words: this.state.words + 1,
                    displayedWords: response,
                    creationFormVisible: false,
                    pages: Math.floor((this.state.words + 1) / this.state.wordsPerPage) + 1
                });
            })
    }
    onClickShowEditForm(id) {
        this.setState({
            selectedWordId: id,
            creationFormVisible: false,
            editFormVisible: true,
            deleteModalVisible: false
        });
    }
    onClickHideEditForm() {
        this.setState({
            selectedWordId: undefined,
            creationFormVisible: false,
            editFormVisible: false,
            deleteModalVisible: false
        })
    }
    onSubmitEditWord() {
        WordService
            .getWordsByPage(this.state.page, this.state.wordsPerPage)
            .then(response => {
                this.setState({
                    displayedWords: response,
                    editFormVisible: false
                });
            })
    }
    onClickShowDeleteModal(id) {
        this.setState({
            selectedWordId: id,
            creationFormVisible: false,
            editFormVisible: false,
            deleteModalVisible: true
        });
    }
    onClickHideDeleteModal() {
        this.setState({
            selectedWordId: undefined,
            creationFormVisible: false,
            editFormVisible: false,
            deleteModalVisible: false
        })
    }
    onClickConfirmDelete = () => {
        WordService
            .deleteWordById(this.state.selectedWordId)
            .then(() => {
                WordService
                    .getWordsByPage(this.state.page, this.state.wordsPerPage)
                    .then((response) => {
                        this.setState({
                            words: this.state.words - 1,
                            displayedWords: response,
                            deleteModalVisible: false
                        });
                    })
            })
    }
    onClickUpdateWordsByPage = (wordsPerPage) => {
        if (this.state.searchQuery === '') {
            WordService
                .getWordsCount()
                .then(response => {
                    this.setState({
                        words: response,
                        pages: Math.floor(response / wordsPerPage) + 1
                    });
                })
            WordService
                .getWordsByPage(this.state.page, wordsPerPage)
                .then(response => {
                    this.setState({
                        ...this.state,
                        displayedWords: response,
                        wordsPerPage: wordsPerPage
                    });
                })
        } else {
            WordService
                .getWordsBySearchQueryCount(this.state.searchQuery)
                .then(response => {
                    this.setState({
                        words: response,
                        pages: Math.floor(response / wordsPerPage) + 1
                    });
                })
            WordService
                .getWordsByPageAndSearchQuery(this.state.page, wordsPerPage, this.state.searchQuery)
                .then(response => {
                    this.setState({
                        ...this.state,
                        displayedWords: response,
                        wordsPerPage: wordsPerPage
                    });
                })
        }
    }
    onChangeQueryString = (event) => {
        this.setState({
            ...this.state,
            searchQuery: event.target.value
        });
        if (event.target.value === '') {
            WordService
                .getWordsCount()
                .then(response => {
                    this.setState({
                        words: response,
                        pages: Math.floor(response / this.state.wordsPerPage) + 1
                    });
                })
            WordService
                .getWordsByPage(this.state.page, this.state.wordsPerPage)
                .then(response => {
                    this.setState({
                        ...this.state,
                        displayedWords: response
                    });
                })
        } else {
            WordService
                .getWordsBySearchQueryCount(event.target.value)
                .then(response => {
                    this.setState({
                        words: response,
                        pages: Math.floor(response / this.state.wordsPerPage) + 1
                    });
                })
            WordService
                .getWordsByPageAndSearchQuery(this.state.page, this.state.wordsPerPage, event.target.value)
                .then(response => {
                    this.setState({
                        ...this.state,
                        displayedWords: response
                    });
                })
        }
    }
    onClickChangePage = (page) => {
        if (this.state.searchQuery === '') {
            WordService
                .getWordsCount()
                .then(response => {
                    this.setState({
                        words: response,
                        pages: Math.floor(response / this.state.wordsPerPage) + 1
                    });
                })
            WordService
                .getWordsByPage(page, this.state.wordsPerPage)
                .then(response => {
                    this.setState({
                        ...this.state,
                        displayedWords: response,
                        page: page
                    });
                })
        } else {
            WordService
                .getWordsBySearchQueryCount(this.state.searchQuery)
                .then(response => {
                    this.setState({
                        words: response,
                        pages: Math.floor(response / this.state.wordsPerPage) + 1
                    });
                })
            WordService
                .getWordsByPageAndSearchQuery(page, this.state.wordsPerPage, this.state.searchQuery)
                .then(response => {
                    this.setState({
                        ...this.state,
                        displayedWords: response,
                        page: page
                    });
                })
        }
    }
    onChangeFileToImport = (event) => {
        this.setState({
            ...this.state,
            fileToImport: event.target.files[0]
        });
    }
    onClickConfirmImport = () => {
        WordService
            .importWordsFromFile(this.state.fileToImport)
            .then(() => {
                WordService
                    .getWordsByPage(this.state.page, this.state.wordsPerPage)
                    .then(response => {
                        this.setState({
                            displayedWords: response
                        });
                    })
                WordService
                    .getWordsCount()
                    .then(response => {
                        this.setState({
                            words: response,
                            pages: Math.floor(response / this.state.wordsPerPage) + 1
                        });
                    })
            })
    }
    OnClickDownloadImportTemplate = () => {
        WordService
            .downloadImportTemplate()
            .then(async (response) => {
                response.text().then(text => {
                    const blob = new Blob([text]);
                    if (window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveBlob(blob, "template.csv");
                    }
                    else {
                        var a = window.document.createElement("a");
                        a.href = window.URL.createObjectURL(blob, { type: "text/plain" });
                        a.download = "template.csv";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    }
                });
            })
    }
    render() {
        let headers = this.state.languages
            .filter((language) => language.enabled === true)
            .map((language, index) =>
                <th key={index} className="text-uppercase text-xxs font-weight-bolder opacity-7">{language.name}</th>
            )
        var wordPerPageOptions = [];
        for (var index = 1; index <= 4; index++) {
            let value = index * 10;
            wordPerPageOptions.push(<li key={index}><span className="dropdown-item pointer" onClick={() => this.onClickUpdateWordsByPage(value)}>{value}</span></li>);
        }
        let rows = this.state.displayedWords.map((word, index) => {
            let columns = [];
            this.state.languages
                .filter((language) => language.enabled === true)
                .forEach((language, index) => {
                    let translation = word.translations.filter((translation) => translation.languageId === language.id);
                    if (translation.length > 0) {
                        columns.push(<td key={index} className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-4">{translation[0].text}</td>)
                    } else {
                        columns.push(<td key={index} className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-4"></td>)
                    }
                })
            return (
                <tr key={index}>
                    <td className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-4">{word.text}</td>
                    <td className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-4">{word.romanization}</td>
                    {columns}
                    <td className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 td-icon">
                        <button className="btn btn-icon btn-2 btn-link btn-sm" type="button"
                            onClick={() => this.onClickShowEditForm(word.id)}
                            aria-controls="example-collapse-text"
                            aria-expanded={this.state.editFormVisible}>
                            <span className="btn-inner--icon">
                                <FontAwesomeIcon className='opacity-10' icon={faEdit} />
                            </span>
                        </button>
                        <button className="btn btn-icon btn-2 btn-link btn-sm" type="button" onClick={() => this.onClickShowDeleteModal(word.id)}>
                            <span className="btn-inner--icon">
                                <FontAwesomeIcon className='opacity-10' icon={faTrash} />
                            </span>
                        </button>
                    </td>
                </tr>
            )
        });
        return (
            <div>
                <div className="row">
                    <div className="col-12 col-md-4 py-4">
                        <ReportCard title="Active words" icon={faUser} color="primary" value={this.state.activeWords} footer={`Total number of words: ${this.state.words}`} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-8">
                        <button className="btn btn-primary"
                            onClick={() => this.onClickToggleCreationForm()}
                            aria-controls="example-collapse-text"
                            aria-expanded={this.state.creationFormVisible}>Add word</button>
                        <div className="dropdown d-inline mx-2">
                            <button className="btn bg-gradient-primary dropdown-toggle" type="button" id="itemsPerPageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                Words per page: {this.state.wordsPerPage}
                                <FontAwesomeIcon className='text-secondary text-white ms-2' icon={faChevronDown} />
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="itemsPerPageDropdown">
                                {wordPerPageOptions}
                            </ul>
                        </div>
                        <button className="btn btn-primary mx-2" onClick={() => this.onClickShowImportModal()}>Import word</button>
                    </div>
                    <div className="col-4">
                        <div className="input-group input-group-outline mb-4">
                            <input type="text" className="form-control" placeholder="Search" name="searchQuery" value={this.state.searchQuery} onChange={(element) => this.onChangeQueryString(element)} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <Collapse in={this.state.editFormVisible}>
                        <div className="col-12 my-3">
                            <div className="card">
                                <div className="card-body">
                                    <WordEditForm key={this.state.selectedWordId} id={this.state.selectedWordId} onSubmitCallback={this.onSubmitEditWord} onResetCallback={this.onClickHideEditForm} />
                                </div>
                            </div>
                        </div>
                    </Collapse>
                    <Collapse in={this.state.creationFormVisible}>
                        <div className="col-12 my-3">
                            <div className="card">
                                <div className="card-body">
                                    <WordCreationForm onSubmitCallback={this.onSubmitCreationWord} onResetCallback={this.onClickHideCreationForm} />
                                </div>
                            </div>
                        </div>
                    </Collapse>
                    <div className="col-12">
                        <div className="card">
                            <div className="table-responsive">
                                <table className="table align-items-center">
                                    <thead>
                                        <tr>
                                            <th className="text-uppercase text-xxs font-weight-bolder opacity-7">Text</th>
                                            <th className="text-uppercase text-xxs font-weight-bolder opacity-7">Romanization</th>
                                            {headers}
                                            <th className="text-uppercase text-xxs font-weight-bolder opacity-7 ps-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-3">
                                <Pagination page={this.state.page} pages={this.state.pages} onClickChangePageCallback={this.onClickChangePage} />
                            </div>
                        </div>
                    </div>
                </div>
                <Modal show={this.state.deleteModalVisible} onHide={this.onClickHideDeleteModal}>
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="py-3 text-center">
                                <FontAwesomeIcon className='h1 text-secondary' icon={faBell} />
                                <h4 className="text-gradient text-danger mt-4">Warning</h4>
                                <p>This operation cannot be undone. If you proceed all the data related to the word will be deleted.</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" name="button" className="btn btn-light m-0" onClick={this.onClickHideDeleteModal}>Cancel</button>
                            <button type="button" name="button" className="btn bg-gradient-primary m-0 ms-2" onClick={this.onClickConfirmDelete}>Delete Word</button>
                        </div>
                    </div>
                </Modal>
                <Modal show={this.state.importModalVisible} onHide={this.onClickHideImportModal}>
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="col-12 col-md-6">
                                <button type="button" className="btn btn-primary" onClick={this.OnClickDownloadImportTemplate}>Donwload template</button>
                                <div className="input-group input-group-outline my-3">
                                    <label>File</label>
                                    <input type="file" className="form-control" name="fileToImport" accept=".csv" onChange={this.onChangeFileToImport} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" name="button" className="btn btn-light m-0" onClick={this.onClickHideImportModal}>Cancel</button>
                            <button type="button" name="button" className="btn bg-gradient-primary m-0 ms-2" onClick={this.onClickConfirmImport}>Delete Word</button>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}