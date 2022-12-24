import * as vscode from 'vscode';

export const PACKAGE_NAME = 'implementationLens';
export let config: any;

export function setConfig() {
    config = vscode.workspace.getConfiguration(PACKAGE_NAME);
}
