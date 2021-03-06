import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faTrash, faEdit, faBell, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Collapse, Modal } from 'react-bootstrap';
import ReportCard from '../components/ReportCard';
import Pagination from '../components/Pagination';
import LanguageCreationForm from '../componentsLanguageCreationForm';
import LanguageEditForm from '../components/LanguageEditForm';
import LanguageService from '../services/LanguageService';

export default class LanguagesManagement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            displayedLanguages: [],
            languages: 0,
            activeWords: 0,
            page: 0,
            pages: undefined,
            languagesPerPage: 10,
            searchQuery: '',
            selectedLanguageId: undefined,
            creationFormVisible: false,
            editFormVisible: false,
            deleteModalVisible: false
        }
        this.onClickToggleCreationForm = this.onClickToggleCreationForm.bind(this);
        this.onClickHideCreationForm = this.onClickHideCreationForm.bind(this);
        this.onSubmitCreationLanguage = this.onSubmitCreationLanguage.bind(this);

        this.onClickShowEditForm = this.onClickShowEditForm.bind(this);
        this.onClickHideEditForm = this.onClickHideEditForm.bind(this);
        this.onSubmitEditLanguage = this.onSubmitEditLanguage.bind(this);

        this.onClickShowDeleteModal = this.onClickShowDeleteModal.bind(this);
        this.onClickHideDeleteModal = this.onClickHideDeleteModal.bind(this);
        this.onClickConfirmDelete = this.onClickConfirmDelete.bind(this);

        this.onClickUpdateLanguagesByPage = this.onClickUpdateLanguagesByPage.bind(this);
        this.onChangeQueryString = this.onChangeQueryString.bind(this);
        this.onClickChangePage = this.onClickChangePage.bind(this);
    }
    componentDidMount() {
        LanguageService
            .getLanguagesByPage(this.state.page, this.state.wordsPerPage)
            .then(response => {
                this.setState({
                    displayedLanguages: response
                });
            })
        LanguageService
            .getDictionaiesCount()
            .then(response => {
                this.setState({
                    languages: response,
                    pages: Math.floor(response / this.state.languagesPerPage) + 1
                });
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
    onSubmitCreationLanguage() {
        LanguageService
            .getLanguagesByPage(this.state.page, this.state.wordsPerPage)
            .then(response => {
                this.setState({
                    languages: this.state.languages + 1,
                    displayedLanguages: response,
                    creationFormVisible: false,
                    pages: Math.floor((this.state.languages + 1) / this.state.languagesPerPage) + 1
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
    onSubmitEditLanguage() {
        LanguageService
            .getLanguagesByPage(this.state.page, this.state.wordsPerPage)
            .then(response => {
                this.setState({
                    displayedLanguages: response,
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
        LanguageService
            .deleteLanguageById(this.state.selectedLanguageId)
            .then(() => {
                LanguageService
                    .getLanguagesByPage(this.state.page, this.state.languagesPerPage)
                    .then((response) => {
                        this.setState({
                            languages: this.state.languages - 1,
                            displayedWords: response,
                            deleteModalVisible: false
                        });
                    })
            })
    }
    onClickUpdateLanguagesByPage = (languagesPerPage) => {
        if (this.state.searchQuery === '') {
            LanguageService
                .getLanguagesCount()
                .then(response => {
                    this.setState({
                        languages: response,
                        pages: Math.floor(response / languagesPerPage) + 1
                    });
                })
            LanguageService
                .getLanguagesByPage(this.state.page, languagesPerPage)
                .then(response => {
                    this.setState({
                        ...this.state,
                        displayedLanguages: response,
                        languagesPerPage: languagesPerPage
                    });
                })
        } else {
            LanguageService
                .getLanguagesBySearchQueryCount(this.state.searchQuery)
                .then(response => {
                    this.setState({
                        languages: response,
                        pages: Math.floor(response / languagesPerPage) + 1
                    });
                })
            LanguageService
                .getLanguagesByPageAndSearchQuery(this.state.page, languagesPerPage, this.state.searchQuery)
                .then(response => {
                    this.setState({
                        ...this.state,
                        displayedLanguages: response,
                        languagesPerPage: languagesPerPage
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
            LanguageService
                .getLanguagesCount()
                .then(response => {
                    this.setState({
                        languages: response,
                        pages: Math.floor(response / this.state.languagesPerPage) + 1
                    });
                })
            LanguageService
                .getLanguagesByPage(this.state.page, this.state.languagesPerPage)
                .then(response => {
                    this.setState({
                        ...this.state,
                        displayedLanguages: response
                    });
                })
        } else {
            LanguageService
                .getLanguagesBySearchQueryCount(event.target.value)
                .then(response => {
                    this.setState({
                        languages: response,
                        pages: Math.floor(response / this.state.languagesPerPage) + 1
                    });
                })
            LanguageService
                .getLanguagesByPageAndSearchQuery(this.state.page, this.state.languagesPerPage, event.target.value)
                .then(response => {
                    this.setState({
                        ...this.state,
                        displayedLanguages: response
                    });
                })
        }
    }
    onClickChangePage = (page) => {
        if (this.state.searchQuery === '') {
            LanguageService
                .getLanguagesCount()
                .then(response => {
                    this.setState({
                        languages: response,
                        pages: Math.floor(response / this.state.languagesPerPage) + 1
                    });
                })
            LanguageService
                .getLanguagesByPage(page, this.state.languagesPerPage)
                .then(response => {
                    this.setState({
                        ...this.state,
                        displayedLanguages: response,
                        page: page
                    });
                })
        } else {
            LanguageService
                .getLanguagesBySearchQueryCount(this.state.searchQuery)
                .then(response => {
                    this.setState({
                        languages: response,
                        pages: Math.floor(response / this.state.languagesPerPage) + 1
                    });
                })
            LanguageService
                .getLanguagesByPageAndSearchQuery(page, this.state.languagesPerPage, this.state.searchQuery)
                .then(response => {
                    this.setState({
                        ...this.state,
                        displayedLanguages: response,
                        page: page
                    });
                })
        }
    }
    render() {
        var languagePerPageOptions = [];
        for (var index = 1; index <= 4; index++) {
            let value = index * 10;
            languagePerPageOptions.push(<li key={index}><span className="dropdown-item pointer" onClick={() => this.onClickUpdateLanguagesByPage(value)}>{value}</span></li>);
        }
        let rows = this.state.displayedLanguages.map((language, index) => {
            return (
                <tr key={index}>
                    <td className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-4">{language.name}</td>
                    <td className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-4">{language.code}</td>
                    <td className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-4">{language.enabled}</td>
                    <td className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 td-icon">
                        <button className="btn btn-icon btn-2 btn-link btn-sm" type="button"
                            onClick={() => this.onClickShowEditForm(word.id)}
                            aria-controls="example-collapse-text"
                            aria-expanded={this.state.editFormVisible}>
                            <span className="btn-inner--icon">
                                <FontAwesomeIcon className='opacity-10' icon={faEdit} />
                            </span>
                        </button>
                        <button className="btn btn-icon btn-2 btn-link btn-sm" type="button" onClick={() => this.onClickShowDeleteModal(language.id)}>
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
                        <ReportCard title="Active languages" icon={faUser} color="primary" value={this.state.activeLanguages} footer={`Total number of languages: ${this.state.languages}`} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-8">
                        <button className="btn btn-primary"
                            onClick={() => this.onClickToggleCreationForm()}
                            aria-controls="example-collapse-text"
                            aria-expanded={this.state.creationFormVisible}>Add language</button>
                        <div className="dropdown d-inline mx-2">
                            <button className="btn bg-gradient-primary dropdown-toggle" type="button" id="itemsPerPageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                Languages per page: {this.state.wordsPerPage}
                                <FontAwesomeIcon className='text-secondary text-white ms-2' icon={faChevronDown} />
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="itemsPerPageDropdown">
                                {languagePerPageOptions}
                            </ul>
                        </div>
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
                                    <LanguageEditForm key={this.state.selectedLanguageId} id={this.state.selectedLanguageId} onSubmitCallback={this.onSubmitEditLanguage} onResetCallback={this.onClickHideEditForm} />
                                </div>
                            </div>
                        </div>
                    </Collapse>
                    <Collapse in={this.state.creationFormVisible}>
                        <div className="col-12 my-3">
                            <div className="card">
                                <div className="card-body">
                                    <LanguageCreationForm onSubmitCallback={this.onSubmitCreationWord} onResetCallback={this.onClickHideCreationForm} />
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
                                            <th className="text-uppercase text-xxs font-weight-bolder opacity-7">Name</th>
                                            <th className="text-uppercase text-xxs font-weight-bolder opacity-7">Code</th>
                                            <th className="text-uppercase text-xxs font-weight-bolder opacity-7">Enabled</th>
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
                                <p>This operation cannot be undone. If you proceed all the data related to the language will be deleted.</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" name="button" className="btn btn-light m-0" onClick={this.onClickHideDeleteModal}>Cancel</button>
                            <button type="button" name="button" className="btn bg-gradient-primary m-0 ms-2" onClick={this.onClickConfirmDelete}>Delete Language</button>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}