import { SimpleGitPlugin, SimpleGitPluginType, SimpleGitPluginTypes } from './simple-git-plugin';
export declare class PluginStore {
    private plugins;
    add<T extends SimpleGitPluginType>(plugin: void | SimpleGitPlugin<T> | SimpleGitPlugin<T>[]): () => void;
    exec<T extends SimpleGitPluginType>(type: T, data: SimpleGitPluginTypes[T]['data'], context: SimpleGitPluginTypes[T]['context']): typeof data;
}
