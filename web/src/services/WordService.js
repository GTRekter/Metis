import CountryCodes from '../assets/static/country_codes.json';

class WordService {
    importFile(fileToImport) {
        localStorage.removeItem('words');
        localStorage.removeItem('wordtypes');
        localStorage.removeItem('languages');

        let fileReader = new FileReader(); 
        fileReader.readAsText(fileToImport); 
        fileReader.onload = function(e) {
            let rows = e.target.result.split('\n');         
            let headers = rows[0].split(',');
            // Set languages
            let languages = [];
            for (let index = 0; index < headers.length; index++) {
                for (let indexCodes = 0; indexCodes < CountryCodes.length; indexCodes++) {
                    if(CountryCodes[indexCodes].code.toLowerCase() === headers[index].toLowerCase()) {
                        languages.push(CountryCodes[indexCodes]);
                    }
                }        
            }
            let stringifiedLanguages = JSON.stringify(languages);
            localStorage.setItem('languages', stringifiedLanguages);

            // Set words
            let words = [];
            for(let i = 1; i < rows.length; i++) {
                if(rows[i] === "") {
                    break;
                }
                let data = rows[i].split(',');
                let obj = {};
                let translation = [];
                for(let j = 0; j < data.length; j++) {
                    let language = languages.filter((language) => {
                        return language.code === headers[j].toLowerCase()
                    });
                    if(language.length <= 0) {
                        obj[headers[j].trim()] = data[j].trim();
                    } else {
                        translation.push({
                            text: data[j].trim(),
                            language: headers[j].trim()
                        });
                    }     
                }
                obj['translations'] = translation;
                words.push(obj);
            }
            let stringifiedWords = JSON.stringify(words);
            localStorage.setItem('words', stringifiedWords);

            // Set wordtypes
            let wordtypes = [];
            for (let index = 0; index < words.length; index++) {  
                let wordType = wordtypes.filter((wordtype) => {
                    return wordtype.name === words[index]['wordtype'];
                });   
                if(wordType.length <= 0 && words[index]['wordtype'] !== undefined) {
                    wordtypes.push({
                        name: words[index]['wordtype']
                    })
                }
            }
            let stringifiedWordtypes = JSON.stringify(wordtypes);
            localStorage.setItem('wordtypes', stringifiedWordtypes);            
        }; 
        fileReader.onerror = function(e) {
            console.log(e.target.error);
        }; 
    }
    getLanguages() {
        let data = localStorage.getItem('languages');
        if(data === null) {
            return [];
        }
        return JSON.parse(data);
    }
    getAllWords() {
        let data = localStorage.getItem('words');
        if(data === null) {
            return [];
        }
        return JSON.parse(data);
    }
    getWordsCount() {
        let data = localStorage.getItem('words');
        if(data === null) {
            return 0;
        }
        let dataJson = JSON.parse(data);
        return dataJson.length;
    }
    getWordsByPage(page, wordsPerPage) {
        let data = localStorage.getItem('words');
        if(data === null) {
            return [];
        }
        let dataJson = JSON.parse(data);
        let dataToReturn = dataJson.slice(page * wordsPerPage, page * wordsPerPage + wordsPerPage);
        return (dataToReturn);
    }
    getAllWordTypes() {
        let data = localStorage.getItem('wordtypes');
        if(data === null) {
            return [];
        }
        return JSON.parse(data);
    }
    getWordsByPageAndSearchQuery(page, wordsPerPage, searchQuery) {
        let data = localStorage.getItem('words');
        if(data === null) {
            return []
        }
        let dataJson = JSON.parse(data);
        let resultJson = [];
        for (let index = 0; index < dataJson.length; index++) {
            if (dataJson[index].text.indexOf(searchQuery) > -1 
                || dataJson[index].romanization.indexOf(searchQuery) > -1) {
                resultJson.push(dataJson[index]);
            } else {
                for (let translationIndex = 0; translationIndex < dataJson[index].translations.length; translationIndex++) {
                    if (dataJson[index].translations[translationIndex].text.indexOf(searchQuery) > -1 ) {
                        resultJson.push(dataJson[index]);
                        break;
                    }
                }
            }
        } 
        let dataToReturn = resultJson.slice(page * wordsPerPage, page * wordsPerPage + wordsPerPage);
        return (dataToReturn);
    }
    getWordsCountBySearchQuery(searchQuery) {
        let data = localStorage.getItem('words');
        if(data === null) {
            return 0;
        }
        let dataJson = JSON.parse(data);
        let resultJson = [];
        for (let index = 0; index < dataJson.length; index++) {
            if (dataJson[index].text.indexOf(searchQuery) > -1 
                || dataJson[index].romanization.indexOf(searchQuery) > -1) {
                resultJson.push(dataJson[index]);
            } else {
                for (let translationIndex = 0; translationIndex < dataJson[index].translations.length; translationIndex++) {
                    if (dataJson[index].translations[translationIndex].text.indexOf(searchQuery) > -1 ) {
                        resultJson.push(dataJson[index]);
                        break;
                    }
                }
            }
        } 
        return resultJson.length;
    }
    getAllWordsByWordType(wordType) {
        let data = localStorage.getItem('words');
        if(data === null) {
            return [];
        }
        let dataJson = JSON.parse(data);
        let resultJson = [];
        for (let index = 0; index < dataJson.length; index++) {
            if (dataJson[index].wordtype === wordType) {
                resultJson.push(dataJson[index]);
            }
        } 
        return (resultJson);
    }
}
let service = new WordService()
export default service;