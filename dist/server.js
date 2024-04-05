"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Create an axios instance with the API base URL and basic auth header
const axiosInstance = axios_1.default.create({
    baseURL: process.env.API_HOST,
    auth: {
        username: process.env.API_USERNAME,
        password: process.env.API_PASSWORD,
    },
});
// Number of resources to retrieve per request
const batchSize = 1000;
// Starting index of the resource retrieval
let offset = 0;
// Temp storage for retrieved resources
const resources = [];
// Total number of resources to retrieve
// Will be updated when retrieveBatch is called
let count = 0;
let batches = [];
const appendData = async (batch) => {
    try {
        resources.push(...batch);
        console.log('Batch pushed to resources. Total resources: ', resources.length);
        console.log('Resources: ', resources);
    }
    catch (error) {
        console.error(`Error appending data: ${error}`);
    }
};
const writeData = async (resources) => {
    try {
        await fs_1.default.promises.writeFile('data.json', JSON.stringify(resources, null, 2));
        console.log('Data written to data.json file.');
    }
    catch (error) {
        console.error(`Error writing data: ${error}`);
    }
};
const updateData = async () => {
    const data = await fs_1.default.promises.readFile('data.json', 'utf-8');
    console.log('data.json file read successfully.');
    const resources = JSON.parse(data);
    resources.map((_a) => {
        var { id } = _a, resource = __rest(_a, ["id"]);
        console.log(`Updating data for resource ${id}...`);
        // TODO: Update the resource data
        setTimeout(() => {
            console.log(`Data updated for resource ${id}`);
        }, 100);
    });
};
const updateResource = async (resource) => {
    const { id } = resource;
    try {
        // Make a PUT request to update the resource
        await axiosInstance.put(`/companies/${process.env.COMPANY_NAME}/inventory/items/${id}/`, resource);
        console.log(`Resource ${id} updated.`);
    }
    catch (error) {
        console.error(`Error updating resource ${id}: ${error}`);
    }
};
const retrieveResources = async ({ batchSize, offset, res, }) => {
    let batch;
    try {
        const response = await axiosInstance.get(`/companies/${process.env.COMPANY_NAME}/inventory/items/`, {
            params: {
                limit: batchSize,
                start: offset,
            }
        });
        if (response.status === 200) {
            batch = response.data.records;
            count = response.data.count;
            appendData(batch);
            res.write(`In progress: ${resources.length} of ${count} resources retrieved.`);
            batch.length < batchSize ? (res.write(`All resources retrieved: ${resources.length} of ${count}`),
                console.log(`All resources retrieved: ${resources.length} of ${count}`),
                console.log('Beginning data update...'),
                writeData(resources),
                console.log('Resources written to data.json file.')) : (offset += batchSize,
                console.log(`Offset updated to ${offset}`),
                setTimeout(() => {
                    console.log('Retrieving next batch...');
                    retrieveResources({
                        batchSize,
                        offset,
                        res,
                    });
                }, 1000));
        }
    }
    catch (error) {
        console.error(`Error retrieving resources: ${error}`);
    }
};
// Endpoint to trigger the resource retrieval
app.get('/', (req, res) => {
    // Start the resource retrieval process
    try {
        retrieveResources({ batchSize, offset, res });
        res.send('Resource retrieval and update in progress...');
    }
    catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
});
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
