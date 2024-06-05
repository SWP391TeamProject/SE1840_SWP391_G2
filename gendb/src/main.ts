import { Command } from 'commander';
import fs from "fs";
import {generate} from "./generator/gen";

if (!fs.existsSync("./cache")) {
    throw new Error("unzip cache.zip :D");
}

fs.mkdir("./data", { recursive: true }, (err: any) => {
    if (err) throw err;
});

const program = new Command();

program
    .name('gendb')
    .description('CLI to perform various operations')
    .version('0.1.0');

program
    .command('gen')
    .description('Generate data')
    .action(async () => {
        await generate()
    });

program.parse(process.argv);