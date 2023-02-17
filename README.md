# Metis
This application will generate random flashcard according to an imported CSV file. I'm currently using this application to memorize Korean words.

## Configuration
In order to use Azure Cognitive Services you will need to create a `.env` file with the following keys:
```
REACT_APP_AZURE_CS_SPEECH_KEY=""
REACT_APP_AZURE_CS_SPEECH_REGION=""
```
## Actions configuration
To use the Github actions, you will need to configure the following secrets:
```
AZURE_CLIENT_ID=""
AZURE_CLIENT_SECRET=""
AZURE_TENANT_ID=""
AZURE_SUBSCRIPTION_ID=""
AZURE_STORAGE_ACCOUNT_NAME=""
AZURE_STORAGE_ACCOUNT_RESOURCE_GROUP_NAME=""
AZURE_STORAGE_ACCOUNT_CONTAINER_NAME=""
AZURE_STORAGE_ACCOUNT_CONTAINER_KEY=""
AZURE_STORAGE_ACCOUNT_CONTAINER_TOKEN=""
```

*Live Application:* https://orange-field-067ae0b00.2.azurestaticapps.net/

## Screenshots
### Homepage
![Homepage](./preview/homepage.png?raw=true)
### Flashcards
![Flashcards](./preview/flashcards.png?raw=true)
### Dictionary
![Dictionary](./preview/dictionary.png?raw=true)
### Pronunciation
![Pronunciation](./preview/pronunciation.png?raw=true)
