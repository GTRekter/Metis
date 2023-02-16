import React, { Component } from 'react';
import korea from '../images/korea.png';
import { Collapse, Modal } from 'react-bootstrap';
import WordService from '../services/WordService';
import Template from '../assets/static/template.csv';

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            weeklyStatisticsPercentage: [],
            importModalVisible: false
        }
        this.onClickShowImportModal = this.onClickShowImportModal.bind(this);
        this.onClickHideImportModal = this.onClickHideImportModal.bind(this);
        this.onChangeFileToImport = this.onChangeFileToImport.bind(this);
        this.onClickConfirmImport = this.onClickConfirmImport.bind(this);
        this.OnClickDownloadImportTemplate = this.OnClickDownloadImportTemplate.bind(this);
    }
    componentDidMount() {
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
    onClickConfirmImport = () => {  
        WordService.importFile(this.state.fileToImport);
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
    onChangeFileToImport = (event) => {
        this.setState({
            ...this.state,
            fileToImport: event.target.files[0]
        });
    }
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card z-index-2 ">
                        <div className="card-body text-center">
                                <button className="btn btn-primary mx-2" onClick={() => this.onClickShowImportModal()}>Import word</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-12 my-3">
                        <div className="card">
                            <div className="card-body text-center">
                                <img src={korea} id="korea-img" className="img-fluid" alt="korea" />
                            </div>
                        </div>
                    </div>
                </div>
                <Modal show={this.state.importModalVisible} onHide={this.onClickHideImportModal}>
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="col-12 col-md-6">
                                <a href={Template} download target='_blank' className="btn btn-primary">Donwload template</a>
                                <div className="input-group input-group-outline my-3">
                                    <label>File</label>
                                    <input type="file" className="form-control" name="fileToImport" accept=".csv" onChange={this.onChangeFileToImport} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" name="button" className="btn btn-light m-0" onClick={this.onClickHideImportModal}>Cancel</button>
                            <button type="button" name="button" className="btn bg-gradient-primary m-0 ms-2" onClick={this.onClickConfirmImport}>Import Words</button>
                        </div>
                    </div>
                </Modal>
            </div>
            
        )
    }
}