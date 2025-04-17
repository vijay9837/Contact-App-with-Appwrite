import { Client, Account, Databases } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject("67fd1d1800257211c340");
const account = new Account(client);

const databases = new Databases(client);

export { client, account, databases };
