import axios from "axios";
import express, { Request, Response } from 'express';
import fs from "fs";
import dotenv from "dotenv";

import { InventoryCollection, InventoryItem } from "../types";

dotenv.config();

const app = express();

// Create an axios instance with the API base URL and basic auth header
const axiosInstance = axios.create({
    baseURL: process.env.API_HOST,
    auth: {
        username: process.env.API_USERNAME!,
        password: process.env.API_PASSWORD!,
    },
});

// Number of resources to retrieve per request
const batchSize: number = 1000;
// Starting index of the resource retrieval
let offset: number = 0;
// Temp storage for retrieved resources
const resources: InventoryItem[] = [];
// Total number of resources to retrieve
// Will be updated when retrieveBatch is called
let count: number = 0;

let batches: InventoryItem[] = [];


const appendData = async (batch: InventoryItem[]) => {
    try {
        resources.push(...batch);
        console.log('Batch pushed to resources. Total resources: ', resources.length);
        console.log('Resources: ', resources);
    } catch (error) {
        console.error(`Error appending data: ${error}`);
    }
}; 

const writeData = async (resources: InventoryItem[]) => {
    try {
        await fs.promises.writeFile('data.json', JSON.stringify(resources, null, 2));
        console.log('Data written to data.json file.');
    } catch (error) {
        console.error(`Error writing data: ${error}`);
    }
};

const updateData = async () => { 
    const data = await fs.promises.readFile('data.json', 'utf-8');
    console.log('data.json file read successfully.')
    const resources: InventoryItem[] = JSON.parse(data);
    resources.map(({ id, ...resource }) => {
        console.log(`Updating data for resource ${id}...`);
        // TODO: Update the resource data
        setTimeout(() => {
            console.log(`Data updated for resource ${id}`);
        }, 100);
    });
};

const updateResource = async (resource: InventoryItem) => {
    const { id } = resource;
    try {
        // Make a PUT request to update the resource
        await axiosInstance.put(
            `/companies/${process.env.COMPANY_NAME}/inventory/items/${id}/`,
            resource
        )
        console.log(`Resource ${id} updated.`);
    } catch (error) {
        console.error(`Error updating resource ${id}: ${error}`);
    }
}

const retrieveResources = async ({
    batchSize,
    offset,
    res,
}: {
    batchSize: number;
    offset: number;
    res: Response;
}) => {

    let batch;
    
    try {
        const response = await axiosInstance.get<InventoryCollection>(
            `/companies/${process.env.COMPANY_NAME}/inventory/items/`, {
                params: {
                    limit: batchSize,
                    start: offset,
                }
            }
        );
        if ( response.status === 200 ) {
            batch = response.data.records;
            count = response.data.count;
            
            appendData(batch)

            res.write(`In progress: ${resources.length} of ${count} resources retrieved.`);

            batch.length < batchSize ? (
                res.write(`All resources retrieved: ${resources.length} of ${count}`),
                console.log(`All resources retrieved: ${resources.length} of ${count}`),
                console.log('Beginning data update...'),
                writeData(resources),
                console.log('Resources written to data.json file.')
            ) : (
                offset += batchSize,
                console.log(`Offset updated to ${offset}`),
                setTimeout(() => {
                    console.log('Retrieving next batch...');
                    retrieveResources({
                        batchSize,
                        offset,
                        res,
                    });
                }, 1000)
            ) 


        }
    } catch (error) {
        console.error(`Error retrieving resources: ${error}`);
    }
}

// Endpoint to trigger the resource retrieval
app.get('/', (req: Request, res: Response) => {
    // Start the resource retrieval process
    try {
        retrieveResources({ batchSize, offset, res });
        res.send('Resource retrieval and update in progress...') 
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});