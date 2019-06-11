import eventEmitter from './EventEmitter';
import commentArticle from './commentArticle';
import publishArticle from './publishArticle';

eventEmitter.on('commentArticle', commentArticle);
eventEmitter.on('publishArticle', publishArticle);
eventEmitter.on('error', err => process.stdout.write('Oops! an event error occurred') && err);
