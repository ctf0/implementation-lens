import * as vscode from 'vscode';
import CodeLens from './Providers/CodeLens';

import * as utils from './utils';

export async function activate(context) {
    utils.setConfig();

    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider('*', new CodeLens()),
        vscode.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration(utils.PACKAGE_NAME)) {
                utils.setConfig();
            }
        }),
    );
}

export function deactivate() { }
