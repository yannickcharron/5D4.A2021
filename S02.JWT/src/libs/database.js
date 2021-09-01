import mongoose from 'mongoose';
import chalk from 'chalk';

export default () => {

    const url = process.env.DATABASE;
    
    console.log(chalk.green(`[MONGO] - Establish new connection with url: ${url}`));
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);

    mongoose.connect(url).then(
        () => { 
            console.log(chalk.green(`[MONGO] - Connected to: ${url}`)); 
        },
        err => { 
            console.log(chalk.red(`[MONGO] - Cannot connect to: ${url}\n ${err} ... \n Exiting`));
            process.exit(1);
        }
    );
}