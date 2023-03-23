import { App } from './app';
import { Container } from 'inversify';
export interface IBootstrap {
	appContainer: Container;
	app: App;
}
