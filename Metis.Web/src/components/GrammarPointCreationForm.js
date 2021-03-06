import React, { Component } from 'react';
import FormHeader from './FormHeader';
import GrammarPointService from '../services/GrammarPointService';
import LanguageService from '../services/LanguageService';
import ReactQuill from 'react-quill';

export default class GrammarPointCreationForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: "",
            description: "",
            languageId: 0,
            languages: []
        }
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onReset = this.onReset.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    componentDidMount() {
        LanguageService
            .getLanguages()
            .then((data) => {
                this.setState({
                    languages: data.filter((language) => language.enabled === true),
                    languageId: data.filter((language) => language.enabled === true)[0].id
                })
            })
    }
    onChangeInput = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }
    onChangeDescription = (value) => {
        this.setState({
            description: value
        });
    }
    onReset = (event) => {
        event.preventDefault();
        this.props.onResetCallback();
    }
    onSubmit = (event) => {
        event.preventDefault();
        GrammarPointService
            .addGrammarPoint(this.state.title, this.state.description, this.state.languageId)
            .then(() => {
                this.props.onSubmitCallback();
                this.setState({
                    title: "",
                    description: "",
                    languageId: this.state.languages.filter((language) => language.enabled === true)[0].id
                });
            })
    }
    render() {
        let languages = this.state.languages.map((language, index) =>
            <option key={index} value={language.id}>{language.name}</option>
        )
        return (
            <form className="text-start" onSubmit={this.onSubmit} onReset={this.onReset}>
                <div className="row">
                <div className="col-12">
                        <FormHeader title="Grammar Point" action="Creation" subtitle="Insert all the information about the grammar point." />
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="input-group input-group-static my-3">
                            <label>Title</label>
                            <input type="text" className="form-control" name="title" value={this.state.title} onChange={this.onChangeInput} />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="input-group input-group-static my-3">
                            <label className="ms-0">Language</label>
                            <select className="form-control" name="languageId" value={this.state.languageId} onChange={this.onChangeInput}>
                                {languages}
                            </select>
                        </div>
                    </div>
                    <div className="col-12">
                        <label>Description</label>
                        <ReactQuill theme="snow" value={this.state.description} onChange={this.onChangeDescription} />        
                    </div>
                    <div className="col-12">
                        <div className="d-flex justify-content-end mt-4">
                            <button type="reset" name="button" className="btn btn-light m-0">Cancel</button>
                            <button type="submit" name="button" className="btn bg-gradient-primary m-0 ms-2">Create GrammarPoint</button>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}