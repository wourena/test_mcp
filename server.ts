import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import axios, { Axios } from "axios";

const server = new McpServer({ name: 'greeting-server', version: '1.0.0' });



server.registerTool('tiempo', {
    description: "Obtiene la temperatura actual para una latitud y longitud dadas",
    inputSchema: {
        latitude: z.number().describe('Latitud de la ubicación').default(18.523726),
        longitude: z.number().describe('Longitud de la ubicación').default(-69.8139)
    },
},
    async ({ latitude, longitude }) => {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`;
            // const url = `https://api.open-meteo.com/v1/forecast?latitude=18.523726&longitude=-69.8139&current=temperature_2m`;
            // const response = await fetch(url);
            const data = (await axios.get(url)).data;


            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(data),
                    }
                ]
            }
        }
        catch (error: any) {
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: `No se pudo obtener el clima: ${error.message}`,
                    },
                ],
            }
        }
    }
)

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main()